'use client';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { Binoculars } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/shadcn/button-ui';
import { fetchAssets } from '@/components/protocol/protocol-umi-access';
import { useWallet } from '@solana/wallet-adapter-react';
import { AssetV1 } from '@metaplex-foundation/mpl-core';
import { Card } from '@/components/ui/shadcn/card-ui';
import { IconCurrencySolana } from '@tabler/icons-react';
import { CrossCircledIcon, Share1Icon } from '@radix-ui/react-icons';
import PortfolioGraph from './PortfolioGraph';
import TopGainer from './TopGainer';
import ArtisansTable from './ArtisansTable';
import InvitationCTA from './InvitationCTA';
import { useAuth } from '@/components/apollo/auth-context-provider';
import { Connection, GetProgramAccountsConfig, Keypair, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { IDL } from '@coral-xyz/anchor/dist/cjs/native/system';
import { ArtsnCore, getArtisanProgram } from '../solana/protocol/artisan-exports';
import TrendingUp from './TrendingUp';
import { TrendingUp as TrendingIcon } from "lucide-react"
import { LoadingFeature } from '@/components/loading/loading-feature';

import { useSolanaRPC } from "@/hooks/use-web3-rpc";
import { useWeb3Auth } from '@/hooks/use-web3-auth';

// Dynamically import Joyride with ssr disabled
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

export default function DashboardFeature() {
  const [runTour, setRunTour] = useState(false);
  const [userAssets, setUserAssets] = useState<AssetV1[]>([]);
  const [userBalance, setUserBalance] = useState<any>();
  const [fractions, setFractions] = useState<any[]>([]);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [joyrideStatus, setJoyrideStatus] = useState('idle');
  const { publicKey } = useWallet();
  const { user: authUser, loading } = useAuth();
  const { provider, login: web3Login, logout: web3Logout, getUserInfo, web3auth, userAccounts } = useWeb3Auth();
  const { signVersionedTransaction, getAccounts, getBalance } = useSolanaRPC(provider);

  const user = useMemo(() => {
    if (!authUser) return null;
    return {
      firstName: authUser.firstName || '',
      lastName: authUser.lastName || '',
      username: authUser.username || '',
      publicKey: authUser.publicKey || null,
      points: 100,
      rank: 2,
      walletValue:  0,
      walletValueChange:  0,
      pointsChange:  12,
      pointsChangePercentage:  1,
      allTimeHigh: 14,
      allTimeHighDaysAgo: 2,
    };
  }, [authUser]);

  const steps = [
    {
      target: '.portfolio-card-1',
      content: 'This card shows your current Wallet Metrics.',
      disableBeacon: true,
    },
    {
      target: '.portfolio-card-2',
      content: 'Here you can see top Gainer Products.',
    },
    {
      target: '.portfolio-card-3',
      content: 'Here you can see top Gainer Products.',
    },
    {
      target: '.portfolio-card-4',
      content: 'Here you can see all the Artisans listed in a table.',
    },
    {
      target: '.portfolio-card-5',
      content: 'Share your referral link and earn $10 on each investment.',
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);
    }
    if (status === 'finished') {
      localStorage.setItem(
        'artisanTour',
        JSON.stringify({ completed: true, date: new Date().toISOString() })
      );
    }
    if (status === 'skipped') {
      localStorage.setItem(
        'artisanTour',
        JSON.stringify({ completed: true, date: new Date().toISOString() })
      );
    }
    setJoyrideStatus(status);
  };
  async function getListingByWatch (key: string) {
    try {
      const memcmp_filter = {
          memcmp: {
            offset: 17,
            bytes: new PublicKey(key).toBase58(),
          },
      };
      const get_accounts_config: GetProgramAccountsConfig = {
          commitment: "confirmed",
          filters: [
              memcmp_filter,
            { dataSize: 70 }
          ]
      };
      const connection = new Connection('https://devnet.helius-rpc.com/?api-key=b7faf1b9-5b70-4085-bf8e-a7be3e3b78c2', 'confirmed');
      const wallet = Keypair.generate();
      //@ts-expect-error - we are not signing
      const provider = new AnchorProvider(connection,  wallet, {commitment: "confirmed"});
      const program = getArtisanProgram(provider);
      const nft = await connection.getProgramAccounts(
        program.programId,
        get_accounts_config 
      );
  
      const nft_decoded = program.coder.accounts.decode(
        "fractionalizedListing",
        nft[0].account.data
      );
      return {
        listing: nft[0].pubkey.toBase58(),
        price: Number(nft_decoded.price),
      };
    } catch (error) {
      console.error('Error fetching listing', error);
    }
  };

  async function fetchUserAssets(owner: string) {
    const assets = await fetchAssets(owner);
    console.log('user assets', assets);
    setUserAssets(assets);
    const listingArray: any[] = [];

    for (let i = 0; i < assets.length; i++) {
      const listing = await getListingByWatch(assets[i].updateAuthority.address!);
      if(!listing) continue;
      // if the listing exists already in the listingArray with the same associatedId as the listing.listing, then increase the quantity by 1
      // else just push the new listing to the listingArray
      if (listingArray.find((item) => item.associatedId === listing!.listing)) {
        const index = listingArray.findIndex((item) => item.associatedId === listing!.listing);
        listingArray[index].quantity += 1;
        continue; 
      } 
      listingArray.push({
        ...assets[i],
        associatedId: listing!.listing,
        price: listing!.price,
        quantity: 1,
      });
    }
    console.log('sending to fractions ->', listingArray);
    setFractions(listingArray);
    setTokensLoading(false);
  }

  useEffect(() => {
    setIsMounted(true);

    const artisanTour = localStorage.getItem('artisanTour');
    if (!artisanTour) {
      localStorage.setItem(
        'artisanTour',
        JSON.stringify({ completed: false, date: new Date().toISOString() })
      );
      setRunTour(true);
    } else {
      const { completed, date } = JSON.parse(artisanTour);
      if (!completed) {
        setRunTour(true);
      }

      if (
        completed &&
        new Date(date) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) {
        localStorage.setItem(
          'artisanTour',
          JSON.stringify({ completed: false, date: new Date().toISOString() })
        );
        setRunTour(true);
      }

      if (completed) {
        setJoyrideStatus('finished');
        setRunTour(false);
      }
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      fetchUserAssets(authUser.publicKey);
      getBalance().then((balance) => {
        console.log('balance', balance);
        setUserBalance(balance);
      });
    }
  }, [authUser]);

  if (loading || !user) {
    return <LoadingFeature />;
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
      <div className="flex flex-col bg-bg pt-6 mt-12 md:pt-14 pb-4 md:pb-8 gap-4 md:gap-8 items-center w-full overflow-auto px-4 md:px-0">
        {/* Header Section */}
        <div className="flex flex-row md:flex-row items-start md:items-center text-secondary gap-2 md:gap-4 w-full md:w-11/12">
          <motion.h1 className="text-3xl md:text-5xl font-semibold">
            Welcome back
            <span className="opacity-[.4]">
              {user.publicKey ? `${user.publicKey.slice(0,4)}...${user.publicKey.slice(-4)}` : 'User'}
            </span>
          </motion.h1>
          <div className="flex flex-col-reverse items-start md:flex-row md:items-center gap-2">
            <div className="flex items-center gap-2 text-[#fff] bg-[#3F3F46] rounded-lg px-3 py-[6px] text-sm md:text-base">
              <CrossCircledIcon />
              <span>Unverified</span>
            </div>
            <Button
              onClick={() => setRunTour(true)}
              className="bg-bg text-secondary rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm md:text-base"
            >
              <Binoculars className="w-6 h-6 mr-2" /> Tour
            </Button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-11/12 text-secondary">
            <Card
              className="rounded-3xl flex flex-row items-center gap-4 justify-between w-full bg-bg p-4 border-zinc-300 dark:border-zinc-700"
            >
              <div className="h-12 md:h-16 aspect-square border border-zinc-300 dark:border-zinc-700 rounded-2xl px-2 md:px-3 py-2 md:py-3 text-secondary">
                <IconCurrencySolana className="w-full h-full" />
              </div>
              <div className="flex w-full items-end gap-2">
                <div className="flex flex-col gap-1">
                  <motion.p className="text-xs md:text-sm text-[#D4D4D8] text-secondary">
                    Buying Power
                  </motion.p>
                  <motion.h1 className="text-xl md:text-3xl text-secondary">
                    $1,337
                  </motion.h1>
                </div>
                <motion.p className="text-xs md:text-md text-secondary text-zinc-700 dark:text-zinc-300 mb-1">
                  $,337 USDC
                </motion.p>
              </div>
            </Card>
            <Card
              className="rounded-3xl flex flex-row items-center gap-4 justify-between w-full bg-bg p-4 border-zinc-300 dark:border-zinc-700"
            >
              <div className="h-12 md:h-16 aspect-square border border-zinc-300 dark:border-zinc-700 rounded-2xl px-2 md:px-3 py-2 md:py-3 text-secondary">
                <IconCurrencySolana className="w-full h-full" />
              </div>
              <div className="flex w-full items-end gap-2">
                <div className="flex flex-col gap-1">
                  <motion.p className="text-xs md:text-sm text-[#D4D4D8] text-secondary">
                    Buying Power
                  </motion.p>
                  <motion.h1 className="text-xl md:text-3xl text-secondary">
                    27.2 SOL
                  </motion.h1>
                </div>
                <motion.p className="text-xs md:text-md text-secondary text-zinc-700 dark:text-zinc-300 mb-1">
                  $3,808 USDC
                </motion.p>
              </div>
            </Card>
            <Card
              className="rounded-3xl flex flex-row items-center gap-4 justify-between w-full bg-bg p-4 border-zinc-300 dark:border-zinc-700"
            >
              <div className="h-12 md:h-16 aspect-square border border-zinc-300 dark:border-zinc-700 rounded-2xl px-2 md:px-3 py-2 md:py-3 text-secondary">
                <TrendingIcon className="w-full h-full" />
              </div>
              <div className="flex w-full items-end gap-2">
                <div className="flex flex-col gap-1">
                  <motion.p className="text-xs md:text-sm text-[#D4D4D8] text-secondary">
                    24 Hour Change
                  </motion.p>
                  <motion.h1 className="text-xl md:text-3xl text-secondary">
                    $102
                  </motion.h1>
                </div>
                <motion.p className="text-xs md:text-md text-secondary text-zinc-700 dark:text-zinc-300 mb-1">
                  +12%
                </motion.p>
              </div>
            </Card>
        </div>

        {/* Body Section */}
        <div className="flex flex-row items-center gap-4 w-full md:w-11/12 mt-2 md:mt-4">
          <motion.h1 className="text-2xl md:text-3xl text-secondary">
            Portfolio
          </motion.h1>
          <Button className="bg-bg flex items-center gap-2 text-secondary rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm md:text-base">
            <span>Share</span> <Share1Icon className="text-secondary" />
          </Button>
        </div>

        {/* Bento Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full md:w-11/12">
          <div className="md:col-span-3 portfolio-card-1">
            <PortfolioGraph />
          </div>
          <div className="md:col-span-2 portfolio-card-2">
            <TopGainer />
          </div>
          <div className="md:col-span-2 portfolio-card-3">
            <TrendingUp />
          </div>
          <div className="md:col-span-5 portfolio-card-4">
            <ArtisansTable assets={userAssets} />
          </div>
          <div className="md:col-span-2 portfolio-card-5">
            <InvitationCTA />
          </div>
        </div>
      </div>
    </Suspense>
  );
}