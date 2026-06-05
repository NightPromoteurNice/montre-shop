import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const customerName = session.customer_details?.name || 'Unknown'
    const customerEmail = session.customer_details?.email || 'Unknown'
    const country = session.customer_details?.address?.country || 'Unknown'
    const city = session.customer_details?.address?.city || ''
    const amount = (session.amount_total || 0) / 100
    const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })

    // Récupérer les articles
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const itemsList = lineItems.data.map(item =>
      `${item.quantity}x ${item.description} — €${((item.amount_total || 0) / 100).toLocaleString()}`
    ).join('\n')

    await resend.emails.send({
      from: 'TTSFactory <onboarding@resend.dev>',
      to: 'ttsfactory17@gmail.com',
      subject: `🎉 New order — €${amount} from ${country}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 40px; max-width: 600px;">
          <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px; border-bottom: 1px solid #333; padding-bottom: 20px;">
            NEW ORDER
          </h1>

          <div style="margin-bottom: 30px;">
            <p style="color: #666; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Date</p>
            <p style="font-size: 14px;">${date}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #666; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Customer</p>
            <p style="font-size: 14px;">${customerName}</p>
            <p style="font-size: 14px; color: #999;">${customerEmail}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #666; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Location</p>
            <p style="font-size: 14px;">${city ? city + ', ' : ''}${country}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #666; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Items</p>
            <pre style="font-size: 13px; color: #ccc; white-space: pre-wrap;">${itemsList}</pre>
          </div>

          <div style="border-top: 1px solid #333; padding-top: 20px; margin-top: 20px;">
            <p style="color: #666; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Total</p>
            <p style="font-size: 28px; font-weight: 300;">€${amount.toLocaleString()}</p>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #222;">
            <a href="https://dashboard.stripe.com/payments" style="color: #666; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
              View in Stripe Dashboard →
            </a>
          </div>
        </div>
      `
    })
  }

  return NextResponse.json({ received: true })
}