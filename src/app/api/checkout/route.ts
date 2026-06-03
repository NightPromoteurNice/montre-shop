import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { items } = await req.json()

  const line_items = items.map((item: { name: string; price: number; image_url: string; quantity: number }) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        images: item.image_url ? [item.image_url] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC', 'ES', 'IT', 'DE', 'GB', 'NL', 'PT', 'US', 'AE'],
    },
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${req.headers.get('origin')}/success`,
    cancel_url: `${req.headers.get('origin')}/cart`,
  })

  return NextResponse.json({ url: session.url })
}