'use client';
import '@/styles/DashboardSettings.scss';
import { useEffect, useMemo, useState } from 'react';
import { Connection } from "@solana/web3.js";
import Dynamic from 'next/dynamic';
const Input = Dynamic(() => import('antd').then((mod) => mod.Input), { ssr: false });

import { useWallet } from '@solana/wallet-adapter-react';
import { checkLogin } from "@/components/Web3Auth/solanaRPC";
import { initAdminTx } from "@/components/Protocol/functions";
import { toastPromise, toastError } from '@/helpers/toast';
import { set } from '@coral-xyz/anchor/dist/cjs/utils/features';

const Profile = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState('');
  const [newAdmin, setNewAdmin] = useState({wallet: '', username: ''});
  const [connectedWallet, setConnectedWallet] = useState('');

  const connection = new Connection(
    process.env.NEXT_PUBLIC_HELIUS_DEVNET,
    "confirmed"
  );
  

  async function handleCreateAdmin(){
    console.log(newAdmin);
    const tx = await initAdminTx(newAdmin.wallet, newAdmin.username, publicKey.toBase58());
    const signature = await sendTransaction(tx, connection, {skipPreflight: true,});
    console.log('signature', signature);
    await toastPromise(signature)
  }

  useEffect(() => {
    if (publicKey) {
      setConnectedWallet(publicKey.toBase58());
    } else if (!web3AuthPublicKey && !publicKey) {
      checkLogin().then((res) => {
        if (res) {
          if (res.account) {
            setConnectedWallet(res.account);
            setWeb3AuthPublicKey(res.account);
          }
        }
      });
    }
  }, [publicKey]);

  return (
    <>
    {publicKey
    //  && publicKey.toString() === auth 
     ? (
      <div className="settings">
        <p className="caption-3">CREATE ADMIN</p>
        <div className="profile__input-row">
          <div className="profile__input-col">
            <p className="caption-3">Wallet Address</p>
            <Input
              size="large"
              placeholder="Enter wallet address of new admin"
              onChange={(e) => {
                setNewAdmin({...newAdmin, wallet: e.target.value});
              }}
              type="string"
              disabled={false}
              style={{ color: 'white', backgroundColor: 'transparent'}}
            />
          </div>

          <div className="profile__input-col">
            <p className="caption-3">Username</p>
            <Input
              size="large"
              placeholder="Enter wallet address of new admin"

              onChange={(e) => {
                setNewAdmin({...newAdmin, username: e.target.value});
              }}
              type="string"
              disabled={false}
              style={{ color: 'white', backgroundColor: 'transparent'}}
            />
          </div>
          
        </div>

        <button
          className="btn-primary"
          onClick={()=> {
            handleCreateAdmin();
          }}
        >
          Create Admin
        </button>
      </div>
    ) : (
      <div className="wallet">
        <div className="wallet__content">
          <div className="wallet__content__header">
            <h1>Unauthorized</h1>
            <p>You are not authorized to view this page</p>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Profile;