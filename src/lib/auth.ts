// lib/auth.ts
import { getDb } from '@/config/mongodb'
import { ObjectId } from 'mongodb'
import { cookies } from 'next/headers'
import { SessionData, sessionOptions } from './session'
import { JwtPayload } from 'jsonwebtoken'

// Define the User type
export interface User {
  _id: string
  publicKey?: string
  email?: string
  role?: string
  paraSession?: string
  username?: string
  firstName?: string
  lastName?: string
  country?: string
  createdAt?: string
  updatedAt?: string
  isActive?: boolean
  isVerified?: boolean
  [key: string]: any // Allow for additional properties
}

// Decode base64 Para session
export function decodeParaSession(base64Session: string): any {
  try {
    const decodedString = Buffer.from(base64Session, 'base64').toString('utf-8')
    return JSON.parse(decodedString)
  } catch (error) {
    console.error('Error decoding Para session:', error)
    return null
  }
}

// Verify the authentication of a user
export async function verifyToken(session: SessionData): Promise<User | null> {
  try {
    // Check if we have a token in the session
    if (session.token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(session.token, process.env.JWT_SECRET) as JwtPayload;
        
        // If the token is valid, get the user from the database using the _id from the token
        const db = await getDb();
        const user = await db.collection('users').findOne({ 
          _id: new ObjectId(decoded._id)
        });
        
        if (user) {
          return {
            ...user,
            _id: user._id.toString(),
          } as User;
        }
      } catch (tokenError) {
        console.error('JWT verification error:', tokenError);
        // Continue to try session._id if token verification fails
      }
    }

    // Fall back to checking by session._id if token verification failed or no token
    if (!session || !session.isLoggedIn || !session._id) {
      return null;
    }

    const db = await getDb()
    
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(session._id)
    })

    if (!user) return null

    return {
      ...user,
      _id: user._id.toString(),
    } as User
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

// Function to get auth cookie - legacy support
export async function getAuthCookie(): Promise<string | undefined> {
  try {
    // TypeScript doesn't know that cookies() returns synchronously,
    // so we need to cast to any to bypass the Promise type
    const cookieStore = cookies() as any
    const cookie = cookieStore?.get?.(sessionOptions.cookieName)
    
    if (!cookie?.value) return undefined
    
    // Process and validate the cookie
    try {
      const { unsealData } = await import('iron-session')
      const data = await unsealData<SessionData>(cookie.value, {
        password: sessionOptions.password,
        ttl: sessionOptions.cookieOptions.maxAge
      })
      
      return data.isLoggedIn ? 'authenticated' : undefined
    } catch (error) {
      console.error('Failed to parse auth cookie:', error)
      return undefined
    }
  } catch (error) {
    console.error('Error accessing cookies:', error)
    return undefined
  }
}