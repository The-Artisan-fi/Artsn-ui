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
import { NextRequest, NextResponse } from 'next/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { resolvers } from '@/graphql/resolvers'
import { typeDefs } from '@/graphql/schema'
import { getDb } from '@/config/mongodb'
import { Context, User as ContextUser } from '@/types/resolver-types'
import { verifyToken, User as AuthUser } from '@/lib/auth'
import { getSessionFromReq, SessionData, sessionOptions } from '@/lib/session'
import mongoose from 'mongoose'

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
})

// Convert AuthUser to ContextUser
function convertUserType(authUser: AuthUser | null): ContextUser | null {
  if (!authUser) return null;
  
  return {
    _id: authUser._id,
    uuid: authUser.uuid || '',
    email: authUser.email || '',
    publicKey: authUser.publicKey || '',
    username: authUser.username || '',
    firstName: authUser.firstName || '',
    lastName: authUser.lastName || '',
    role: authUser.role || 'USER',
    createdAt: authUser.createdAt || new Date().toISOString(),
    updatedAt: authUser.updatedAt || new Date().toISOString(),
    isActive: authUser.isActive || true,
    isVerified: authUser.isVerified || false,
    // Include any other required fields
  } as ContextUser;
}

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const db = await getDb()
    
    // Get the response object from the request or create a new one
    const res = (req as any).contextResponse || new NextResponse()
    
    // Get iron-session
    const session = await getSessionFromReq(req, res)
    let authUser = null
    
    // Try to authenticate with iron-session JWT token
    if (session.isLoggedIn && session.token) {
      authUser = await verifyToken(session)
    }
    
    // Get capsule session header but don't validate it here
    // Each resolver will handle capsule session validation as needed
    const capsuleSessionHeader = req.headers.get('x-capsule-session')
    
    // Convert to the expected User type in Context
    const contextUser = convertUserType(authUser)
    
    return { 
      req, 
      res, 
      db, 
      user: contextUser || undefined, 
      session,
      capsuleSession: capsuleSessionHeader,
      mongoose
    }
  },
})

export async function GET() {
  return new Response('Use POST for GraphQL queries and mutations', {
    status: 405,
    headers: { Allow: 'POST' },
  })
}

export async function POST(request: Request) {
  console.log('GraphQL API request received')
  
  // Create a NextRequest instance properly
  const nextRequest = new NextRequest(request, {
    nextConfig: {}
  })
  
  // Create a response for context
  const contextResponse = new NextResponse();
  
  // Add the response to the request object for context to use
  (nextRequest as any).contextResponse = contextResponse;
  
  try {
    // Get the response from handler
    const response = await handler(nextRequest)
    
    // Get response body to check for sessionCookie field in login mutation
    let responseBody: any = {};
    
    try {
      const text = await response.text();
      if (text) {
        responseBody = JSON.parse(text);
        console.log('Parsed response body structure:', Object.keys(responseBody));
      }
    } catch (e) {
      console.error('Error parsing response body:', e);
    }
    
    // Create a new response to ensure we have full control over cookies and headers
    const finalResponse = new NextResponse(JSON.stringify(responseBody), {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    });
    
    // Extract session cookie from the login mutation response
    // This is specifically for social logins where the cookie needs to be set on the client
    const sessionCookie = responseBody?.data?.login?.response?.sessionCookie;
    
    if (sessionCookie) {
      console.log('Found sessionCookie in response, setting auth_session cookie');
      finalResponse.cookies.set({
        name: sessionOptions.cookieName,
        value: sessionCookie,
        httpOnly: sessionOptions.cookieOptions.httpOnly,
        secure: sessionOptions.cookieOptions.secure,
        sameSite: sessionOptions.cookieOptions.sameSite,
        path: sessionOptions.cookieOptions.path,
        maxAge: sessionOptions.cookieOptions.maxAge
      });
    }
    
    // Copy all cookies from context response
    const contextCookies = contextResponse.cookies.getAll();
    if (contextCookies.length > 0) {
      console.log(`Copying ${contextCookies.length} cookies from context response`);
      for (const cookie of contextCookies) {
        console.log(`Setting cookie ${cookie.name} from context`);
        finalResponse.cookies.set({
          name: cookie.name,
          value: cookie.value,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite as any,
          path: cookie.path,
          maxAge: cookie.maxAge
        });
      }
    } else {
      console.log('No cookies found in context response');
    }
    
    // Copy all cookies from handler response
    if (response instanceof NextResponse) {
      const handlerCookies = response.cookies.getAll();
      if (handlerCookies.length > 0) {
        console.log(`Copying ${handlerCookies.length} cookies from handler response`);
        for (const cookie of handlerCookies) {
          console.log(`Setting cookie ${cookie.name} from handler`);
          finalResponse.cookies.set({
            name: cookie.name,
            value: cookie.value,
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            sameSite: cookie.sameSite as any,
            path: cookie.path,
            maxAge: cookie.maxAge
          });
        }
      } else {
        console.log('No cookies found in handler response');
      }
    }
    
    // Check for and transfer any Set-Cookie headers
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      console.log('Found Set-Cookie header, transferring to final response');
      // Split multiple cookies if they are in a single header
      const cookies = setCookieHeader.split(',').map(c => c.trim());
      for (const cookie of cookies) {
        finalResponse.headers.append('Set-Cookie', cookie);
      }
    }
    
    // Ensure required CORS headers are set
    finalResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    const origin = request.headers.get('origin');
    if (origin) {
      finalResponse.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      finalResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
    
    // Log the final list of cookies being sent
    console.log('Final cookies in response:', finalResponse.cookies.getAll().map(c => c.name));
    
    return finalResponse;
  } catch (error) {
    console.error('Error handling GraphQL request:', error);
    return new NextResponse(JSON.stringify({ 
      errors: [{ message: 'Internal server error processing the request' }] 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': request.headers.get('origin') || 'http://localhost:3000'
      }
    });
  }
}

export async function OPTIONS(request: Request) {
  // Get the origin from the request
  const origin = request.headers.get('origin') || 'http://localhost:3000';
  
  console.log('Handling OPTIONS request for CORS preflight from origin:', origin);
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-capsule-session',
      // Include Set-Cookie in exposed headers so browsers can access it
      'Access-Control-Expose-Headers': 'Set-Cookie'
    },
  });
}
