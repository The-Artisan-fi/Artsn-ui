import { useState, useEffect, useCallback, useMemo } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK , UX_MODE,  IWeb3AuthCoreOptions, IAdapter} from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import RPC from "@/components/solana/web3auth/solana-rpc";
import { publicKey } from '@metaplex-foundation/umi';

// no modal web3 auth
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";

// PROD
// const clientId = "BCOEGyUq_T1SSwyzmeeekxP4dqa1aGSUgj1n2IfIo1ejT-OwjzOBD5yMuGFqx6aRsytY41yZNiCPhsAuCaJ9YF8";
// DEV
const clientId = "BI8MhAUT4vK4cfQZRQ_NEUYOHE3dhD4ouJif9SUgbgBeeZwP6wBlXast2pZsQJlney3nPBDb-PcMl9oF6lV67P0"
let defaultSolanaAdapters: IAdapter<unknown>[] = [];
const chainConfig = {
  chainId: "0x3",
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  rpcTarget: "https://api.devnet.solana.com",
  tickerName: "SOLANA",
  ticker: "SOL",
  decimals: 18,
  blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
  logo: "https://images.toruswallet.io/sol.svg",
};

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userAccounts, setUserAccounts] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      defaultSolanaAdapters = await getDefaultExternalAdapters({ options: web3authOptions }) as IAdapter<unknown>[];
      defaultSolanaAdapters.forEach((adapter) => {
        web3auth.configureAdapter(adapter);
      });

      await web3auth.init();
      setProvider(web3auth.provider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to initialize Web3Auth");
    } finally {
      setLoading(false);
    }
    
  }, []);

  useEffect(() => {
    initWeb3Auth();
  }, [initWeb3Auth]);

  const checkIfLoggedIn = useCallback(async () => {
    if (!web3auth || !provider) {
      setError("Web3Auth not initialized");
      return null;
    }

    if (!web3auth.connected) {
      setError("User not logged in");
      return null;
    }

    try {
      const user = await web3auth.getUserInfo();
      return {
        email: user.email,
      };
    } catch (err) {
      console.error(err);
      setError("Failed to get user info");
      return null;
    }
  }, [web3auth, provider]);

  const login = useCallback(async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet, attempting to initialize')
     
    }

    try {
      console.log('connecting to web3 auth')
      await initWeb3Auth();
      const web3authProvider = await web3auth!.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: "google",
      });
      setProvider(web3authProvider);
      setProvider(web3authProvider);

      const user = await web3auth!.getUserInfo();
      const accounts = await rpc?.getAccounts();
      const publicKey = accounts![0];
      setLoggedIn(true)
      return {
        email: user.email,
        publicKey: publicKey,
        profileImage: user.profileImage,
      };
    } catch (err) {
      console.error(err);
      setError("Login failed");
      return null;
    }
  }, [web3auth]);

  const logout = useCallback(async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized");
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
    } catch (err) {
      console.error(err);
      setError("Logout failed");
    }
  }, [web3auth]);

  const getUserInfo = useCallback(async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized");
      return null;
    }

    try {
      const user = await web3auth.getUserInfo();
      setLoggedIn(true)
      return user
    } catch (err) {
      console.error(err);
      setError("Failed to get user info");
      return null;
    }
  }, [web3auth]);

  return {
    web3auth,
    provider,
    loggedIn,
    loading,
    error,
    rpc,
    checkIfLoggedIn,
    login,
    logout,
    getUserInfo,
    userAccounts
  };
};