import { NextRequest, NextResponse } from 'next/server'
import { loadStripe } from '@stripe/stripe-js'

export async function GET(request: NextRequest) {
  // Check for required environment variable
  if (!process.env.NEXT_SECRET_STRIPE_KEY) {
    console.error('NEXT_SECRET_STRIPE_KEY is not set')
    return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 })
  }

  // Initialize Stripe client inside the function to avoid build-time issues
  const stripe = loadStripe(process.env.NEXT_SECRET_STRIPE_KEY)

  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'setup_intent'],
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Return the client secret for embedded checkout
    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
    })
  } catch (error: any) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve checkout session' },
      { status: 500 }
    )
  }
} 