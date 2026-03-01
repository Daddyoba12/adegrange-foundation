"use client"

import { useState } from "react"

export default function ContactPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // For now just alert
    alert("Message submitted successfully.")
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <div className="min-h-screen py-28 px-6">

      <div className="max-w-3xl mx-auto space-y-16">

        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-semibold">
            Contact Us
          </h1>

          <p className="text-lg text-neutral-500">
            For partnerships, media inquiries, or program collaborations,
            please complete the form below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide opacity-60">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 rounded-lg bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide opacity-60">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 rounded-lg bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide opacity-60">
              Message
            </label>
            <textarea
              name="message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 rounded-lg bg-transparent"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
          >
            Submit Message
          </button>

        </form>

      </div>

    </div>
  )
}