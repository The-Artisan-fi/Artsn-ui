'use client'
import { useState } from 'react'
import {
  getArtisanProgram,
  getArtisanProgramId,
} from '@/components/blockchain/artisan-exports'
import { Program } from '@coral-xyz/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import {
  Cluster,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from './clusterAccess'
import { useAnchorProvider } from '@/providers/SolanaProvider'
// import { useTransactionToast } from '../ui/ui-layout';
import { Connection } from '@solana/web3.js'
export function useArtisanProgram() {
  const connection = new Connection(
    'https://soft-cold-energy.solana-devnet.quiknode.pro/ad0dda04b536ff45a76465f9ceee5eea6a048a8f',
    'confirmed'
  )
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  const programId = getArtisanProgramId('devnet')
  const program = getArtisanProgram(provider)
  const fraction = Keypair.generate()
  const listings = useQuery({
    queryKey: ['listings', 'all', { cluster }],
    //@ts-ignore - referenced correctly
    queryFn: () => program.account.fractionalizedListing.all(),
  })

  const listingDetails = useQuery({
    queryKey: ['listing-details', 'all', { cluster }],
    queryFn: () => {
      // Return an empty array as default to avoid undefined
      return []
    },
  })

  const watches = useQuery({
    queryKey: ['watches', 'all', { cluster }],
    //@ts-ignore - referenced correctly
    queryFn: () => program.account.baseCollectionV1.all(),
  })

  const profiles = useQuery({
    queryKey: ['profiles', 'all', { cluster }],
    //@ts-ignore - referenced correctly
    queryFn: () => program.account.profile.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  // TODO: RELOCATE TO API
  async function buyListing(params: {
    id: number
    reference: string
    key: string
    amount: number
    uri: string
  }) {
    try {
      const response = await fetch('/api/protocol/buy/sol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
          reference: params.reference,
          publicKey: params.key,
          amount: params.amount,
          uri: params.uri,
        }),
      })
      const { transaction } = await response.json() //VersionedTransaction
      if (!transaction) {
        console.log('no transaction')
        return toast.error('Failed to buy listing')
      }
      return transaction
    } catch (error) {
      console.error('Error sending transaction', error)
      toast.error('Failed to buy listing')
    }
  }

  return useMemo(
    () => ({
      program,
      programId,
      fraction,
      listings,
      listingDetails,
      watches,
      profiles,
      getProgramAccount,
      buyListing,
    }),
    [
      program,
      programId,
      fraction,
      listings,
      listingDetails,
      watches,
      profiles,
      getProgramAccount,
    ]
  )
}

export function useArtisanProgramAccount({
  account,
  username,
  enabled = true,
}: {
  account: PublicKey
  username?: string
  enabled?: boolean
}) {
  const { cluster } = useCluster()
  const [loading, setLoading] = useState<boolean>(false)
  const { program, listings } = useArtisanProgram()
  // const buyerProfile = PublicKey.findProgramAddressSync([Buffer.from('profile'), account.toBuffer()], program.programId)[0];

  const listingQuery = useQuery({
    queryKey: ['listing', 'fetch', { cluster, account }],

    queryFn: async () => {
      setLoading(true)
      //@ts-ignore - referenced correctly
      const _data = await program.account.fractionalizedListing.fetch(account)
      console.log('listing data ->', _data)
      setLoading(false)
      return _data
    },
    enabled: enabled,
  } as UseQueryOptions)

  const watchesQuery = useQuery({
    queryKey: ['watches', 'fetch', { cluster, account }],

    queryFn: async () => {
      //@ts-ignore - referenced correctly
      const data = await program.account.baseCollectionV1.fetch(account)
      console.log('watches data ->', data)
    },
  } as UseQueryOptions)

  const profileQuery = useQuery({
    queryKey: ['profile', 'fetch', { cluster, account }],
    //@ts-ignore - referenced correctly
    queryFn: () => program.account.profile.fetch(account),
    enabled: enabled,
  } as UseQueryOptions)

  return useMemo(
    () => ({
      program,
      account,
      // buyerProfile,
      listingQuery,
      watchesQuery,
      profileQuery,
      loading,
    }),
    [
      program,
      account,
      loading,
      // buyerProfile,
      listingQuery,
      watchesQuery,
      profileQuery,
    ]
  )
}
