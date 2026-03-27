"use client"

import { useState } from "react"

const faqs = [
  {
    question: "What is AdeGrange Child Foundation?",
    answer:
      "AdeGrange Child Foundation is a mission-driven organisation established in 2009, committed to improving maternal and child health outcomes across Africa through community development, education, and strategic partnerships."
  },
  {
    question: "How can I support the Foundation?",
    answer:
      "You can support us by donating, volunteering, or partnering with us on community programmes. Visit our Contact page to get in touch and learn more about collaboration opportunities."
  },
  {
    question: "How do I view a specific program?",
    answer:
      "Head to the Programs page from the navigation menu. Each program card has a 'View Program' button that opens the full detail page including photos, reports, and impact information."
  },
  {
    question: "How do I open the photo gallery?",
    answer:
      "On the Programs page, click 'Open Gallery' on any program card. You can browse photos, documents and videos for each program."
  },
  {
    question: "How do I contact the Foundation?",
    answer:
      "Use the Contact page accessible from the navigation menu. Fill in your name, email and message and we will respond within 2 business days."
  },
  {
    question: "Is my information kept private?",
    answer:
      "Yes. Any information you submit via our contact form is used solely to respond to your enquiry and is never shared with third parties."
  },
  {
    question: "How do I switch between light and dark mode?",
    answer:
      "Use the sun/moon icon in the top right corner of the navigation bar. On mobile it sits next to the menu icon. Your preference is saved automatically."
  },
  {
    question: "Where is the Foundation based?",
    answer:
      "AdeGrange Child Foundation operates across the United Kingdom and Nigeria, with programmes extending to the United States and other international locations."
  }
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform duration-200
                          border-gray-400 dark:border-gray-600
                          ${open ? "rotate-45 border-pink-600 dark:border-pink-500" : ""}`}>
          <svg className={`w-2.5 h-2.5 transition-colors ${open ? "text-pink-600 dark:text-pink-500" : "text-gray-400"}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16M4 12h16" />
          </svg>
        </span>
      </button>

      {/* Answer — animated open/close */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out
                       ${open ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600">
            Support
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Help Centre
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Find answers to common questions about AdeGrange Child Foundation,
            our programmes, and how to get involved.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="mb-14 sm:mb-20">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Still need help CTA */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800
                        bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-600 mb-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Still need help?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Our team is happy to assist. Send us a message and we will get back to you within 2 business days.
          </p>
          <a
            href="/contact"
            className="inline-block mt-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                       bg-pink-600 hover:bg-pink-700 active:scale-95 text-white shadow-sm"
          >
            Contact Us
          </a>
        </div>

      </div>
    </div>
  )
}
