"use client"

import { useState } from "react"
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

const currencies = [
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "NGN", symbol: "₦", label: "NGN (₦)" },
]

const rates: Record<string, number> = { GBP: 1, USD: 1.27, NGN: 1650 }

const impacts = [
  { icon: <Heart className="w-5 h-5" />, amount: "£10",  desc: "Provides essential health education materials for one child" },
  { icon: <Users className="w-5 h-5" />, amount: "£25",  desc: "Supports a community health workshop for 5 mothers" },
  { icon: <Globe className="w-5 h-5" />, amount: "£50",  desc: "Funds a peer-to-peer dialogue session in a rural community" },
  { icon: <Shield className="w-5 h-5" />, amount: "£100", desc: "Sponsors a full month of maternal health outreach" },
]

export default function DonatePage() {
  const [selected, setSelected]     = useState<number | null>(25)
  const [custom, setCustom]         = useState("")
  const [currency, setCurrency]     = useState("GBP")
  const [frequency, setFrequency]   = useState<"once" | "monthly">("once")
  const [step, setStep]             = useState<"amount" | "details">("amount")
  const [form, setForm]             = useState({ name: "", email: "" })
  const [loading, setLoading]       = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState("")

  const symbol     = currencies.find(c => c.code === currency)?.symbol ?? "£"
  const baseAmount = custom ? parseFloat(custom) : selected
  const finalAmount = baseAmount ? Math.round(baseAmount * rates[currency]) : 0
  const displayLabel = `${symbol}${finalAmount}${frequency === "monthly" ? "/mo" : ""}`

  async function handlePayment() {
    if (!finalAmount || !form.email || !form.name) return
    setLoading(true)
    setError("")

    try {
      if (currency === "NGN") {
        // Paystack for Naira
        const handler = (window as any).PaystackPop?.setup({
          key:      process.env.NEXT_PUBLIC_PAYSTACK_PK,
          email:    form.email,
          amount:   finalAmount * 100, // kobo
          currency: "NGN",
          metadata: { name: form.name, frequency },
          callback:  () => setSubmitted(true),
          onClose:   () => setLoading(false),
        })
        handler?.openIframe()
        return
      }

      // Stripe for GBP / USD
      const stripe = await getStripe()
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:    baseAmount,
          currency:  currency.toLowerCase(),
          email:     form.email,
          recurring: frequency === "monthly",
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? "Payment error")
      await stripe?.redirectToCheckout({ sessionId: data.id })
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-pink-600" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Thank You!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your donation of <strong className="text-pink-600">{displayLabel}</strong> will make a real difference to children and mothers in West Africa.
          </p>
          <a href="/" className="inline-block px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold transition">
            Back to Home
          </a>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-20 bg-gray-50 dark:bg-gray-950">
      {/* Paystack SDK */}
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-700 via-pink-600 to-rose-600 py-14 sm:py-20 px-4 text-white text-center mb-10 sm:mb-14">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Heart className="w-10 h-10 mx-auto mb-4 opacity-90" fill="currentColor" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">Make a Difference Today</h1>
          <p className="text-pink-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Every contribution helps us protect children and empower mothers across Nigeria and West Africa.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12">

          {/* Impact info */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Your Impact</h2>
            <div className="space-y-4">
              {impacts.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-pink-600 block mb-0.5">{item.amount}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Safe &amp; Trusted</p>
              <div className="flex flex-wrap gap-2">
                {["Registered NGO", "Transparent Reporting", "100% to Mission"].map(b => (
                  <span key={b} className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Donation form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">

              {step === "amount" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Choose an Amount</h2>

                  {/* Currency */}
                  <div className="flex gap-2 mb-4">
                    {currencies.map(c => (
                      <button key={c.code} onClick={() => setCurrency(c.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          currency === c.code
                            ? "bg-pink-600 border-pink-600 text-white"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-pink-300"
                        }`}>
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Frequency */}
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                    {(["once", "monthly"] as const).map(f => (
                      <button key={f} onClick={() => setFrequency(f)}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                          frequency === f ? "bg-pink-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}>
                        {f === "once" ? "Give Once" : "Give Monthly"}
                      </button>
                    ))}
                  </div>

                  {/* Preset amounts */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                    {presetAmounts.map(amt => (
                      <button key={amt} onClick={() => { setSelected(amt); setCustom("") }}
                        className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                          selected === amt && !custom
                            ? "bg-pink-600 border-pink-600 text-white shadow-md"
                            : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 hover:text-pink-600"
                        }`}>
                        £{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">{symbol}</span>
                    <input type="number" min="1" placeholder="Other amount" value={custom}
                      onChange={e => { setCustom(e.target.value); setSelected(null) }}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm" />
                  </div>

                  <button onClick={() => setStep("details")} disabled={!finalAmount || finalAmount <= 0}
                    className="w-full py-3.5 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue — {displayLabel}
                  </button>
                </motion.div>
              )}

              {step === "details" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button onClick={() => setStep("amount")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5 transition">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Your Details</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Donating <strong className="text-pink-600">{displayLabel}</strong> via {currency === "NGN" ? "Paystack" : "Stripe"}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                      <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm" />
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                        {error}
                      </div>
                    )}

                    <button onClick={handlePayment} disabled={loading || !form.name || !form.email}
                      className="w-full py-3.5 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                      {loading ? "Processing…" : `Donate ${displayLabel}`}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      {currency === "NGN" ? "Secured by Paystack" : "Secured by Stripe"} · Test mode active
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
