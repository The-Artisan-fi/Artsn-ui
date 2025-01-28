'use client'

import dynamic from 'next/dynamic'
import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletError } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback, useMemo } from 'react'
import { Connection, Keypair } from '@solana/web3.js'

export const WalletButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => 'https://api.devnet.solana.com', [])
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const connection = new Connection(
    'https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f',
    'confirmed'
  )
  const wallet = Keypair.generate()
  // @ts-expect-error - wallet is dummy variable, signing is not needed
  return new AnchorProvider(connection, wallet, { commitment: 'confirmed' })
}
