import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Define the session data type
export interface SessionData {
  isLoggedIn: boolean
  _id?: string
  token?: string // JWT token for authentication
}

// Session options to configure iron-session
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'auth_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 120, // 2 hours (120 minutes)
  },
}

// Function to get the session from request and response objects (API Routes)
export async function getSessionFromReq(req: NextRequest, res: NextResponse) {
  return getIronSession<SessionData>(req, res, sessionOptions)
}

// Read session from server component (read-only)
export async function getSessionFromCookies(): Promise<SessionData> {
  try {
    // Use type assertion to handle the type issue with cookies()
    const cookieStore = cookies() as any
    const sessionCookie = cookieStore?.get?.(sessionOptions.cookieName)
    
    if (!sessionCookie?.value) {
      return { isLoggedIn: false }
    }
    
    try {
      const { unsealData } = await import('iron-session')
      return await unsealData<SessionData>(
        sessionCookie.value,
        {
          password: sessionOptions.password,
          ttl: sessionOptions.cookieOptions.maxAge
        }
      )
    } catch (error) {
      console.error('Failed to unseal session cookie:', error)
      return { isLoggedIn: false }
    }
  } catch (error) {
    console.error('Error reading cookies:', error)
    return { isLoggedIn: false }
  }
}

// Generate a JWT token for authentication
export function generateToken(user: any): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured')
  }
  
  const payload = {
    _id: user._id?.toString() || '',
    publicKey: user.publicKey,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 120) // 2 hours (120 minutes)
  }
  
  const jwt = require('jsonwebtoken')
  return jwt.sign(payload, process.env.JWT_SECRET)
}

// Create a secure session cookie value
export async function sealSession(session: SessionData): Promise<string> {
  const { sealData } = await import('iron-session')
  return sealData(session, {
    password: sessionOptions.password,
    ttl: sessionOptions.cookieOptions.maxAge
  })
}

// Read and decrypt a session cookie value
export async function unsealSession(cookieValue: string): Promise<SessionData> {
  try {
    const { unsealData } = await import('iron-session')
    return await unsealData<SessionData>(cookieValue, {
      password: sessionOptions.password,
      ttl: sessionOptions.cookieOptions.maxAge
    })
  } catch (error) {
    console.error('Failed to unseal session cookie:', error)
    return { isLoggedIn: false }
  }
}

// To use in client components
declare module 'iron-session' {
  interface IronSessionData extends SessionData {}
} 