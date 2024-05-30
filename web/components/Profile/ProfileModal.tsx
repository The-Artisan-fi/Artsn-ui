import '@/styles/ProfileModal.scss';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Dynamic from 'next/dynamic';
import { Calendar, Select, theme } from 'antd';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { checkLogin } from '@/components/Web3Auth/solanaRPC';
import { initProfileTx } from '../Protocol/functions';
import { toastPromise, toastError } from '@/helpers/toast';
import RPC from "@/components/Web3Auth/solanaRPC";
import ImgCrop from 'antd-img-crop';
import { MdOutlineFileUpload } from 'react-icons/md';
import { useMutation } from "@apollo/client";
import { ADD_USER } from "@/lib/mutations";
import useSWRMutation from "swr/mutation";
import LoginHeader from '@/public/assets/login/login_header.svg';
import Logo from '@/public/assets/login/logo_bw.svg';
import OnfidoWrapper from '@/components/Profile/Onfido/OnfidoWrapper';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { countries } from '@/lib/countries';
const Upload = Dynamic(() => import('antd').then((mod) => mod.Upload), { ssr: false });
const Input = Dynamic(() => import('antd').then((mod) => mod.Input), { ssr: false });

type Profile = {
    fullName?: string,
    userName?: string,
    email?: string,
    dob?: string,
    address: {
        building_number?: string,
        street?: string,
        town?: string,
        postcode?: string,
        country?: string
    }
}

