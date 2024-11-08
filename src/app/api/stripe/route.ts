// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';



// export async function POST(req: NextRequest) {

//   const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
//   const host = process.env.NEXT_PUBLIC_HOST;

//   // Check if variables are defined
//   if (!stripeSecretKey || !host) {
//     throw new Error('Stripe secret key or host is not defined');
//   }

//   const stripe = new Stripe(stripeSecretKey);
//   const body = await req.json();
//   const date = new Date().toISOString();
//   const idempotencyKey = req.headers.get('Idempotency-Key');

//   if (!idempotencyKey) {
//     return NextResponse.json(
//       { error: 'Missing Idempotency-Key header' },
//       { status: 400 }
//     );
//   };

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'INV-' + date,
//             },
//             unit_amount: body?.amount * 100 || 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       cancel_url: `${host}`,
//       success_url: `${host}/product/${body?.id}?amount=${body?.amount}`,
//     },
//     {
//       idempotencyKey,
//     }
//   );

//     return NextResponse.json({ sessionId: session.id });
//   } catch (err) {
//     console.log(err, 'err');
//     return NextResponse.json(
//       { error: 'Error creating checkout session' },
//       { status: 500 }
//     );
//   }
// }


import { connectToDatabase } from '@/config/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

interface PaymentBody {
  amount: number;
  id: string;
  objectReference: string;
  metadata?: Record<string, string>;
  uri: any;
}

export async function POST(req: NextRequest) {
  // Environment validation
  const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
  const host = process.env.NEXT_PUBLIC_HOST;

  if (!stripeSecretKey || !host) {
    console.error('Missing environment variables:', {
      hasStripeKey: !!stripeSecretKey,
      hasHost: !!host
    });
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Request validation
  const idempotencyKey = req.headers.get('Idempotency-Key');
  if (!idempotencyKey) {
    return NextResponse.json(
      { error: 'Missing Idempotency-Key header' },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey);

    const body = await req.json() as PaymentBody;

    // Input validation
    if (!body.amount || !body.id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate reference ID
    const date = new Date();
    const referenceId = `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${date.getTime().toString().slice(-6)}`;
    const objectReference = body.objectReference;
    const encodedUri = body.uri;
    // Create session with enhanced metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: referenceId,
              description: `Fraction purchase for asset ${body.id}`,
              metadata: {
                asset_id: body.id,
                ...body.metadata
              }
            },
            unit_amount: Math.round(body.amount * 100), // Ensure integer
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        asset_id: body.id,
        reference_id: referenceId,
        amount: body.amount.toString(),
        created_at: date.toISOString(),
        ...body.metadata
      },
      success_url: `${host}/stripe/success?session_id={CHECKOUT_SESSION_ID}&asset_id=${body.id}&amount=${body.amount}&ref=${referenceId}&object_ref=${objectReference}&uri=${encodedUri}`,
      cancel_url: `${host}/product/${body.id}?cancelled=true`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    }, {
      idempotencyKey,
    });
    const { db } = await connectToDatabase();
    const collection = db.collection('stripe_sessions');
    // Store session info for verification (you might want to add this)
    await collection.insertOne({
      session_id: session.id,
      asset_id: body.id,
      amount: body.amount,
      reference_id: referenceId,
      status: 'pending',
      created_at: date,
      expires_at: new Date(Date.now() + (30 * 60 * 1000))
    });

    return NextResponse.json({
      sessionId: session.id,
      referenceId,
      expiresAt: session.expires_at
    });

  } catch (error) {
    console.error('Stripe session creation error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { 
          error: 'Payment processing error',
          details: error.message
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}