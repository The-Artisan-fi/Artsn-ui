import {
  Connection,
  GetProgramAccountsConfig,
  PublicKey,
} from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

interface RpcConfig {
  url: string
  weight: number
  currentCalls: number
  lastUsed: number
  isHealthy: boolean
}

interface RequestCache {
  timestamp: number
  result: any
}

export class RpcManager {
  private rpcs: RpcConfig[]
  private lastRotation: number = 0
  private rotationInterval: number = 1000 // 1 second
  private requestCache: Map<string, RequestCache> = new Map()
  private requestTimestamps: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5000 // 5 seconds
  private readonly RATE_LIMIT_WINDOW = 1000 // 1 second
  private readonly MAX_REQUESTS_PER_WINDOW = 5

  constructor() {
    this.rpcs = [
      {
        url: 'https://magical-summer-tree.solana-devnet.quiknode.pro/12c78848dd07aaa7b2dfa3154a09824a0b97ea1c',
        weight: 1,
        currentCalls: 0,
        lastUsed: 0,
        isHealthy: true,
      },
      // {
      //   url: 'https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2',
      //   weight: 2,
      //   currentCalls: 0,
      //   lastUsed: 0,
      //   isHealthy: true
      // },
      {
        url: 'https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f',
        weight: 3,
        currentCalls: 0,
        lastUsed: 0,
        isHealthy: true,
      },
    ]
  }

  private canMakeRequest(endpoint: string): boolean {
    const now = Date.now()
    const timestamps = this.requestTimestamps.get(endpoint) || now

    if (now - timestamps < this.RATE_LIMIT_WINDOW) {
      return false
    }

    this.requestTimestamps.set(endpoint, now)
    return true
  }

  private getCachedResult(cacheKey: string): any | null {
    const cached = this.requestCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result
    }
    return null
  }

  private setCachedResult(cacheKey: string, result: any): void {
    this.requestCache.set(cacheKey, {
      timestamp: Date.now(),
      result,
    })
  }

  public async getProgramAccountsWithCache(
    programId: PublicKey,
    config?: GetProgramAccountsConfig
  ): Promise<ReadonlyArray<any>> {
    const cacheKey = `${programId.toString()}-${JSON.stringify(config)}`

    // Check cache first
    const cached = this.getCachedResult(cacheKey)
    if (cached) {
      return cached
    }

    // Rate limit check
    const rpc = this.selectRpc()
    if (!this.canMakeRequest(rpc.url)) {
      throw new Error('Rate limit exceeded. Please try again in a few seconds.')
    }

    try {
      const connection = this.getConnection()
      const result = await connection.getProgramAccounts(programId, config)

      // Cache the result
      this.setCachedResult(cacheKey, result)

      return result
    } catch (error) {
      if ((error as any).message?.includes('429')) {
        this.markRpcUnhealthy(rpc.url)
        throw new Error(
          'Rate limit exceeded. Please try again in a few seconds.'
        )
      }
      throw error
    }
  }

  private selectRpc(): RpcConfig {
    const now = Date.now()

    // Reset call counts periodically
    if (now - this.lastRotation > this.rotationInterval) {
      this.rpcs.forEach((rpc) => {
        rpc.currentCalls = 0
      })
      this.lastRotation = now
    }

    // Filter healthy RPCs
    const healthyRpcs = this.rpcs.filter((rpc) => rpc.isHealthy)
    if (healthyRpcs.length === 0) {
      // If all RPCs are unhealthy, reset them and try again
      this.rpcs.forEach((rpc) => {
        rpc.isHealthy = true
      })
      return this.selectRpc()
    }

    // Select RPC with lowest (currentCalls / weight) ratio
    return healthyRpcs.reduce((best, current) => {
      const bestLoad = best.currentCalls / best.weight
      const currentLoad = current.currentCalls / current.weight
      return currentLoad < bestLoad ? current : best
    })
  }

  public getConnection(): Connection {
    const rpc = this.selectRpc()
    rpc.currentCalls++
    rpc.lastUsed = Date.now()
    return new Connection(rpc.url, 'confirmed')
  }

  public getUmi() {
    const rpc = this.selectRpc()
    rpc.currentCalls++
    rpc.lastUsed = Date.now()
    return createUmi(rpc.url).use(dasApi())
  }

  public markRpcUnhealthy(url: string) {
    const rpc = this.rpcs.find((r) => r.url === url)
    if (rpc) {
      rpc.isHealthy = false
      setTimeout(() => {
        rpc.isHealthy = true
      }, 60000) // Reset after 1 minute
    }
  }
}

// Create a singleton instance
export const rpcManager = new RpcManager()
