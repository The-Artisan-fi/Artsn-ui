import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';

// Initialize Stripe
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

// Instead of using config, we'll use the following solution for raw body
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
          const { asset_id, reference_id, amount } = session.metadata || {};
          
          if (!asset_id || !reference_id || !amount) {
            console.error('Missing required metadata in session:', session.id);
            return NextResponse.json(
              { error: 'Invalid session metadata' },
              { status: 400 }
            );
          }

          try {
            // Connect to MongoDB and update session status
            const { db } = await connectToDatabase();
            await db.collection('stripe_sessions').updateOne(
              { session_id: session.id },
              { 
                $set: { 
                  status: 'completed',
                  completed_at: new Date(),
                  payment_intent: session.payment_intent
                }
              }
            );

            // Here you could also initiate your blockchain transaction
            // if you want to handle it in the webhook instead of the success page

          } catch (dbError) {
            console.error('Database update error:', dbError);
            // Still return 200 to Stripe but log the error
          }
          
          return NextResponse.json({ status: 'success' });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        try {
          const { db } = await connectToDatabase();
          await db.collection('stripe_sessions').updateOne(
            { session_id: session.id },
            { $set: { status: 'expired' } }
          );
        } catch (dbError) {
          console.error('Database update error:', dbError);
        }
        
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}