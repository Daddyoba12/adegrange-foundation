"use client"

import { motion } from "framer-motion"
import LeadershipSection from "@/components/LeadershipSection"

function Counter({ number, label }: { number: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      {/* Pink number — always visible */}
      <h3 className="text-3xl sm:text-4xl font-bold text-pink-500">
        {number.toLocaleString()}+
      </h3>
      {/* Label — force white in dark, gray in light via inline class */}
      <p className="counter-label text-sm sm:text-base">
        {label}
      </p>
    </motion.div>
  )
}

export default function Home() {
  return (
    <main className="overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] flex items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Empowering Mothers.
            <br className="hidden sm:block" />
            Protecting Children.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            AdeGrange Child Foundation is committed to reducing maternal and
            child mortality and strengthening communities across Africa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-lg font-semibold shadow-lg transition w-full sm:w-auto"
            >
              Donate Now
            </a>
            <a
              href="/about"
              className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition w-full sm:w-auto"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      {/* ================= IMPACT ================= */}
      <section className="impact-section py-20 text-center">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 px-6">
          <Counter number={15}    label="Years Impact" />
          <Counter number={10000} label="Children Reached" />
          <Counter number={4}     label="Strategic Pillars" />
          <Counter number={2009}  label="Founded" />
        </div>
      </section>

      {/* ================= MISSION BLOCK ================= */}
      <section className="mission-section py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mission-heading text-3xl sm:text-4xl font-bold mb-6"
          >
            Advancing Maternal &amp; Child Health Across Africa
          </motion.h2>

          <p className="mission-body max-w-3xl mx-auto text-lg leading-relaxed">
            Through community engagement, health advocacy, leadership development,
            and strategic partnerships, AdeGrange Child Foundation strengthens
            systems that protect women and children and build resilient futures.
          </p>
        </div>
      </section>

      {/* ================= PARALLAX STYLE BLOCK ================= */}
      <section
        className="h-[60vh] bg-cover bg-center flex items-center justify-center text-white px-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1920')",
        }}
      >
        <div className="bg-black/70 backdrop-blur-sm p-8 sm:p-12 rounded-xl max-w-2xl text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            Building Healthier Futures
          </h2>
          <p className="text-gray-200 leading-relaxed">
            From grassroots advocacy to national policy influence,
            our mission reaches the farthest communities.
          </p>
        </div>
      </section>

      {/* ================= LEADERSHIP ================= */}
      <LeadershipSection />

    </main>
  )
}
