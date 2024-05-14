import '@/styles/ProfileModal.scss';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Dynamic from 'next/dynamic';
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

const Upload = Dynamic(() => import('antd').then((mod) => mod.Upload), { ssr: false });
const Input = Dynamic(() => import('antd').then((mod) => mod.Input), { ssr: false });

interface ProfileModalProps {
    showModal: boolean;
    handleClose: () => void;
    handleCloseThenCheck: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ showModal, handleClose, handleCloseThenCheck }) => {
    const { publicKey, sendTransaction } = useWallet();
    const [isOpen, setIsOpen] = useState(showModal);
    const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState<string | null>(null);
    const [rpc, setRpc] = useState<RPC | null>(null);
    const [addUser, { loading, error, data }] = useMutation(ADD_USER);
    const [fileList, setFileList] = useState([]);
    const [profile, setProfile] = useState({
        fullName: '',
        userName: '',
        email: ''
    });
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );

    const handleCloseModal = () => {
        setIsOpen(false);
        handleClose();
    }

    const handleCloseCheck = () => {
        setIsOpen(false);
        handleCloseThenCheck();
    }

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
                
                handleCloseThenCheck();
            }

            if(web3AuthPublicKey !== null && !publicKey){
                const tx = await initProfileTx(web3AuthPublicKey);
                const signature = await rpc!.sendTransaction(tx!);
               
                console.log(
                    `Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
                );
                await toastPromise(signature);
                handleCloseThenCheck();            
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

        initProfile(key);

        addUser({
            variables: {
                fullName: profile.fullName,
                userName: profile.userName,
                email: profile.email,
                wallet: publicKey ? publicKey.toBase58() : web3AuthPublicKey,
                currencyPreference: '$USD',
                // @ts-expect-error - fileList is not empty
                profileImg: `https://artisan-solana.s3.eu-central-1.amazonaws.com/${publicKey ? publicKey.toBase58() : web3AuthPublicKey}.${fileList.length > 0 ? fileList[0].name.split('.').pop() : ''}`
            }
        });
        {!loading && !error && data && (
           console.log('Profile created', data)
        )}
        {error && (
            console.log('Error submitting', error)
        )}
        {loading && (
            console.log('Submitting...')
        )}
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
                                    onChange={(e) => {setProfile({ ...profile, fullName: e.target.value });}}
                                />
                                <p className="caption-3">USERNAME</p>
                                <Input 
                                    size="large" 
                                    style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                    onChange={(e) => {setProfile({ ...profile, userName: e.target.value });}}
                                />
                                <p className="caption-3">EMAIL</p>
                                <Input
                                    size="large"
                                    placeholder="Enter Your Email"
                                    type="email"
                                    style={{ backgroundColor: '#1e1e22', color: 'white'}}
                                    onChange={(e) => {setProfile({ ...profile, email: e.target.value });}}
                                />
                            </div>
                        </div>
                    </div> 
                    <div className="login-container">
                        <button className="btn-primary" onClick={() => createProfile(publicKey ? publicKey!.toBase58() : web3AuthPublicKey!)}>
                            Create Profile
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileModal;
