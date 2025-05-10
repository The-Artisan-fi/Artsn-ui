'use client'

import React, { ReactNode } from 'react'
import { ParaSolanaProvider as OriginalParaSolanaProvider, glowWallet, phantomWallet, backpackWallet } from "@getpara/solana-wallet-connectors"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

interface ParaSolanaProviderProps {
  children: ReactNode
  endpoint: string
  network: WalletAdapterNetwork
  appName: string
  appUrl: string
}

export default function ParaSolanaProvider({ 
  children, 
  endpoint, 
  network, 
  appName, 
  appUrl 
}: ParaSolanaProviderProps) {
  return (
    <OriginalParaSolanaProvider
      endpoint={endpoint}
      wallets={[glowWallet, phantomWallet, backpackWallet]}
      chain={network}
      appIdentity={{
        name: appName,
        uri: appUrl,
      }}
    >
      {children}
    </OriginalParaSolanaProvider>
  )
} 