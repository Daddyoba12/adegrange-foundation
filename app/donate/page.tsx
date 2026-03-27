"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from '@/lib/supabase'

/* ================= STRIPE ================= */
let stripePromise: Promise<any> | null = null
function getStripe() {
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js").then((m) =>
      m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK ?? "")
    )
  }
  return stripePromise
}

/* ================= PAYSTACK ================= */
function loadPaystack(): Promise<any> {
  return new Promise((resolve) => {
    if ((window as any).PaystackPop) { resolve((window as any).PaystackPop); return }
    const s = document.createElement('script')
    s.src = 'https://js.paystack.co/v1/inline.js'
    s.onload = () => resolve((window as any).PaystackPop)
    document.body.appendChild(s)
  })
}

function generateDonorRef() { return `ACF_${Date.now()}` }

async function saveDonation(data: {
  donor_ref: string; name: string; email: string; phone?: string
  amount: number; currency: string; frequency: string
  payment_provider: string; status: string
}) {
  const { error } = await supabase.from("donations").insert([data])
  if (error) console.error("Supabase insert error:", error)
}

/* ================= CONFIG ================= */
const presetAmounts = [15, 25, 50, 100]

const currencies = [
  { code: "USD", symbol: "$", label: "USD $" },
  { code: "GBP", symbol: "£", label: "GBP £" },
  { code: "NGN", symbol: "₦", label: "NGN ₦" },
]

const rates: Record<string, number> = { USD: 1, GBP: 0.79, NGN: 1570 }

const impactItems = [
  { usd: 15,  label: "supports prenatal care for a mother" },
  { usd: 25,  label: "protects a child with vaccinations" },
  { usd: 50,  label: "funds a community health outreach" },
  { usd: 100, label: "sponsors a child's education for a term" },
]

const MONTHLY_GOAL  = 32000
const AMOUNT_RAISED = 4800

/* ================= SECTION DIVIDER ================= */
function Divider() {
  return <div className="border-t border-gray-200 dark:border-gray-800 my-6" />
}

/* ================= SECTION LABEL ================= */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 mb-4">
      {children}
    </p>
  )
}

