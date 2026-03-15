"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* ================= HERO ================= */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[650px] max-h-[700px] flex items-center justify-center text-center overflow-hidden">

        <Image
          src="/images/about-hero.jpg"
          alt="Community outreach"
          fill
          priority
          className="object-cover object-[center_30%] brightness-105 contrast-110"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl px-4 sm:px-6 text-white"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            About AdeGrange Child Foundation
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            Advancing maternal and child health through sustainable community development.
          </p>
        </motion.div>

      </section>

      {/* ================= INTRO ================= */}
      <section className="py-14 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Established in 2009, AdeGrange Child Foundation is a mission-driven
            organisation committed to improving maternal and child health
            outcomes across Africa.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            We confront the deeply rooted challenges of poverty, limited
            healthcare access, and systemic inequities that contribute to
            preventable child mortality.
          </p>
        </div>
      </section>

      {/* ================= STRATEGIC PILLARS ================= */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
              What We Stand For
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Strategic Pillars
            </h2>
          </div>

          {/* 1 col mobile → 2 col tablet → 4 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">

            {[
              {
                title: "Maternal Health",
                body: "Improving prenatal care and safe delivery systems across underserved communities.",
                icon: "🤱"
              },
              {
                title: "Child Survival",
                body: "Reducing preventable child mortality through targeted intervention programmes.",
                icon: "👶"
              },
              {
                title: "Education",
                body: "Promoting early childhood education, literacy, and learning awareness.",
                icon: "📚"
              },
              {
                title: "Community Empowerment",
                body: "Strengthening grassroots leadership, partnerships and self-sufficiency.",
                icon: "🤝"
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center px-2 sm:px-4 py-6 sm:py-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
              >
                <div className="text-3xl sm:text-4xl mb-4">{pillar.icon}</div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {pillar.body}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= SPLIT / IMAGE SECTION ================= */}
      <section className="relative w-full overflow-hidden" style={{ height: 'clamp(280px, 55vw, 600px)' }}>

        {/* Blurred background */}
        <Image
          src="/images/about-hero.jpg"
          alt=""
          fill
          className="object-cover blur-xl scale-110 opacity-40"
          sizes="100vw"
          aria-hidden="true"
        />

        {/* Sharp centre image */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="relative h-[85%] w-full max-w-2xl">
            <Image
              src="/images/about-hero2.jpg"
              alt="Mother and Child"
              fill
              className="object-contain rounded-xl shadow-2xl"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>

      </section>

      {/* ================= IMPACT QUOTE ================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-4xl sm:text-5xl text-pink-600 leading-none">&ldquo;</span>
          <blockquote className="text-xl sm:text-2xl md:text-3xl italic font-medium text-gray-800 dark:text-gray-200 leading-relaxed mt-2">
            Healthy mothers raise healthy nations.
          </blockquote>
          <span className="text-4xl sm:text-5xl text-pink-600 leading-none">&rdquo;</span>
        </div>
      </section>

    </div>
  )
}
