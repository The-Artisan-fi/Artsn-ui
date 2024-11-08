// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import ArtsnCoreIDL from './idl/artisan.json';
import type { ArtsnCore } from './types/artisan';

// Re-export the generated IDL and type
export { ArtsnCore, ArtsnCoreIDL };

// The programId is imported from the program IDL.
export const ARTISAN_PROGRAM_ID = new PublicKey(ArtsnCoreIDL.address);

// This is a helper function to get the Counter Anchor program.
export function getArtisanProgram(provider: AnchorProvider) {
  return new Program(ArtsnCoreIDL as ArtsnCore, provider);
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getArtisanProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet': 
      return new PublicKey("6Z9hUFC9PnzqZsu2ji4WHDJBdD6qzTJ7N1bhkPVsaKEs");
    case 'testnet': 
      return new PublicKey("6Z9hUFC9PnzqZsu2ji4WHDJBdD6qzTJ7N1bhkPVsaKEs");
    case 'mainnet-beta': 
      return new PublicKey("6Z9hUFC9PnzqZsu2ji4WHDJBdD6qzTJ7N1bhkPVsaKEs");
    default:
      return ARTISAN_PROGRAM_ID;
  }
}

export const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // circle DEVNET - USDC

export const PROTOCOL = PublicKey.findProgramAddressSync([Buffer.from("protocol")], ARTISAN_PROGRAM_ID)[0];
export const MANAGER = PublicKey.findProgramAddressSync([Buffer.from("manager")], ARTISAN_PROGRAM_ID)[0];

export const mplCoreProgram = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
