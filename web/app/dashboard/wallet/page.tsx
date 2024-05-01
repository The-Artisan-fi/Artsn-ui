'use client'
import '@/styles/DashboardWallet.scss';
import { useEffect, useState } from 'react';
import Dynamic from 'next/dynamic';
import Image from 'next/image';
const RiMoneyDollarCircleFill = Dynamic(() => import('react-icons/ri').then((mod) => mod.RiMoneyDollarCircleFill), { ssr: false });
// const SiSolana = Dynamic(() => import('react-icons/si').then((mod) => mod.SiSolana), { ssr: false });
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import ArtisanIcon from "@/public/assets/artisan-icon.png"


const WalletPage = () => {
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const { publicKey } = useWallet();
  // Get details about the USDC token - Mainnet
  // const usdcAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  
  // Get details about the USDC token - Devnet
  const usdcAddress= new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr')
  const connection = new Connection(
    process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
    "confirmed"
);
  // function to slice the public key and display only the first 5 characters
  const sliceKey = (key: string) => {
    return `${key.slice(0, 5)}...${key.slice(-5)}`
  }
  async function getBalance(publicKey: PublicKey) {
    // get the balance of the public key
    const sol = await connection.getBalance(publicKey);
    setSolBalance(sol / 10 ** 9);
    const ata = await getAssociatedTokenAddress(usdcAddress, publicKey);
    const accountData = await getAccount(connection, ata, "confirmed");
    console.log(Number(accountData.amount));
    // divide by 10^6 to get the actual balance

    setUsdcBalance(Number(accountData.amount) / 10 ** 6);
  }

  useEffect(() => {
    if (publicKey) {
      getBalance(publicKey);
    }
  }, [publicKey]);
  return (
    <div className="wallet">
      <div className="wallet__item item-1">
        <Image
          src={ArtisanIcon}
          alt="Artisan Icon"
          className="wallet__item__img"
        />
        <div className="wallet__item__details">
          <p className="p-2">THEARTISAN WALLET</p>
          <p className="p-2 dimmed">{publicKey ? sliceKey(publicKey.toBase58()) : 'Connect Wallet'}</p>
        </div>

        <div className="wallet__item__action">
          <span className="p-5">EST. BALANCE</span>
          <span className="h-6">
            {/* {
              solBalance ? solBalance.toFixed(4) : '0.00'
            } */}
            {usdcBalance ? usdcBalance.toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      {/* item 2 */}
      <div className="wallet__item">
        <RiMoneyDollarCircleFill className="wallet__item__icon" />
        <div className="wallet__item__details">
          <p className="p-4 dimmed">USDC</p>
          <p className="p-2 dimmed">
            {usdcBalance ? usdcBalance.toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="wallet__item__action__container">
          <div className="wallet__item__action__container__btn">
            <span className="p-3">DEPOSIT USDC </span>
          </div>
          <div className="wallet__item__action__container__btn">
            <span className="p-3">DEPOSIT SOL</span>
          </div>
        </div>
      </div>

      {/* item 3 */}

      {/* <div className="wallet__item">
        <SiSolana className="wallet__item__icon" />
        <div className="wallet__item__details">
          <p className="p-4 dimmed">SOLANA</p>
          <p className="p-2 dimmed">
            {solBalance ? solBalance.toFixed(4) : '0.00'}
          </p>
        </div>

        <div className="wallet__item__action">
          <span className="p-3">DEPOSIT SOL</span>
        </div>
      </div> */}
    </div>
  );
};

export default WalletPage;