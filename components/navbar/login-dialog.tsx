import React, { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { LoadingFeature } from '@/components/loading/loading-feature';
import { useMutation } from '@apollo/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK, IWeb3AuthCoreOptions, IAdapter  } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/shadcn/card-ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from '@/components/ui/shadcn/dropdown-menu-ui';
import { Progress } from '@/components/ui/shadcn/progress-ui';
import { Button } from "@/components/ui/shadcn/button-ui";
import { Checkbox } from '@/components/ui/shadcn/checkbox-ui';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/components/apollo/auth-context-provider';
import RPC from "@/components/solana/web3auth/solana-rpc";
import { countries } from '@/data/countries';
import { UPDATE_USER } from '@/graphql/mutations';
import { useToast } from '@/hooks/use-toast';
import { Dialog } from '@radix-ui/react-dialog';
const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton), { ssr: false });
const clientId = "BI8MhAUT4vK4cfQZRQ_NEUYOHE3dhD4ouJif9SUgbgBeeZwP6wBlXast2pZsQJlney3nPBDb-PcMl9oF6lV67P0";

interface DialogProps {
    _isOpen?: boolean;
    handleNext?: () => void;
    handleBack?: () => void;
    handleClose?: () => void;
}
let defaultSolanaAdapters: IAdapter<unknown>[] = [];
const LoginDialog: React.FC<DialogProps> = ({ _isOpen }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [slide, setSlide] = useState(_isOpen ? 2 : 1);
    const [isOpen, setIsOpen] = useState(_isOpen || false);
    const [userWallet, setUserWallet] = useState<string | null>(null);
    const { user, loginExistingUser, checkAuth, checkUserRegistration } = useAuth();
    const [updateUser] = useMutation(UPDATE_USER);
    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
    const [provider, setProvider] = useState<IProvider | null>(null);
    const { publicKey } = useWallet();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        country: 'CH',
        acceptTerms: '',
        plan: ''
    });

    const loginWithAdapter = async (adapterName: string) => {
        console.log('Logging in with adapter:', adapterName);
        if (!web3auth) {
          console.log("web3auth not initialized yet");
          return;
        }
        const web3authProvider = await web3auth.connectTo(adapterName);
        setProvider(web3authProvider);

        if (web3auth.connected && web3auth.provider) {
            const rpc = new RPC(web3auth.provider);
            const accounts = await rpc.getAccounts();
            setUserWallet(accounts[0]);
            const {idToken}= await web3auth.authenticateUser();
            if (idToken) {
                console.log('returned idToken:', idToken, 'from adapter:', adapterName, 'with accounts:', accounts[0]);
                const _isRegistered = await checkUserRegistration(accounts[0]);
                console.log('isRegistered:', _isRegistered);
                // if (!_isRegistered) {
                //    router.push('/register');
                // }
                await loginExistingUser({ publicKey: accounts[0] });
                await checkAuth();
                handleClose();
            }
            toast({
                title: 'Connected',
                description: 'Successfully connected to your wallet',
            });
        } else {
            toast({
                title: 'Failed to connect',
                description: 'Failed to connect to your wallet',
            });
        }
    };

    const handleLogin = useCallback(async (adapterName: string) => {
        await loginWithAdapter(adapterName);
    }, [loginWithAdapter]);

    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleUpdateUser = useCallback(async () => {
        try {
            if (!userWallet || !user) await checkAuth();
            const result = await updateUser({
                variables: {
                    _id: user!._id,
                    input: formData,
                }
            });

            if (result.data && result.data.updateUser) {
                console.log('User updated successfully:', result.data.updateUser);
                localStorage.removeItem('signupFormData');
            } else {
                console.error('UpdateUser mutation returned null or undefined');
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
        }
    }, [userWallet, user, checkAuth, updateUser, formData, router]);

    const handleBack = useCallback(() => setSlide(prev => Math.max(prev - 1, 1)), []);
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prevData => {
            const newData = {
                ...prevData,
                [name]: name === 'acceptTerms' ? Date.now().toString() : value
            };
            localStorage.setItem('signupFormData', JSON.stringify(newData));
            return newData;
        });
    }, []);

    const initWeb3Auth = useCallback(async () => {
        try {
            const chainConfig = {
                chainNamespace: CHAIN_NAMESPACES.SOLANA,
                chainId: "0x3",
                rpcTarget: "https://api.devnet.solana.com",
                displayName: "Solana Devnet",
                blockExplorerUrl: "https://explorer.solana.com",
                ticker: "SOL",
                tickerName: "Solana Token",
            };

            const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

            const web3authOptions: IWeb3AuthCoreOptions = {
                clientId,
                privateKeyProvider,
                web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
            };

            const web3auth = new Web3AuthNoModal(web3authOptions);

            const authAdapter = new AuthAdapter({
                privateKeyProvider,
                adapterSettings: { uxMode: UX_MODE.REDIRECT },
            });

            web3auth.configureAdapter(authAdapter);

            defaultSolanaAdapters = await getDefaultExternalAdapters({ options: web3authOptions }) as IAdapter<unknown>[];
            defaultSolanaAdapters.forEach((adapter) => web3auth.configureAdapter(adapter as IAdapter<unknown>));

            await web3auth.init();
            setWeb3auth(web3auth);
            setProvider(web3auth.provider);

            if (web3auth.provider && web3auth.connected) {
                const rpc = new RPC(web3auth.provider);
                const accounts = await rpc.getAccounts();
                setUserWallet(accounts[0]);
            }
        } catch (error) {
            console.error('Failed to initialize Web3Auth:', error);
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        if (!web3auth) {
            await initWeb3Auth();
        }
        try {
            const web3authProvider = await web3auth!.connectTo(WALLET_ADAPTERS.AUTH, {
                loginProvider: "google",
            });
            setProvider(web3authProvider);
        } catch (error) {
            console.error('Failed to login with Google:', error);
        }
    }, [web3auth, initWeb3Auth]);

    useEffect(() => {
        const storedData = localStorage.getItem('signupFormData');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }

        if (!web3auth) {
            initWeb3Auth();
        }

        if (publicKey && !web3auth) {
            setUserWallet(publicKey.toBase58());
        }

        if (publicKey && web3auth) {
            console.warn('Two login methods detected, please refresh page and only choose one');
        }
    }, [web3auth, publicKey, initWeb3Auth]);

    useEffect(() => {
        if ((publicKey || userWallet) && slide === 2) {
            setSlide(3);
        }
    }, [slide, userWallet, publicKey]);


    return (
        <Suspense fallback={<div className='animate-pulse'>Loading...</div>}>
            {web3auth && defaultSolanaAdapters.length > 0 ? (
                <>
                    <Button variant='secondary' className='rounded-xl z-[201]' onClick={handleOpen}>
                        Login
                    </Button>
                    {isOpen && (
                        <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10" onClick={handleClose} />
                            <div className="bg-transparent rounded-lg p-6 w-full max-w-4xl relative z-20">
                                <Button onClick={handleClose} className="absolute -top-10 right-2 z-10">Close</Button>
                                {/* <Progress className='w-full my-6 shadow-sm rounded-full bg-gradient-to-r from-primary to-secondary' value={slide * 25} max={100} /> */}
                                <div className='flex flex-col md:flex-row gap-6'>
                                    <Card className='bg-transparent flex flex-col text-secondary border-none w-full md:w-1/2 z-[301]'>
                                        <CardHeader className='bg-bg rounded-t-xl'>
                                            <CardTitle className='font-bold'>Welcome to the Artisan</CardTitle>
                                            <CardDescription>Connect your buyer profile to access the marketplace and begin collecting</CardDescription>
                                        </CardHeader>
                                        <CardContent className='bg-bg flex flex-col gap-2'>
                                            {/* <form className='flex flex-col gap-2'>
                                                <input type='email' placeholder='Email' className='rounded-full p-2 border-2 border-gray-300' />
                                                <Button onClick={handleNext} className='rounded-full'>Continue</Button>
                                            </form> */}
                                            <Button className='w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary' onClick={()=> loginWithGoogle()}>
                                                Sign in with Google
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant={'default'} className='w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary'>
                                                    Connect 
                                                        {['phantom', 'solflare', 'backpack', 'ledger'].map(icon => (
                                                            <img key={icon} src={`/login/${icon}_icon.svg`} alt={icon} className='ml-2' style={{ width: '20px', height: '20px'}} />
                                                        ))}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuGroup>
                                                        {defaultSolanaAdapters?.map((adapter: IAdapter<unknown>) => (
                                                            <DropdownMenuItem key={adapter.name.toUpperCase()} onClick={() => handleLogin(adapter.name)}>
                                                                <img key={adapter.name} src={`/login/${adapter.name}_icon.svg`} alt={adapter.name ?? ''} className='ml-2' style={{ width: '20px', height: '20px'}} />
                                                                {adapter.name.charAt(0).toUpperCase() + adapter.name.slice(1)}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            
                                            <div className='flex items-center'>
                                                <div className='flex-grow h-px bg-gray-300'></div>
                                                <span className='px-4 text-gray-500'>OR</span>
                                                <div className='flex-grow h-px bg-gray-300'></div>
                                            </div>

                                            <Button onClick={()=>router.push('/register')} variant={'secondary'} className='w-full rounded-full hover:bg-primary hover:text-secondary hover:border-solid hover:border-2 hover:border-secondary hover:animate-pulse'>Create account</Button>
                                        </CardContent>
                                        <CardFooter className='bg-bg flex flex-col gap-2 rounded-b-xl'>
                                            By continuing to use the Artisan you accept terms and condition
                                        </CardFooter>
                                    </Card>

                                    <Card className='hidden md:flex bg-bg flex flex-col relative w-1/2 text-secondary overflow-hidden'>
                                        <div className='h-full w-full rounded-xl bg-[url(/products/rolex-bg.svg)] bg-contain bg-right-middle bg-no-repeat transform translate-x-[6rem] scale-[140]translate-y-10 ' />
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
            ) : <div className='animate-pulse'>Loading...</div>}
        </Suspense>
    );
}

export default LoginDialog;