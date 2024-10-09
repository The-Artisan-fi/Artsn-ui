import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';



export async function POST(req: NextRequest) {

  const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
  const host = process.env.NEXT_PUBLIC_HOST;

  // Check if variables are defined
  if (!stripeSecretKey || !host) {
    throw new Error('Stripe secret key or host is not defined');
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await req.json();
  console.log('body', body);  
  const date = new Date().toISOString();
  const idempotencyKey = req.headers.get('Idempotency-Key');

  if (!idempotencyKey) {
    return NextResponse.json(
      { error: 'Missing Idempotency-Key header' },
      { status: 400 }
    );
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'INV-' + date,
            },
            unit_amount: body?.amount * 100 || 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      cancel_url: `${host}`,
      success_url: `${host}/product/${body?.id}?amount=${body?.amount}`,
    },
    {
      idempotencyKey,
    }
  );

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.log(err, 'err');
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
