"use client"
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import * as Realm from 'realm-web';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const graphqlUri = process.env.NEXT_PUBLIC_MONGO_ENDPOINT;
const app = new Realm.App('artisan-gql-scrtu');
async function getValidAccessToken() {
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  } else {
    // An already logged in user's access token might be stale. Tokens must be refreshed after 
    // 30 minutes. To guarantee that the token is valid, we refresh the user's access token.
    await app.currentUser.refreshAccessToken();
  }
  return app.currentUser!.accessToken;
}
const client = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUri,
    // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
    // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
    // access token before sending the request.
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      // @ts-expect-error : 'headers' does not exist on type 'RequestInit'
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache(),
});


export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Navbar />
        <div style={{ flexGrow: 1 }}>{children}</div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}
