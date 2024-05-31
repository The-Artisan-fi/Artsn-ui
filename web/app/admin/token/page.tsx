'use client';
import '@/styles/DashboardSettings.scss';
import Dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
// import { message } from 'antd';
const Button = Dynamic(() => import('antd').then((mod) => mod.Button), { ssr: false });
const Input = Dynamic(() => import('antd').then((mod) => mod.Input), { ssr: false });
const Select = Dynamic(() => import('antd').then((mod) => mod.Select), { ssr: false });
import useSWRMutation from "swr/mutation";
import { FaLock } from 'react-icons/fa';
import { MdOutlineFileUpload } from 'react-icons/md';
import ImgCrop from 'antd-img-crop';
const Upload = Dynamic(() => import('antd').then((mod) => mod.Upload), { ssr: false });
// const message = Dynamic(() => import('antd').then((mod) => mod.message), { ssr: false });
import { Connection } from "@solana/web3.js";
import { initTokenTx } from "@/components/Protocol/functions";
import { toastPromise, toastError, toastSuccess } from '@/helpers/toast';

import { useEffect, useState, useMemo } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import { useLazyQuery } from "@apollo/client";
import { userCurrencyPref } from "@/lib/queries";
import { useWallet } from '@solana/wallet-adapter-react';
import { auth } from '@/lib/constants';
import { checkLogin } from '@/components/Web3Auth/checkLogin';
import { useMutation } from "@apollo/client";
import { ADD_LISTING } from "@/lib/mutations";
const SettingsPage = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [connectedWallet, setConnectedWallet] = useState('');
  const [currencyPref, setCurrencyPref] = useState('');
  const [fileList, setFileList] = useState([]);
  const randomNo = Math.floor(Math.random() * 1000000);
  const tokenObj = useMemo(() => {
    return {
      id: randomNo,
      reference: '',
      share: 0,
      price: 0,
      startingTime: 0,
      uri: ''
    }
  }, []);

  const connection = new Connection(
    process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
    "confirmed"
  );

  // DATABASE MUTATION****************************************************
  const variables = useMemo(() => (
    {
      associatedId: "",
      assetDetails: "",
      earningPotential: "",
      earningPotentialDuration: "",
      expectedNetReturn: "",
      images: [],
      marketValue: "",
      pastReturns: ""
    }
  ), []);
  const [addListing, { loading, error, data }] = useMutation(ADD_LISTING);

  // Create Token IX
  async function handleCreateToken() {
    try {
      const tx = await initTokenTx(tokenObj.id, tokenObj.reference, tokenObj.share, tokenObj.price, tokenObj.startingTime, tokenObj.uri, connectedWallet);
      if(tx){
        variables.associatedId = tx.associatedId;
        const signature = await sendTransaction(tx.tx, connection, {skipPreflight: true,});
          await toastPromise(signature)
      }
    } catch (error) {
      console.error('Error creating token', error);
      toastError('Error creating token');
    }
  }

  // S3 IMAGE UPLOAD AND FETCH****************************************************
  async function uploadDocuments(
    url: string,
    { arg }: { arg: { files: Blob[] } }
  ) {
      const body = new FormData();
      if(fileList.length < 1){
          return;
      }
      arg.files.forEach((file: Blob, index) => {
        body.append("file", file, `${variables.associatedId}-${index}`);
      });
      try {
          const response = await fetch(url, { method: "POST", body });
          console.log('upload response', await response.json())
          return await response.json();
      } catch (error) {
          console.error('Error uploading documents', error);
      }
  }
  const { trigger } = useSWRMutation("/api/aws/s3/upload", uploadDocuments);
   // @ts-expect-error - fileList is not empty
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
// @ts-expect-error - file
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
      image.src = src!;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    };

  async function initToken() {
    try{

      // Add token to Protocol
      await handleCreateToken();

      // Add Images to Bucket
      const fileListBlob = fileList.map((file: { originFileObj: Blob; type: string; }) => {
        return new Blob([file.originFileObj], { type: file.type });
      });
      await trigger({ files: fileListBlob });

      // Add off-chain data to Mongo
      await addListing({ variables });
      
      toastSuccess('Token created successfully');
    } catch (error) {
      console.error('Error initializing token', error);
      toastError('Error initializing token');
    }
  };

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

  return (
    <>
      {publicKey 
        // && publicKey.toString() === auth 
      ? (
        <div className="settings">
          <p className="caption-3">CREATE A TOKEN</p>
          <div className="profile__input-row">
            <div className="profile__top-row__image-upload">
              <ImgCrop rotationSlider>
                  <Upload
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
              {fileList.length < 1 && <p className="p-4">Upload Item Images</p>}
            </div>
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
              <p className="caption-3">Reference</p>
              <Input
                value={
                  tokenObj.reference
                }
                size="large"
                placeholder="Watch Reference"
                onChange={(e) => {
                  tokenObj.reference = e.target.value;
                }}
                disabled={false}
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
            onClick={()=> {
              initToken();
            }}
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