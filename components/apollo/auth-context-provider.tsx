'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApolloClient, gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '@/hooks/use-web3-auth';
import { useSolanaRPC } from '@/hooks/use-web3-rpc';
import { useToast } from "@/hooks/use-toast";
import { useWallet } from '@solana/wallet-adapter-react';

const ME_QUERY = gql`
  query Me {
    me {
      _id
      uuid
      username
      email
      firstName
      lastName
      profilePictureUrl
      role
      createdAt
      publicKey
      solanaTransactionId
      baseProfile {
        displayName
        displayRole
        photoUrl
        bio
        createdAt
        updatedAt
      }
      creatorInfo {
        detailedBio {
          profession
          education {
            schools {
              name
              degree
              fieldOfStudy
              graduationYear
            }
            relevantCourses
            specializedTraining
          }
          professionalAchievements {
            awards
            exhibitions
            portfolioLinks
          }
          collaborators
          employmentContracts {
            employer
            startDate
            endDate
            ipRightsInfo
          }
        }
        ipAssets
      }
      investorInfo {
        id
        createdAt
        updatedAt
        investmentPreferences
        investmentHistory {
          id
          type
          investmentDate
          amount
          terms
          transactionId
          creatorId
          ipId
        }
        portfolioSize
        riskTolerance
        preferredInvestmentDuration
      }
      kycInfo {
        kycStatus
        kycCompletionDate
        kycDocuments {
          documentType
          documentUrl
          verificationStatus
        }
      }
    }
  }
`;

// const IS_USER_REGISTERED = gql`
//   query IsUserRegistered($email: String!) {
//     isUserRegistered(email: $email)
//   }
// `;

const IS_USER_REGISTERED = gql`
  query IsUserRegistered($publicKey: String!) {
    isUserRegistered(publicKey: $publicKey)
  }
`;

// const LOGIN_USER = gql`
//   mutation LoginUser($email: String!, $password: String!) {
//     login(email: $email, password: $password) {
//       token
//       user {
//         _id
//         email
//         username
//         # Include other user fields as needed
//       }
//     }
//   }
// `;

const LOGIN_USER = gql`
  mutation LoginUser($publicKey: String!, $password: String!) {
    login(publicKey: $publicKey, password: $password) {
      token
      user {
        _id
        email
        username
        profilePictureUrl
        publicKey
        firstName
        lastName
        baseProfile {
          displayName
          displayRole
          photoUrl
          bio
          createdAt
          updatedAt
        }
          coverImageUrl
          kycInfo {
            kycStatus
            kycCompletionDate
            kycDocuments {
              documentType
              documentUrl
              verificationStatus
            }
          }
      }
    }
  }
`;

interface User {
  _id: string;
  uuid: string;
  email: string;
  username: string;
  profilePictureUrl?: string;
  publicKey: string;
  firstName?: string;
  lastName?: string;
  creatorInfo?: any;
  investorInfo?: any;
  baseProfile?: any;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  verificationToken?: string;
  coverImageUrl?: string;
  solanaTransactionId?: string;
  phoneNumber?: string;
  kycInfo?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: any;
  login: (userObject: {email: string; publicKey: string}) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  // loginExistingUser: (userObject: {email: string; publicKey: string}) => Promise<void>;
  loginExistingUser: (userObject: {publicKey: string}) => Promise<void>;
  checkUserRegistration: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const client = useApolloClient();
  const router = useRouter();
  const { toast } = useToast();
  const { provider, login: web3Login, logout: web3Logout, getUserInfo, web3auth } = useWeb3Auth();
  const { getAccounts } = useSolanaRPC(provider);
  const { publicKey, disconnect } = useWallet();
  const [loginUserMutation] = useMutation(LOGIN_USER);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found!!');
      setUser(null);
      if(publicKey) disconnect();
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

      if (data && data.me) {
        console.log('User data:', data.me);
        setUser(data.me);
      } else {
        throw new Error('No user data returned');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [client]);

  // const loginExistingUser = useCallback(async (userObject: {email: string; publicKey: string}) => {
    const loginExistingUser = useCallback(async (userObject: {publicKey: string}) => {
      console.log('Logging in existing user...', userObject);
    try {
      const result = await loginUserMutation({
        variables: {
          // email: userObject.email,
          publicKey: userObject.publicKey,
          password: userObject.publicKey,
        },
      });
      const { token, user: userData } = result.data.login;
      console.log('User data:', result.data.login);
      localStorage.setItem('token', token);
      setUser(userData);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error) {
      console.error("Login error:", error);
      setError('Failed to login existing user');
      toast({
        title: 'Login Failed',
        description: 'An error occurred during login. Please try again.',
      });
    }
  }, [loginUserMutation, toast]);

  const checkUserRegistration = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data } = await client.query({
        query: IS_USER_REGISTERED,
        variables: { email },
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
  }, [client, toast]);

  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        if (!web3auth) {
            console.log('web3Login not initialized yet, attempting to initialize');
        }
        const connected = await web3Login();
        console.log('Connected:', connected);
        if (!connected) throw new Error('Failed to connect to web3 provider');
        
        const userInfo = await getUserInfo();
        const email = userInfo?.email || '';
        if (!userInfo) throw new Error('Failed to get user info');
        
        const accounts = await getAccounts();
        const {idToken} = await web3auth!.authenticateUser();

      const userObject: { publicKey: string, _token: string } = {
        publicKey: accounts![0],
        _token: idToken
      };

      const isRegistered = await checkUserRegistration(accounts![0]);

      if (isRegistered && userObject.publicKey) {
        await loginExistingUser(userObject);
      } else {
        // Handle new user registration
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: userObject.publicKey,
            publicKey: userObject.publicKey
          }),
        });
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        await loginExistingUser(userObject);
      }
      return userObject;
    } catch (error) {
      console.error("Login error:", error);
      setError('Failed to complete login process');
      toast({
        title: 'Login Failed',
        description: 'An error occurred during login. Please try again.',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [web3Login, getUserInfo, getAccounts, loginExistingUser, checkUserRegistration, toast]);

  const logout = useCallback(async () => {
    try {
      console.log('Logging out...');
      await web3Logout();
      
      if(publicKey) {
        disconnect();
      }
      localStorage.removeItem('token');
      await client.resetStore();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to complete logout process');
    }
  }, [client, router, web3Logout]);

  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      checkAuth, 
      loginExistingUser,
      checkUserRegistration 
    }}>
      {children}
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