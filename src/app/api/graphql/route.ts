// import { ApolloServer } from '@apollo/server';
// import { startServerAndCreateNextHandler } from '@as-integrations/next';
// import { resolvers } from '@/graphql/resolvers';
// import { typeDefs } from '@/graphql/schema';
// import { connectToDatabase } from '@/config/mongodb';
// import { verifyToken } from '@/lib/auth';
// import { NextRequest } from 'next/server';
// import { Context } from '@/types/resolver-types';

// const server = new ApolloServer<Context>({
//   typeDefs,
//   resolvers,
// });

// const handler = startServerAndCreateNextHandler(server, {
//   context: async (req: NextRequest) => {
//     const db = (await connectToDatabase()).db;
//     const token = req.headers.get('authorization')?.replace('Bearer ', '');
//     const user = token ? await verifyToken(token) : null;

//     return { req, db, user };
//   },
// });

// export { handler as GET, handler as POST };

import { ApolloServer } from '@apollo/server'
import { NextRequest } from 'next/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import jwt from 'jsonwebtoken'
import { resolvers } from '@/graphql/resolvers'
import { typeDefs } from '@/graphql/schema'
import { connectToDatabase } from '@/config/mongodb'
import { Context } from '@/types/resolver-types'
import { verifyToken } from '@/lib/auth'

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const db = (await connectToDatabase()).db
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await verifyToken(token) : null

    return { req, db, user }
  },
})

export async function GET() {
  return new Response('Use POST for GraphQL queries and mutations', {
    status: 405,
    headers: { Allow: 'POST' },
  })
}

export async function POST(request: Request) {
  console.log('auth post pinged')
  return handler(request)
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  })
}
