"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function PartnershipsPage() {
  return (
<main className="min-h-screen bg-gray-100 dark:bg-slate-900">

      {/* ================= HERO ================= */}
      <section className="py-16 sm:py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-pink-600 font-semibold mb-3">
              Partnerships
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Partner With AdeGrange
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-4 leading-relaxed">
              We collaborate with institutions, funders, and organisations
              to deliver scalable health education and community impact
              across Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= WHAT WE DO ================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-4"
        >
          <p className="text-xs uppercase tracking-widest text-pink-600 font-semibold">
            Our Work
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            What We Do
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            AdeGrange delivers community-based health education programmes
            focused on women and children. Our approach combines local engagement,
            peer-to-peer learning, and scalable delivery models to ensure
            sustainable impact.
          </p>
        </motion.div>
      </section>

      {/* ================= IMPACT MODEL ================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-pink-600 font-semibold mb-2">
            Your Contribution
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-gray-900 dark:text-white">
            Our Impact Model
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { amount: "$10",  text: "Educates 1 child for a month" },
              { amount: "$25",  text: "Supports 5 mothers with health resources" },
              { amount: "$50",  text: "Funds a community outreach session" },
              { amount: "$100", text: "Sustains a programme for 30 days" },
            ].map(({ amount, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-100 dark:bg-gray-800 p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <p className="text-3xl font-bold text-pink-600 mb-2">{amount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY PARTNER ================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-pink-600 font-semibold mb-2">
            The Case For Partnership
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-gray-900 dark:text-white">
            Why Partner With Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left sm:text-center">
            {[
              {
                title: "Scalable Model",
                body: "Designed to expand across multiple communities efficiently and sustainably.",
                icon: "📈"
              },
              {
                title: "Measurable Impact",
                body: "Clear tracking of outcomes and programme effectiveness at every stage.",
                icon: "📊"
              },
              {
                title: "Community Driven",
                body: "Built with and for the communities we serve — not imposed from the outside.",
                icon: "🤝"
              },
            ].map(({ title, body, icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 p-5 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              >
                <span className="text-3xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                    {title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FUNDING ================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-5"
        >
          <p className="text-xs uppercase tracking-widest text-pink-600 font-semibold">
            Opportunities
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Funding Opportunities
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            We are actively seeking funding and strategic partnerships to expand
            our programmes, increase reach, and strengthen our impact delivery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mt-4">
            {[
              "Community outreach expansion",
              "Maternal health programmes",
              "Digital platform development",
              "Monitoring & evaluation systems",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="w-2 h-2 rounded-full bg-pink-600 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto space-y-5"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Start a Conversation
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            If you are interested in partnering or funding our work,
            we would be happy to discuss opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 text-center"
            >
              Contact Us
            </Link>
            <Link
              href="/programs"
              className="w-full sm:w-auto px-8 py-3.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 text-center"
            >
              View Our Programs
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}