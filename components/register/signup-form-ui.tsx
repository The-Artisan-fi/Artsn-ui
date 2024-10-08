"use client"
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { X, Check } from 'lucide-react';
import { countries } from '@/data/countries';
import { REGISTER_USER } from '@/graphql/mutations';
import { IS_USER_REGISTERED } from '@/graphql/queries';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/shadcn/dropdown-menu-ui';
import { UPDATE_USER } from '@/graphql/mutations';
// web3auth
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter";
import { useLazyQuery, useMutation } from '@apollo/client';
import { useAuth } from '@/components/apollo/auth-context-provider';
import RPC from "@/components/solana/web3auth/solana-rpc";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK, IWeb3AuthCoreOptions, IAdapter } from "@web3auth/base";
import { Button } from '../ui/shadcn/button-ui';
import { web3 } from '@coral-xyz/anchor';
import { Progress } from '../ui/shadcn/progress-ui';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/shadcn/card-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';
const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton), { ssr: false });
type SignupFormProps = {
    onClose: () => void;
};

const clientId = "BI8MhAUT4vK4cfQZRQ_NEUYOHE3dhD4ouJif9SUgbgBeeZwP6wBlXast2pZsQJlney3nPBDb-PcMl9oF6lV67P0"; // get from https://dashboard.web3auth.io
let defaultSolanaAdapters: IAdapter<unknown>[] = [];

