//components/dashboard/Dashboard.tsx
'use client'
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react'
import { Binoculars, Settings } from 'lucide-react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fetchAssets } from '@/components/blockchain/umiAccess'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { AssetV1 } from '@metaplex-foundation/mpl-core'
import { Card } from '@/components/ui/card'
import { IconCurrencyDollar, IconCurrencySolana } from '@tabler/icons-react'
import {
  CheckCircledIcon,
  CrossCircledIcon,
  Share1Icon,
} from '@radix-ui/react-icons'
import PortfolioGraph from './PortfolioGraph'
import TopGainer from './TopGainer'
import ArtisansTable from './ArtisansTable'
import InvitationCTA from './InvitationCTA'
import { para, usePara } from '@/providers/Para'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import {
  Connection,
  GetProgramAccountsConfig,
  Keypair,
  PublicKey,
} from '@solana/web3.js'
import { IDL } from '@coral-xyz/anchor/dist/cjs/native/system'
import {
  ArtsnCore,
  getArtisanProgram,
} from '@/components/blockchain/artisan-exports'
import TrendingUp from './TrendingUp'
import { TrendingUp as TrendingIcon } from 'lucide-react'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import KYCVerification from '@/components/kyc/KycForm'
import { useToast } from '@/hooks/use-toast'
// import { useSolanaRPC } from "@/components/blockchain/solana-rpc";
import RPC from '@/components/blockchain/solana-rpc'
import { set } from 'lodash'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { HeliusMplCoreAsset } from '@/types'
import { rpcManager } from '@/lib/rpc/rpc-manager'
import { User } from '@/types/resolver-types'
import { token } from '@coral-xyz/anchor/dist/cjs/utils'

const SolanaRPC = rpcManager.getConnection()

type BalanceObject = {
  sol: number
  usdc: number
}

// Define a type for the user data
interface UserData {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  publicKey?: string;
  kycInfo?: {
    kycStatus?: string;
  };
}

