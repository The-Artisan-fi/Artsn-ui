// app/api/kyc/create/route.ts
import { NextResponse } from 'next/server'

const ONDATO_API_URL =
  process.env.ONDATO_API_URL || 'https://sandbox-api.ondato.com'
const ONDATO_API_KEY = process.env.ONDATO_API_KEY
const ONDATO_SETUP_ID = process.env.NEXT_PUBLIC_ONDATO_SETUP_ID
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('incoming request:', body)
    const { registration, externalReferenceId } = body

    if (!registration || !externalReferenceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Make request to Ondato API
    const auth_token = await fetch(
      `https://sandbox-id.ondato.com/connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=app.ondato.timeverse-labs.730fb&client_secret=7aa6ce886867d6bb4086fecfae3a4c222fa377ef6d4bbaf04ebe8331795dff8a`,
      }
    )

    const token = await auth_token.json()

    if (auth_token.status !== 200) {
      throw new Error(token.message)
    }

    const response = await fetch(
      `https://sandbox-idvapi.ondato.com/v1/identity-verifications`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setupId: ONDATO_SETUP_ID,
          registration: registration,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Ondato API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to create identity verification', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('ondato response', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('KYC Creation Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: Add GET method if needed
export async function GET() {
  return NextResponse.json(
    { message: 'KYC verification endpoint' },
    { status: 200 }
  )
}
