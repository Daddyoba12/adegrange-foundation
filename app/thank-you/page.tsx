'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ThankYouContent() {
  const params    = useSearchParams()
  const ref       = params.get('ref')       ?? '—'
  const name      = params.get('name')      ?? 'Donor'
  const email     = params.get('email')     ?? ''
  const amount    = params.get('amount')    ?? ''
  const currency  = params.get('currency')  ?? ''
  const frequency = params.get('frequency') ?? 'once'

  const emailSent = useRef(false)

  useEffect(() => {
    if (emailSent.current || !email || ref === '—') return
    emailSent.current = true
    fetch('/api/send-thank-you', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, amount: parseFloat(amount) || 0, currency, frequency, donorRef: ref }),
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-lg text-center space-y-6">

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto">
          <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thank you, {name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Your generous donation is making a real difference for mothers and children across Africa.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-left space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Donation Summary
          </p>
          {[
            { label: 'Donor Reference', value: ref },
            ...(amount ? [{ label: 'Amount', value: `${currency} ${parseFloat(amount).toLocaleString()}` }] : []),
            { label: 'Frequency', value: frequency === 'monthly' ? 'Monthly' : 'One-time' },
            { label: 'Status', value: 'Confirmed ✓' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className={`text-sm font-semibold ${label === 'Status' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600">
          A confirmation email has been sent to <strong>{email || 'your email'}</strong>.
          Keep your reference <strong>{ref}</strong> for your records.
          You will receive a quarterly impact update from us.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/" className="px-6 py-3 rounded-xl text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white transition-all active:scale-95">
            Back to Home
          </Link>
          <Link href="/donate" className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95">
            Donate Again
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
