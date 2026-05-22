'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK ?? '')

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
  await supabase.from('donations').insert([data])
}

const presetAmounts = [15, 25, 50, 100]
const currencies = [
  { code: 'USD', symbol: '$', label: 'USD $' },
  { code: 'GBP', symbol: '£', label: 'GBP £' },
  { code: 'NGN', symbol: '₦', label: 'NGN ₦' },
]
const rates: Record<string, number> = { USD: 1, GBP: 0.79, NGN: 1570 }
const impactItems = [
  { usd: 15,  label: 'supports prenatal care for a mother' },
  { usd: 25,  label: 'protects a child with vaccinations' },
  { usd: 50,  label: 'funds a community health outreach' },
  { usd: 100, label: "sponsors a child's education for a term" },
]
const MONTHLY_GOAL  = 32000
const AMOUNT_RAISED = 4800

function Divider() {
  return <div className="border-t border-gray-200 dark:border-gray-800 my-1" />
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 mb-4">{children}</p>
}

/* ═══════════════════════════════
   INNER CHECKOUT FORM
   Rendered inside <Elements>
═══════════════════════════════ */
function CheckoutForm({
  displayAmount, sym, frequency, name, email, phone,
  currency, agreed, donorRef,
  onSuccess, onError,
}: {
  displayAmount: number; sym: string; frequency: string
  name: string; email: string; phone: string
  currency: string; agreed: boolean; donorRef: string
  onSuccess: () => void; onError: (msg: string) => void
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    if (!name.trim() || !email.trim()) { onError('Please enter your name and email.'); return }
    if (displayAmount <= 0) { onError('Please select or enter a donation amount.'); return }
    if (!agreed) { onError('Please accept the Terms & Conditions to continue.'); return }

    setPaying(true)
    onError('')

    try {
      // Create PaymentIntent on server
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: displayAmount, currency, frequency, email, name, donorRef }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Could not start payment')

      await saveDonation({
        donor_ref: donorRef, name, email, phone: phone || undefined,
        amount: displayAmount, currency, frequency,
        payment_provider: 'stripe', status: 'pending',
      })

      const returnUrl = `${window.location.origin}/thank-you?ref=${donorRef}&name=${encodeURIComponent(name)}&amount=${displayAmount}&currency=${currency}`

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: { billing_details: { name, email } },
        },
      })

      if (error) throw new Error(error.message ?? 'Payment failed')
      onSuccess()
    } catch (err: any) {
      onError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <form onSubmit={handlePay}>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || paying || !agreed}
        className="w-full py-4 rounded-2xl font-semibold text-base bg-pink-600 hover:bg-pink-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {paying ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : `Donate ${sym}${displayAmount > 0 ? displayAmount.toLocaleString() : '0'}${frequency === 'monthly' ? ' / month' : ''}`}
      </button>
    </form>
  )
}

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
export default function DonatePage() {
  const [currency,  setCurrency]  = useState('GBP')
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('monthly')
  const [preset,    setPreset]    = useState<number | null>(25)
  const [custom,    setCustom]    = useState('')
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [agreed,    setAgreed]    = useState(false)
  const [error,     setError]     = useState('')
  const [progress,  setProgress]  = useState(0)
  const [payMethod, setPayMethod] = useState<'card' | 'paypal'>('card')
  const [donorRef]                = useState(() => generateDonorRef())

  useEffect(() => {
    const t = setTimeout(() => setProgress(Math.round((AMOUNT_RAISED / MONTHLY_GOAL) * 100)), 400)
    return () => clearTimeout(t)
  }, [])

  const sym  = currencies.find((c) => c.code === currency)?.symbol ?? '£'
  const rate = rates[currency] ?? 1
  const displayAmount: number = preset !== null ? Math.round(preset * rate) : parseFloat(custom) || 0

  // Paystack handler (NGN only)
  async function handlePaystack() {
    if (!name.trim() || !email.trim()) { setError('Please enter your name and email.'); return }
    if (displayAmount <= 0) { setError('Please select or enter a donation amount.'); return }
    if (!agreed) { setError('Please accept the Terms & Conditions.'); return }
    setError('')
    await saveDonation({ donor_ref: donorRef, name, email, phone: phone || undefined, amount: displayAmount, currency, frequency, payment_provider: 'paystack', status: 'pending' })
    const PaystackPop = await loadPaystack()
    const pop = PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PK ?? '',
      email, amount: displayAmount * 100, currency: 'NGN', ref: donorRef,
      callback: async () => {
        await supabase.from('donations').update({ status: 'completed' }).eq('donor_ref', donorRef)
        window.location.href = `/thank-you?ref=${donorRef}&name=${encodeURIComponent(name)}&amount=${displayAmount}&currency=${currency}`
      },
      onClose: () => {},
    })
    pop?.openIframe()
  }

  // Stripe Elements options — initialised with deferred mode (no clientSecret needed upfront)
  const stripeOptions = {
    mode: (frequency === 'monthly' ? 'setup' : 'payment') as 'payment' | 'setup',
    amount: frequency === 'monthly' ? undefined : Math.round(displayAmount * 100),
    currency: currency.toLowerCase(),
    appearance: {
      theme: 'stripe' as const,
      variables: { colorPrimary: '#db2777', borderRadius: '12px' },
    },
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Make a Donation</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            AdeGrange Child Foundation &mdash; Protecting Mothers &amp; Children Across Africa
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-semibold text-pink-600">${AMOUNT_RAISED.toLocaleString()} raised this month</span>
            <span>Goal: ${MONTHLY_GOAL.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-pink-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Frequency + Currency + Amount */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 overflow-hidden">
          <div className="p-4 sm:p-6">
            <SectionLabel>Donation Frequency</SectionLabel>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {(['monthly', 'once'] as const).map((f) => (
                <button key={f} onClick={() => setFrequency(f)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${frequency === f ? 'bg-pink-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  {f === 'monthly' ? 'Monthly' : 'One-time'}
                </button>
              ))}
            </div>
          </div>
          <Divider />
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <SectionLabel>Currency</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {currencies.map((c) => (
                <button key={c.code} onClick={() => setCurrency(c.code)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currency === c.code ? 'bg-pink-600 text-white' : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-400'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <Divider />
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <SectionLabel>Select Amount</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
              {presetAmounts.map((p) => (
                <button key={p} onClick={() => { setPreset(p); setCustom('') }}
                  className={`py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${preset === p ? 'bg-pink-600 text-white shadow-sm' : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-400'}`}>
                  {sym}{Math.round(p * rate)}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none">{sym}</span>
              <input type="number" inputMode="numeric" placeholder="Other amount" value={custom}
                onChange={(e) => { setCustom(e.target.value); setPreset(null) }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>
          <Divider />
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Donation Total</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {sym}{displayAmount > 0 ? displayAmount.toLocaleString() : '0'}
                {frequency === 'monthly' && <span className="text-sm font-normal text-gray-400"> / mo</span>}
              </span>
            </div>
            {displayAmount > 0 && (
              <p className="text-xs text-pink-600 mt-1 text-right">
                {impactItems.slice().reverse().find((i) => displayAmount >= Math.round(i.usd * rate))
                  ? `Your gift ${impactItems.slice().reverse().find((i) => displayAmount >= Math.round(i.usd * rate))!.label}`
                  : 'Every contribution makes a difference'}
              </p>
            )}
          </div>
        </div>

        {/* Donor details */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 p-4 sm:p-6">
          <SectionLabel>Your Details</SectionLabel>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Full Name</label>
                <input type="text" placeholder="Your full name" value={name} autoComplete="name" onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Email Address</label>
                <input type="email" placeholder="your@email.com" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Phone <span className="opacity-60">(optional)</span></label>
              <input type="tel" placeholder="+44 7700 900000" value={phone} autoComplete="tel" onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 p-4 sm:p-6">
          <SectionLabel>Secure Payment 🔒</SectionLabel>

          {/* Method toggle */}
          <div className="flex gap-3 mb-5">
            <button onClick={() => setPayMethod('card')}
              className={`flex items-center justify-center w-20 h-14 rounded-xl border-2 transition-all ${payMethod === 'card' ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2" />
                <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2" />
              </svg>
            </button>
            {currency === 'NGN' && (
              <button onClick={() => setPayMethod('paypal')}
                className={`flex items-center justify-center w-20 h-14 rounded-xl border-2 transition-all ${payMethod === 'paypal' ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                <span className="text-[#003087] dark:text-blue-400 font-extrabold text-sm">Pay<span className="text-[#009cde]">stack</span></span>
              </button>
            )}
          </div>

          {/* Stripe card fields — always visible when card selected and not NGN */}
          {payMethod === 'card' && currency !== 'NGN' && displayAmount > 0 && (
            <Elements key={`${currency}-${frequency}-${displayAmount}`} stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm
                displayAmount={displayAmount}
                sym={sym}
                frequency={frequency}
                name={name}
                email={email}
                phone={phone}
                currency={currency}
                agreed={agreed}
                donorRef={donorRef}
                onSuccess={() => {}}
                onError={setError}
              />
            </Elements>
          )}

          {/* NGN — Paystack */}
          {currency === 'NGN' && payMethod === 'paypal' && (
            <button onClick={handlePaystack}
              className="w-full py-4 rounded-2xl font-semibold text-base bg-pink-600 hover:bg-pink-700 text-white shadow-sm transition-all active:scale-[0.98]">
              Donate {sym}{displayAmount > 0 ? displayAmount.toLocaleString() : '0'} via Paystack
            </button>
          )}

          {displayAmount <= 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
              Select an amount above to see payment options.
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded accent-pink-600 cursor-pointer flex-shrink-0" />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer">
              By donating, you agree to our{' '}
              <Link href="/terms" target="_blank" className="text-pink-600 hover:text-pink-500 underline underline-offset-2 font-medium">
                Terms &amp; Conditions
              </Link>
              {' '}and confirm how your funds will be used by AdeGrange Child Foundation.
            </label>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4 leading-relaxed">
          🔒 SSL encrypted &nbsp;&middot;&nbsp; Stripe &amp; Paystack &nbsp;&middot;&nbsp; Cancel anytime
        </p>

      </div>
    </div>
  )
}
