// // src/hooks/use-web3-auth.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
  UX_MODE,
  IWeb3AuthCoreOptions,
  IAdapter,
} from '@web3auth/base'
import { getInjectedAdapters } from '@web3auth/default-solana-adapter'
import { SolanaPrivateKeyProvider } from '@web3auth/solana-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { AuthAdapter } from '@web3auth/auth-adapter'
import RPC from '@/components/blockchain/solana-rpc'
import { LOGIN_USER } from '@/graphql/mutations/user'
import { useMutation } from '@apollo/client'
import { useAuthStore } from '@/lib/stores/useAuthStore'

const clientId =
  'BI8MhAUT4vK4cfQZRQ_NEUYOHE3dhD4ouJif9SUgbgBeeZwP6wBlXast2pZsQJlney3nPBDb-PcMl9oF6lV67P0'
let injectedAdapters: IAdapter<unknown>[] = []
export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [userWallet, setUserWallet] = useState<string | null>(null)
  const [loginUserMutation] = useMutation(LOGIN_USER)
  const rpc = useMemo(() => (provider ? new RPC(provider) : null), [provider])
  const {
    loggedIn,
    loading,
    error,
    setWeb3AuthState,
    setLoading,
    setError: setStoreError,
    setAuth,
  } = useAuthStore()

  const initWeb3Auth = useCallback(async () => {
    try {
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: '0x3', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        rpcTarget: 'https://api.devnet.solana.com',
        displayName: 'Solana Devnet',
        blockExplorerUrl: 'https://explorer.solana.com',
        ticker: 'SOL',
        tickerName: 'Solana Token',
        logo: '',
      }

      const privateKeyProvider = new SolanaPrivateKeyProvider({
        config: { chainConfig },
      })

      const web3authOptions: IWeb3AuthCoreOptions = {
        clientId,
        privateKeyProvider,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      }
      const web3auth = new Web3AuthNoModal(web3authOptions)

      setWeb3auth(web3auth)

      const authAdapter = new AuthAdapter({
        privateKeyProvider,
        adapterSettings: {
          uxMode: UX_MODE.REDIRECT,
        },
      })
      web3auth.configureAdapter(authAdapter)

      injectedAdapters = getInjectedAdapters({ options: web3authOptions })
      injectedAdapters.forEach((adapter) => {
        web3auth.configureAdapter(adapter)
      })

      const availableAdapters = injectedAdapters.map((adapter) => adapter.name)

      await web3auth.init()
      setProvider(web3auth.provider)
      if (web3auth.connected) {
        console.log('web3auth is connected')

        const rpc = new RPC(web3auth.provider!)
        const accounts = await rpc?.getAccounts()
        const publicKey = accounts![0]
        const { idToken } = await web3auth.authenticateUser()
        const user = await web3auth.getUserInfo()

        const userObject = {
          email: user.email || '',
          publicKey: publicKey,
          username: user.name || '',
          profilePictureUrl: user.profileImage || '',
        }

        setUserWallet(userObject.publicKey)

        const result = await loginUserMutation({
          variables: {
            publicKey: userObject.publicKey,
            password: userObject.publicKey,
          },
          onCompleted: (data) => {
            console.log('Mutation completed with data:', data)
            setAuth(data.login)
          },
          onError: (error) => {
            console.error('Mutation error:', {
              message: error.message,
              graphQLErrors: error.graphQLErrors?.map((err) => ({
                message: err.message,
                path: err.path,
                extensions: err.extensions,
              })),
              networkError: error.networkError,
            })
          },
        }).catch((error) => {
          console.error('Caught in mutation catch block:', error)
          throw error
        })

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
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initWeb3Auth()
  }, [initWeb3Auth])

  const login = useCallback(async () => {
    if (!web3auth) {
      console.log('Web3Auth not initialized, initializing...')
      await initWeb3Auth()
    }

    try {
      setLoading(true)
      if (web3auth && web3auth.connected) {
        const user = await web3auth!.getUserInfo()

        const accounts = await rpc?.getAccounts()

        const publicKey = accounts?.[0]

        return {
          email: user.email,
          publicKey,
          profileImage: user.profileImage,
        }
      }
      const web3authProvider = await web3auth!.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: 'google',
      })

      setProvider(web3authProvider)

      const user = await web3auth!.getUserInfo()

      const accounts = await rpc?.getAccounts()

      const publicKey = accounts?.[0]

      return {
        email: user.email,
        publicKey,
        profileImage: user.profileImage,
      }
    } catch (err) {
      console.error('Login failed:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [web3auth, rpc, initWeb3Auth])

  const loginWithAdapter = useCallback(
    async (adapterName: string) => {
      if (!web3auth) {
        console.error('Web3Auth not initialized')
        return
      }

      try {
        setLoading(true)
        const web3authProvider = await web3auth.connectTo(adapterName)
        setProvider(web3authProvider)

        const user = await web3auth.getUserInfo()

        const accounts = await rpc?.getAccounts()

        const publicKey = accounts?.[0]

        try {
          const result = await loginUserMutation({
            variables: {
              publicKey,
              password: publicKey,
            },
          })

          if (result.data?.login) {
            setAuth(result.data.login)

            // Get and set balance after successful login
            // const balance = await rpc.getBalance()
            // setBalance(balance)

            // toast({
            //   title: 'Welcome back!',
            //   description: 'You have successfully logged in.',
            // })
          }
        } catch (error) {
          console.error('Login mutation error:', error)
          throw error
        }

        return {
          email: user.email || 'adapter',
          publicKey,
          profileImage: user.profileImage || 'adapter',
        }
      } catch (err) {
        console.error('Login failed:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [web3auth, rpc, initWeb3Auth]
  )

  const logout = useCallback(async () => {
    if (!web3auth) {
      console.error('Web3Auth not initialized')
      return
    }

    try {
      await web3auth.logout()
      setProvider(null)
      setAuth(null)
      localStorage.removeItem('web3auth_logged_in')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }, [web3auth])

  const getUserInfo = useCallback(async () => {
    try {
      const user = await web3auth!.getUserInfo()

      const accounts = await rpc?.getAccounts()

      return {
        ...user,
        publicKey: accounts?.[0],
      }
    } catch (err) {
      console.error('Failed to get user info:', err)
      return null
    }
  }, [web3auth, rpc])

  const signTransaction = useCallback(
    async (tx: any) => {
      if (!provider) {
        console.error('No provider available for transaction signing')
        throw new Error('Web3 provider not initialized')
      }

      try {
        const rpc = new RPC(provider)
        // Make sure we're using the version-specific signing method
        const signature = await rpc.signVersionedTransaction({ tx })

        if (!signature) {
          throw new Error('No signature returned')
        }

        console.log('Transaction signed successfully:', signature)
        return signature
      } catch (error) {
        console.error('Transaction signing error:', error)
        throw new Error('Failed to sign transaction')
      }
    },
    [provider]
  )

  // Check localStorage on mount
  useEffect(() => {
    if (web3auth && web3auth?.connected) {
      setProvider(web3auth.provider)
    }
  }, [web3auth])

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
    signTransaction,
  }
}