interface ProfileModalProps {
    showModal: boolean;
    page?: number;
    offChainProfile?: Profile;
    handleClose: () => void;
    handleCloseThenCheck: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ showModal, page, offChainProfile, handleClose, handleCloseThenCheck }) => {
    const { publicKey, sendTransaction } = useWallet();
    const { token } = theme.useToken();
    const [isOpen, setIsOpen] = useState(showModal);
    const [activePage, setActivePage] = useState(page ? page : 1);
    const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState<string | null>(null);
    const [verificationPending, setVerificationPending] = useState<boolean>(false);
    const [verificationNeeded, setVerificationNeeded] = useState<boolean>(false);
    const [rpc, setRpc] = useState<RPC | null>(null);
    const [addUser, { loading, error, data }] = useMutation(ADD_USER);
    const [fileList, setFileList] = useState([]);
    const [selectedValue, setSelectedValue] = useState<Dayjs>(
        dayjs('1990-01-31')
    );
    const [profile, setProfile] = useState<Profile | null>({
        fullName: offChainProfile ? offChainProfile.fullName : '',
        userName: '',
        email: '',
        dob: '', //'1990-01-31'
        address: {
            building_number: '',
            street: '',
            town: '',
            postcode: '',
            country: '',
        }
    });
    const [displayOnfido, setDisplayOnfido] = useState<boolean>(false);
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );

    // MODAL ACTIONS***************************************************************
    const handlePageChange = (page: number) => {
        console.log('handle page change')
        setActivePage(page)
    }

    const handleCloseModal = () => {
        setIsOpen(false);
        handleClose();
    }

    const handleCloseCheck = () => {
        setIsOpen(false);
        handleCloseThenCheck();
    }

    // CALENDAR PICKER FUNCTIONS****************************************************
    const onSelect = (newValue: Dayjs) => {
        setProfile(
            { ...profile!, dob: newValue.format('YYYY-MM-DD') }
        );
        console.log('selected value', newValue.format('YYYY-MM-DD'));
        setSelectedValue(newValue);
      };
    
    const onPanelChange = (newValue: Dayjs) => {
        setProfile(
            { ...profile!, dob: newValue.format('YYYY-MM-DD') }
        );
    };

    // COUNTRY SELECTION***********************************************************
    const handleChange = (value: string) => {
        setProfile(
            { ...profile, address: { ...profile!.address, country: value } }
        );
      };

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
        // @ts-expect-error - image
        const image = new Image();
        image.src = src!;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };
    
    // S3 IMAGE UPLOAD AND FETCH****************************************************
    async function uploadDocuments(
        url: string,
        { arg }: { arg: { files: Blob[] } }
    ) {
        const body = new FormData();
        if(fileList.length < 1){
            return;
        }
        arg.files.forEach((file: Blob) => {
            // @ts-expect-error - fileList not empty
          body.append("file", file, `${publicKey ? publicKey.toBase58() : web3AuthPublicKey}.${fileList[0].name.split('.').pop()}`);
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
    
    async function initProfile(key: string | null) {        
        try {
            if(!publicKey && !web3AuthPublicKey){
                console.log('no public key');
                return;
            }
            if(publicKey){
                const tx = await initProfileTx(publicKey.toBase58());
                const signature = await sendTransaction(tx!, connection);
                console.log(
                    `Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
                );

                await toastPromise(signature);
                
                // handleCloseThenCheck();
                setVerificationNeeded(true);
            }

            if(web3AuthPublicKey !== null && !publicKey){
                const tx = await initProfileTx(web3AuthPublicKey);
                const signature = await rpc!.sendTransaction(tx!);
               
                console.log(
                    `Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
                );
                await toastPromise(signature);
                // handleCloseThenCheck();   
                setVerificationNeeded(true);         
            }
        } catch (error) {
            console.error('Error sending transaction', error);
            toastError('Error sending transaction');
        }
    }

    async function createProfile(key: string) {
        if(fileList.length < 1){
            return;
        }
        // convert newFileList to a Blob
        const fileListBlob = fileList.map((file: { originFileObj: Blob; type: string; }) => {
            return new Blob([file.originFileObj], { type: file.type });
        });
        await trigger({ files: fileListBlob });

        await initProfile(key);

        addUser({
            variables: {
                fullName: profile!.fullName,
                userName: profile!.userName,
                email: profile!.email,
                wallet: publicKey ? publicKey.toBase58() : web3AuthPublicKey,
                currencyPreference: '$USD',
                // @ts-expect-error - fileList is not empty
                profileImg: `https://artisan-solana.s3.eu-central-1.amazonaws.com/${publicKey ? publicKey.toBase58() : web3AuthPublicKey}.${fileList.length > 0 ? fileList[0].name.split('.').pop() : ''}`
            }
        });
        {!loading && !error && data && (
            handlePageChange(2)
        )}
        {error && (
            console.log('Error submitting', error)
        )}
        {loading && (
            console.log('Submitting...')
        )}
    }

    const page1 = () => {

        return(
            <>
                <div className="modal-header">
                    {/* create an X to 'handleCloseModal' in the top right corner of the div and give it a z index so it stays on top of other ojects */}
                    <button 
                        onClick={handleCloseModal}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2.5rem',
                            zIndex: 100,
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: 'none',                               
                            fontSize: '2.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        x
                    </button>
                    {/* <Image
                        src={LoginHeader}
                        alt="login header"
                        className="login-header"
                    /> */}
                    <div className="login-header" />
                    <Image
                        src={Logo}
                        alt="logo"
                        className="logo"
                    />
                    <div className="header-text-container">
                        <p className="header-text">
                            Create a Buyer Profile
                        </p>
                        <p className="header-subtext">
                            Establish a buyer profile to access the marketplace and begin collecting.
                        </p>
                    </div>
                </div>
                <div className="profile">
                    <div className="profile__top-row">
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
                            {fileList.length < 1 && <p className="p-4">Upload Profile Picture</p>}
                        </div>

                        <div className="profile__top-row__col">
                            <p className="caption-3">FULL NAME</p>
                            <Input 
                                className="profile__input-col__input"
                                size="large" 
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile!, fullName: e.target.value });}}
                            />
                            <p className="caption-3">USERNAME</p>
                            <Input 
                                size="large" 
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile!, userName: e.target.value });}}
                            />
                            <p className="caption-3">EMAIL</p>
                            <Input
                                size="large"
                                placeholder="Enter Your Email"
                                type="email"
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile!, email: e.target.value });}}
                            />
                        </div>
                    </div>
                </div> 

                
                
                {verificationPending && (
                    <div className="verification-pending">
                        <p className="caption-3">Verification Pending</p>
                        <p className="caption-3">You will be notified when your verification is complete</p>
                    </div>
                )}

                {!verificationNeeded && (
                    <div className="login-container">
                        <button className="btn-primary" onClick={() => createProfile(publicKey ? publicKey!.toBase58() : web3AuthPublicKey!)}>
                            Create Profile
                        </button>
                    </div>
                )}

                <button
                    onClick={()=> handlePageChange(2)}
                >
                    change page
                </button>
            </>
        )
    }

    const page2 = () => {
        const wrapperStyle = {
            width: 300,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
          };
        const retry = () => {
            // setDisplayOnfido(false);
            // setDisplayOnfido(true);
            console.log('retry')
        }
        return (
            <>
                <div className="modal-header">
                    {/* create an X to 'handleCloseModal' in the top right corner of the div and give it a z index so it stays on top of other ojects */}
                    <button 
                        onClick={handleCloseModal}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2.5rem',
                            zIndex: 100,
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: 'none',                               
                            fontSize: '2.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        x
                    </button>
                    {/* <Image
                        src={LoginHeader}
                        alt="login header"
                        className="login-header"
                    /> */}
                    <div className="login-header" />
                    <Image
                        src={Logo}
                        alt="logo"
                        className="logo"
                    />
                    <div className="header-text-container">
                        <p className="header-text">
                            Verify Your Identity
                        </p>
                        <p className="header-subtext">
                            To open an account with us, we need to verify your identity. This should only take a few minutes.
                        </p>
                    </div>
                </div>
                <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: '2rem',
                        padding: '2rem',

                    }}
                >
                    <div 
                        // className="profile__top-row"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '2rem',
                            gap: '2rem',
                        //     alignContent: 'center'
                        }}
                    >
                        <div 
                            // className="profile__top-row__image-upload" 
                            style={wrapperStyle}
                        >
                            <p className="caption-3">Date of Birth</p>
                            {/* calendar picker that reports the date as 10-20-01 */}
                            <Calendar 
                                fullscreen={false}
                                value={profile!.dob !== '' ? dayjs(profile!.dob) : selectedValue} 
                                onSelect={onSelect} 
                                onPanelChange={onPanelChange} 
                                style={{ height: '20vh'}}
                            />
                        </div>

                        <div className="profile__top-row__col">
                            
                            <p className="caption-3">Building Number</p>
                            <Input 
                                size="large" 
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile, address: { ...profile!.address, building_number: e.target.value } });}}
                            />
                            <p className="caption-3">Street</p>
                            <Input 
                                size="large" 
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile, address: { ...profile!.address, street: e.target.value } });}}
                            />
                            <p className="caption-3">Town</p>
                            <Input 
                                size="large" 
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile, address: { ...profile!.address, town: e.target.value } });}}
                            />
                            <p className="caption-3">Postcode</p>
                            <Input 
                                size="large" 
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile, address: { ...profile!.address, postcode: e.target.value } });}}
                            />
                            <p className="caption-3">Country</p>
                            {/* <Input 
                                size="large" 
                                style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                onChange={(e) => {setProfile({ ...profile, address: { ...profile.address, country: e.target.value } });}}
                            /> */}
                            <Select
                                defaultValue="CH"
                                style={{ width: 260 }}
                                onChange={handleChange}
                                options={countries}
                            />
                        </div>
                    </div>
                    {/* 
                    <button
                        className="btn-primary"
                        onClick={()=> handlePageChange(1)}
                    >
                        Go Back
                    </button> */}
                </div> 
                {
                    profile!.fullName !== '' && profile!.fullName !== undefined &&
                    profile!.dob !== '' && profile!.dob !== undefined &&
                    profile!.address.building_number !== '' && profile!.address.building_number !== undefined &&
                    profile!.address.street !== '' && profile!.address.street !== undefined &&
                    profile!.address.town !== '' && profile!.address.town !== undefined &&
                    profile!.address.postcode !== '' && profile!.address.postcode !== undefined &&

                    (
                        <div className="login-container">
                            <button 
                                className="btn-primary"
                                onClick={()=> setDisplayOnfido(true)}
                            >
                                Verify Identity
                            </button>
                        </div>
                    )
                }
                
                {
                    displayOnfido &&
                    (
                        <OnfidoWrapper 
                            publicKey={publicKey ? publicKey.toString() : web3AuthPublicKey!} 
                            handleSuccessPending={()=> setVerificationPending(true)}
                            handleRetry={()=> retry()}
                            fullName={profile!.fullName || ''}
                            dob={profile!.dob || ''}
                            address={{
                                ...profile!.address,
                                building_number: profile!.address.building_number || '',
                                street: profile!.address.street || '',
                                town: profile!.address.town || '',
                                postcode: profile!.address.postcode || '',
                                country: profile!.address.country || ''
                            }}
                        />
                    )
                }
                </>
        )
    }

    useEffect(() => {
        if(publicKey){
            return;
        }
        checkLogin().then((res) => {
            if(res){
                if(res.account){
                    setWeb3AuthPublicKey(res.account);
                }
                if(res.rpc !== null){
                    setRpc(res.rpc);
                }
            }
        });
    }, []);

    return (
        <>
            {isOpen && (
                <div className="modal-container">
                    {activePage !== 2 ? page1() : page2()}
                </div>
            )}
        </>
    );
};

export default ProfileModal;
