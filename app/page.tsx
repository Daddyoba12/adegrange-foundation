"use client"

import { motion } from "framer-motion"
import Link from "next/link"

/* ============================================================
   COUNTER COMPONENT
============================================================ */
function Counter({ number, label, prefix = "" }: {
  number: string | number
  label: string
  prefix?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-1 text-center"
    >
      <p className="text-3xl sm:text-4xl font-bold text-pink-600">
        {prefix}{typeof number === "number" ? number.toLocaleString() : number}+
      </p>
      <p className="counter-label text-xs sm:text-sm font-medium uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  )
}

/* ============================================================
   STAT BADGE (inline impact row)
============================================================ */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-4 sm:px-6 py-4 sm:py-5 rounded-2xl
                    bg-white/10 backdrop-blur-sm border border-white/20">
      <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
      <p className="text-xs sm:text-sm text-white/70 mt-1">{label}</p>
    </div>
  )
}

/* ============================================================
   HOME PAGE
============================================================ */
export default function Home() {
  return (
    <main className="overflow-hidden">

      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="relative min-h-[100svh] flex items-center justify-center text-center px-4 sm:px-6">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1920')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white max-w-4xl w-full"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-pink-400 mb-4 sm:mb-6"
          >
            AdeGrange Child Foundation
          </motion.p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6">
            Empowering Mothers.
            <br />
            <span className="text-pink-400">Protecting Children.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            AdeGrange Child Foundation is committed to reducing maternal and
            child mortality and strengthening communities across Africa.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center px-4 xs:px-0">
            <a
              href="/donate"
              className="px-7 sm:px-8 py-3 sm:py-3.5 bg-pink-600 hover:bg-pink-700 active:scale-95
                         text-white font-semibold rounded-xl shadow-lg transition-all duration-200
                         text-sm sm:text-base"
            >
              Donate Now
            </a>
            <a
              href="/about"
              className="px-7 sm:px-8 py-3 sm:py-3.5 border-2 border-white/60 hover:border-white
                         hover:bg-white hover:text-black active:scale-95
                         text-white font-semibold rounded-xl transition-all duration-200
                         text-sm sm:text-base"
            >
              Learn More
            </a>
            <Link
              href="/programs"
              className="px-7 sm:px-8 py-3 sm:py-3.5 border-2 border-pink-500/60 hover:border-pink-400
                         hover:bg-pink-600 active:scale-95
                         text-pink-300 hover:text-white font-semibold rounded-xl transition-all duration-200
                         text-sm sm:text-base"
            >
              Our Programs
            </Link>
          </div>

          {/* Inline stat badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16 max-w-2xl mx-auto"
          >
            <StatBadge value="15+"     label="Years of Impact" />
            <StatBadge value="10,000+" label="Children Reached" />
            <StatBadge value="4"       label="Strategic Pillars" />
            <StatBadge value="2009"    label="Est." />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>

      </section>

      {/* ======================================================
          IMPACT NUMBERS BAND
      ====================================================== */}
      <section className="impact-section py-14 sm:py-20 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-pink-600 mb-8 sm:mb-12">
            Our Impact At A Glance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            <Counter number={15}    label="Years of Impact" />
            <Counter number={10000} label="Children Reached" />
            <Counter number={4}     label="Strategic Pillars" />
            <Counter number={2009}  label="Est. Year" prefix="" />
          </div>
        </div>
      </section>

      {/* ======================================================
          MISSION BLOCK
      ====================================================== */}
      <section className="mission-section py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-4"
          >
            Our Mission
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mission-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight"
          >
            Advancing Maternal &amp; Child Health Across Africa
          </motion.h2>

          <p className="mission-body text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Through community engagement, health advocacy, leadership development,
            and strategic partnerships, AdeGrange Child Foundation strengthens
            systems that protect women and children and build resilient futures.
          </p>

          {/* Partner CTA */}
          <div className="mt-8 sm:mt-10 flex flex-col xs:flex-row gap-3 justify-center">
            <Link
              href="/programs"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                         bg-pink-600 hover:bg-pink-700 active:scale-95 text-white shadow-sm"
            >
              Explore Programs
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200
                         border-gray-300 dark:border-gray-700
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          PARALLAX IMAGE BLOCK
      ====================================================== */}
      <section
        className="relative h-[45vh] sm:h-[55vh] bg-cover bg-center bg-fixed
                   flex items-center justify-center text-white px-4 sm:px-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 bg-black/50 backdrop-blur-sm
                     p-6 sm:p-10 md:p-12 rounded-2xl
                     max-w-xs sm:max-w-lg md:max-w-2xl
                     text-center shadow-2xl border border-white/10 w-full"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-400 mb-3">
            Our Vision
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-white leading-tight">
            Building Healthier Futures
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            From grassroots advocacy to national policy influence,
            our mission reaches the farthest communities.
          </p>
        </motion.div>
      </section>

      {/* ======================================================
          TEAM TEASER
      ====================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
              Our People
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Led by Experts. Driven by Purpose.
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-7">
              Our leadership team brings together decades of experience in public health,
              governance, and community development across Africa and beyond.
            </p>
            <Link
              href="/about#leadership"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-500 transition-colors"
            >
              Meet Our Leadership Team
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          BOTTOM CTA BAND
      ====================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Ready to Make a Difference?
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Join us in our mission to protect women and children across Africa.
            Every contribution — big or small — creates lasting change.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center pt-2">
            <a
              href="/donate"
              className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200
                         bg-pink-600 hover:bg-pink-700 active:scale-95 text-white shadow-sm"
            >
              Donate Today
            </a>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold border transition-all duration-200
                         border-gray-300 dark:border-gray-700
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
