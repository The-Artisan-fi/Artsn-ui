//providers/Web3AuthProvider.tsx
'use client'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import {
  CHAIN_NAMESPACES,
  IProvider,
  WEB3AUTH_NETWORK_TYPE,
} from '@web3auth/base'
import { SolanaPrivateKeyProvider } from '@web3auth/solana-provider'
import { AuthAdapter } from '@web3auth/auth-adapter'
import { useApolloClient, useMutation, useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import RPC from '@/components/blockchain/solana-rpc'
import { ME_QUERY, IS_USER_REGISTERED } from '@/graphql/queries/user'
import { CREATE_USER, LOGIN_USER } from '@/graphql/mutations/user'
import { User } from '@/types/resolver-types'
import { useAuthStore } from '@/lib/stores/useAuthStore'

// Configuration constants
const WEB3_AUTH_NETWORK = process.env
  .NEXT_PUBLIC_WEB3AUTH_NETWORK as WEB3AUTH_NETWORK_TYPE
const CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
const RPC_TARGET =
  process.env.NEXT_PUBLIC_RPC_TARGET || 'https://api.devnet.solana.com'

interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
  isInitialized: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  provider: IProvider | null
  login: () => Promise<User | null>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  checkUserRegistration: (publicKey: string) => Promise<boolean>
  getUserInfo: () => Promise<any>
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isInitialized: false,
  isAuthenticated: false,
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('AUTH PROVIDER MOUNTED')
  const [state, setState] = useState<AuthState>(initialState)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const web3auth = useRef<Web3AuthNoModal | null>(null)
  const initializationPromise = useRef<Promise<void> | null>(null)

  const client = useApolloClient()
  const router = useRouter()
  const { toast } = useToast()

  const [loginUserMutation] = useMutation(LOGIN_USER)
  const [checkRegistrationQuery] = useLazyQuery(IS_USER_REGISTERED)
  const [createUser] = useMutation(CREATE_USER)

  const checkAuth = useCallback(async () => {
    console.log('Checking Auth')
    const storedAuth = useAuthStore.getState()
    const token = storedAuth.authToken
    console.log('Token:', token)
    if (!token) {
      setState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        loading: false,
      }))
      return
    }

    try {
      const { data } = await client.query({
        query: ME_QUERY,
        context: { headers: { authorization: `Bearer ${token}` } },
        fetchPolicy: 'network-only',
      })
      console.log('Auth check data:', data)
      if (data?.me) {
        setState((prev) => ({
          ...prev,
          user: data.me,
          isAuthenticated: true,
          loading: false,
        }))
        return data.me
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('authToken')
      setState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        loading: false,
      }))
    }
  }, [client])

  const initialize = useCallback(async () => {
    console.log('Initializing Web3Auth')
    if (initializationPromise.current) return initializationPromise.current
    if (web3auth.current?.connected) return

    initializationPromise.current = (async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: '0x3',
          rpcTarget: RPC_TARGET,
          displayName: 'Solana Devnet',
          blockExplorer: 'https://explorer.solana.com',
          ticker: 'SOL',
          tickerName: 'Solana Token',
        }

        const web3authInstance = new Web3AuthNoModal({
          clientId: CLIENT_ID!,
          web3AuthNetwork: WEB3_AUTH_NETWORK,
          chainConfig,
        })

        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig },
        })
        const adapter = new AuthAdapter({
          privateKeyProvider,
          adapterSettings: { network: WEB3_AUTH_NETWORK },
        })

        web3authInstance.configureAdapter(adapter)
        await web3authInstance.init()

        web3auth.current = web3authInstance

        if (web3authInstance.connected) {
          setProvider(web3authInstance.provider)
          await checkAuth()
        }
      } catch (error) {
        console.error('Failed to initialize Web3Auth:', error)
        setState((prev) => ({ ...prev, error: error as Error }))
      } finally {
        setState((prev) => ({ ...prev, isInitialized: true, loading: false }))
        initializationPromise.current = null
      }
    })()

    return initializationPromise.current
  }, [checkAuth])

  const getUserInfo = useCallback(async () => {
    if (!web3auth.current?.provider) {
      throw new Error('Provider not initialized')
    }
    const rpc = new RPC(web3auth.current.provider)
    const accounts = await rpc.getAccounts()
    const userInfo = await web3auth.current.getUserInfo()

    return {
      ...userInfo,
      publicKey: accounts[0],
    }
  }, [])

  const checkUserRegistration = useCallback(
    async (publicKey: string) => {
      try {
        const { data } = await checkRegistrationQuery({
          variables: { publicKey },
          fetchPolicy: 'network-only',
        })
        return !!data?.isUserRegistered
      } catch (error) {
        console.error('Failed to check registration:', error)
        return false
      }
    },
    [checkRegistrationQuery]
  )

  const login = useCallback(async () => {
    if (!web3auth.current) {
      throw new Error('Web3Auth not initialized')
    }

    setState((prev) => ({ ...prev, loading: true }))

    try {
      await web3auth.current.connectTo('openlogin')
      setProvider(web3auth.current.provider)

      const userInfo = await getUserInfo()
      console.log('Logged In User info:', userInfo)
      const isRegistered = await checkUserRegistration(userInfo.publicKey)
      console.log('Logged In User is registered:', isRegistered)
      if (isRegistered) {
        const { data } = await loginUserMutation({
          variables: {
            publicKey: userInfo.publicKey,
            password: userInfo.publicKey,
          },
        })
        console.log('User is registered:', data)
        if (data?.login) {
          const { token, user } = data.login
          localStorage.setItem('authToken', token)
          setState((prev) => ({
            ...prev,
            user,
            isAuthenticated: true,
            loading: false,
          }))
          return user
        }
      } else {
        const { data: createData } = await createUser({
          variables: {
            input: {
              email: userInfo.email || 'unknown',
              publicKey: userInfo.publicKey,
              password: userInfo.publicKey,
              username:
                userInfo.name || `user_${userInfo.publicKey.slice(0, 6)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              role: 'USER',
            },
          },
        })

        if (createData?.createUser) {
          const loginResult = await loginUserMutation({
            variables: {
              publicKey: userInfo.publicKey,
              password: userInfo.publicKey,
            },
          })

          if (loginResult.data?.login) {
            const { token, user } = loginResult.data.login
            localStorage.setItem('authToken', token)
            setState((prev) => ({
              ...prev,
              user,
              isAuthenticated: true,
              loading: false,
            }))
            return user
          }
        }
      }

      throw new Error('Login failed')
    } catch (error) {
      console.error('Login failed:', error)
      setState((prev) => ({
        ...prev,
        error: error as Error,
        loading: false,
      }))
      toast({
        title: 'Login Failed',
        description: (error as Error).message,
        variant: 'destructive',
      })
      return null
    }
  }, [checkUserRegistration, loginUserMutation, createUser, getUserInfo, toast])

  const logout = useCallback(async () => {
    try {
      if (web3auth.current) {
        await web3auth.current.logout()
      }

      localStorage.removeItem('authToken')
      await client.resetStore()

      setState({ ...initialState, loading: false, isInitialized: true })
      setProvider(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: 'Logout Failed',
        description: 'An error occurred during logout',
        variant: 'destructive',
      })
    }
  }, [client, router, toast])

  useEffect(() => {
    const initAuth = async () => {
      // First check if we have auth state in the store
      const storedAuth = useAuthStore.getState()

      if (storedAuth.authToken && storedAuth.currentUser) {
        setState((prev) => ({
          ...prev,
          user: storedAuth.currentUser,
          isAuthenticated: true,
          loading: false,
        }))
        return
      }

      // If no stored state, then check token and run normal auth check
      await checkAuth()
    }

    initialize().then(() => {
      initAuth()
    })
  }, [initialize, checkAuth])

  useEffect(() => {
    if (web3auth.current?.connected && !state.user) {
      checkAuth()
    }
  }, [web3auth?.current?.connected, checkAuth, state.user])

  const value = {
    ...state,
    provider,
    login,
    logout,
    checkAuth,
    checkUserRegistration,
    getUserInfo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
