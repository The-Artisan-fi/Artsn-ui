'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApolloClient, useMutation, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '@/hooks/use-web3-auth';
import RPC from '@/components/blockchain/solana-rpc';
import { useToast } from "@/hooks/use-toast";
import { ME_QUERY, IS_USER_REGISTERED } from '@/graphql/queries/user';
import { CREATE_USER, LOGIN_USER } from '@/graphql/mutations/user';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
interface User {
  _id: string;
  uuid: string;
  email: string;
  username: string;
  publicKey: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  investorInfo?: any;
  baseProfile?: any;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  verificationToken?: string;
  solanaTransactionId?: string;
  phoneNumber?: string;
  kycInfo?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: any;
  injectedAdapters: any[];
  login: () => Promise<any>;
  loginUserWithAdapter: (adapter: any) => Promise<any>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  checkAuth: () => Promise<void>;
  loginExistingUser: (userObject: { publicKey: string }) => Promise<void>;
  checkUserRegistration: (publicKey: string) => Promise<boolean>;
  isAuthenticated: boolean;
  web3auth: any;
  provider: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const client = useApolloClient();
  const router = useRouter();
  const { toast } = useToast();
  const [createUser] = useMutation(CREATE_USER);
  // const { publicKey, disconnect } = useWallet();
  
  // Web3Auth integration
  const {
    provider,
    login: web3Login,
    loginWithAdapter,
    injectedAdapters,
    logout: web3Logout,
    getUserInfo,
    web3auth,
    loading: web3Loading,
  } = useWeb3Auth();
  const rpc = new RPC(provider!);
  const getAccounts = async () => rpc?.getAccounts();
  const [loginUserMutation] = useMutation(LOGIN_USER);
  const [checkRegistrationQuery] = useLazyQuery(IS_USER_REGISTERED);

  const initialAuth = typeof window !== 'undefined' ? 
    localStorage.getItem('authToken') : null;

