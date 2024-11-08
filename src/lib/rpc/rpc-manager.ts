import { Connection } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

interface RpcConfig {
  url: string;
  weight: number;
  currentCalls: number;
  lastUsed: number;
  isHealthy: boolean;
}

export class RpcManager {
  private rpcs: RpcConfig[];
  private lastRotation: number = 0;
  private rotationInterval: number = 1000; // 1 second

  constructor() {
    this.rpcs = [
      {
        url: 'https://magical-summer-tree.solana-devnet.quiknode.pro/12c78848dd07aaa7b2dfa3154a09824a0b97ea1c',
        weight: 1,
        currentCalls: 0,
        lastUsed: 0,
        isHealthy: true
      },
      {
        url: 'https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2',
        weight: 2,
        currentCalls: 0,
        lastUsed: 0,
        isHealthy: true
      },
      {
        url: 'https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f',
        weight: 3,
        currentCalls: 0,
        lastUsed: 0,
        isHealthy: true
      }
    ];
  }

  private selectRpc(): RpcConfig {
    const now = Date.now();
    
    // Reset call counts periodically
    if (now - this.lastRotation > this.rotationInterval) {
      this.rpcs.forEach(rpc => {
        rpc.currentCalls = 0;
      });
      this.lastRotation = now;
    }

    // Filter healthy RPCs
    const healthyRpcs = this.rpcs.filter(rpc => rpc.isHealthy);
    if (healthyRpcs.length === 0) {
      // If all RPCs are unhealthy, reset them and try again
      this.rpcs.forEach(rpc => {
        rpc.isHealthy = true;
      });
      return this.selectRpc();
    }

    // Select RPC with lowest (currentCalls / weight) ratio
    return healthyRpcs.reduce((best, current) => {
      const bestLoad = best.currentCalls / best.weight;
      const currentLoad = current.currentCalls / current.weight;
      return currentLoad < bestLoad ? current : best;
    });
  }

  public getConnection(): Connection {
    const rpc = this.selectRpc();
    rpc.currentCalls++;
    rpc.lastUsed = Date.now();
    return new Connection(rpc.url, 'confirmed');
  }

  public getUmi() {
    const rpc = this.selectRpc();
    rpc.currentCalls++;
    rpc.lastUsed = Date.now();
    return createUmi(rpc.url);
  }

  public markRpcUnhealthy(url: string) {
    const rpc = this.rpcs.find(r => r.url === url);
    if (rpc) {
      rpc.isHealthy = false;
      setTimeout(() => {
        rpc.isHealthy = true;
      }, 60000); // Reset after 1 minute
    }
  }
}

// Create a singleton instance
export const rpcManager = new RpcManager();