export default function DashboardFeature() {
  const [userAssets, setUserAssets] = useState<HeliusMplCoreAsset[]>([])
  const [fractions, setFractions] = useState<any[]>([])
  const [tokensLoading, setTokensLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { currentUser } = useAuthStore()
  const [showKYCDialog, setShowKYCDialog] = useState(false)
  const [isVerified, setIsVerified] = useState<string>('Unverified')
  const RPC_ENDPOINT = 'https://api.devnet.solana.com'
  const { toast } = useToast()
  const rpc = new RPC(RPC_ENDPOINT as any)
  const [userBalance, setUserBalance] = useState<number>(0)
  
  // Update verification status when currentUser changes
  useEffect(() => {
    if (currentUser?.kycInfo?.kycStatus) {
      setIsVerified(currentUser.kycInfo.kycStatus);
    }
  }, [currentUser]);
  
  const getListingByWatch = useCallback(async (key: string) => {
    try {
      const memcmp_filter = {
        memcmp: {
          offset: 17,
          bytes: new PublicKey(key).toBase58(),
        },
      }
      const get_accounts_config: GetProgramAccountsConfig = {
        commitment: 'confirmed',
        filters: [memcmp_filter, { dataSize: 70 }],
      }
      const connection = SolanaRPC
      const wallet = Keypair.generate()
      //@ts-expect-error - we are not signing
      const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
      })
      const program = getArtisanProgram(provider)
      const nft = await connection.getProgramAccounts(
        program.programId,
        get_accounts_config
      )

      const nft_decoded = program.coder.accounts.decode(
        'fractionalizedListing',
        nft[0].account.data
      )
      return {
        listing: nft[0].pubkey.toBase58(),
        price: Number(nft_decoded.price),
      }
    } catch (error) {
      console.error('Error fetching listing', error)
    }
  }, [])

  const fetchUserAssets = useCallback(async (owner: string) => {
    if (!owner) {
      console.log('No owner public key provided');
      setUserAssets([]);
      setFractions([]);
      return;
    }
    
    try {
      setTokensLoading(true);
      const result = await fetchAssets(owner);
      console.log('user assets result', result);
      
      // Handle case where result is undefined or has no assets
      if (!result || !result.nftAssets || result.nftAssets.length === 0) {
        setUserAssets([]);
        setFractions([]);
        // Still set the USDC balance even if no NFT assets
        setUserBalance(result?.usdcBalance || 0);
        return;
      }
      
      // Update the USDC balance
      setUserBalance(result.usdcBalance);
      
      // Update NFT assets
      setUserAssets(result.nftAssets);
      const listingArray: any[] = [];

      for (let i = 0; i < result.nftAssets.length; i++) {
        try {
          const listing = await getListingByWatch(
            result.nftAssets[i].grouping[0].group_value
          );
          if (!listing) continue;

          const existingIndex = listingArray.findIndex(
            (item) => item.associatedId === listing.listing
          );

          if (existingIndex !== -1) {
            listingArray[existingIndex].quantity += 1;
          } else {
            listingArray.push({
              ...result.nftAssets[i],
              associatedId: listing.listing,
              price: listing.price,
              quantity: 1,
            });
          }
        } catch (listingError) {
          console.error('Error fetching listing:', listingError);
          continue; // Skip this listing but continue processing others
        }
      }

      setFractions(listingArray);
    } catch (error) {
      console.error('Error fetching user assets:', error);
      // Set empty arrays to avoid undefined errors
      setUserAssets([]);
      setFractions([]);
      setUserBalance(0);
      
      toast({
        title: 'Error',
        description: 'Failed to fetch your assets. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setTokensLoading(false);
    }
  }, [getListingByWatch, setFractions, setTokensLoading, setUserAssets, toast]);

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsMounted(true)
    }
    initializeDashboard()
  }, [])

  useEffect(() => {
    const initializeUser = async () => {
      console.log('Initializing user data');
      try {
        if (currentUser?.publicKey) {
          console.log('Fetching assets for authenticated user:', currentUser?.publicKey);
          await fetchUserAssets(currentUser?.publicKey);
        } 
        else {
          console.log('No publicKey available, cannot fetch assets');
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your dashboard. Please try refreshing.',
          variant: 'destructive',
        });
      }
    };

    if (isMounted ) {
      initializeUser();
    }
  }, [isMounted, currentUser, fetchUserAssets, toast]);

  const steps = [
    // {
    //   target: '.portfolio-card-1',
    //   content: 'This card shows your current Wallet Metrics.',
    //   disableBeacon: true,
    // },
    {
      target: '.portfolio-card-2',
      content: 'Here you can see the Top Performing Products.',
    },
    {
      target: '.portfolio-card-3',
      content: 'Here you can see the Top Selling Products.',
    },
    {
      target: '.portfolio-card-4',
      content: 'All of your purchased Fractions are listed here.',
    },
    // {
    //   target: '.portfolio-card-5',
    //   content: 'Share your referral link and earn $10 on each investment.',
    // },
  ]


  const handleVerificationComplete = () => {
    setIsVerified('PENDING')
    setShowKYCDialog(false)
    toast({
      title: 'Verification Submitted',
      description:
        "Your verification is being processed. We'll notify you once it's complete.",
    })
  }

  const VerificationStatus = () => {
    if (currentUser?.kycInfo?.kycStatus === 'VERIFIED') {
      return (
        <div className="flex items-center gap-2 rounded-lg bg-green-700/20 px-3 py-[6px] text-sm  text-green-500 md:text-base">
          <CheckCircledIcon />
          <span>Verified</span>
        </div>
      )
    }

    if (currentUser?.kycInfo?.kycStatus === 'PENDING') {
      return (
        <div className="flex items-center gap-2 bg-yellow-700/20 text-yellow-500 rounded-lg px-3 py-[6px] text-sm md:text-base">
          <span>Pending</span>
        </div>
      );
    }

    return (
      <button
        onClick={() => currentUser?.kycInfo?.kycStatus !== 'VERIFIED' && setShowKYCDialog(true)}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#6d6d75] px-3 py-[6px] text-sm text-[#fff] transition-colors hover:bg-[#4F4F56] md:text-base"
      >
        <CrossCircledIcon />
        <span>Verify Now</span>
      </button>
    )
  }

  if (!currentUser || tokensLoading) {
    return <LoadingSpinner />
  }

  return (
    <Suspense fallback={<div />}>
      <Dialog open={showKYCDialog && currentUser?.kycInfo?.kycStatus !== 'VERIFIED'} onOpenChange={setShowKYCDialog}>
        <DialogContent className="w-[85%] md:max-w-2xl md:w-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Verification</DialogTitle>
          </DialogHeader>
          <KYCVerification onComplete={handleVerificationComplete} />
        </DialogContent>
      </Dialog>

      <div className="mt-12 flex w-full flex-col items-center gap-4 overflow-auto bg-bg px-4 pb-4 pt-6 md:gap-8 md:px-0 md:pb-8 md:pt-14">
        {/* Header Section */}
        <div className="flex w-full flex-row items-center justify-between gap-2 text-secondary md:w-11/12 md:gap-4">
          <div className="flex items-center gap-4">
              <motion.h1 className="text-3xl font-semibold md:text-5xl">
                My Assets
              </motion.h1>
          </div>
          <div className="flex items-center gap-3">
            <VerificationStatus />
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex w-full flex-col gap-4 text-secondary md:w-11/12 md:flex-row">
          <Card className="flex w-full flex-row items-center justify-between gap-4 rounded-3xl border-zinc-300 bg-bg p-4 dark:border-zinc-700">
            <div className="aspect-square h-12 rounded-2xl border border-zinc-300 px-2 py-2 text-secondary dark:border-zinc-700 md:h-16 md:px-3 md:py-3">
              <IconCurrencyDollar className="h-full w-full" />
            </div>
            <div className="flex w-full items-end gap-2">
              <div className="flex flex-col gap-1">
                <motion.p className="text-xs text-[#D4D4D8] md:text-sm">
                  Buying Power
                </motion.p>
                <motion.h1 className="text-xl text-secondary md:text-3xl">
                  ${userBalance.toFixed(2)}
                </motion.h1>
              </div>
              <motion.p className="md:text-md mb-1 text-xs text-zinc-700 dark:text-zinc-300">
                USDC
              </motion.p>
            </div>
          </Card>
        </div>

        {/* Body Section */}
        <div className="mt-2 flex w-full flex-row items-center justify-between gap-4 md:mt-4 md:w-11/12">
          <motion.h1 className="text-2xl text-secondary md:text-3xl">
            Portfolio
          </motion.h1>
          <Button  
            variant="ghost" 
            size="sm"
            disabled={tokensLoading}
            onClick={() => {
              if (currentUser?.publicKey && !tokensLoading) {
                // Usa direttamente la funzione che già gestisce lo stato di loading interno
                fetchUserAssets(currentUser.publicKey);
              }
            }}
            className="flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`lucide ${tokensLoading ? 'animate-spin' : ''}`}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
          </Button>
        </div>

        {/* Bento Grid Section */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-5 md:w-11/12">
          <div className="portfolio-card-4 md:col-span-5">
            <ArtisansTable assets={userAssets} isLoading={tokensLoading} />
          </div>
          <div className="flex w-full flex-col gap-4 md:col-span-5 md:flex-row">
            <div className="portfolio-card-1 md:w-[50%]">
              <PortfolioGraph />
            </div>
            {/* <div className="portfolio-card-2 md:col-span-2">
              <TopGainer />
            </div>
            <div className="portfolio-card-3 md:col-span-2">
              <TrendingUp />
            </div> */}
            <div className="portfolio-card-5 md:w-[50%]">
              <InvitationCTA />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
