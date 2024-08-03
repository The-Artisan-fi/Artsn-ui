'use client';
import '@/styles/DashboardSettings.scss';
import Dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { confirm } from '@/helpers/confirm';
// import { message } from 'antd';
import { Input } from 'antd';
const Button = Dynamic(() => import('antd').then((mod) => mod.Button), { ssr: false });
// const Input = Dynamic(() => import('antd').then((mod) => mod.Input), { ssr: false });
const Select = Dynamic(() => import('antd').then((mod) => mod.Select), { ssr: false });
const Option = Dynamic(() => import('antd').then((mod) => mod.Select), { ssr: false });
import useSWRMutation from "swr/mutation";
import { FaLock } from 'react-icons/fa';
import { MdOutlineFileUpload } from 'react-icons/md';
import ImgCrop from 'antd-img-crop';
const Image = Dynamic(() => import('antd').then((mod) => mod.Image), { ssr: false });
const Upload = Dynamic(() => import('antd').then((mod) => mod.Upload), { ssr: false });
// const message = Dynamic(() => import('antd').then((mod) => mod.message), { ssr: false });
import { Connection } from "@solana/web3.js";
import { initTokenTx } from "@/components/Protocol/functions";
import { toastPromise, toastError, toastSuccess } from '@/helpers/toast';

