import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'


export const runtime = 'nodejs'

// Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover'
})


// ─── Thank-you email helper ───────────────────────────────────────────────────
// Uses a simple fetch to your email provider (e.g. Resend / SendGrid).
// Replace the body below with your provider's API call.
async function sendThankYouEmail(
  email: string | null | undefined,
  name:  string | null | undefined,
  amount: number | null
) {
  if (!email) return

  const amountFormatted =
    amount != null ? `£${(amount / 100).toFixed(2)}` : 'your generous donation'

  // Example using Resend — swap for SendGrid/Mailgun/etc. as needed
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from:    'AdeGrange Foundation <noreply@adegrangefoundation.org>',
      to:      email,
      subject: 'Thank You for Your Donation',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
          <h2 style="color:#111">Thank you${name ? `, ${name}` : ''}!</h2>
          <p>We have received ${amountFormatted} — your support helps us protect
             mothers and children across Africa.</p>
          <p>You will receive an official receipt shortly.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="font-size:12px;color:#999">
            AdeGrange Child Foundation &mdash; Registered Charity
          </p>
        </div>
      `
    })
  })
}

// ─── Webhook handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Read raw body — required for signature verification
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return Response.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  // 2. Verify event signature
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return Response.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    )
  }

  // 3. Handle events
  try {
    switch (event.type) {

      // ── Successful donation ─────────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const donationRow = {
          stripe_session_id: session.id,
          amount:            session.amount_total,
          currency:          session.currency,
          email:             session.customer_details?.email  ?? null,
          name:              session.customer_details?.name   ?? null,
          status:            'completed',
          created_at:        new Date().toISOString(),
        }

        // Save to Supabase
        const { error: dbError } = await supabase
          .from('donations')
          .insert(donationRow)

        if (dbError) {
          // Log but do not return 500 — Stripe would retry endlessly
          console.error('Supabase insert error:', dbError.message)
        } else {
          console.log('Donation saved:', donationRow)
        }

        // Send thank-you email
        try {
          await sendThankYouEmail(
            session.customer_details?.email,
            session.customer_details?.name,
            session.amount_total
          )
          console.log('Thank-you email sent to:', session.customer_details?.email)
        } catch (emailErr: any) {
          // Email failure must not block the 200 response
          console.error('Email send error:', emailErr.message)
        }

        break
      }

      // ── Failed payment ──────────────────────────────────────────────────
      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent

        console.warn('Payment failed:', intent.id)

        // Optionally log failed attempts to Supabase
        await supabase.from('donation_failures').insert({
          stripe_payment_intent_id: intent.id,
          reason: intent.last_payment_error?.message ?? 'unknown',
          created_at: new Date().toISOString(),
        })

        break
      }

      // ── All other events ────────────────────────────────────────────────
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err: any) {
    console.error('Error processing webhook event:', err.message)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }

  // 4. Always return 200 so Stripe stops retrying
  return Response.json({ received: true }, { status: 200 })
}
