'use client'
import React, { useState } from 'react';
// import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay";
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { Transaction, Connection, Keypair } from '@solana/web3.js';
import Link from 'next/link';
// QR Code Imports
import { encodeURL, TransactionRequestURLFields } from "@solana/pay";
import QrModal from '@/components/Qr/QrModal';

export default function FaucetPage() {
    const { publicKey, sendTransaction } = useWallet();
    const [displayQr, setDisplayQr] = useState<boolean>(false);
    const [solanaUrl, setSolanaUrl] = useState<URL>();
    const [refKey, setRefKey] = useState<string>();

    const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_DEVNET!,
        "confirmed"
    );
    async function getTransaction() {
        try {
            if(!publicKey){
                console.log('no public key');
                return;
            }

            const response = await fetch('/api/faucet/standard', {
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
        
            const signature = await sendTransaction(tx, connection, 
                {
                    skipPreflight: true,
                },
            );
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
        } catch (error) {
            console.error('Error sending transaction', error);
            toast.error(
                <p style={{color: 'black'}}>
                    Error sending transaction
                </p>
            );
        }
    }

    async function getQrCode() {
        try{
            const { location } = window
            const apiUrl = `${location.protocol}//${location.host}/api/faucet/qr`
            const ref_key = Keypair.generate().publicKey.toBase58();
            setRefKey(ref_key);
            const urlParams: TransactionRequestURLFields = {
                link: new URL(apiUrl),
                label: "swissDAO",
                message: "Thanks for your order! 🤑",
            }
            const solanaUrl = encodeURL(urlParams)
            setSolanaUrl(solanaUrl);
            setDisplayQr(true);     
        } catch (error) {
            console.error('Error generating QR code', error);
            toast.error(
                <p style={{color: 'black'}}>
                    Error generating QR code
                </p>
            );
        };
    };
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            width: '100vw',
            gap: '1rem'
        }}>
            <h1>Faucet</h1>
            <p>Get some free tokens</p>
            <button
                className='btn'
                onClick={getTransaction}
            >
                Get Tokens
            </button>

            <button
                className='btn'
                onClick={getQrCode}
            >
                Get QR Code
            </button>
            {displayQr && solanaUrl && refKey && (
                <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col">
                    {/* create a backdrop that when clicked setDisplayQr(false) */}
                    <div
                        onClick={() => setDisplayQr(false)}
                        className="fixed inset-0 z-10 bg-black bg-opacity-50"
                    />
                    <QrModal
                        showModal={displayQr}
                        solanaUrl={solanaUrl}
                        refKey={refKey}
                        handleClose={() => setDisplayQr(false)}
                    />
                </div>
            )}
        </div>
    )
};