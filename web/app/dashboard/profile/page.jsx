'use client';
import '@/styles/DashboardProfile.scss';
import { useEffect, useState } from 'react';
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
      setVariables({ wallet: publicKey.toBase58() });
      getDetails();
    } else if (!web3AuthPublicKey && !publicKey) {
      checkLogin().then((res) => {
        if (res) {
          if (res.account) {
            setConnectedWallet(res.account);
            setWeb3AuthPublicKey(res.account);
            setVariables({ wallet: res.account });
            getDetails();
            
          }
        }
      });
    }
  }, [publicKey]);

  return (
    <div className="profile">
      <div className="profile__image-upload">
        <ImgCrop rotationSlider>
          <Upload
            style={{ color: '#fff' }}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 1 && (
              <MdOutlineFileUpload style={{ fontSize: '2.5rem' }} />
            )}
          </Upload>
        </ImgCrop>
        {fileList.length < 1 && <p className="p-4">Upload Profile Picture</p>}
      </div>
      <div className="profile__input-row">
        <div className="profile__input-col">
          <p className="caption-3">FULL NAME</p>
          <Input 
            className="profile__input-col__input"
            size="large" 
            style={{ backgroundColor: '#1e1e22', color: 'white'}}
            value={offChainData ? offChainData.fullName : ''}
            onChange={(e) => {
              setOffChainData({ ...offChainData, fullName: e.target.value });
            }}
          />
        </div>
        <div className="profile__input-col">
          <p className="caption-3">USERNAME</p>
          <Input 
            size="large" 
            value={offChainData ? offChainData.userName : ''}
            style={{ backgroundColor: '#1e1e22', color: 'white'}}
            onChange={(e) => {
              setOffChainData({ ...offChainData, userName: e.target.value });
            }}
          />
        </div>
      </div>

      <div className="profile__input-row">
        <div className="profile__input-col">
          <p className="caption-3">EMAIL</p>
          <Input
            suffix={<FaLock />}
            size="large"
            placeholder="Enter Your Email"
            value={offChainData ? offChainData.email : ''}
            type="email"
            disabled={true}
            style={{ color: 'white'}}
          />
        </div>
        <div className="profile__input-col">
          <p className="caption-3">WALLET (ACCOUNT)</p>
          <Input
            suffix={
              <FaCopy
                onClick={() => {
                  navigator.clipboard.writeText(publicKey.toBase58());
                  message.success('Copied!');
                }}
                style={{ cursor: 'pointer', color: 'white' }}
              />
            }
            value={connectedWallet !== '' ? connectedWallet : 'Connect Wallet'}
            size="large"
            placeholder="Enter Your"
            disabled={true}
            style={{ color: 'white'}}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;