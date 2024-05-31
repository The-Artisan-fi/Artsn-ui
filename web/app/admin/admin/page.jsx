'use client';
import '@/styles/DashboardSettings.scss';
import { useEffect, useMemo, useState } from 'react';
import { auth } from '@/lib/constants';
import Dynamic from 'next/dynamic';
const Upload = Dynamic(() => import('antd').then((mod) => mod.Upload), { ssr: false });
const Input = Dynamic(() => import('antd').then((mod) => mod.Input), { ssr: false });
const message = Dynamic(() => import('antd').then((mod) => mod.message), { ssr: false });

// import { Upload, Input, message } from 'antd';
import ImgCrop from 'antd-img-crop';

import { MdOutlineFileUpload } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa';
import { useLazyQuery } from "@apollo/client";
import { user } from "@/lib/queries";
import { useWallet } from '@solana/wallet-adapter-react';
import { checkLogin } from "@/components/Web3Auth/solanaRPC";

const Profile = () => {
  const { publicKey } = useWallet();
  const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState('');
  const newAdmin = useMemo(() => {
    return {
      wallet: '',
      username: ''
    }
  }, []);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [offChainData, setOffChainData] = useState(undefined);
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const [variables, setVariables] = useState({
    wallet: "",
  });
  const [getDetails, { loading, error, data }] = useLazyQuery(user , {variables});
  if(!loading && data != undefined && offChainData == undefined){
    console.log("data", data);
    setOffChainData(data.users[0]);
  }
  if(!loading && error != undefined){
      console.log("error", error);
  }
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

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
              value={
                newAdmin.wallet
              }
              onChange={(e) => {
                newAdmin.wallet = e.target.value;
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
              value={
                newAdmin.username
              }
              onChange={(e) => {
                newAdmin.username = e.target.value;
              }}
              type="string"
              disabled={false}
              style={{ color: 'white', backgroundColor: 'transparent'}}
            />
          </div>
          
        </div>

        <button
          className="btn-primary"
          onClick={()=> {console.log("Create Admin: ", newAdmin)}}
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