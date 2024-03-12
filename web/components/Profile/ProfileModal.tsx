import '@/styles/ProfileModal.scss';
import React, { useState, useEffect } from 'react';
// import { signAllTransaction, signTransaction } from '@/components/Web3Auth/solanaRPC';
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, Connection, PublicKey } from "@solana/web3.js";
import { checkLogin } from '../Web3Auth/checkLogin';

interface ProfileModalProps {
    showModal: boolean;
    handleClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ showModal, handleClose }) => {
    const { publicKey, sendTransaction } = useWallet();
    const [isOpen, setIsOpen] = useState(showModal);
    const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState<string | null>(null);
    const [rpc, setRpc] = useState<any>(null);
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
            
                const signature = await sendTransaction(tx, connection, {skipPreflight: true});
                
                console.log(
                    `Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
                );
                
                if(signature){
                    handleCloseModal();
                }
            }

            if(web3AuthPublicKey !== null && !publicKey){
                console.log('web3auth public key', web3AuthPublicKey);
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
                console.log('sending tx to web3auth', tx)
                const signature = await rpc.sendTransaction(tx);
                
                console.log(
                    `Web3Auth Transaction sent: https://explorer.solana.com/tx/${signature}?cluster=devnet`
                );
                
                if(signature){
                    setTimeout(() => {
                        handleCloseModal();
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error sending transaction', error);
        }
    }

    useEffect(() => {
        if(publicKey){
            return;
        }
        checkLogin().then((res) => {
            if(res !== false){
                const web3pubkey = localStorage.getItem("web3pubkey");
                if(web3pubkey){
                    setWeb3AuthPublicKey(web3pubkey);
                }
                if(res.rpc !== null){
                    setRpc(res.rpc);
                    console.log('rpc', rpc);
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
                            {/* <form 
                                className="email-form"
                                onSubmit={(e) => {
                                e.preventDefault();
                                loginWithEmail(e.target[0].value);
                                }
                            }>
                                <input type="email" placeholder="Login with Email" />
                                <button type="submit" className="email-btn">
                                <CgArrowRight  className="email-icon"/>
                                </button>
                            </form> */}
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
                    {/* <div className="login-container">
                        <div className="social-login-option">
                            <p className="social-login-text">Login with Social Accounts</p>             
                            <div className="web3auth-container">
                            {!loggedIn ? (
                            <button 
                                onClick={login} 
                                className="google-login-btn" 
                            >
                                <CgGoogle onClick={login} className="google-icon" />
                                <p className="google-login-text">
                                Sign in with Google
                                </p>
                            </button>
                            ):(
                                <button onClick={logout} className="google-login-btn">
                                <CgGoogle onClick={login} className="google-icon" />
                                Log Out
                                </button>
                            )}
                            </div>
                        </div>
                        <div className="divider-text">OR</div>
                        <div className="web3-login-option">
                        <div className="wallet-icons-container">
                            <img src="/assets/login/phantom_icon.svg" alt="phantom" className="phantom-wallet-icon" />
                            <img src="/assets/login/solflare_icon.svg" alt="solflare" className="solflare-wallet-icon" />
                            <img src="/assets/login/backpack_icon.svg" alt="backpack" className="backpack-wallet-icon" />
                            <img src="/assets/login/torus_icon.svg" alt="torus" className="torus-wallet-icon" />
                            <img src="/assets/login/ledger_icon.svg" alt="ledger" className="ledger-wallet-icon" />
                        </div>
                        <WalletMultiButton
                            className="wallet-btn"
                            style={{ 
                            borderRadius: '7px', 
                            height: '36px', 
                            width: '100%',
                            background: 'linear-gradient(92.89deg, rgba(255, 153, 0, 0.26) 6.43%, rgba(151, 71, 255, 0.26) 100%), linear-gradient(93.85deg, #ff9900d3 1.67%, #9747ffd2 100%)',
                            fontFamily: 'Inter',
                            fontWeight: '300',
                            fontStyle: 'normal',
                            fontSize: '1.2rem',
                            lineHeight: '16px',
                            letterSpacing: '-2.6%',
                            border: '1px solid linear-gradient(92.89deg, rgba(255, 153, 0, 0.26) 6.43%, rgba(151, 71, 255, 0.26) 100%), linear-gradient(93.85deg, #FF9900 1.67%, #9747FF 100%)',
                            }}
                        > 
                            {
                            publicKey ?
                            <span>Connected</span> :
                            <span>Connect Web3 Wallet</span>
                            }
                        </WalletMultiButton>
                        </div>
                    </div> */}
                </div>
            )}
        </>
    );
};

export default ProfileModal;
