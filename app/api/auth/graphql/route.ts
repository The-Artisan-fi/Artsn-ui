import { ApolloServer } from '@apollo/server';
import { NextRequest } from 'next/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import jwt from 'jsonwebtoken';
import { resolvers } from '@/lib/resolvers';
import { typeDefs } from '@/lib/typeDefs';
import { connectToDatabase } from '@/lib/mongodb';
// Keep your existing typeDefs and resolvers

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const token = req.headers.get('authorization') || '';
    const { db } = await connectToDatabase();

    if (token) {
      try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET as string) as { _id: string, email: string, publicKey: string };
        return { user: { _id: decoded._id, email: decoded.email, publicKey: decoded.publicKey }, db };
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    } else {
      console.log('No authorization token provided');
    }

    return { user: null as any, db };
  },
});

export async function GET() {
  return new Response('Use POST for GraphQL queries and mutations', {
    status: 405,
    headers: { 'Allow': 'POST' },
  });
}

export async function POST(request: Request) {
  console.log('auth post pinged')
  return handler(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  });
}