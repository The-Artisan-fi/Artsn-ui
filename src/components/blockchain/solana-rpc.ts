import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { rpcManager } from '@/lib/rpc/rpc-manager'

class RPC {
  private connection: Connection

  constructor(endpoint?: string) {
    this.connection = endpoint 
      ? new Connection(endpoint) 
      : rpcManager.getConnection()
  }

  async getBalance(publicKey?: string) {
    try {
      if (!publicKey) {
        // Check localStorage for wallet address
        let walletData = localStorage.getItem('@CAPSULE/wallets')
        
        // If empty or not found, try '@CAPSULE/currentExternalWalletAddresses'
        if (!walletData || walletData === '{}') {
          walletData = localStorage.getItem('@CAPSULE/currentExternalWalletAddresses')
        }
        
        if (!walletData) {
          throw new Error('No wallet connected')
        }
        
        const parsedWallets = JSON.parse(walletData)
        publicKey = Object.keys(parsedWallets)[0]
        
        if (!publicKey) {
          throw new Error('No wallet connected')
        }
      }

      const account = new PublicKey(publicKey)
      const balance = await this.connection.getBalance(account)
      
      // Get USDC balance (you'll need to implement this based on your token setup)
      const usdcBalance = await this.getUSDCBalance(publicKey)
      
      return {
        sol: balance / LAMPORTS_PER_SOL,
        usdc: usdcBalance
      }
    } catch (error) {
      console.error('Error getting balance:', error)
      throw error
    }
  }

  async getUSDCBalance(publicKey: string) {
    try {
      // This is a placeholder - you'll need to implement token balance fetching
      // based on your specific USDC token setup
      return 0
    } catch (error) {
      console.error('Error getting USDC balance:', error)
      return 0
    }
  }
}

export default RPC 