export function SignupForm({ onClose }: SignupFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { user, checkAuth, loginExistingUser } = useAuth();
    const { publicKey, wallet } = useWallet();
    const [error, setError] = useState<string | null>(null);
    // const { user, login, logout, loading, checkAuth, connected } = useAuth();
    // const { provider, loggedIn: web3AuthConnected, login: web3AuthLogin, logout: Web3AuthLogout, getUserInfo } = useWeb3Auth();
    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registerUser] = useMutation(REGISTER_USER);
    const [checkRegistration, { loading: registrationLoading, data, error: registrationError }] = useLazyQuery(IS_USER_REGISTERED);
    const [errMsg, setErrMsg] = useState('');
    const [updateUser] = useMutation(UPDATE_USER);
    const [step, setStep] = useState(1);
    const [loginData, setLoginData] = useState({
        _id: '',
        email: '',
        publicKey: '',
        profilePictureUrl: '',
        authProvider: '',
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        country: 'CH',
        acceptTerms: '',
        plan: ''
    });

    const getLocalStorage = () => {
        if (typeof window !== 'undefined') {
            return window.localStorage;
        }
        return null;
    };
      
    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(( prevData: any )=> {
            const newData = {
                ...prevData,
                [name]: type === 'checkbox' ? Date.now() : value
            };
            // Save to localStorage (client-side only)
            const storage = getLocalStorage();
            if (storage) {
                storage.setItem('signupFormData', JSON.stringify(newData));
            }
            return newData;
        });
    };

    const handleNext = async() => {
        await fetchUserInfo();
        setStep(prevStep => prevStep + 1);
    };

    const handleUpdateUser = async() => {
        try {
            console.log('user ->', user);
            if (!loginData.publicKey || !user) await checkAuth();
            const result = await updateUser({
                variables: {
                    _id: user!._id,
                    input: {
                        acceptTerms: formData.acceptTerms,
                    },
                }
            });

            if (result.data && result.data.updateUser) {
                console.log('User updated successfully:', result.data.updateUser);
                const storage = getLocalStorage();
                if (storage) {
                    storage.removeItem('signupFormData');
                }
                router.push('/dashboard');
            } else {
                console.error('UpdateUser mutation returned null or undefined');
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            if (error.graphQLErrors) {
                error.graphQLErrors.forEach((graphQLError: any) => {
                    console.error('GraphQL error:', graphQLError.message);
                    if (graphQLError.extensions) {
                        console.error('Error extensions:', graphQLError.extensions);
                    }
                });
            }
            if (error.networkError) {
                console.error('Network error:', error.networkError);
            }
        }
    };

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
            setLoginData((prevData: any) => ({ ...prevData, publicKey: accounts[0] }));
            const {idToken}= await web3auth.authenticateUser();
            if (idToken) {
                console.log('returned idToken:', idToken, 'from adapter:', adapterName, 'with accounts:', accounts[0]);
                setConnected(true);
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

    const loginWithGoogle = async () => {
        try {
            if (!web3auth) {
                console.error("Web3Auth not initialized yet");
                return;
            }
    
            // Check if already connected
            if (web3auth.connected) {
                console.log("Already connected, fetching user info");
                // Fetch user info directly if already connected
                await fetchUserInfo();
                return;
            }
    
            // If not connected, proceed with connection
            const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
                loginProvider: "google",
            });
    
            if (!web3authProvider) {
                console.error('No provider');
                return;
            }
    
            setProvider(web3authProvider);
            setLoggedIn(true);
            
            await fetchUserInfo();

        } catch (error) {
            console.error("Error during Google login:", error);
            // If the error is due to already being connected, try to fetch user info
            if (error instanceof Error && error.message.includes("Already connected")) {
                console.log("Detected 'Already connected' error, attempting to fetch user info");
                await fetchUserInfo();
            } else {
                setError("Failed to login with Google. Please try again.");
            }
        }
    };
    
    const fetchUserInfo = async () => {
        try {
            if (!web3auth || !web3auth.provider) {
                throw new Error("Web3Auth not initialized or no provider");
            }
    
            const rpc = new RPC(web3auth.provider);
            const accounts = await rpc.getAccounts();
            const publicKey = accounts[0];
            
            const user = await web3auth.getUserInfo();
            setLoginData({
                ...loginData,
                publicKey: publicKey.toString(),
            });
            let userObject = {
                _id: '',
                email: user.email || '',
                publicKey: publicKey,
                username: user.name || '',
                profilePictureUrl: user.profileImage || '',
                authProvider: 'google',
            };  
            console.log('user object', userObject);

            const _isRegistered = await checkRegistration({ variables: { publicKey: publicKey} });
            
            console.log('is registered ->', _isRegistered.data.isUserRegistered);
            if (_isRegistered.data.isUserRegistered) {
                setIsRegistered(true);
                await loginExistingUser({ publicKey: userObject.publicKey });
                setConnected(true);
            }
            const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
            console.log('baseUrl ->', baseUrl);
            const response = await fetch(`${baseUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    country: formData.country,
                    profilePictureUrl: userObject.profilePictureUrl || '',
                    email: userObject.email || '',
                    password: userObject.publicKey,
                    publicKey: userObject.publicKey
                }),
              });
              const data = await response.json();
              console.log('data ->', data);
              // If registration is successful, log the user in
              await loginExistingUser({ 
                publicKey: userObject.publicKey,
              });
        
    
            setLoginData(userObject);
            setIsRegistered(_isRegistered.data.isUserRegistered);
        } catch (error) {
            console.error("Error fetching user info:", error);
            setError("Failed to fetch user information. Please try logging in again.");
        }
    };

    const fetchPubkeyInfo = async () => {
        try {
            
            let userObject = {
                _id: '',
                email: loginData.email || '',
                publicKey: publicKey!.toString(),
                username: '',
                profilePictureUrl: '',
                authProvider: 'web3wallet',
            };  
            console.log('user object', userObject);

            const _isRegistered = await checkRegistration({ variables: { publicKey: userObject.publicKey } });
            
            console.log('is registered ->', _isRegistered.data.isUserRegistered);
            if (_isRegistered.data.isUserRegistered) {
                setIsRegistered(true);
                await loginExistingUser({ publicKey: publicKey!.toString() });
                setConnected(true);
            }
            const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
            console.log('baseUrl ->', baseUrl);
            const response = await fetch(`${baseUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    country: formData.country,
                    profilePictureUrl: userObject.profilePictureUrl,
                    password: userObject.publicKey,
                    publicKey: userObject.publicKey
                }),
              });
              const data = await response.json();
              console.log('data ->', data);
              // If registration is successful, log the user in
              await loginExistingUser({ 
                publicKey: userObject.publicKey,
              });
        
    
            setLoginData(userObject);
            setIsRegistered(_isRegistered.data.isUserRegistered);
        } catch (error) {
            console.error("Error fetching user info:", error);
            setError("Failed to fetch user information. Please try logging in again.");
        }
    };

    useEffect(() => {
        
        const initWeb3Auth = async () => {
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
                    adapterSettings: {
                        uxMode: UX_MODE.REDIRECT,
                    },
                });
                web3auth.configureAdapter(authAdapter);
                
                defaultSolanaAdapters = await getDefaultExternalAdapters({ options: web3authOptions }) as IAdapter<unknown>[];
                defaultSolanaAdapters.forEach((adapter) => {
                    web3auth.configureAdapter(adapter);
                });
                
                await web3auth.init();
                setWeb3auth(web3auth);
                setProvider(web3auth.provider);
                if (web3auth.connected) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error("Failed to initialize Web3Auth", error);
            }
        };
    
        initWeb3Auth();
        const storage = getLocalStorage();
         // Load form data from localStorage on component mount
         const savedFormData = storage!.getItem('signupFormData');
         console.log('saved form data ->', savedFormData);  
         if (savedFormData !== null) {
            const firstName = JSON.parse(savedFormData).firstName;
            const lastName = JSON.parse(savedFormData).lastName;
            const country = JSON.parse(savedFormData).country;
            const acceptTerms = JSON.parse(savedFormData).acceptTerms;
            setFormData({
                firstName,
                lastName,
                country,
                acceptTerms,
                plan: ''
            });
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            await fetchUserInfo();
        }
        if(web3auth) {
            // Check if already connected
            if (web3auth.connected) {
               console.log("Already connected, fetching user info");
               setConnected(true);
               // Fetch user info directly if already connected
               fetchUser();
               return;
           }
       }
    }, [web3auth]);
    
    useEffect(() => {
        if (user) {
            setLoginData({
                ...loginData,
                _id: user._id,
            });
        }
    }, [user]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storage = getLocalStorage();
            if (storage) {
                setFormData(JSON.parse(storage!.getItem('signupFormData')!));
            }
            
        } else {
            console.error('Window object not available');
        }
    }, []);
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {web3auth && defaultSolanaAdapters.length > 0 && (
                <div className="fixed h-full inset-0 bg-black bg-opacity-100 flex items-center justify-center z-[100]">
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10" onClick={()=>console.log('click')} />
                    <div className="bg-transparent rounded-lg p-6 w-full max-w-4xl relative z-20">
                        <Button onClick={()=> router.push('/')} className="absolute -top-10 right-2 z-30">Close</Button>
                        <Progress className='w-full my-6 shadow-sm rounded-full bg-gradient-to-r from-primary to-secondary' value={step == 1 ? 50 : 100} max={100} />

                        {step === 1 && (
                            <div className='flex flex-row gap-6'>
                                <Card className='bg-primary p-8 flex flex-col text-secondary border-none w-1/2'>
                                    <h3 className="text-xl font-bold mb-4">FILL YOUR ACCOUNT INFORMATION</h3>
                                    <div className="flex flex-col gap-4 mb-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First name"
                                            value={formData ? formData.firstName : ''}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={formData ? formData.lastName : ''}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded"
                                            required
                                        />
                                        <select
                                            name="country"
                                            value={formData ? formData.country : 'CH'}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded"
                                            required
                                        >
                                            <option value={'CH'} label={'Switzerland 🇨🇭'} >
                                                Switzerland 🇨🇭
                                            </option>
                                            {countries.map(country => (
                                            <option key={country.value} value={country.label}>
                                                {country.label}
                                            </option>
                                            ))}
                                        </select>
                                        <div className="mt-4">
                                            <h3 className="text-xl font-bold mb-2">CONNECT A WALLET</h3>
                                                <div className="flex flex-col justify-evenly mb-4 gap-4">
                                                    <Button disabled={connected || loginData.publicKey ? true : false} variant="outline" className='w-full rounded-full border-none font-urbanist text-lg hover:bg-secondary hover:text-primary' style={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}} onClick={() => loginWithGoogle()}>
                                                        Google
                                                    </Button>
                                                    {/* <WalletMultiButton /> */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button disabled={connected || loginData.publicKey ? true : false} variant={'default'} className='w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary'>
                                                            Connect 
                                                                {['phantom', 'solflare', 'backpack', 'ledger'].map(icon => (
                                                                    <img key={icon} src={`/login/${icon}_icon.svg`} alt={icon} className='ml-2' style={{ width: '20px', height: '20px'}} />
                                                                ))}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-56 z-[201]">
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
                                                </div>
                                                {loginData.authProvider || publicKey && ( <p className="flex felx-row text-green-600 mb-2 justify-center">Connected with {!publicKey ? loginData.authProvider : wallet?.adapter.name }</p> )}
                                        </div>
                                    </div>
                                    <>  
                                        <div className="mb-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="acceptTerms"
                                                    checked={formData && formData.acceptTerms === new Date().toISOString() ? true : false} 
                                                    onChange={() => {setFormData((prevData: any)=> ({ ...prevData, acceptTerms: new Date().toISOString() }))}}
                                                    // disabled={!loginData.publicKey || !publicKey ? true : false}
                                                    className="mr-2"
                                                    required
                                                />
                                                I have read and accept the terms of use
                                            </label>
                                        </div>
                                        <Button disabled={!loginData.publicKey} type="submit" className="bg-secondary text-primary hover:text-secondary px-4 py-2 rounded" onClick={()=> handleNext()}>
                                            Next 
                                        </Button>
                                    </>
                                </Card>
                                <Card className='bg-bg flex flex-col relative w-1/2 text-secondary overflow-hidden'>
                                    <div className='h-full w-full rounded-xl bg-[url(/products/rolex-bg.svg)] bg-contain bg-right-middle bg-no-repeat transform translate-x-[4rem] scale-150 translate-y-[7rem] ' />
                                    <CardHeader className='absolute bottom-0 left-0 w-1/2'>
                                        <CardTitle className='text-xl font-bold'>Buy a fraction of your favorite asset</CardTitle>
                                        <CardDescription className='text-md'>Democratizing Luxury one fraction at a time</CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                        
                        )}

                

                        {step === 2 && (
                            <div className='flex flex-row gap-6'>
                                <Card className='bg-primary p-8 flex flex-col text-secondary border-none w-1/2'>
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Congratulations!</h3>
                                    <p className="mb-4">Your account with The Artisan has been created</p>
                                    <p className="mb-4">Head over to your dashboard to learn how to collect!</p>
                                    <p className="mb-4">
                                        <strong>Wallet: {loginData.publicKey.slice(0,4)}...{loginData.publicKey.slice(-4)}</strong>
                                        
                                    </p>
                                    <button 
                                        onClick={
                                            () => {
                                                // onClose();
                                                handleUpdateUser();
                                            }
                                        } 
                                        className="bg-black text-white px-4 py-2 rounded"
                                    >
                                        Enter
                                    </button>
                                </Card>
                                <Card className='bg-bg flex flex-col relative w-1/2 text-secondary overflow-hidden'>
                                <div className='h-full w-full rounded-xl bg-[url(/products/rolex-bg.svg)] bg-contain bg-right-middle bg-no-repeat transform translate-x-20 scale-150 translate-y-20 ' />
                                <CardHeader className='absolute bottom-0 left-0 w-1/2'>
                                        <CardTitle className='text-xl font-bold'>Buy a fraction of your favorite asset</CardTitle>
                                        <CardDescription className='text-md'>Democratizing Luxury one fraction at a time</CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Suspense>
    );
}