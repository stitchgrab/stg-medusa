import { retrieveCart } from '@lib/data/cart'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = Stripe(process.env.NEXT_SECRET_STRIPE_KEY!)

export async function POST(request: NextRequest) {
  const { successUrl, cancelUrl, cartId } = await request.json()

  const cart = await retrieveCart(cartId)

  if (!cart) {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
  }

  const lineItems = cart.items?.map((item: any) => ({
    price_data: {
      currency: cart.region?.currency_code ?? "usd",
      product_data: {
        name: item.product_title,
      },
      unit_amount: item.total * 100,
    },
    quantity: item.quantity,
  }))

  try {
    const session = await stripe?.checkout?.sessions.create({
      line_items: lineItems,
      ui_mode: "custom",
      mode: "payment",
      return_url: successUrl,
    })

    console.log(session)
    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 