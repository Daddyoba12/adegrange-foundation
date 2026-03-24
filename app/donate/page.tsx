"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { motion } from "framer-motion"
import { Heart, Shield, Globe, Users } from "lucide-react"
// Stripe loaded lazily so the build never hard-fails if pk is missing
let stripePromise: Promise<any> | null = null
function getStripe() {
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js").then(m =>
      m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK ?? "")
    )
  }
  return stripePromise
}

const presetAmounts = [10, 25, 50, 100, 250]

const impacts = [
  { icon: <Heart className="w-5 h-5" />,  amount: "£10",  desc: "Provides essential health education materials for one child" },
  { icon: <Users className="w-5 h-5" />,  amount: "£25",  desc: "Supports a community health workshop for 5 mothers" },
  { icon: <Globe className="w-5 h-5" />,  amount: "£50",  desc: "Funds a peer-to-peer dialogue session in a rural community" },
  { icon: <Shield className="w-5 h-5" />, amount: "£100", desc: "Sponsors a full month of maternal health outreach" },
]

export default function DonatePage() {
  const [currency, setCurrency]   = useState<"GBP" | "USD" | "NGN">("GBP")
  const [frequency, setFrequency] = useState<"once" | "monthly">("once")
  const [rates, setRates]         = useState({ GBP: 1, USD: 1.27, NGN: 1600 })
  const [selected, setSelected]   = useState<number | null>(25)
  const [custom, setCustom]       = useState("")
  const [step, setStep]           = useState<"amount" | "details">("amount")
  const [form, setForm]           = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const currencySymbol = { GBP: "£", USD: "$", NGN: "₦" }
  const symbol = currencySymbol[currency]

  // Live FX rates
  useEffect(() => {
    fetch("https://api.exchangerate.host/latest?base=GBP")
      .then(r => r.json())
      .then(data => setRates({ GBP: 1, USD: data.rates.USD, NGN: data.rates.NGN }))
      .catch(() => {}) // silently fallback to defaults
  }, [])

  const baseAmount   = custom ? parseFloat(custom) : selected
  const finalAmount  = baseAmount ? Math.round(baseAmount * rates[currency]) : 0
  const displayLabel = `${symbol}${finalAmount}${frequency === "monthly" ? "/mo" : ""}`

  // ── Payment handler ──────────────────────────────────────────
  async function handlePayment() {
    if (!finalAmount || !form.email) return
    setLoading(true)

    try {
      // Paystack for NGN
      if (currency === "NGN") {
        const handler = (window as any).PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PK,
          email: form.email,
          amount: finalAmount * 100,
          currency: "NGN",
          callback: () => setSubmitted(true),
          onClose: () => setLoading(false),
        })
        handler.openIframe()
        return
      }

      // Stripe for GBP / USD
      const stripe = await getStripe()
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          currency,
          email: form.email,
          recurring: frequency === "monthly",
        }),
      })
      const data = await res.json()
      await stripe?.redirectToCheckout({ sessionId: data.id })

    } catch (err) {
      console.error(err)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Thank you screen ─────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-pink-600" fill="currentColor" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Thank You, {form.name || "Friend"}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
            Your donation of{" "}
            <strong className="text-pink-600">{displayLabel}</strong>{" "}
            will make a real difference.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            A confirmation will be sent to <strong>{form.email}</strong>.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold transition active:scale-95"
          >
            Back to Home
          </a>
        </motion.div>
      </main>
    )
  }

  // ── Main page ────────────────────────────────────────────────
  return (
    <main className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Paystack SDK */}
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-pink-700 via-pink-600 to-rose-600 py-12 sm:py-20 px-4 text-white text-center mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Heart className="w-9 h-9 mx-auto mb-4 opacity-90" fill="currentColor" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Make a Difference Today
          </h1>
          <p className="text-pink-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Every contribution helps us protect children and empower mothers across Nigeria and West Africa.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12">

          {/* ── Left: impact + trust ── */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Your Impact
            </h2>
            <div className="space-y-3">
              {impacts.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-pink-600 block mb-0.5">
                      {item.amount}
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-6 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                Safe &amp; Trusted
              </p>
              <div className="flex flex-wrap gap-2">
                {["Registered NGO", "Transparent Reporting", "100% to Mission"].map(badge => (
                  <span key={badge} className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">

              {/* ── Step 1: Amount ── */}
              {step === "amount" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Choose an Amount
                  </h2>

                  {/* Currency selector */}
                  <div className="flex gap-2 mb-5">
                    {(["GBP", "USD", "NGN"] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all active:scale-95 ${
                          currency === c
                            ? "bg-pink-600 border-pink-600 text-white"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-700"
                        }`}
                      >
                        {c === "GBP" ? "🇬🇧 GBP" : c === "USD" ? "🇺🇸 USD" : "🇳🇬 NGN"}
                      </button>
                    ))}
                  </div>

                  {/* Frequency toggle */}
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-5">
                    {(["once", "monthly"] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                          frequency === f
                            ? "bg-pink-600 text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {f === "once" ? "Give Once" : "Give Monthly"}
                      </button>
                    ))}
                  </div>

                  {/* Preset amounts */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                    {presetAmounts.map(amt => (
                      <button
                        key={amt}
                        onClick={() => { setSelected(amt); setCustom("") }}
                        className={`py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                          selected === amt && !custom
                            ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-500/20"
                            : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-700"
                        }`}
                      >
                        {symbol}{Math.round(amt * rates[currency])}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold select-none">
                      {symbol}
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Other amount"
                      value={custom}
                      onChange={e => { setCustom(e.target.value); setSelected(null) }}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none transition text-base"
                    />
                  </div>

                  <button
                    onClick={() => finalAmount > 0 && setStep("details")}
                    disabled={!finalAmount || finalAmount <= 0}
                    className="w-full py-3.5 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
                  >
                    Continue — {displayLabel}
                  </button>
                </motion.div>
              )}

              {/* ── Step 2: Details + Payment ── */}
              {step === "details" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button
                    onClick={() => setStep("amount")}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5 transition"
                  >
                    ← Back
                  </button>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Your Details
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Donating{" "}
                    <strong className="text-pink-600">{displayLabel}</strong>
                  </p>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        autoComplete="name"
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none transition text-base"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        autoComplete="email"
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none transition text-base"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Message{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Share why you are donating..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none transition text-sm resize-none"
                      />
                    </div>

                    {/* Payment notice — NGN shows Paystack note, else Stripe */}
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-semibold mb-1">
                        {currency === "NGN" ? "Pay with Paystack" : "Pay with Stripe"}
                      </p>
                      <p className="text-xs leading-relaxed">
                        {currency === "NGN"
                          ? "You will be redirected to Paystack's secure checkout to complete your NGN payment."
                          : "You will be redirected to Stripe's secure checkout. All major cards and Apple Pay accepted."}
                      </p>
                    </div>

                    {/* Pay button */}
                    <button
                      onClick={handlePayment}
                      disabled={loading || !form.email || !form.name}
                      className="w-full py-3.5 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
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
                        `Donate ${displayLabel} →`
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-400 dark:text-gray-600">
                      🔒 Secure payment via {currency === "NGN" ? "Paystack" : "Stripe"} &bull; Instant confirmation
                    </p>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
