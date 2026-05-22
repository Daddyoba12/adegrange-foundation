'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createClient } from '@supabase/supabase-js'

// Publishable key is safe to hardcode — it's intentionally public
const stripePromise = loadStripe('pk_live_51TVCtY3s25jG0fEU1RWbdTeO1M6C7rFGOg3FJoGKJ37BCICRez04kvuYJMGD5dGe58AIiuEkFHzF4r5lYjVsDrYh00GVuCQL1r')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

/* ─── Card form (inside Elements) ─── */
function CardForm({ name, email, phone, agreed, intentMode, donorRef, displayAmount, currency, frequency, onError, onSuccess }: {
  name: string; email: string; phone: string; agreed: boolean
  intentMode: 'payment' | 'setup'
  donorRef: string; displayAmount: number; currency: string; frequency: string
  onError: (m: string) => void; onSuccess: () => void
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)

  async function sendEmails(amount: number) {
    try {
      await fetch('/api/send-thank-you', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, amount, currency, frequency, donorRef }),
      })
    } catch { /* email failure must not block redirect */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    if (!name.trim() || !email.trim()) { onError('Please enter your name and email above.'); return }
    if (!agreed) { onError('Please tick the Terms & Conditions checkbox below.'); return }
    setBusy(true)
    onError('')

    const baseUrl = `${window.location.origin}/thank-you?ref=${encodeURIComponent(donorRef)}&name=${encodeURIComponent(name)}&currency=${currency}`

    try {
      if (intentMode === 'setup') {
        const { error, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${baseUrl}&amount=${displayAmount}`,
            payment_method_data: { billing_details: { name, email } },
          },
          redirect: 'if_required',
        })
        if (error) {
          onError(error.message ?? 'Setup failed — please check your card details.')
        } else if (setupIntent?.status === 'succeeded') {
          await sendEmails(displayAmount)
          window.location.href = `${baseUrl}&amount=${displayAmount}`
        }
      } else {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${baseUrl}&amount=${displayAmount}`,
            payment_method_data: { billing_details: { name, email } },
          },
          redirect: 'if_required',
        })
        if (error) {
          onError(error.message ?? 'Payment failed — please check your card details.')
        } else if (paymentIntent?.status === 'succeeded') {
          await sendEmails(paymentIntent.amount / 100)
          window.location.href = `${baseUrl}&amount=${paymentIntent.amount / 100}`
        }
      }
    } catch (err: any) {
      onError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || busy}
        className="w-full py-4 rounded-2xl font-semibold text-base bg-pink-600 hover:bg-pink-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {busy ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Processing...
          </span>
        ) : 'Confirm Donation'}
      </button>
    </form>
  )
}

