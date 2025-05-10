"use client";

import "@getpara/react-sdk/styles.css";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import "@getpara/react-sdk/styles.css";
import { Environment, ParaWeb } from "@getpara/react-sdk";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, VersionedTransaction } from '@solana/web3.js';
import { ParaModal, ExternalWallet, OAuthMethod } from "@getpara/react-sdk";
import { ParaSolanaProvider } from "@getpara/solana-wallet-connectors";
import { ParaSolanaWeb3Signer } from "@getpara/solana-web3.js-v1-integration";
import { IS_USER_REGISTERED } from "@/graphql/queries/user";
import { LOGIN_USER } from "@/graphql/mutations/user";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { client } from "./ApolloProvider";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { decodeParaSession } from '@/lib/auth'
import { RegisterForm } from '../components/register/RegisterForm';
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";

const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;

if (!API_KEY) {
  throw new Error("API key is not defined. Please set NEXT_PUBLIC_PARA_API_KEY in your environment variables.");
}

// Initialize Para
export const para = new ParaWeb(Environment.BETA, API_KEY);

// Create a context for Para authentication
interface ParaContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  user: any;
  openModal: () => void;
  signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction | undefined>;
  wallet: string | null;
}

const ParaContext = createContext<ParaContextType | undefined>(undefined);

