"use client"

import { useState } from "react"
import { supabase } from '@/lib/supabase'

const COUNTRY_CODES = [
  { code: '+1',   label: 'US/CA (+1)' },
  { code: '+44',  label: 'UK (+44)' },
  { code: '+234', label: 'Nigeria (+234)' },
  { code: '+27',  label: 'South Africa (+27)' },
  { code: '+233', label: 'Ghana (+233)' },
  { code: '+254', label: 'Kenya (+254)' },
  { code: '+49',  label: 'Germany (+49)' },
  { code: '+33',  label: 'France (+33)' },
  { code: '+61',  label: 'Australia (+61)' },
  { code: '+91',  label: 'India (+91)' },
]

interface FormState {
  name: string
  email: string
  countryCode: string
  phone: string
  message: string
}

interface Errors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    message: '',
  })
  const [errors, setErrors]           = useState<Errors>({})
  const [submitted, setSubmitted]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [serverError, setServerError] = useState('')

  /* ── Validation ── */
  function validate(): boolean {
    const e: Errors = {}

    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Please enter your full name.'

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.'

    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 15)
      e.phone = 'Please enter a valid phone number.'

    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters.'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Field change ── */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof Errors])
      setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  /* ── Submit — saves to Supabase ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)

    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name:    form.name.trim(),
        email:   form.email.trim(),
        phone:   `${form.countryCode} ${form.phone.trim()}`,
        message: form.message.trim(),
      })

    if (dbError) {
      setServerError('Failed to send message. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
    setForm({ name: '', email: '', countryCode: '+1', phone: '', message: '' })
  }

  /* ── Input class helper ── */
  const inputClass = (field: keyof Errors) =>
    `w-full border rounded-xl px-4 py-3 text-base transition
     bg-white dark:bg-gray-900
     text-gray-900 dark:text-white
     placeholder-gray-400 dark:placeholder-gray-600
     focus:outline-none focus:ring-2 focus:border-transparent
     ${errors[field]
       ? 'border-red-400 dark:border-red-600 focus:ring-red-400'
       : 'border-gray-300 dark:border-gray-700 focus:ring-pink-500'
     }`

  /* ── Render ── */
  return (
    <div className="contact-page min-h-screen py-16 sm:py-24 px-4 sm:px-6
                    bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto space-y-10 sm:space-y-14">

        {/* Header */}
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600">
            Get In Touch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight
                         text-gray-900 dark:text-white">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed
                        text-gray-500 dark:text-gray-400">
            For partnerships, media inquiries, or programme collaborations,
            complete the form below and we will be in touch shortly.
          </p>
        </div>

        {/* ── Success state ── */}
        {submitted ? (
          <div className="text-center py-12 sm:py-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
                            bg-green-100 dark:bg-green-900/30 mb-2">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Message Sent
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Thank you for reaching out. We will respond within 2 business days.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setForm({ name: '', email: '', countryCode: '+1', phone: '', message: '' })
              }}
              className="mt-2 text-sm text-pink-600 hover:text-pink-500
                         underline underline-offset-4 transition-colors"
            >
              Send another message
            </button>
          </div>

        ) : (

          /* ── Form ── */
          <form onSubmit={handleSubmit} noValidate
                className="space-y-6 sm:space-y-8">

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name"
                     className="block text-xs font-semibold uppercase tracking-widest
                                text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <input id="name" type="text" name="name"
                     value={form.name} onChange={handleChange}
                     autoComplete="name" placeholder="Your full name"
                     className={inputClass('name')} />
              {errors.name &&
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email"
                     className="block text-xs font-semibold uppercase tracking-widest
                                text-gray-500 dark:text-gray-400">
                Email Address
              </label>
              <input id="email" type="email" name="email"
                     value={form.email} onChange={handleChange}
                     autoComplete="email" placeholder="your@email.com"
                     className={inputClass('email')} />
              {errors.email &&
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone + country code */}
            <div className="space-y-2">
              <label htmlFor="phone"
                     className="block text-xs font-semibold uppercase tracking-widest
                                text-gray-500 dark:text-gray-400">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className="flex-shrink-0 border rounded-xl px-3 py-3 text-base
                             border-gray-300 dark:border-gray-700
                             bg-white dark:bg-gray-900
                             text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-pink-500
                             focus:border-transparent"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input
                  id="phone" type="tel" name="phone"
                  value={form.phone} onChange={handleChange}
                  autoComplete="tel" placeholder="8012345678"
                  className={`flex-1 ${inputClass('phone')}`}
                />
              </div>
              {errors.phone &&
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message"
                     className="block text-xs font-semibold uppercase tracking-widest
                                text-gray-500 dark:text-gray-400">
                Message
              </label>
              <textarea
                id="message" name="message" rows={6}
                value={form.message} onChange={handleChange}
                placeholder="How can we help you?"
                className={`resize-none ${inputClass('message')}`}
              />
              {errors.message &&
                <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="flex items-start gap-2 p-3 rounded-xl text-sm
                              bg-red-50 dark:bg-red-900/20
                              border border-red-200 dark:border-red-800
                              text-red-700 dark:text-red-400">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {serverError}
              </div>
            )}

            {/* Privacy note */}
            <p className="text-xs text-gray-400 dark:text-gray-600 leading-relaxed">
              By submitting this form you agree to our{' '}
              <a href="/privacy"
                 className="underline hover:text-pink-600 transition-colors">
                Privacy Policy
              </a>
              . Your data will only be used to respond to your enquiry.
            </p>

            {/* Submit button */}
            <button
              type="submit" disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl
                         text-sm sm:text-base font-semibold
                         transition-all duration-200 active:scale-95
                         bg-pink-600 hover:bg-pink-700 text-white shadow-sm
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : 'Submit Message'}
            </button>

          </form>
        )}

        {/* Contact details */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest
                            text-gray-400 dark:text-gray-500 mb-1">
                Email
              </p>
              <a href="mailto:info@adegrangefoundation.org"
                 className="text-gray-700 dark:text-gray-300
                            hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                info@adegrangefoundation.org
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest
                            text-gray-400 dark:text-gray-500 mb-1">
                Based In
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                United States of America &amp; Nigeria
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