/* ─── Main Page ─── */
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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentMode,   setIntentMode]   = useState<'payment' | 'setup'>('payment')
  const [secretLoading, setSecretLoading] = useState(false)
  const [donorRef] = useState(() => generateDonorRef())

  const sym  = currencies.find((c) => c.code === currency)?.symbol ?? '£'
  const rate = rates[currency] ?? 1
  const displayAmount = preset !== null ? Math.round(preset * rate) : parseFloat(custom) || 0

  useEffect(() => {
    const t = setTimeout(() => setProgress(Math.round((AMOUNT_RAISED / MONTHLY_GOAL) * 100)), 400)
    return () => clearTimeout(t)
  }, [])

  // Create PaymentIntent whenever amount/currency/frequency changes
  useEffect(() => {
    if (currency === 'NGN' || displayAmount <= 0) { setClientSecret(null); return }

    const timer = setTimeout(async () => {
      setSecretLoading(true)
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: displayAmount,
            currency,
            frequency,
            email: 'pending@pending.com',
            name: 'Pending',
            donorRef: generateDonorRef(),
          }),
        })
        const data = await res.json()
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
          setIntentMode(data.mode === 'setup' ? 'setup' : 'payment')
        }
      } catch {
        // silently fail — user will see error on submit
      } finally {
        setSecretLoading(false)
      }
    }, 500) // debounce 500ms

    return () => clearTimeout(timer)
  }, [displayAmount, currency, frequency])

  async function handlePaystack() {
    if (!name.trim() || !email.trim()) { setError('Please enter your name and email.'); return }
    if (displayAmount <= 0) { setError('Please select or enter a donation amount.'); return }
    if (!agreed) { setError('Please accept the Terms & Conditions.'); return }
    setError('')
    const ref = generateDonorRef()
    await supabase.from('donations').insert([{
      donor_ref: ref, name, email, phone: phone || undefined,
      amount: displayAmount, currency, frequency,
      payment_provider: 'paystack', status: 'pending',
    }])
    const PaystackPop = await loadPaystack()
    PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PK ?? '',
      email, amount: displayAmount * 100, currency: 'NGN', ref,
      callback: async () => {
        await supabase.from('donations').update({ status: 'completed' }).eq('donor_ref', ref)
        window.location.href = `/thank-you?ref=${ref}&name=${encodeURIComponent(name)}&amount=${displayAmount}&currency=${currency}`
      },
      onClose: () => {},
    })?.openIframe()
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Make a Donation</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AdeGrange Child Foundation — Protecting Mothers &amp; Children Across Africa</p>
        </div>

        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-semibold text-pink-600">${AMOUNT_RAISED.toLocaleString()} raised this month</span>
            <span>Goal: ${MONTHLY_GOAL.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-pink-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Frequency */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 overflow-hidden">
          <div className="p-4 sm:p-6">
            <SectionLabel>Frequency</SectionLabel>
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
            <SectionLabel>Amount</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
              {presetAmounts.map((p) => (
                <button key={p} onClick={() => { setPreset(p); setCustom('') }}
                  className={`py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${preset === p ? 'bg-pink-600 text-white' : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-400'}`}>
                  {sym}{Math.round(p * rate)}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none">{sym}</span>
              <input type="number" inputMode="numeric" placeholder="Other amount" value={custom}
                onChange={(e) => { setCustom(e.target.value); setPreset(null) }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <Divider />
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Total</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {sym}{displayAmount > 0 ? displayAmount.toLocaleString() : '0'}
                {frequency === 'monthly' && <span className="text-sm font-normal text-gray-400"> / mo</span>}
              </span>
            </div>
            {displayAmount > 0 && (
              <p className="text-xs text-pink-600 mt-1 text-right">
                {impactItems.slice().reverse().find(i => displayAmount >= Math.round(i.usd * rate))
                  ? `Your gift ${impactItems.slice().reverse().find(i => displayAmount >= Math.round(i.usd * rate))!.label}`
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
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Full Name</label>
                <input type="text" placeholder="Your full name" value={name} autoComplete="name" onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email Address</label>
                <input type="email" placeholder="your@email.com" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Phone <span className="opacity-60">(optional)</span></label>
              <input type="tel" placeholder="+44 7700 900000" value={phone} autoComplete="tel" onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 p-4 sm:p-6">
          <SectionLabel>Payment Details 🔒</SectionLabel>

          {currency === 'NGN' ? (
            <button onClick={handlePaystack}
              className="w-full py-4 rounded-2xl font-semibold text-base bg-pink-600 hover:bg-pink-700 text-white transition-all">
              Donate {sym}{displayAmount > 0 ? displayAmount.toLocaleString() : '0'} via Paystack
            </button>
          ) : displayAmount <= 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Select an amount above to enter card details.</p>
          ) : secretLoading ? (
            <div className="flex items-center justify-center gap-3 py-8 text-gray-400">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm">Loading payment form...</span>
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{
              clientSecret,
              appearance: { theme: 'stripe', variables: { colorPrimary: '#db2777', borderRadius: '12px' } },
            }}>
              <CardForm name={name} email={email} phone={phone} agreed={agreed} intentMode={intentMode} donorRef={donorRef} displayAmount={displayAmount} currency={currency} frequency={frequency} onError={setError} onSuccess={() => {}} />
            </Elements>
          ) : (
            <p className="text-sm text-red-400 text-center py-4">Could not load payment form. Please refresh and try again.</p>
          )}
        </div>

        {/* Terms */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl mb-4 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded accent-pink-600 cursor-pointer flex-shrink-0" />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer">
              By donating you agree to our{' '}
              <Link href="/terms" target="_blank" className="text-pink-600 hover:text-pink-500 underline font-medium">Terms &amp; Conditions</Link>
              {' '}and confirm how your funds will be used by AdeGrange Child Foundation.
            </label>
          </div>
        </div>

        {error && (
          <div className="flex gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-4">🔒 SSL encrypted · Stripe &amp; Paystack · Cancel anytime</p>

      </div>
    </div>
  )
}
