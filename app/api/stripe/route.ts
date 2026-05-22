import Stripe from "stripe"
import { NextResponse } from "next/server"

// Guard against missing env var at startup
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, currency, email, frequency, recurring: recurringRaw } = body
    const recurring = recurringRaw ?? frequency === 'monthly'

    // ── Input validation ──────────────────────────────────────
    if (!amount || typeof amount !== "number" || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum donation is 1." },
        { status: 400 }
      )
    }

    if (!currency || typeof currency !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing currency." },
        { status: 400 }
      )
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid or missing email address." },
        { status: 400 }
      )
    }

    // ── Build price_data conditionally ────────────────────────
    // recurring must NOT be included when mode is "payment"
    const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
      currency: currency.toLowerCase(),
      product_data: {
        name: "Donation to AdeGrange Child Foundation",
      },
      unit_amount: Math.round(amount * 100), // ensure integer pence/cents
      ...(recurring && {
        recurring: { interval: "month" }
      }),
    }

    // ── Create Stripe session ─────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      customer_email: email,
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donate`,

      // Optional: collect billing address for compliance
      billing_address_collection: "auto",

      // Optional: allow promo codes
      // allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id })

  } catch (error) {
    console.error("Stripe session error:", error)

    // Return a clean error to the client (never expose raw Stripe errors)
    return NextResponse.json(
      { error: "Payment session could not be created. Please try again." },
      { status: 500 }
    )
  }
}