  useEffect(() => {
    const initAuth = async () => {
      if (web3auth?.connected) {
        try {
          const userInfo = await getUserInfo();
          const accounts = await getAccounts();
          if (accounts && accounts[0]) {
            // Re-establish authentication
            await loginExistingUser({ publicKey: accounts[0] });
          }
        } catch (error) {
          console.error('Error restoring auth state:', error);
        }
      }
    };

    initAuth();
  }, [web3auth?.connected]);


  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      // if (publicKey) disconnect();
      setLoading(false);
      return;
    }

    try {
      const { data } = await client.query({
        query: ME_QUERY,
        context: {
          headers: {
            authorization: `Bearer ${token}`
          }
        },
        fetchPolicy: 'network-only'
      });
      console.log('ME query data:', data);
      if (data?.me) {
        setUser(data.me);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [client]);

  const loginExistingUser = useCallback(async (userObject: { publicKey: string }) => {
    try {
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
      
      const { token, user: userData } = result.data.login;
      if (userData) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userPublicKey', userData.publicKey);
      }
      setUser(userData);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.username}!`,
      });
      
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      setError('Failed to login existing user');
      toast({
        title: 'Login Failed',
        description: 'An error occurred during login. Please try again.',
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('userPublicKey');
      throw error;
    }
  }, [loginUserMutation, toast]);

  const checkUserRegistration = useCallback(async (publicKey: string): Promise<boolean> => {
    try {
      const { data } = await checkRegistrationQuery({
        variables: { publicKey },
        fetchPolicy: 'network-only',
      });
      return data.isUserRegistered;
    } catch (error) {
      console.error('Error checking user registration:', error);
      toast({
        title: 'Error',
        description: 'Failed to check user registration. Please try again.',
      });
      return false;
    }
  }, [checkRegistrationQuery, toast]);

  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Verify your CREATE_USER mutation is correctly exported
    console.log('CREATE_USER mutation:', CREATE_USER);

    try {
      if (!web3auth) {
        throw new Error('web3auth not initialized');
      }
  
      console.log('1. Starting login process...');
      const connected = await web3Login();
      if (!connected) throw new Error('Failed to connect to web3 provider');
  
      console.log('2. Getting user info...');
      const userInfo = await getUserInfo();
      console.log('User info:', userInfo);

      console.log('3. Getting accounts...');
      const accounts = await getAccounts();
      const publicKey = accounts![0];
      console.log('Public key:', publicKey);
      
      console.log('4. Checking registration...');
      const isRegistered = await checkUserRegistration(publicKey);
      console.log('Is registered:', isRegistered);
  
      if (isRegistered) {
        console.log('5a. Logging in existing user...');
        const userData = await loginExistingUser({ publicKey });
        return userData;
      } else {
        console.log('5b. Creating new user...');
        const userInput = {
          email: userInfo?.email || 'unknown',
          publicKey,
          password: publicKey,
          username: userInfo?.name || `user_${publicKey.slice(0, 6)}`,
          firstName: userInfo?.name?.split(' ')[0] || 'Unknown',
          lastName: userInfo?.name?.split(' ')[1] || 'Unknown',
          country: 'Unknown',
          isActive: true,
          isVerified: false,
          role: 'USER'
        };

        console.log('User input:', userInput);
        
        try {
          console.log('6. Executing createUser mutation...');
          const createUserResult = await createUser({
            variables: {
              input: userInput
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
  
          console.log('7. Create user result:', createUserResult);

          if (!createUserResult?.data) {
            console.error('No data returned from mutation');
            throw new Error('No data returned from createUser mutation');
          }

          console.log('8. User created, logging in...');
          if (createUserResult.data?.createUser) {
            const userData = await loginExistingUser({ publicKey: createUserResult.data?.createUser.publicKey });
            console.log('9. Login successful:', userData);
            return userData;
          }
        } catch (error: any) {
          console.error("User creation error:", {
            message: error.message,
            graphQLErrors: error.graphQLErrors,
            networkError: error.networkError,
            stack: error.stack
          });
          
          toast({
            title: 'Registration Failed',
            description: error.message || 'Failed to create new user account',
            variant: "destructive",
          });
          
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Login process error:", {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      });
      setError(error.message || 'Failed to complete login process');
      toast({
        title: 'Login Failed',
        description: error.message || 'An error occurred during login. Please try again.',
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [web3Login, getUserInfo, getAccounts, checkUserRegistration, loginExistingUser, createUser, toast, web3auth]);

  const loginUserWithAdapter = useCallback(async (adapter: any) => {
    setLoading(true);
    setError(null);

    try {
      if (!web3auth) {
        throw new Error('web3auth not initialized');
      }

      console.log('1. Starting login process...', adapter);

      const connected = await loginWithAdapter(adapter);
      if (!connected) throw new Error('Failed to connect to web3 provider');

      console.log('2. Getting user info...');
      const userInfo = await getUserInfo();
      console.log('User info:', userInfo);

      console.log('3. Getting accounts...');
      const accounts = await getAccounts();
      const publicKey = accounts![0];
      console.log('Public key:', publicKey);

      console.log('4. Checking registration...');
      const isRegistered = await checkUserRegistration(publicKey);
      console.log('Is registered:', isRegistered);

      if (isRegistered) {
        console.log('5a. Logging in existing user...');
        try {
          const userData = await loginExistingUser({ publicKey: publicKey });
          console.log('5a. Login successful:', userData);
          return userData;
        } catch (error) {
          console.error('Error logging in existing user:', error);
          throw error;
        }
      } else {
        console.log('5b. Creating new user...');
        const userInput = {
          email: userInfo?.email || 'unknown',
          publicKey,
          password: publicKey,
          username: userInfo?.name || `user_${publicKey.slice(0, 6)}`,
          firstName: userInfo?.name?.split(' ')[0] || 'Unknown',
          lastName: userInfo?.name?.split(' ')[1] || 'Unknown',
          country: 'Unknown',
          isActive: true,
          isVerified: false,
          role: 'USER'
        };

        console.log('User input:', userInput);

        try {
          console.log('6. Executing createUser mutation...');
          const createUserResult = await createUser({
            variables: {
              input: userInput
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

          console.log('7. Create user result:', createUserResult);

          if (!createUserResult?.data) {
            console.error('No data returned from mutation');
            throw new Error('No data returned from createUser mutation');
          }

          console.log('8. User created, logging in...');

          if (createUserResult.data?.createUser) {
            const userData = await loginExistingUser({ publicKey: createUserResult.data?.createUser.publicKey });
            console.log('9. Login successful:', userData);
            return userData;
          }

        }

        catch (error: any) {
          console.error("User creation error:", {
            message: error.message,
            graphQLErrors: error.graphQLErrors,
            networkError: error.networkError,
            stack: error.stack
          });

          toast({
            title: 'Registration Failed',
            description: error.message || 'Failed to create new user account',
            variant: "destructive",
          });

          throw error;
        }

      }
    }
      
      catch (error: any) {
        console.error("Login process error:", {
          message: error.message,
          stack: error.stack,
          type: error.constructor.name
        });
        setError(error.message || 'Failed to complete login process');
        toast({
          title: 'Login Failed',
          description: error.message || 'An error occurred during login. Please try again.',
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }

  }, [loginWithAdapter, getUserInfo, getAccounts, checkUserRegistration, loginExistingUser, createUser, toast, web3auth]);
                  

  const logout = useCallback(async () => {
    try {
      await web3Logout();
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userPublicKey');
      await client.resetStore();
      setUser(null);
      router.push('/');
      
      toast({
        title: 'Logged Out',
        description: 'Successfully logged out of your account.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to complete logout process');
      toast({
        title: 'Logout Failed',
        description: 'An error occurred during logout. Please try again.',
      });
    }
  }, [client, router, web3Logout, toast]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Monitor web3auth connection status
  useEffect(() => {
    if (web3auth?.connected && !user) {
      checkAuth();
    }
  }, [web3auth?.connected, checkAuth, user]);

  const contextValue: AuthContextType = {
    user,
    loading: loading || web3Loading,
    injectedAdapters,
    error,
    login,
    loginUserWithAdapter,
    logout,
    checkAuth,
    getUserInfo,
    loginExistingUser,
    checkUserRegistration,
    isAuthenticated: !!user,
    web3auth,
    provider,
  };

  if (loading) {<LoadingSpinner />;}

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-lg overflow-auto">
          <pre className="text-xs">
            {JSON.stringify(
              {
                isAuthenticated: !!user,
                loading,
                error,
                web3Connected: !!provider,
                publicKey: user?.publicKey,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}