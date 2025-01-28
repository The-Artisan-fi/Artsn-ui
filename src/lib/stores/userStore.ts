// src/lib/stores/useStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, ListingType, AuthPayload } from '@/types/resolver-types'

interface StoreState {
  // Auth state
  authToken: string | null
  currentUser: User | null

  // Cache state
  users: Map<string, User>
  listings: Map<string, ListingType>

  // Loading states
  loadingStates: {
    users: Map<string, boolean>
    listings: Map<string, boolean>
  }

  // Auth actions
  setAuth: (auth: AuthPayload | null) => void
  logout: () => void

  // User actions
  upsertUser: (user: User) => void
  upsertUsers: (users: User[]) => void
  updateUserProfile: (userId: string, updates: Partial<User>) => void
  setUserLoading: (userId: string, loading: boolean) => void

  // Listing actions
  upsertListing: (listing: ListingType) => void
  upsertListings: (listings: ListingType[]) => void
  updateListing: (listingId: string, updates: Partial<ListingType>) => void
  setListingLoading: (listingId: string, loading: boolean) => void

  // Cache management
  clearCache: () => void
}

const initialState = {
  authToken: null,
  currentUser: null,
  users: new Map(),
  listings: new Map(),
  loadingStates: {
    users: new Map(),
    listings: new Map(),
  },
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth actions
      setAuth: (auth) => {
        if (!auth) {
          set({ authToken: null, currentUser: null })
          return
        }

        const { token, user } = auth
        set({
          authToken: token,
          currentUser: user,
          users: new Map(get().users).set(user._id!, user),
        })
      },

      logout: () => {
        set({
          authToken: null,
          currentUser: null,
          users: new Map(),
          listings: new Map(),
        })
      },

      // User actions
      upsertUser: (user) =>
        set((state) => ({
          users: new Map(state.users).set(user._id!, user),
        })),

      upsertUsers: (users) =>
        set((state) => ({
          users: new Map<string, User>([
            ...Array.from(state.users.entries()),
            ...users.map((user) => [user._id!, user] as [string, User]),
          ]),
        })),

      updateUserProfile: (userId, updates) =>
        set((state) => {
          const users = new Map(state.users)
          const existingUser = users.get(userId)
          if (existingUser) {
            const updatedUser = { ...existingUser, ...updates }
            users.set(userId, updatedUser)

            // Update currentUser if this is the current user
            if (state.currentUser?._id === userId) {
              return { users, currentUser: updatedUser }
            }
          }
          return { users }
        }),

      setUserLoading: (userId, loading) =>
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            users: new Map(state.loadingStates.users).set(userId, loading),
          },
        })),

      // Listing actions
      upsertListing: (listing) =>
        set((state) => ({
          listings: new Map(state.listings).set(listing._id, listing),
        })),

      upsertListings: (listings) =>
        set((state) => ({
          listings: new Map<string, ListingType>([
            ...Array.from(state.listings.entries()),
            ...listings.map(
              (listing) => [listing._id, listing] as [string, ListingType]
            ),
          ]),
        })),

      updateListing: (listingId, updates) =>
        set((state) => {
          const listings = new Map(state.listings)
          const existingListing = listings.get(listingId)
          if (existingListing) {
            listings.set(listingId, { ...existingListing, ...updates })
          }
          return { listings }
        }),

      setListingLoading: (listingId, loading) =>
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            listings: new Map(state.loadingStates.listings).set(
              listingId,
              loading
            ),
          },
        })),

      // Cache management
      clearCache: () =>
        set((state) => ({
          ...initialState,
          authToken: state.authToken,
          currentUser: state.currentUser,
        })),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authToken: state.authToken,
        currentUser: state.currentUser,
        users: Array.from(state.users.entries()),
        listings: Array.from(state.listings.entries()),
      }),
    }
  )
)
