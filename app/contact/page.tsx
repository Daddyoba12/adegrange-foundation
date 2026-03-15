"use client"

import { useState } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setForm({ name: "", email: "", message: "" })
    }, 600)
  }

  return (
    <div className="contact-page min-h-screen py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-10 sm:space-y-14">

        {/* Header */}
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600">
            Get In Touch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Contact Us
          </h1>
          <p className="contact-sub text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            For partnerships, media inquiries, or programme collaborations,
            please complete the form below and we will be in touch shortly.
          </p>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="text-center py-12 sm:py-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="success-title text-xl sm:text-2xl font-semibold">
              Message Sent
            </h2>
            <p className="success-body text-sm sm:text-base">
              Thank you for reaching out. We will respond within 2 business days.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm text-pink-600 hover:text-pink-500 underline underline-offset-4 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Your full name"
                className="w-full border rounded-xl px-4 py-3 text-base transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full border rounded-xl px-4 py-3 text-base transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-widest">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
                className="w-full border rounded-xl px-4 py-3 text-base transition resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200
                         bg-pink-600 hover:bg-pink-700 active:scale-95 text-white shadow-sm
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : "Submit Message"}
            </button>

          </form>
        )}

        {/* Contact details */}
        <div className="contact-divider border-t pt-8 sm:pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="contact-detail-label text-xs font-semibold uppercase tracking-widest mb-1">
                Email
              </p>
              <a
                href="mailto:info@adegrangefoundation.org"
                className="contact-detail-value hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                info@adegrangefoundation.org
              </a>
            </div>
            <div>
              <p className="contact-detail-label text-xs font-semibold uppercase tracking-widest mb-1">
                Based In
              </p>
              <p className="contact-detail-value">
                United Kingdom &amp; Nigeria
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
