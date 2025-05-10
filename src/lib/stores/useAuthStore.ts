// src/store/useAuthStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { IProvider } from '@web3auth/base'
import { User, AuthPayload } from '@/types/resolver-types'

interface AuthState {
  // Web3Auth state
  web3auth: Web3AuthNoModal | null
  provider: IProvider | null
  publicKey: string | null
  loggedIn: boolean // Added this state
  userInfo: {
    email?: string
    name?: string
    profileImage?: string
  } | null

  // User state
  currentUser: User | null
  authToken: string | null  // Para session
  jwtToken: string | null  // JWT token
  isAuthenticated: boolean
  showRegisterForm: { publicKey: string; userInfo: { email?: string } } | null

  // Loading states
  loading: boolean
  error: Error | null

  // Actions
  setWeb3Auth: (web3auth: Web3AuthNoModal | null) => void
  setProvider: (provider: IProvider | null) => void
  setUserInfo: (info: AuthState['userInfo']) => void
  setPublicKey: (key: string | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setCurrentUser: (user: User | null) => void
  setAuthToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  setWeb3AuthState: (state: {
    web3auth?: Web3AuthNoModal | null
    provider?: IProvider | null
    loggedIn?: boolean
  }) => void
  setAuth: (auth: AuthPayload | null) => void
  logout: () => void
  resetAuth: () => void
  clearAuth: () => void
  setShowRegisterForm: (data: { publicKey: string; userInfo: { email?: string } } | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      web3auth: null,
      provider: null,
      publicKey: null,
      loggedIn: false, // Added initial state
      userInfo: null,
      currentUser: null,
      authToken: null,
      jwtToken: null,
      isAuthenticated: false,
      paraSession: null,
      loading: false,
      error: null,
      showRegisterForm: null,

      // Actions
      setShowRegisterForm: (data) => set({ showRegisterForm: data }),
      setWeb3Auth: (web3auth) => set({ web3auth }),
      setProvider: (provider) => set({ provider }),
      setUserInfo: (info) => set({ userInfo: info }),
      setPublicKey: (key) => set({ publicKey: key }),
      setCurrentUser: (user) =>
        set({
          currentUser: user,
          isAuthenticated: !!user,
        }),
      setAuthToken: (token) => set({ authToken: token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setWeb3AuthState: (state) =>
        set((prev) => ({
          ...prev,
          ...state,
          loggedIn: state.loggedIn ?? prev.loggedIn,
          isAuthenticated: state.loggedIn ?? prev.isAuthenticated,
        })),
      setAuth: (auth) => {
        if (!auth) {
          set({
            authToken: null,
            currentUser: null,
            isAuthenticated: false,
            loggedIn: false,
          })
          return
        }
        const { token, user } = auth
        set((state) => ({
          // Preserve the existing authToken (Para session) and store JWT token separately
          authToken: state.authToken,  // Keep the Para session
          jwtToken: token,  // Store JWT token separately
          currentUser: user,
          isAuthenticated: true,
          loggedIn: true,
          publicKey: user.publicKey,
        }))
      },
      logout: () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userPublicKey')
        set({
          web3auth: null,
          provider: null,
          publicKey: null,
          userInfo: null,
          currentUser: null,
          authToken: null,
          jwtToken: null,
          isAuthenticated: false,
          loggedIn: false,
          error: null,
        })
      },
      resetAuth: () =>
        set({
          publicKey: null,
          userInfo: null,
          currentUser: null,
          authToken: null,
          jwtToken: null,
          isAuthenticated: false,
          loggedIn: false,
          error: null,
        }),
      clearAuth: () => set({ currentUser: null, authToken: null, jwtToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authToken: state.authToken,
        jwtToken: state.jwtToken,
        currentUser: state.currentUser,
        publicKey: state.publicKey,
        userInfo: state.userInfo,
        loggedIn: state.loggedIn,
      }),
    }
  )
)