export default function DonatePage() {
  const [currency,  setCurrency]  = useState("GBP")
  const [frequency, setFrequency] = useState<"once" | "monthly">("monthly")
  const [preset,    setPreset]    = useState<number | null>(25)
  const [custom,    setCustom]    = useState("")
  const [name,      setName]      = useState("")
  const [email,     setEmail]     = useState("")
  const [phone,     setPhone]     = useState("")
  const [agreed,    setAgreed]    = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState("")
  const [progress,  setProgress]  = useState(0)
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card")

  useEffect(() => {
    const pct = Math.round((AMOUNT_RAISED / MONTHLY_GOAL) * 100)
    const t = setTimeout(() => setProgress(pct), 400)
    return () => clearTimeout(t)
  }, [])

  const sym  = currencies.find((c) => c.code === currency)?.symbol ?? "$"
  const rate = rates[currency] ?? 1

  const displayAmount: number = preset !== null
    ? Math.round(preset * rate)
    : parseFloat(custom) || 0

  async function handleDonate() {
    setError("")
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email to continue.")
      return
    }
    if (displayAmount <= 0) {
      setError("Please select or enter a donation amount.")
      return
    }
    if (!agreed) {
      setError("Please accept the Terms & Conditions to continue.")
      return
    }

    setLoading(true)
    const donorRef = generateDonorRef()

    try {
      if (currency === "NGN") {
        await saveDonation({
          donor_ref: donorRef, name, email,
          phone: phone || undefined, amount: displayAmount,
          currency, frequency, payment_provider: "paystack", status: "pending",
        })
        const PaystackPop = await loadPaystack()
        const pop = PaystackPop?.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PK ?? "",
          email, amount: displayAmount * 100, currency: "NGN", ref: donorRef,
          callback: async () => {
            await supabase.from("donations").update({ status: "completed" }).eq("donor_ref", donorRef)
            window.location.href = `/thank-you?ref=${donorRef}&name=${encodeURIComponent(name)}&amount=${displayAmount}&currency=${currency}`
          },
          onClose: () => setLoading(false),
        })
        pop?.openIframe()
        return
      }

      await saveDonation({
        donor_ref: donorRef, name, email,
        phone: phone || undefined, amount: displayAmount,
        currency, frequency, payment_provider: "stripe", status: "pending",
      })

      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: displayAmount, currency: currency.toLowerCase(), frequency, name, email, donorRef }),
      })
      const { sessionId } = await res.json()
      const stripe = await getStripe()
      await stripe?.redirectToCheckout({ sessionId })

    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Make a Donation
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            AdeGrange Child Foundation &mdash; Protecting Mothers &amp; Children Across Africa
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-semibold text-pink-600">
              ${AMOUNT_RAISED.toLocaleString()} raised this month
            </span>
            <span>Goal: ${MONTHLY_GOAL.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-600 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── ORDER SUMMARY CARD ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl mb-4">

          {/* Frequency */}
          <div className="p-5 sm:p-6">
            <SectionLabel>Donation Frequency</SectionLabel>
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {(["monthly", "once"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors
                    ${frequency === f
                      ? "bg-pink-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  {f === "monthly" ? "Monthly" : "One-time"}
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* Currency */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <SectionLabel>Currency</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${currency === c.code
                      ? "bg-pink-600 text-white"
                      : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-400"
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* Amount */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <SectionLabel>Select Amount</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
              {presetAmounts.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPreset(p); setCustom("") }}
                  className={`py-3.5 rounded-lg text-sm font-semibold transition-all active:scale-95
                    ${preset === p
                      ? "bg-pink-600 text-white shadow-sm"
                      : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-400"
                    }`}
                >
                  {sym}{Math.round(p * rate)}
                </button>
              ))}
            </div>

            {/* Custom */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none select-none">
                {sym}
              </span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Other amount"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setPreset(null) }}
                className="w-full pl-8 pr-4 py-3 rounded-lg border text-base transition
                           border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-800
                           text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-600
                           focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <Divider />

          {/* Order total line — like Harrods */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Donation Total
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {sym}{displayAmount > 0 ? displayAmount.toLocaleString() : "0"}
                {frequency === "monthly" && (
                  <span className="text-sm font-normal text-gray-400 dark:text-gray-500"> / mo</span>
                )}
              </span>
            </div>

            {/* Impact line */}
            {displayAmount > 0 && (
              <p className="text-xs text-pink-600 mt-1 text-right">
                {impactItems.slice().reverse().find(i => displayAmount >= Math.round(i.usd * rate))?.label
                  ? `Your gift ${impactItems.slice().reverse().find(i => displayAmount >= Math.round(i.usd * rate))!.label}`
                  : "Every contribution makes a difference"}
              </p>
            )}
          </div>

        </div>

        {/* ── DONOR DETAILS CARD ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl mb-4 p-5 sm:p-6">
          <SectionLabel>Your Details</SectionLabel>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="donor-name" className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                  Full Name
                </label>
                <input
                  id="donor-name" type="text" placeholder="Your full name"
                  value={name} autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-base transition
                             border-gray-300 dark:border-gray-700
                             bg-white dark:bg-gray-800
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="donor-email" className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                  Email Address
                </label>
                <input
                  id="donor-email" type="email" placeholder="your@email.com"
                  value={email} autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-base transition
                             border-gray-300 dark:border-gray-700
                             bg-white dark:bg-gray-800
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="donor-phone" className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                Phone <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="donor-phone" type="tel" inputMode="tel"
                placeholder="+44 7700 900000"
                value={phone} autoComplete="tel"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-base transition
                           border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-800
                           text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-600
                           focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* ── PAYMENT METHOD CARD ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl mb-4 p-5 sm:p-6">

          <div className="flex items-center gap-2 mb-4">
            <SectionLabel>Secure Payment</SectionLabel>
            <span className="text-base -mt-3.5">🔒</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Please select your payment method
          </p>

          {/* Payment method icons — Harrods style */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setPayMethod("card")}
              className={`flex items-center justify-center w-20 h-14 rounded-lg border-2 transition-all
                ${payMethod === "card"
                  ? "border-pink-600 bg-pink-50 dark:bg-pink-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              aria-label="Pay by card"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2" />
                <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2" />
              </svg>
            </button>

            <button
              onClick={() => setPayMethod("paypal")}
              className={`flex items-center justify-center w-20 h-14 rounded-lg border-2 transition-all
                ${payMethod === "paypal"
                  ? "border-pink-600 bg-pink-50 dark:bg-pink-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              aria-label="Pay with PayPal"
            >
              <span className="text-[#003087] dark:text-blue-400 font-extrabold text-sm">
                Pay<span className="text-[#009cde]">Pal</span>
              </span>
            </button>
          </div>

          {payMethod === "card" && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You will be securely redirected to Stripe to complete your card payment.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["VISA", "MC", "AMEX"].map(card => (
                  <span key={card} className="px-2 py-1 text-xs font-bold border border-gray-300 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          )}

          {payMethod === "paypal" && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You will be redirected to PayPal to complete your donation securely.
              </p>
            </div>
          )}
        </div>

        {/* ── TERMS CARD ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl mb-4 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <input
              id="terms" type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-pink-600 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer">
              By clicking below and placing your donation, you agree to the{" "}
              <Link href="/terms" target="_blank" className="text-pink-600 hover:text-pink-500 underline underline-offset-2 font-medium">
                Terms &amp; Conditions
              </Link>
              , including our donation refund policy and how your funds will be used by AdeGrange Child Foundation.
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── DONATE BUTTON ── */}
        <button
          onClick={handleDonate}
          disabled={loading || !agreed}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200
                     bg-pink-600 hover:bg-pink-700 active:scale-[0.98]
                     text-white shadow-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Donate ${sym}${displayAmount > 0 ? displayAmount.toLocaleString() : "0"}${frequency === "monthly" ? " / month" : ""}`
          )}
        </button>

        {/* Footer trust line */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
          🔒 SSL encrypted &nbsp;&middot;&nbsp; Powered by Stripe &amp; Paystack &nbsp;&middot;&nbsp; Cancel anytime
        </p>

      </div>
    </div>
  )
}
