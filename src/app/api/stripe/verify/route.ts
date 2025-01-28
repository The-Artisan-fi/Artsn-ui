// app/api/stripe/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectToDatabase } from '@/config/mongodb'
import { headers } from 'next/headers'

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const headersList = headers()
  const authToken = headersList.get('authorization')

  console.log('Starting verification process')
  console.log('Auth header:', authToken ? 'present' : 'missing')

  try {
    // 1. Check Authorization
    if (!authToken?.startsWith('Bearer ')) {
      console.log('Invalid auth header format')
      return NextResponse.json(
        { error: 'Invalid authorization header' },
        { status: 401 }
      )
    }

    // 2. Parse Request
    let body
    try {
      body = await req.json()
      console.log('Request body:', body)
    } catch (error) {
      console.error('Failed to parse request body:', error)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // 3. Validate Required Fields
    const { sessionId, assetId, amount, ref } = body
    console.log('Parsed fields:', { sessionId, assetId, amount, ref })

    if (!sessionId || !assetId || !amount || !ref) {
      console.log('Missing required fields')
      return NextResponse.json(
        {
          error: 'Missing required fields',
          received: { sessionId, assetId, amount, ref },
        },
        { status: 400 }
      )
    }

    // 4. Connect to Database
    let db
    try {
      const { db: database } = await connectToDatabase()
      db = database
      console.log('Database connected')
    } catch (error) {
      console.error('Database connection failed:', error)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // 5. Check Stripe Session
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId)
      console.log('Stripe session:', {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
      })
    } catch (error) {
      console.error('Failed to retrieve Stripe session:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve Stripe session' },
        { status: 500 }
      )
    }

    // 6. Verify Payment Status
    if (session.payment_status !== 'paid') {
      console.log('Payment not completed:', session.payment_status)
      return NextResponse.json(
        {
          error: 'Payment not completed',
          status: session.payment_status,
        },
        { status: 400 }
      )
    }

    // 7. Update Database
    try {
      const result = await db.collection('stripe_sessions').updateOne(
        { session_id: sessionId },
        {
          $setOnInsert: {
            session_id: sessionId,
            asset_id: assetId,
            amount: Number(amount),
            reference_id: ref,
            created_at: new Date(),
          },
          $set: {
            status: 'completed',
            completed_at: new Date(),
            payment_intent: session.payment_intent,
          },
        },
        { upsert: true }
      )
      console.log('Database update result:', result)
    } catch (error) {
      console.error('Failed to update database:', error)
      return NextResponse.json(
        { error: 'Failed to update database' },
        { status: 500 }
      )
    }

    // 8. Return Success
    return NextResponse.json({
      verified: true,
      details: {
        paymentIntent: session.payment_intent,
        amount: session.amount_total! / 100,
        currency: session.currency,
        customerEmail: session.customer_details?.email,
      },
    })
  } catch (error) {
    console.error('Verification process failed:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: `Stripe error: ${error.message}`,
          code: error.code,
        },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
