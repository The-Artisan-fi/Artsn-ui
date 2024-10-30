import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Verify the payment was successful
        if (session.payment_status === 'paid') {
          // Extract metadata
          const { asset_id, reference_id, amount } = session.metadata || {};
          
          if (!asset_id || !reference_id || !amount) {
            console.error('Missing required metadata in session:', session.id);
            return NextResponse.json(
              { error: 'Invalid session metadata' },
              { status: 400 }
            );
          }
          const { db } = await connectToDatabase();
          const collection = db.collection('stripe_sessions');
          // Update your database to mark the payment as successful
          await collection.updateOne(
            { session_id: session.id },
            { 
              $set: { 
                status: 'completed',
                completed_at: new Date(),
                payment_intent: session.payment_intent
              }
            }
          );

          // You might want to trigger the blockchain transaction here
          // instead of waiting for the success page
          
          return NextResponse.json({ status: 'success' });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { db } = await connectToDatabase();
        const collection = db.collection('stripe_sessions');
        // Clean up any pending sessions
        await collection.updateOne(
          { session_id: session.id },
          { $set: { status: 'expired' } }
        );
        
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};