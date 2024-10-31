import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '@/lib/mongodb';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { sessionId, assetId, amount, ref } = await req.json();

    // Input validation
    if (!sessionId || !assetId || !amount || !ref) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if this session was already processed
    const existingSession = await db.collection('stripe_sessions').findOne({
      session_id: sessionId,
      status: 'completed'
    });

    if (existingSession) {
      return NextResponse.json(
        { error: 'Payment already processed' },
        { status: 400 }
      );
    }

    // Verify payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Verify amount matches
    const expectedAmount = parseInt(amount) * 100; // Stripe amounts are in cents
    if (session.amount_total !== expectedAmount) {
      return NextResponse.json(
        { error: 'Amount mismatch' },
        { status: 400 }
      );
    }

    // Update session status in database if not already done by webhook
    await db.collection('stripe_sessions').updateOne(
      { session_id: sessionId },
      {
        $setOnInsert: {
          session_id: sessionId,
          asset_id: assetId,
          amount: parseInt(amount),
          reference_id: ref,
          created_at: new Date(),
          expires_at: new Date(Date.now() + (30 * 60 * 1000)) // 30 minutes
        },
        $set: {
          status: 'completed',
          completed_at: new Date(),
          payment_intent: session.payment_intent
        }
      },
      { upsert: true }
    );

    // Return success with session details
    return NextResponse.json({
      verified: true,
      details: {
        paymentIntent: session.payment_intent,
        amount: session.amount_total / 100,
        currency: session.currency,
        customerEmail: session.customer_details?.email
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}