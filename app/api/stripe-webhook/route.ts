import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// IMPORTANT: tell Next.js NOT to parse the body
// Stripe needs the raw buffer to verify the signature
export const config = {
  api: {
    bodyParser: false
  }
}

export async function POST(req: Request) {
  // 1. Get the raw body as a buffer (required for signature check)
  const body = await req.text()

  // 2. Get the Stripe signature from the request headers
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return new Response(
      JSON.stringify({ error: 'Missing stripe-signature header' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 3. Verify the event — this throws if signature is invalid
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(
      JSON.stringify({ error: `Webhook error: ${err.message}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 4. Handle specific event types
  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Donation confirmed:', {
          id:       session.id,
          amount:   session.amount_total,
          currency: session.currency,
          email:    session.customer_details?.email,
          name:     session.customer_details?.name,
        })

        // TODO: save to your database here
        // await supabase.from('donations').insert({ ... })

        // TODO: send confirmation email here
        // await sendThankYouEmail(session.customer_details?.email)
        break
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent
        console.warn('Payment failed:', intent.id)
        // TODO: notify your team or log to DB
        break
      }

      // Add more event types here as needed
      default:
        // Acknowledge receipt of unhandled event types
        // so Stripe does not keep retrying
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err: any) {
    console.error('Error processing webhook event:', err.message)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 5. Always return 200 so Stripe knows the webhook was received
  return new Response(
    JSON.stringify({ received: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
