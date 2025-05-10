import {
  Connection,
  GetProgramAccountsFilter,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { CustomChainConfig, IProvider } from '@web3auth/base'
import { SolanaWallet } from '@web3auth/solana-provider'
import * as b58 from 'bs58'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import { rpcManager } from './rpc-manager'

interface RequestCache {
  timestamp: number
  data: any
  expiresIn: number
}

interface RequestTracker {
  timestamp: number
  count: number
}

export default class SolanaRpc {
  private provider: IProvider
  private solanaWallet: SolanaWallet
  private static connection = rpcManager.getConnection()
  private static umi = rpcManager.getUmi()

  // Rate limiting
  private static requestsPerWindow = 10
  private static windowMs = 1000
  private static requests: RequestTracker[] = []

  // Caching
  private static cache = new Map<string, RequestCache>()
  private static defaultCacheTime = 5000 // 5 seconds

  constructor(provider: IProvider) {
    this.provider = provider
    this.solanaWallet = new SolanaWallet(this.provider)
  }

  private static async rateLimitedRequest<T>(
    key: string,
    request: () => Promise<T>,
    cacheTime: number = SolanaRpc.defaultCacheTime
  ): Promise<T> {
    // Check cache first
    const cached = SolanaRpc.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
      return cached.data
    }

    // Clean old requests
    const now = Date.now()
    SolanaRpc.requests = SolanaRpc.requests.filter(
      (req) => now - req.timestamp < SolanaRpc.windowMs
    )

    // Check rate limit
    if (SolanaRpc.requests.length >= SolanaRpc.requestsPerWindow) {
      const oldestRequest = SolanaRpc.requests[0]
      const waitTime = SolanaRpc.windowMs - (now - oldestRequest.timestamp)
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
      return SolanaRpc.rateLimitedRequest(key, request, cacheTime)
    }

    // Make request
    try {
      SolanaRpc.requests.push({ timestamp: now, count: 1 })
      const result = await request()

      // Cache result
      SolanaRpc.cache.set(key, {
        timestamp: now,
        data: result,
        expiresIn: cacheTime,
      })

      return result
    } catch (error: any) {
      if (error.message?.includes('429')) {
        // Rate limit hit - wait and retry
        await new Promise((resolve) => setTimeout(resolve, SolanaRpc.windowMs))
        return SolanaRpc.rateLimitedRequest(key, request, cacheTime)
      }
      throw error
    }
  }

  async getAccounts(): Promise<string[]> {
    return SolanaRpc.rateLimitedRequest('getAccounts', async () => {
      try {
        return await this.solanaWallet.requestAccounts()
      } catch (error) {
        console.error('Error getting accounts:', error)
        return []
      }
    })
  }

  async signTransaction(tx: any): Promise<string> {
    const steps: Array<{
      step: string
      status: 'started' | 'completed' | 'failed'
      error?: any
    }> = []

    try {
      // Step 1: Get accounts
      steps.push({ step: 'getAccounts', status: 'started' })
      const accounts = await this.getAccounts()
      if (!accounts?.length) throw new Error('No accounts found')
      steps.push({ step: 'getAccounts', status: 'completed' })

      // Step 2: Sign transaction
      steps.push({ step: 'signAndSendTransaction', status: 'started' })
      if (!tx) throw new Error('Transaction object is null or undefined')

      const signedTx = await this.solanaWallet.signAndSendTransaction(tx)
      if (!signedTx) throw new Error('Failed to sign transaction')
      steps.push({ step: 'signAndSendTransaction', status: 'completed' })

      // Step 3: Process with UMI
      steps.push({ step: 'umiProcessing', status: 'started' })
      const umiTx = SolanaRpc.umi.transactions.deserialize(tx.serialize())

      const signature = await SolanaRpc.umi.rpc.sendTransaction(umiTx, {
        skipPreflight: true,
      })

      if (!signature) throw new Error('No signature received from transaction')
      steps.push({ step: 'umiProcessing', status: 'completed' })

      return signature.toString()
    } catch (error: any) {
      // Mark current step as failed
      const currentStep = steps[steps.length - 1]
      if (currentStep) {
        currentStep.status = 'failed'
        currentStep.error = error
      }

      console.error('Transaction signing failed:', {
        error: error.message,
        stack: error.stack,
        steps,
      })

      throw new Error(
        `Transaction signing failed at step ${currentStep?.step}: ${error.message}`
      )
    }
  }

  async signVersionedTransaction({
    tx,
  }: {
    tx: VersionedTransaction
  }): Promise<string> {
    try {
      const signedTx = await this.solanaWallet.signTransaction(tx)
      const umiTx = SolanaRpc.umi.transactions.deserialize(signedTx.serialize())

      const signature = await SolanaRpc.umi.rpc.sendTransaction(umiTx, {
        skipPreflight: true,
      })

      const confirmResult = await SolanaRpc.umi.rpc.confirmTransaction(
        signature,
        {
          strategy: {
            type: 'blockhash',
            ...(await SolanaRpc.umi.rpc.getLatestBlockhash()),
          },
        }
      )

      return b58.encode(Buffer.from(signature))
    } catch (error) {
      console.error('Error signing versioned transaction:', error)
      throw error
    }
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    try {
      return await this.solanaWallet.signAllTransactions(txs)
    } catch (error) {
      console.error('Error signing all transactions:', error)
      throw error
    }
  }

  async signAllVersionedTransactions(
    txs: VersionedTransaction[]
  ): Promise<VersionedTransaction[]> {
    try {
      return await this.solanaWallet.signAllTransactions(txs)
    } catch (error) {
      console.error('Error signing all versioned transactions:', error)
      throw error
    }
  }

  async getPrivateKey(): Promise<string> {
    try {
      return (await this.provider.request({
        method: 'solanaPrivateKey',
      })) as string
    } catch (error) {
      console.error('Error getting private key:', error)
      return ''
    }
  }
} 