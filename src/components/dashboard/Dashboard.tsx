//components/dashboard/Dashboard.tsx
'use client'
import { Suspense, useState, useEffect, useMemo } from 'react'
import { Binoculars } from 'lucide-react'
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
import { useAuth } from '@/providers/Web3AuthProvider'
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
import { useSolanaPrice } from '@/hooks/use-solana-price'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { HeliusMplCoreAsset } from '@/types'
import { rpcManager } from '@/lib/rpc/rpc-manager'

const SolanaRPC = rpcManager.getConnection()
// Dynamically import Joyride with ssr disabled
const Joyride = dynamic(() => import('react-joyride'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})
type BalanceObject = {
  sol: number
  usdc: number
}
export default function DashboardFeature() {
  const [runTour, setRunTour] = useState(false)
  const [userAssets, setUserAssets] = useState<HeliusMplCoreAsset[]>([])
  const [userBalance, setUserBalance] = useState<BalanceObject>()
  const [fractions, setFractions] = useState<any[]>([])
  const [tokensLoading, setTokensLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [joyrideStatus, setJoyrideStatus] = useState('idle')
  const { user: authUser, loading, provider, checkAuth } = useAuth()
  const { currentPrice, priceChange, dayRange } = useSolanaPrice()
  const [showKYCDialog, setShowKYCDialog] = useState(false)
  const [isVerified, setIsVerified] = useState<string>('Unverified')

  const { toast } = useToast()
  const rpc = provider ? new RPC(provider) : null
  // const getBalance = async () => {
  //   try {
  //     if (!rpc) {
  //       throw new Error('RPC provider is not available')
  //     }
  //     const balance = await rpc.getBalance()
  //     console.log('balance', balance)
  //     setUserBalance(balance)
  //     return balance
  //   } catch (error) {
  //     console.error('Error fetching balance', error)
  //   }
  // }

  const user = useMemo(() => {
    if (!authUser) {
      console.log('no auth user')
      checkAuth()
      return null
    }
    console.log('auth user', authUser)
    return {
      firstName: authUser.firstName || '',
      lastName: authUser.lastName || '',
      username: authUser.username || '',
      publicKey: authUser.publicKey || null,
      isVerified: authUser.kycInfo?.kycStatus || 'Unverified',
      points: 100,
      rank: 2,
      walletValue: 0,
      walletValueChange: 0,
      pointsChange: 12,
      pointsChangePercentage: 1,
      allTimeHigh: 14,
      allTimeHighDaysAgo: 2,
    }
  }, [authUser])

  useEffect(() => {
    if (user) {
      console.log('DASHBOARD USER ->', user)
      setIsVerified(user.isVerified)
    }
  }, [user])

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

  const handleJoyrideCallback = (data: any) => {
    const { status } = data
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false)
    }
    if (status === 'finished') {
      localStorage.setItem(
        'artisanTour',
        JSON.stringify({ completed: true, date: new Date().toISOString() })
      )
    }
    if (status === 'skipped') {
      localStorage.setItem(
        'artisanTour',
        JSON.stringify({ completed: true, date: new Date().toISOString() })
      )
    }
    setJoyrideStatus(status)
  }

  const handleVerificationComplete = () => {
    setIsVerified('PENDING')
    setShowKYCDialog(false)
    toast({
      title: 'Verification Submitted',
      description:
        "Your verification is being processed. We'll notify you once it's complete.",
    })
  }

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied to clipboard',
      description: text.length > 50 ? `${text.slice(0, 50)}.....` : text,
    })
  }

  async function getListingByWatch(key: string) {
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
  }

  const fetchUserAssets = async (owner: string) => {
    try {
      setTokensLoading(true)
      const assets = await fetchAssets(owner)
      console.log('user assets', assets)
      setUserAssets(assets)
      const listingArray: any[] = []

      for (let i = 0; i < assets.length; i++) {
        try {
          const listing = await getListingByWatch(
            assets[i].grouping[0].group_value
          )
          if (!listing) continue

          const existingIndex = listingArray.findIndex(
            (item) => item.associatedId === listing.listing
          )

          if (existingIndex !== -1) {
            listingArray[existingIndex].quantity += 1
          } else {
            listingArray.push({
              ...assets[i],
              associatedId: listing.listing,
              price: listing.price,
              quantity: 1,
            })
          }
        } catch (listingError) {
          console.error('Error fetching listing:', listingError)
          continue // Skip this listing but continue processing others
        }
      }

      setFractions(listingArray)
    } catch (error) {
      console.error('Error fetching user assets:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch your assets. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setTokensLoading(false)
    }
  }

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsMounted(true)

      // Handle tour logic
      try {
        const artisanTour = localStorage.getItem('artisanTour')
        if (!artisanTour) {
          localStorage.setItem(
            'artisanTour',
            JSON.stringify({ completed: false, date: new Date().toISOString() })
          )
          setRunTour(true)
        } else {
          const { completed, date } = JSON.parse(artisanTour)
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

          if (!completed || (completed && new Date(date) < sevenDaysAgo)) {
            setRunTour(true)
          } else {
            setJoyrideStatus('finished')
            setRunTour(false)
          }
        }
      } catch (error) {
        console.error('Error initializing tour:', error)
        // Fail gracefully - don't show tour if there's an error
        setRunTour(false)
      }
    }

    initializeDashboard()
  }, [])

  useEffect(() => {
    const initializeUser = async () => {
      if (!authUser) {
        console.log('No auth user, running check')
        await checkAuth()
        return
      }

      console.log('Fetching user data')
      try {
        await Promise.all([fetchUserAssets(authUser.publicKey)])
      } catch (error) {
        console.error('Error initializing user data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load your dashboard. Please try refreshing.',
          variant: 'destructive',
        })
      }
    }

    initializeUser()
  }, [authUser, checkAuth])

  const VerificationStatus = () => {
    if (isVerified === 'VERIFIED') {
      return (
        <div className="flex items-center gap-2 rounded-lg bg-green-700/20 px-3 py-[6px] text-sm text-[#fff] text-green-500 md:text-base">
          <CheckCircledIcon />
          <span>Verified</span>
        </div>
      )
    }

    // if (isVerified === 'PENDING') {
    //   return (
    //     <div className="flex items-center gap-2 text-[#fff] bg-yellow-700/20 text-yellow-500 rounded-lg px-3 py-[6px] text-sm md:text-base">
    //       <span>Pending</span>
    //     </div>
    //   );
    // }

    return (
      <button
        onClick={() => setShowKYCDialog(true)}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#3F3F46] px-3 py-[6px] text-sm text-[#fff] transition-colors hover:bg-[#4F4F56] md:text-base"
      >
        <CrossCircledIcon />
        <span>Unverified</span>
      </button>
    )
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return (
    <Suspense fallback={<div />}>
      {isMounted && (
        <Joyride
          steps={steps}
          run={runTour}
          continuous={true}
          showSkipButton={true}
          showProgress={true}
          styles={{
            options: {
              primaryColor: '#0066FF',
            },
          }}
          callback={handleJoyrideCallback}
        />
      )}
      <Dialog open={showKYCDialog} onOpenChange={setShowKYCDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Verification</DialogTitle>
          </DialogHeader>
          <KYCVerification onComplete={handleVerificationComplete} />
        </DialogContent>
      </Dialog>
      <div className="mt-12 flex w-full flex-col items-center gap-4 overflow-auto bg-bg px-4 pb-4 pt-6 md:gap-8 md:px-0 md:pb-8 md:pt-14">
        {/* Header Section */}
        <div className="flex w-full flex-row items-start gap-2 text-secondary md:w-11/12 md:flex-row md:items-center md:gap-4">
          <motion.h1 className="text-3xl font-semibold md:text-5xl">
            Welcome back
            <span className="opacity-[.4]">
              {user.publicKey
                ? `${user.publicKey.slice(0, 4)}...${user.publicKey.slice(-4)}`
                : 'User'}
            </span>
          </motion.h1>
          <div className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-center">
            <VerificationStatus />
            <Button
              onClick={() => setRunTour(true)}
              className="rounded-xl border border-zinc-300 bg-bg text-sm text-secondary dark:border-zinc-700 md:text-base"
            >
              <Binoculars className="mr-2 h-6 w-6" /> Tour
            </Button>
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
                <motion.p className="text-xs text-[#D4D4D8] text-secondary md:text-sm">
                  Buying Power
                </motion.p>
                <motion.h1 className="text-xl text-secondary md:text-3xl">
                  ${userBalance?.usdc ?? 0}
                </motion.h1>
              </div>
              <motion.p className="md:text-md mb-1 text-xs text-secondary text-zinc-700 dark:text-zinc-300">
                USDC
              </motion.p>
            </div>
          </Card>
          <Card className="flex w-full flex-row items-center justify-between gap-4 rounded-3xl border-zinc-300 bg-bg p-4 dark:border-zinc-700">
            <div className="aspect-square h-12 rounded-2xl border border-zinc-300 px-2 py-2 text-secondary dark:border-zinc-700 md:h-16 md:px-3 md:py-3">
              <IconCurrencySolana className="h-full w-full" />
            </div>
            <div className="flex w-full items-end gap-2">
              <div className="flex flex-col gap-1">
                <motion.p className="text-xs text-[#D4D4D8] text-secondary md:text-sm">
                  Buying Power
                </motion.p>
                <motion.h1 className="text-xl text-secondary md:text-3xl">
                  {userBalance?.sol?.toFixed(5) ?? 0}
                </motion.h1>
              </div>
              <motion.p className="md:text-md mb-1 text-xs text-secondary text-zinc-700 dark:text-zinc-300">
                SOL
              </motion.p>
            </div>
          </Card>
          <Card className="flex w-full flex-row items-center justify-between gap-4 rounded-3xl border-zinc-300 bg-bg p-4 dark:border-zinc-700">
            <div className="aspect-square h-12 rounded-2xl border border-zinc-300 px-2 py-2 text-secondary dark:border-zinc-700 md:h-16 md:px-3 md:py-3">
              <TrendingIcon className="h-full w-full" />
            </div>
            <div className="flex w-full items-end gap-2">
              <div className="flex flex-col gap-1">
                <motion.p className="text-xs text-[#D4D4D8] text-secondary md:text-sm">
                  Current SOL Price
                </motion.p>
                <motion.h1 className="text-xl text-secondary md:text-3xl">
                  ${(currentPrice! / 100000000).toFixed(2)}
                </motion.h1>
              </div>
              {/* <div className="ml-4 flex flex-col">
                <motion.p className="md:text-md text-xs text-secondary text-zinc-700 dark:text-zinc-300">
                  Daily High
                </motion.p>
                <motion.p className="md:text-md mb-1 text-xs text-secondary text-zinc-700 dark:text-zinc-300">
                  ${(dayRange.high / 100000000).toFixed(2)}
                </motion.p>
              </div> */}
            </div>
          </Card>
        </div>

        {/* Body Section */}
        <div className="mt-2 flex w-full flex-row items-center gap-4 md:mt-4 md:w-11/12">
          <motion.h1 className="text-2xl text-secondary md:text-3xl">
            Portfolio
          </motion.h1>
          <Button
            className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-bg text-sm text-secondary dark:border-zinc-700 md:text-base"
            onClick={() =>
              copyToClipboard(
                `https://explorer.solana.com/address/${user.publicKey}?cluster=devnet`
              )
            }
          >
            <span>Share</span> <Share1Icon className="text-secondary" />
          </Button>
        </div>

        {/* Bento Grid Section */}
        <div className="grid w-full grid-cols-1 gap-4 md:w-11/12">
          <div className="portfolio-card-4 md:col-span-5">
            <ArtisansTable assets={userAssets} />
          </div>
          <div className="flex w-full flex-row gap-4 md:col-span-5 md:flex-row md:gap-8">
            <div className="portfolio-card-1 md:col-span-3">
              <PortfolioGraph />
            </div>
            {/* <div className="portfolio-card-2 md:col-span-2">
              <TopGainer />
            </div>
            <div className="portfolio-card-3 md:col-span-2">
              <TrendingUp />
            </div> */}
            <div className="portfolio-card-5 md:col-span-2">
              <InvitationCTA />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
