'use client'

import { useAuthStore } from '@/lib/stores/useAuthStore'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'include',
})

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      
      // Handle authentication errors
      if (message === 'Not authenticated') {
        // Clear auth state
        useAuthStore.getState().clearAuth();
      }
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

// Auth link for adding paraSession
const authLink = setContext((_, { headers }) => {
  const storedAuth = useAuthStore.getState()
  
  const newHeaders = {
    ...headers,
    'x-capsule-session': storedAuth.authToken || '',
    'Content-Type': 'application/json',
    'x-apollo-operation-name': 'GraphQLRequest',
    'apollo-require-preflight': 'true'
  };
    
  return {
    headers: newHeaders,
  }
})

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

export default function ApolloWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