export function ParaProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const endpoint = clusterApiUrl('devnet');
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wallet, setWallet] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [wallets, setWallets] = useState<unknown[]>([]);
  const [user, setUser] = useState<any>(null);
  const [solanaSigner, setSolanaSigner] = useState<ParaSolanaWeb3Signer | null>(null);
  const solanaConnection = new Connection(endpoint, 'confirmed');
  const { isAuthenticated,setIsAuthenticated, showRegisterForm } = useAuthStore();
  const {loading, setLoading} = useAuthStore()
  const { setShowRegisterForm } = useAuthStore();

  const checkAuthStatus = useCallback(async () => {
    try {
        const storedAuth = localStorage.getItem('auth-storage');
        console.log('wallets:', para.wallets);
        if (Object.keys(para.wallets).length > 0) {
          // Only authenticate if auth storage exists AND we can verify session is still valid
          if (storedAuth && storedAuth !== '{}') {
            try {
              const authData = JSON.parse(storedAuth);
              const paraSession = authData?.state?.authToken;
              
              if (paraSession) {
                const sessionData = JSON.parse(atob(paraSession));
                
                // Check if sessionCookie exists and contains expiration information
                if (sessionData.sessionCookie) {
                  // Extract expiration date from the cookie string
                  const expiresMatch = sessionData.sessionCookie.match(/Expires=([^;]+)/);
                  if (expiresMatch && expiresMatch[1]) {
                    const expiresDate = new Date(expiresMatch[1]);
                    
                    if (expiresDate > new Date()) {
                      setIsAuthenticated(true);
                      return true;
                    } else {
                      console.log("Para session expired");
                      setIsAuthenticated(false);
                      return false;
                    }
                  } else {
                    // If we can't find expiration date session is not valid
                    setIsAuthenticated(false);
                    return false;
                  }
                } else {
                  // If no sessionCookie, check for expiresAt as fallback
                  const expiresAt = sessionData.expiresAt;
                  if (expiresAt && new Date(expiresAt) > new Date()) {
                    setIsAuthenticated(true);
                    return true;
                  } else {
                    console.log("Para session expired or no expiration info");
                    setIsAuthenticated(false);
                    return false;
                  }
                }
              } else {
                setIsAuthenticated(false);
                return false;
              }
            } catch (e) {
              console.error("Error parsing auth data:", e);
              setIsAuthenticated(false);
              return false;
            }
          } else {
            setIsAuthenticated(false);
            return false;
          }
        } else {
          setIsAuthenticated(false);
          return false;
        }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      return false;
    }
  }, [setIsAuthenticated]);

  
  async function checkIfUserIsRegistered(walletAddress: string) {
    console.log('Checking if user is registered:', walletAddress);
    const { data } = await client.query({
      query: IS_USER_REGISTERED,
      variables: { publicKey: walletAddress },
    });
    console.log('Is user registered:', data.isUserRegistered);
    return data.isUserRegistered;
  }

  // Load wallets on client side only
  useEffect(() => {
    setIsAuthenticated(false);
    import('@getpara/solana-wallet-connectors').then(mod => {
      setWallets([
        mod.glowWallet,
        mod.phantomWallet,
        mod.backpackWallet
      ]);
    });
  }, []);


  // Check authentication status and set up event listeners
  useEffect(() => {
    const checkAuthAndSetupListeners = async () => {
      setIsLoading(true);
      console.log('Checking auth and setting up listeners');
      try {
        // Check if user is authenticated
        const isAuthenticatedPara = await para.isFullyLoggedIn();
        setIsConnected(isAuthenticatedPara);
        //check local storage for auth-storage auth if still valid before trying to login
        const checkAuth = await checkAuthStatus();
        console.log('checkAuthStatus listener:', checkAuth);
        if (checkAuth) {
          await updateWalletInfo();
          return;
        }
        if (isAuthenticatedPara && !isAuthenticated && wallet) {
          // Attempt to login if authenticated
          console.log('Attempting to login');
          try {
            // First update the auth store with the current paraSession
            useAuthStore.getState().setAuthToken(para.exportSession());
            // Then make the mutation - the auth link will automatically add the headers
            const { data: loginData } = await client.mutate({
              mutation: LOGIN_USER
            });
            
            if (loginData?.login) {
              useAuthStore.getState().setAuth(loginData.login);
            }
          } catch (loginError) {
            console.error('Error during login:', loginError);
          }
        }
        
        // Set up event listeners for auth state changes
        // Using type assertion for event methods
        const paraWithEvents = para as unknown as {
          on: (event: string, callback: () => void) => void;
          off: (event: string) => void;
        };
        
        if (typeof paraWithEvents.on === 'function') {
          paraWithEvents.on('auth:login', async () => {
            console.log('Auth login event');
            setIsConnected(true);
            await updateWalletInfo();
            setSolanaSigner(new ParaSolanaWeb3Signer(para, solanaConnection));
          });
          
          paraWithEvents.on('auth:logout', () => {
            console.log('Auth logout event');
            setIsConnected(false);
            setIsAuthenticated(false);
            setWallet("");
            setSolanaSigner(null);
          });
          
          paraWithEvents.on('wallet:connected', async () => {
            console.log('Wallet connected event');
            await updateWalletInfo();
            setSolanaSigner(new ParaSolanaWeb3Signer(para, solanaConnection));
          });
          
          paraWithEvents.on('wallet:disconnected', () => {
            console.log('Wallet disconnected event');
            setWallet("");
            setSolanaSigner(null);
          });
        } else {
          console.warn('Para SDK event methods not available');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err instanceof Error ? err.message : "An error occurred during authentication");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndSetupListeners();
    
    // Clean up event listeners
    return () => {
      const paraWithEvents = para as unknown as {
        off: (event: string) => void;
      };
      if (typeof paraWithEvents.off === 'function') {
        paraWithEvents.off('auth:login');
        paraWithEvents.off('auth:logout');
        paraWithEvents.off('wallet:connected');
        paraWithEvents.off('wallet:disconnected');
      }
    };
  }, []);
  
  // Helper function to update wallet information
  const updateWalletInfo = async () => {
    try {
      let walletAddress = "";
      if (para.email) {
        console.log('Email:', para.email);
        const wallets = Object.values(await para.getWallets());
        console.log('Wallets:', wallets);
        
        if (wallets?.length) {
          const primaryWallet = wallets[0];
          walletAddress = primaryWallet.address || "unknown";
          setWallet(walletAddress);
        }
      } else {
        console.log('No email found');
        console.log('External wallets:', para.externalWallets);
        
        // Use type assertion for external wallets
        type ExternalWalletType = { address: string };
        const externalWallets = para.externalWallets as Record<string, ExternalWalletType>;
        const walletAddresses = Object.values(externalWallets).map(wallet => wallet.address);
        console.log('Wallets:', walletAddresses);

        if (walletAddresses?.length > 0) {
          walletAddress = walletAddresses[0];
          setWallet(walletAddress);
        }
      }
      return walletAddress;
    } catch (err) {
      console.error('Error fetching wallet info:', err);
      return "";
    }
  };

  const handleSignTransaction = async (transaction: VersionedTransaction): Promise<VersionedTransaction | undefined> => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    const attemptSign = async (attempt: number): Promise<VersionedTransaction | undefined> => {
      try {
        console.log(`Signing attempt ${attempt + 1} of ${MAX_RETRIES}`);
        
        // Check Para connection
        const isAuthenticatedPara = await para.isFullyLoggedIn();
        setIsConnected(isAuthenticatedPara);
        if (!isAuthenticatedPara) {
          console.log('Para not authenticated, attempting to reconnect...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (attempt + 1 < MAX_RETRIES) {
            return attemptSign(attempt + 1);
          }
          throw new Error('Failed to authenticate with Para');
        }

        // Create a new signer instance
        const _solanaSigner = new ParaSolanaWeb3Signer(para, solanaConnection);
        console.log('Created new solanaSigner:', _solanaSigner);
        
        // Log the transaction details before signing
        console.log('Transaction to sign:', {
          version: transaction.version,
          signatures: transaction.signatures.length,
          messageSize: transaction.message.serialize().length
        });

        // Sign the transaction using the SDK's method
        const signedTx = await _solanaSigner.signVersionedTransaction(transaction);
        if (!signedTx) {
          throw new Error('Transaction signing returned null');
        }

        console.log('🚨 Transaction signed successfully', signedTx);
        return signedTx;
        
      } catch (err) {
        console.error(`Signing attempt ${attempt + 1} failed:`, err);
        
        if (attempt + 1 < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return attemptSign(attempt + 1);
        }
        
        throw err;
      }
    };

    try {
      const signedTx = await attemptSign(0);
      if (signedTx) {
        // Send the transaction using the SDK's method
        const signature = await solanaConnection.sendTransaction(signedTx, {
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        });
        console.log('Transaction sent successfully, signature:', signature);
      }
      return signedTx;
    } catch (err) {
      console.error('All signing attempts failed:', err);
      return undefined;
    }
  }

  const handleCloseModal = async () => {
    try {
      setIsOpen(false);
      if(isAuthenticated) return;
      const isAuthenticatedPara = await para.isFullyLoggedIn();
      setIsConnected(isAuthenticatedPara);
      console.log('Auth status after modal close:', isAuthenticatedPara);
      console.log('para after modal close:', para);
      if (!isAuthenticatedPara) return;
      if (isAuthenticatedPara) {
        const walletAddress = await updateWalletInfo();
        // First update the auth store with the current session
        useAuthStore.getState().setAuthToken(para.exportSession());
        if (walletAddress) {
          setLoading(true);
          const isRegistered = await checkIfUserIsRegistered(walletAddress);
          console.log('isRegistered:', isRegistered);
          if (!isRegistered) {
            if (para.email) {
              setShowRegisterForm({ publicKey: walletAddress, userInfo: { email: para.email } });
            } else {
              setShowRegisterForm({ publicKey: walletAddress, userInfo: {} });
            }
          }
          else {
            console.log('User exists, performing login' + wallet);
            // Get the current session and verify it
            const currentSession = para.exportSession();
            console.log('Current session length:', currentSession?.length);
            console.log('Current session first 50 chars:', currentSession?.substring(0, 50));
            
            if (!currentSession) {
              console.error('No session available after login');
              return;
            }

            
            // Then make the login request
            const { data: loginData } = await client.mutate({
              mutation: LOGIN_USER,
            });
            console.log('Login response:', loginData);
            
            // Set auth data in store
            if (loginData?.login) {
              useAuthStore.getState().setAuth(loginData.login);
              setIsAuthenticated(true);
              setShowRegisterForm(null);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error checking auth after modal close:', err);
      if (err && typeof err === 'object' && 'graphQLErrors' in err) {
        const graphQLError = err as { graphQLErrors: Array<{ message: string; extensions?: any }> };
        graphQLError.graphQLErrors.forEach((error) => {
          console.error('GraphQL Error:', error.message);
          console.error('Error extensions:', error.extensions);
        });
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParaSolanaProvider
    endpoint={endpoint}
    wallets={wallets as any}
    chain={'devnet'}
    appIdentity={{
      name: "The Artisan",
      uri: typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "",
  }}>
  <ParaContext.Provider
    value={{
      isConnected,
      wallet,
      user,
      isLoading,
      error,
      signTransaction: handleSignTransaction,
      openModal: () => setIsOpen(true),
      }}
    >
    {loading && <LoadingSpinner />}
    {children}
    {showRegisterForm && (
      <RegisterForm
        initialData={showRegisterForm}
        onClose={() => setShowRegisterForm(null)}
      />
    )}
      <ParaModal
          appName="Artsn"
          logo={"/logos/artisan-3d-logo.svg"}
          para={para}
          rpcUrl={process.env.NEXT_PUBLIC_HELIUS_DEVNET}
          disableEmailLogin={false}
          disablePhoneLogin={false}
          isOpen={isOpen}
          oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.TWITTER, OAuthMethod.APPLE, OAuthMethod.DISCORD, OAuthMethod.FACEBOOK]}
          authLayout={["AUTH:FULL", "EXTERNAL:FULL"]}
          externalWallets={[ExternalWallet.PHANTOM, ExternalWallet.BACKPACK, ExternalWallet.GLOW]}
          twoFactorAuthEnabled
          recoverySecretStepEnabled
          hideWallets
          onRampTestMode={true}
          onClose={handleCloseModal}
          theme={{
            foregroundColor: "#000000",
            backgroundColor: "#ffffff",
            accentColor: "#000000",
            darkForegroundColor: "#ffffff",
            darkBackgroundColor: "#000000",
            darkAccentColor: "#ffffff",
            mode: "light",
            borderRadius: "lg",
            font: "Inter",
          }}
        />
    </ParaContext.Provider>
    </ParaSolanaProvider>
  );
}

export function usePara() {
  const context = useContext(ParaContext);
  if (context === undefined) {
    throw new Error("usePara must be used within a ParaProvider");
  }
  return context;
}