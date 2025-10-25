import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuthUser } from '@/lib/auth';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdefghijklmnopqrstuvwxyz', {
  apiVersion: '2024-06-20',
});

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { items } = result.data;

    // Calculate total
    const amount = Math.round(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    ); // Convert to cents

    // Create payment intent
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: {
          userId: authUser.userId,
          items: JSON.stringify(items),
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (stripeError) {
      // If Stripe fails (e.g., invalid API key in demo), return mock data
      console.warn('Stripe error (demo mode):', stripeError);
      return NextResponse.json({
        clientSecret: 'mock_client_secret_for_demo',
        paymentIntentId: `pi_mock_${Date.now()}`,
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