import { useEffect, useState, useMemo, use } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import { useLazyQuery } from "@apollo/client";
import { userCurrencyPref } from "@/lib/queries";
import { useWallet } from '@solana/wallet-adapter-react';
import { auth } from '@/lib/constants';
import { checkLogin } from '@/components/Web3Auth/checkLogin';
import { useMutation } from "@apollo/client";
import { ADD_LISTING } from "@/lib/mutations";
import { fetchWatches } from '@/hooks/fetchProducts';
import { watch } from 'fs';
import { render } from 'react-dom';
import { token } from '@coral-xyz/anchor/dist/cjs/utils';
import { set } from 'date-fns';
import { toast } from 'react-toastify';
const SettingsPage = () => {
  const { TextArea } = Input;
  const { publicKey, sendTransaction } = useWallet();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [connectedWallet, setConnectedWallet] = useState('');
  const [step, setStep] = useState(1);
  const [currencyPref, setCurrencyPref] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [watches, setWatches] = useState<any[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const randomNo = Math.floor(Math.random() * 1000000);
  const tokenObj = useMemo(() => {
    return {
      watchName: '',
      watchUri: '',
      watchBrand: '',
      watchModel: '',
      watchReference: '',
      watchDiameter: 0,
      watchMovement: '',
      watchDialColor: '',
      watchCaseMaterial: '',
      watchBraceletMaterial: '',
      watchYearOfProduction: 0,
      listingId: randomNo,
      listingObjectType: '0',
      listingShare: 0,
      listingPrice: 0,
      listingStartingTime: 0,
      offAssetDetails: '',
      offExpectednetReturn: '',
      offMarketValue: '',
      offPastReturns: '',
      offEarningPotential: '',
      offEarningPotentialDuration: '',
      offCurrency: '',
      offDescription: '',
      offModel: '',
      offOfferViews: 0,
      offSold: 0,
      offTotal: 0,
      offMintAddress: '',
      offAbout: '',
    }
  }, []);

  const connection = new Connection(
    process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
    "confirmed"
  );

  // DATABASE MUTATION****************************************************
  const variables: {
    associatedId: string;
    assetDetails: string;
    earningPotential: string;
    earningPotentialDuration: string;
    expectedNetReturn: string;
    images: string[];
    marketValue: string;
    pastReturns: string;
    currency: string;
    description: string;
    model: string;
    offerViews: number;
    sold: number;
    total: number;
    mintAddress: string;
    about: string;
  } = useMemo(() => (
    {
      associatedId: "",
      assetDetails: "",
      earningPotential: "",
      earningPotentialDuration: "",
      expectedNetReturn: "",
      images: [],
      marketValue: "",
      pastReturns: "",
      currency: "",
      description: "",
      model: "",
      offerViews: 0,
      sold: 0,
      total: 0,
      mintAddress: "",
      about: "",
    }
  ), []);
  const [addListing, { loading, error, data }] = useMutation(ADD_LISTING);
  {!loading && !error && data && toastSuccess('Listing added to off-chain database')};
  {loading && console.log('loading', loading)};
  {error && toastError('Error adding listing to off-chain database')};

  async function handleCreateToken() {
    try {
      const tx = await initTokenTx(
        tokenObj.watchName,
        tokenObj.watchUri,
        tokenObj.watchBrand,
        tokenObj.watchModel,
        tokenObj.watchReference,
        tokenObj.watchDiameter,
        tokenObj.watchMovement,
        tokenObj.watchDialColor,
        tokenObj.watchCaseMaterial,
        tokenObj.watchBraceletMaterial,
        tokenObj.watchYearOfProduction,
        tokenObj.listingId,
        tokenObj.listingObjectType,
        tokenObj.listingShare,
        tokenObj.listingPrice,
        tokenObj.listingStartingTime,
        connectedWallet,
        fileList[0]
      );
      if(tx){
        variables.associatedId = tx.associatedId;
        console.log('associatedId', tx.associatedId);
        const signature = await sendTransaction(tx.tx, connection, {skipPreflight: true,});

        toastPromise(signature);

        return true;
      } else {
        return false;
      }
      
    } catch (error) {
      console.error('Error creating token', error);
      toastError('Error creating token');
      return false;
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
      const previewFile: any = fileList[0].url;
      let src = previewFile;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }

      setPreviewImage(previewFile.url || null);
      setPreviewOpen(true);
    };

  async function initToken() {
    try{
      setCreateLoading(true);
      // Add token to Protocol
      const create: boolean = await handleCreateToken();
      if(!create){
        toastError('Please try again');
        setCreateLoading(false);
        return;
      }
      // iterate throug the image files and rename them to `associatedId-index`
      fileList.forEach((file: { name: string; }, index: number) => {
        file.name = `${variables.associatedId}-${index}`;
      });

      variables.assetDetails = tokenObj.offAssetDetails;
      variables.earningPotential = tokenObj.offEarningPotential;
      variables.earningPotentialDuration = tokenObj.offEarningPotentialDuration;
      variables.expectedNetReturn = tokenObj.offExpectednetReturn;
      variables.images = fileList.map((file: { name: string; }) => file.name);
      variables.marketValue = tokenObj.offMarketValue;
      variables.pastReturns = tokenObj.offPastReturns;
      variables.currency = tokenObj.offCurrency;
      variables.description = tokenObj.offDescription;
      variables.model = tokenObj.offModel;
      variables.offerViews = tokenObj.offOfferViews;
      variables.sold = tokenObj.offSold;
      variables.total = tokenObj.offTotal;
      variables.mintAddress = tokenObj.offMintAddress;
      variables.about = tokenObj.offAbout;

      // Add Images to Bucket
      
      const fileListBlob = fileList.map((file: { originFileObj: Blob; type: string; }) => {
        return new Blob([file.originFileObj], { type: file.type });
      });
      await trigger({ files: fileListBlob });

      // Add off-chain data to Mongo
      addListing({ variables });
      setCreateLoading(false);
    } catch (error) {
      console.error('Error initializing token', error);
      toastError('Error initializing token');
    }
  };

  const renderSwitch = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center',
          }}>
            <p className="caption-3">CREATE A TOKEN</p>
            <div 
              className="profile__input-row"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',

              }}
            >
              <div className="profile__top-row__image-upload">
                <ImgCrop rotationSlider>
                    <Upload
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      previewFile={fileList[0]?.url}
                      multiple={true}
                    
                    >
                        {fileList.length < 1 && (
                        <MdOutlineFileUpload style={{ fontSize: '2.5rem' }} />
                        )}
                    </Upload>
                </ImgCrop>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
                {fileList.length < 1 && <p className="p-4">Upload Item Images</p>}
              </div>
              <div 
                className="profile__input-col"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '40%',
                }}
              >
                <div className="profile__input-col-sm">
                  <p className="caption-3">ID</p>
                  <Input
                    suffix={<FaLock />}
                    size="large"
                    placeholder="Token ID"
                    value={
                      tokenObj.listingId
                    }
                    type="id"
                    disabled={true}
                    style={{ color: 'white', backgroundColor: 'transparent'}}
                  />
                </div>
                <div className="profile__input-col-sm">
                  <p className="caption-3">Reference</p>
                  <Input
                    size="large"
                    placeholder="Watch Reference"
                    onChange={(e) => {
                      tokenObj.watchReference = e.target.value;
                    }}
                    disabled={false}
                    style={{ color: 'white', backgroundColor: 'transparent'}}
                  />
                </div>
                <div className="profile__input-col-sm">
                  <p className="caption-3">Total Shares</p>
                  <Input
                    size="large"
                    placeholder="Enter the total shares"
                    onChange={(e) => {
                      tokenObj.listingShare = parseInt(e.target.value);
                    }}
                    style={{ color: 'white', backgroundColor: 'transparent'}}
                  />
                </div>
                <div className="profile__input-col-sm">
                  <p className="caption-3">Price</p>
                  <Input
                    size="large"
                    placeholder="Enter the price"
                    onChange={(e) => {
                      tokenObj.listingPrice = parseInt(e.target.value);
                    }}
                    disabled={false}
                    style={{ color: 'white', backgroundColor: 'transparent'}}
                  />
                </div>
                
              </div>
              
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignContent: 'center', justifyContent: 'center', marginTop: '4rem'}}>
              <button
                className="btn-primary"
                onClick={() => {
                  setStep(step + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="profile__input-col">
              <p className="caption-3">Starting Time</p>
              <Input
                size="large"
                placeholder="Enter the starting time"
                onChange={(e) => {
                  tokenObj.listingStartingTime = parseInt(e.target.value);
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent',

                  // placeholder color should be white
                  textDecorationColor: 'white',
                }}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Market Value</p>
              <Input
                size="large"
                placeholder="Enter the market value"
                onChange={(e) => {
                  tokenObj.offMarketValue = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Earning Potential</p>
              <Input
                size="large"
                placeholder="Enter the earning potential"
                onChange={(e) => {
                  tokenObj.offEarningPotential = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Earning Potential Duration</p>
              <Input
                size="large"
                placeholder="Enter the earning potential duration"
                onChange={(e) => {
                  tokenObj.offEarningPotentialDuration = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignContent: 'center', justifyContent: 'center', marginTop: '4rem'}}>
              <button
                className="btn-primary"
                onClick={() => {
                  setStep(step - 1);
                }}
              >
                Back
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setStep(step + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="profile__input-col">
              <p className="caption-3">Expected Net Return</p>
              <Input
                size="large"
                placeholder="Enter the expected net return"
                onChange={(e) => {
                  tokenObj.offExpectednetReturn = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
                defaultValue="Enter the expected net return"
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Past Returns</p>
              <Input
                size="large"
                placeholder="Enter the past returns"
                onChange={(e) => {
                  tokenObj.offPastReturns = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Currency</p>
              <Select
                size="large"
                placeholder="Select Currency"
                onChange={(value) => {
                  setCurrencyPref(value as string);
                  tokenObj.offCurrency = value as string;
                }}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              >
                <Option value="USDC">USDC</Option>
                <Option value="SOL">SOL</Option>
              </Select>
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Object Type</p>
              <Select
                size="large"
                placeholder="Select Type"
                onChange={(value) => {
                  setCurrencyPref(value as string);
                  tokenObj.listingObjectType = value as string;
                }}
                style={{ color: 'white', backgroundColor: 'transparent'}}
              >
                <Option value="0">Watch</Option>
                <Option value="1">Diamonds</Option>
              </Select>
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Asset Details</p>
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Enter the asset details"
                onChange={(e) => {
                  tokenObj.offAssetDetails = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent', height: '100px'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Description</p>
              <TextArea
                placeholder="Enter the description"
                onChange={(e) => {
                  tokenObj.offDescription = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent', height: '100px'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">Model</p>
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Enter the model"
                onChange={(e) => {
                  tokenObj.watchModel = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent', height: '100px'}}
              />
            </div>
            <div className="profile__input-col">
              <p className="caption-3">About</p>
              <TextArea
                placeholder="Enter the about"
                onChange={(e) => {
                  tokenObj.offAbout = e.target.value;
                }}
                disabled={false}
                style={{ color: 'white', backgroundColor: 'transparent'}}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignContent: 'center', justifyContent: 'center', marginTop: '4rem'}}>
              <button
                className="btn-primary"
                onClick={() => {
                  setStep(step - 1);
                }}
              >
                Back
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setStep(step + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        // case 4 is the final step where the user can confirm the details and create the token
        // display all the details in an orderly and easy to read fashion, and a button to create the token
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              <p className="caption-3">Review Token Details</p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Token ID</p>
                  <p className="caption-3">{tokenObj.listingId}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Watch Reference</p>
                  <p className="caption-3">{tokenObj.watchReference}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Starting Time</p>
                  <p className="caption-3">{tokenObj.listingStartingTime}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Earning Potential</p>
                  <p className="caption-3">{tokenObj.offEarningPotential}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Earning Potential Duration</p>
                  <p className="caption-3">{tokenObj.offEarningPotentialDuration}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">URI</p>
                  <p className="caption-3">{tokenObj.watchUri}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Expected Net Return</p>
                  <p className="caption-3">{tokenObj.offExpectednetReturn}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Past Returns</p>
                  <p className="caption-3">{tokenObj.offPastReturns}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Currency</p>
                  <p className="caption-3">{tokenObj.offCurrency}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Asset Details</p>
                  <p className="caption-3">{tokenObj.offAssetDetails}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Description</p>
                  <p className="caption-3">{tokenObj.offDescription}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">Model</p>
                  <p className="caption-3">{tokenObj.watchModel}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p className="caption-3">About</p>
                  <p className="caption-3">{tokenObj.offAbout}</p>
                </div>
            </div>
            {!createLoading && (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignContent: 'center', justifyContent: 'center', marginTop: '4rem'}}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setStep(step - 1);
                  }}
                >
                  Back
                </button>
                <button className="btn-primary" onClick={()=>{initToken()}}>
                  Create Token
                </button>
              </div>
            )}
          </div>

        );
      default: null;
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

  useEffect(() => {
    if(connectedWallet){
      fetchWatches().then((res) => {
        if(res){
          setWatches(res);
        }
      });
    }
  }, [connectedWallet]);

  return (
    <>
      {publicKey 
        // && publicKey.toString() === auth 
      ? (
        // TOP HALF
        <div className="settings">
          {renderSwitch(step)}
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