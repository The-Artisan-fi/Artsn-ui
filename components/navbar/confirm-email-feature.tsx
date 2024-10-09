import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK, IWeb3AuthCoreOptions } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/shadcn/card-ui';
import { Progress } from '@/components/ui/shadcn/progress-ui';
import { Button } from "@/components/ui/shadcn/button-ui";
import { Checkbox } from '@/components/ui/shadcn/checkbox-ui';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/components/apollo/auth-context-provider';
import RPC from "@/components/solana/web3auth/solana-rpc";
import { countries } from '@/data/countries';
import { CHECK_EMAIL } from '@/graphql/queries';
import { Dialog } from '@radix-ui/react-dialog';
const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton), { ssr: false });
const clientId = "BI8MhAUT4vK4cfQZRQ_NEUYOHE3dhD4ouJif9SUgbgBeeZwP6wBlXast2pZsQJlney3nPBDb-PcMl9oF6lV67P0";

interface DialogProps {
    _isOpen?: boolean;
    handleNext?: () => void;
    handleBack?: () => void;
    handleClose?: () => void;
}

const ConfirmEmailDialog: React.FC<DialogProps> = ({ _isOpen, handleClose }) => {
    const router = useRouter(); 
    const [isOpen, setIsOpen] = useState(true);
    const [userWallet, setUserWallet] = useState<string | null>(null);
    const { user, loginExistingUser, checkAuth } = useAuth();
    const [checkUserEmail] = useMutation(CHECK_EMAIL);
    const { publicKey } = useWallet();
    const [formData, setFormData] = useState({
        email: '',
    });

    // const handleClose = useCallback(() => setIsOpen(false), []);

    const handleEmailCheck = async () => {
        console.log('Checking email:', formData);
        try {
            console.log('Checking email:', formData);
            console.log('Public Key:', publicKey?.toString());
            if (!userWallet || !user) await checkAuth();
            console.log('loginExistingUser:', userWallet);
            await loginExistingUser({ publicKey: userWallet! });
        } catch (error: any) {
            console.error('Error updating user:', error);
        }
    }
    
    useEffect(() => {
        if (publicKey) setUserWallet(publicKey.toBase58());
        if (user) {
            console.log('User:', user);
            router.push('/dashboard');
        }
    }, [publicKey, user]);

    return (
        <>
            {isOpen && (
                <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10" onClick={handleClose} />
                    <div className="bg-transparent rounded-lg p-6 w-full max-w-4xl relative z-20">
                        <Button onClick={handleClose} className="absolute -top-10 right-2 z-10">Close</Button>
                        {/* <Progress className='w-full my-6 shadow-sm rounded-full bg-gradient-to-r from-primary to-secondary' value={slide * 25} max={100} /> */}
                        <div className='flex flex-row gap-6'>
                            <Card className='bg-transparent flex flex-col text-secondary border-none w-1/2'>
                                <CardHeader className='bg-bg rounded-t-xl'>
                                    <CardTitle className='font-bold'>Welcome back to the Artisan</CardTitle>
                                    <CardDescription>Confirm your email address to continue.</CardDescription>
                                </CardHeader>
                                <CardContent className='bg-bg flex flex-col gap-2'>
                                    
                                    
                                    <WalletMultiButton>
                                        {!publicKey ? (
                                            <>
                                                Connect 
                                                {['phantom', 'solflare', 'backpack', 'ledger'].map(icon => (
                                                    <img key={icon} src={`/login/${icon}_icon.svg`} alt={icon} className='ml-2' style={{ width: '20px', height: '20px'}} />
                                                ))}
                                            </>
                                        ) : (
                                        <>{'Disconnect'} {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</>
                                        )}
                                    </WalletMultiButton>

                                    {/* <form className='flex flex-col gap-2'> */}
                                        <input type='email' placeholder='Email' className='rounded-full p-2 border-2 border-gray-300' onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                                        <Button onClick={()=>handleEmailCheck()} className='rounded-full'>Continue</Button>
                                    {/* </form> */}
                                </CardContent>
                                <CardFooter className='bg-bg flex flex-col gap-2 rounded-b-xl'>
                                    By continuing to use the Artisan you accept terms and condition
                                </CardFooter>
                            </Card>
                            <Card className='bg-bg flex flex-col relative w-1/2 text-secondary'>
                                <div className='h-full w-full rounded-xl bg-[url(/products/rolex-graphic.svg)] bg-cover bg-right-top bg-no-repeat' />
                                <CardHeader className='absolute bottom-0 left-0 w-1/2'>
                                    <CardTitle className='text-xl font-bold'>Buy a fraction of your favorite asset</CardTitle>
                                    <CardDescription className='text-md'>Democratizing Luxury one fraction at a time</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConfirmEmailDialog;