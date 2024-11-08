'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK, UX_MODE, IWeb3AuthCoreOptions, IAdapter } from "@web3auth/base";
import { getInjectedAdapters } from "@web3auth/default-solana-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import RPC from "@/components/blockchain/solana-rpc";
import { LOGIN_USER } from '@/graphql/mutations/user';
import { useMutation } from '@apollo/client';

const clientId = "BI8MhAUT4vK4cfQZRQ_NEUYOHE3dhD4ouJif9SUgbgBeeZwP6wBlXast2pZsQJlney3nPBDb-PcMl9oF6lV67P0";
let injectedAdapters: IAdapter<unknown>[] = [];
export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userWallet, setUserWallet] = useState<string | null>(null);
  const [loginUserMutation] = useMutation(LOGIN_USER);
  const rpc = useMemo(() => provider ? new RPC(provider) : null, [provider]);

  const initWeb3Auth = useCallback(async () => {
    try {
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        rpcTarget: "https://api.devnet.solana.com",
        displayName: "Solana Devnet",
        blockExplorerUrl: "https://explorer.solana.com",
        ticker: "SOL",
        tickerName: "Solana Token",
        logo: "",
      };

      const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

      const web3authOptions: IWeb3AuthCoreOptions = {
        clientId,
        privateKeyProvider,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      };
      const web3auth = new Web3AuthNoModal(web3authOptions);

      setWeb3auth(web3auth);

      const authAdapter = new AuthAdapter({
        privateKeyProvider,
        adapterSettings: {
          uxMode: UX_MODE.REDIRECT,
        },
      });
      web3auth.configureAdapter(authAdapter);

      injectedAdapters = getInjectedAdapters({ options: web3authOptions });
      injectedAdapters.forEach((adapter) => {
        web3auth.configureAdapter(adapter);
      });

      console.log('adapters available', 
        injectedAdapters
          .map((adapter) => adapter.name)
          .join(', ')
      );
      const availableAdapters = injectedAdapters.map((adapter) => adapter.name);

      await web3auth.init();
      setProvider(web3auth.provider);
      if (web3auth.connected) {


        const rpc = new RPC(web3auth.provider!);
        const accounts = await rpc?.getAccounts();
        console.log('accounts', accounts);
        const publicKey = accounts![0];
        console.log('publicKey', publicKey);
        const{ idToken }= await web3auth.authenticateUser();
        const user = await web3auth.getUserInfo();

        console.log('user', user);

        const userObject= {
            email: user.email || '',
            publicKey: publicKey,
            username: user.name || '',
            profilePictureUrl: user.profileImage || '',
        };  
        console.log('logging in with userObject', userObject);
        console.log('user object', userObject);

        setUserWallet(userObject.publicKey);

            console.log('user is registered logging in with userObject', userObject);
            // await loginExistingUser({ email: userObject.email, publicKey: userObject.publicKey });
            const result = await loginUserMutation({
              variables: {
                publicKey: userObject.publicKey,
                password: userObject.publicKey,
              },
              onCompleted: (data) => {
                console.log('Mutation completed with data:', data);
              },
              onError: (error) => {
                console.error('Mutation error:', {
                  message: error.message,
                  graphQLErrors: error.graphQLErrors?.map(err => ({
                    message: err.message,
                    path: err.path,
                    extensions: err.extensions
                  })),
                  networkError: error.networkError
                });
              }
            }).catch(error => {
              console.error('Caught in mutation catch block:', error);
              throw error;
            });

            console.log('result', result);
            // toast({
            //   title: 'Welcome back!',
            //   description: 'You have successfully logged in.',
            // })
            // router.push('/dashboard');
        
        // else {
        //   router.push('/register');
        // }

      }
    } catch (error) {
      console.error(error);
    }  finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initWeb3Auth();
  }, [initWeb3Auth]);

  const login = useCallback(async () => {
    if (!web3auth) {
      console.log('Web3Auth not initialized, initializing...');
      await initWeb3Auth();
    }

    try {
      console.log('Attempting login...');
      setLoading(true);
      console.log('about to connect to web3auth', web3auth);
      if(web3auth && web3auth.connected) {
        const test = await web3auth.getUserInfo();
        console.log('test', test);

        setLoggedIn(true);

        const user = await web3auth!.getUserInfo();
        console.log('User info:', user);
        
        const accounts = await rpc?.getAccounts();
        console.log('Accounts:', accounts);
        
        const publicKey = accounts?.[0];

        // Store auth state in localStorage
        localStorage.setItem('web3auth_logged_in', 'true');
        
        return {
          email: user.email,
          publicKey,
          profileImage: user.profileImage,
        };
      }
      const web3authProvider = await web3auth!.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: "google",
      });
      console.log(web3authProvider);
      console.log('Connected to Web3Auth');
      setProvider(web3authProvider);
      setLoggedIn(true);

      const user = await web3auth!.getUserInfo();
      console.log('User info:', user);
      
      const accounts = await rpc?.getAccounts();
      console.log('Accounts:', accounts);
      
      const publicKey = accounts?.[0];

      // Store auth state in localStorage
      localStorage.setItem('web3auth_logged_in', 'true');
      
      return {
        email: user.email,
        publicKey,
        profileImage: user.profileImage,
      };
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, [web3auth, rpc, initWeb3Auth]);

  const loginWithAdapter = useCallback(async (adapterName: string) => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }

    try {
      setLoading(true);
      console.log('hook is logging in with adapter:', adapterName);
      const web3authProvider = await web3auth.connectTo(adapterName);
      setProvider(web3authProvider);
      setLoggedIn(true);

      const user = await web3auth.getUserInfo();
      console.log('User info:', user);
      
      const accounts = await rpc?.getAccounts();
      console.log('Accounts:', accounts);
      
      const publicKey = accounts?.[0];

      // Store auth state in localStorage
      localStorage.setItem('web3auth_logged_in', 'true');
      
      return {
        email: user.email || 'adapter',
        publicKey,
        profileImage: user.profileImage || 'adapter',
      };
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, [web3auth, rpc, initWeb3Auth]);

