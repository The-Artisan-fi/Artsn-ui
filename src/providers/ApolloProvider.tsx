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
  credentials: 'same-origin',
})

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

// Auth link for adding token
const authLink = setContext((_, { headers }) => {
  const storedAuth = useAuthStore.getState()
  const token = storedAuth.authToken
  console.log('Token:', token)
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
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
