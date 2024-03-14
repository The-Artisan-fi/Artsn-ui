import '@/styles/ProfileModal.scss';
import React, { useState, useEffect } from 'react';
// import { signAllTransaction, signTransaction } from '@/components/Web3Auth/solanaRPC';
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, Connection } from "@solana/web3.js";
import { checkLogin } from '@/components/Web3Auth/checkLogin';
import { toast } from 'react-toastify';
import RPC from "@/components/Web3Auth/solanaRPC";
import Link from 'next/link';
interface ProfileModalProps {
    showModal: boolean;
    handleClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ showModal, handleClose }) => {
    const { publicKey, sendTransaction } = useWallet();
    const [isOpen, setIsOpen] = useState(showModal);
    const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState<string | null>(null);
    const [rpc, setRpc] = useState<RPC | null>(null);
    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );

    const handleCloseModal = () => {
        setIsOpen(false);
        handleClose();
    }

    async function initProfile(key: string | null) {        
        try {
            if(!publicKey && !web3AuthPublicKey){
                console.log('no public key');
                return;
            }
            if(publicKey){
                const response = await fetch('/api/initProfile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        publicKey: publicKey.toBase58(),
                    })
                })
                const txData = await response.json();
                const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
            
                const signature = await sendTransaction(tx, connection);
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

                console.log(
                    `Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
                );
                toast.promise(
                    connection.confirmTransaction({
                        blockhash,
                        lastValidBlockHeight,
                        signature: signature
                    }),
                    {
                        pending: 'Transaction pending...',
                        success: {
                            render(){
                                return (
                                    <div>
                                        <Link 
                                            style={{color: 'black'}}
                                            target='_blank'  
                                            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                                        > 
                                            Transaction Confirmed 
                                        </Link>
                                    </div>
                                )
                            }
                        },
                        error: 'Error sending transaction'
                    }
                );
                
                handleCloseModal();
                
            }

            if(web3AuthPublicKey !== null && !publicKey){
                const response = await fetch('/api/initProfile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        publicKey: web3AuthPublicKey,
                    })
                })
                const txData = await response.json();
                const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
                const signature = await rpc!.sendTransaction(tx);
                
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

               

                console.log(
                    `Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
                );
                toast.promise(
                    connection.confirmTransaction({
                        blockhash,
                        lastValidBlockHeight,
                        signature: signature
                    }),
                    {
                        pending: 'Transaction pending...',
                        success: {
                            render(){
                                return (
                                    <div>
                                        <Link 
                                            style={{color: 'black'}}
                                            target='_blank'  
                                            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                                        > 
                                            Transaction Confirmed 
                                        </Link>
                                    </div>
                                )
                            }
                        },
                        error: 'Error sending transaction'
                    }
                );
                
                handleCloseModal();            
            }
        } catch (error) {
            console.error('Error sending transaction', error);
            toast.error(
                <p style={{color: 'black'}}>
                    Error sending transaction
                </p>
            );
        }
    }

    useEffect(() => {
        if(publicKey){
            return;
        }
        checkLogin().then((res) => {
            if(res !== false){
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
                        <img src="/assets/login/login_header.svg" alt="login header" className="login-header" />
                        <img src="/assets/login/logo_bw.svg" alt="login header" className="logo" />
                        <div className="header-text-container">
                            <p className="header-text">
                                Create a Buyer Profile
                            </p>
                            <p className="header-subtext">
                                Establish a buyer profile to access the marketplace and begin collecting.
                            </p>
                        </div>
                    </div>
                    <div className="login-container">
                        <button className="btn-primary" 
                            onClick={
                                () => 
                                    {if(publicKey) {
                                        initProfile(publicKey.toBase58())
                                    } else if (web3AuthPublicKey) {
                                       initProfile(web3AuthPublicKey)
                                    }}
                            }
                        >
                            Create Profile
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileModal;