//   const loginWithAdapter = async (adapterName: string) => {
//     console.log('Logging in with adapter:', adapterName);
//     if (!web3auth) {
//       console.log("web3auth not initialized yet");
//       return;
//     }
//     const web3authProvider = await web3auth.connectTo(adapterName);
//     setProvider(web3authProvider);

//     if (web3auth.connected && web3auth.provider) {
//         const rpc = new RPC(web3auth.provider);
//         const accounts = await rpc.getAccounts();
//         setUserWallet(accounts[0]);
//         const {idToken}= await web3auth.authenticateUser();
//         if (idToken) {
//             console.log('returned idToken:', idToken, 'from adapter:', adapterName, 'with accounts:', accounts[0]);
//             const _isRegistered = await checkUserRegistration(accounts[0]);
//             console.log('isRegistered:', _isRegistered);
//             // if (!_isRegistered) {
//             //    router.push('/register');
//             // }
//             await loginExistingUser({ publicKey: accounts[0] });
//             await checkAuth();
//             handleClose();
//         }
//         toast({
//             title: 'Connected',
//             description: 'Successfully connected to your wallet',
//         });
//     } else {
//         toast({
//             title: 'Failed to connect',
//             description: 'Failed to connect to your wallet',
//         });
//     }
// };

  const logout = useCallback(async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      localStorage.removeItem('web3auth_logged_in');
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed");
    }
  }, [web3auth]);

  const getUserInfo = useCallback(async () => {
    try {
      console.log('Getting user info:');
      const user = await web3auth!.getUserInfo();
      
      const accounts = await rpc?.getAccounts();
      console.log('Getting user info:', { user, accounts });
      
      return {
        ...user,
        publicKey: accounts?.[0],
      };
    } catch (err) {
      console.error("Failed to get user info:", err);
      return null;
    }
  }, [web3auth, rpc]);

  // Check localStorage on mount
  useEffect(() => {
    if (web3auth && web3auth?.connected) {
      setProvider(web3auth.provider);
    }
  }, [web3auth]);

  return {
    web3auth,
    injectedAdapters,
    provider,
    loggedIn,
    loading,
    error,
    rpc,
    login,
    loginWithAdapter,
    logout,
    getUserInfo,
  };
};