import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { amount, currency, email, name, frequency, donorRef } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const isMonthly = frequency === "monthly"

    if (isMonthly) {
      // For subscriptions: create a SetupIntent so the card can be charged monthly
      const customer = await stripe.customers.create({ email, name })

      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ["card"],
        metadata: { donorRef, amount: String(amount), currency, frequency },
      })

      return NextResponse.json({ clientSecret: setupIntent.client_secret, customerId: customer.id, mode: "setup" })
    }

    // One-time payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      receipt_email: email,
      metadata: { donorRef, name, frequency },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, mode: "payment" })
  } catch (error) {
    console.error("PaymentIntent error:", error)
    return NextResponse.json({ error: "Could not initialise payment" }, { status: 500 })
  }
}
