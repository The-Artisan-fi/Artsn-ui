'use client';
import '@/styles/DashboardSettings.scss';
import Dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
// import { message } from 'antd';
const Button = Dynamic(() => import('antd').then((mod) => mod.Button), { ssr: false });
const Input = Dynamic(() => import('antd').then((mod) => mod.Input), { ssr: false });
const Select = Dynamic(() => import('antd').then((mod) => mod.Select), { ssr: false });
import { FaLock } from 'react-icons/fa';
// const message = Dynamic(() => import('antd').then((mod) => mod.message), { ssr: false });

import { useEffect, useState, useMemo } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import { useLazyQuery } from "@apollo/client";
import { userCurrencyPref } from "@/lib/queries";
import { useWallet } from '@solana/wallet-adapter-react';
import { auth } from '@/lib/constants';
import { checkLogin } from '@/components/Web3Auth/checkLogin';

const SettingsPage = () => {
  const { publicKey, disconnect } = useWallet();
  const [connectedWallet, setConnectedWallet] = useState('');
  const [currencyPref, setCurrencyPref] = useState('');
  const [variables, setVariables] = useState({ wallet: '' });
  const randomNo = Math.floor(Math.random() * 1000000);
  const tokenObj = useMemo(() => {
    return {
      id: randomNo,
      share: 0,
      price: 0,
      startingTime: 0,
      uri: ''
    }
  }, []);

  const [getDetails, { loading, error, data }] = useLazyQuery(userCurrencyPref , {variables});
  if(!loading && data != undefined && currencyPref == '' ){
    console.log("data", data);
    setCurrencyPref(data.users[0].currencyPreference);
  }
  if(!loading && error != undefined){
      console.log("error", error);
  }

  useEffect(() => {
    if (publicKey) {
      setConnectedWallet(publicKey.toBase58());
    } else {
      checkLogin().then((res) => {
        if (res && res.account) {
          setConnectedWallet(res.account);
        }
      });
    }
  }, [publicKey]);

  useEffect(() => {
    if(connectedWallet) {
      setVariables({ wallet: connectedWallet });
      getDetails();
    }
  }, [connectedWallet]);

  return (
    // {
    //   "name": "id",
    //   "type": "u64"
    // },
    // {
    //   "name": "share",
    //   "type": "u16"
    // },
    // {
    //   "name": "price",
    //   "type": "u64"
    // },
    // {
    //   "name": "startingTime",
    //   "type": "i64"
    // },
    // {
    //   "name": "uri",
    //   "type": "string"
    // }
    <>
      {publicKey && publicKey.toString() === auth ? (
        <div className="settings">
          <p className="caption-3">CREATE A TOKEN</p>
          <div className="profile__input-row">
            <div className="profile__input-col">
              <p className="caption-3">ID</p>
              <Input
                suffix={<FaLock />}
                size="large"
                placeholder="Token ID"
                value={
                  tokenObj.id
                }
                type="id"
                disabled={true}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Total Shares</p>
              <Input
                value={
                  tokenObj.share
                }
                size="large"
                placeholder="Enter the total shares"
                onChange={(e) => {
                  tokenObj.share = parseInt(e.target.value);
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Price</p>
              <Input
                value={
                  tokenObj.price
                }
                size="large"
                placeholder="Enter the price"
                onChange={(e) => {
                  tokenObj.price = parseInt(e.target.value);
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Starting Time</p>
              <Input
                value={
                  tokenObj.startingTime
                }
                size="large"
                placeholder="Enter the starting time"
                onChange={(e) => {
                  tokenObj.startingTime = parseInt(e.target.value);
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">URI</p>
              <Input
                value={
                  tokenObj.uri
                }
                size="large"
                placeholder="Enter the URI"
                onChange={(e) => {
                  tokenObj.uri = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={()=> {console.log("tokenObj", tokenObj)}}
          >
            Create Token
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

export default SettingsPage;