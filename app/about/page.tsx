"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import LeadershipSection from "@/components/LeadershipSection"

/* ── Fade-in wrapper ─────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[650px] max-h-[700px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/about-hero.jpg"
          alt="Community outreach"
          fill priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl px-4 sm:px-6 text-white"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-400 mb-3">
            Who We Are
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            About AdeGrange Child Foundation
          </h1>
          <p className="text-base sm:text-lg text-white/85 max-w-xl mx-auto">
            Advancing maternal and child health through sustainable community development.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. OUR STORY
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-4">
              Our Story
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Built on a Lifelong Commitment to Children
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-5">
              Established in 2009, AdeGrange Child Foundation is a mission-driven
              organisation committed to improving maternal and child health outcomes
              across Africa. We confront the deeply rooted challenges of poverty,
              limited healthcare access, and systemic inequities that contribute to
              preventable child mortality.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              From grassroots community dialogues in Lagos to national policy advocacy,
              we work at every level of the health system — equipping mothers with
              knowledge, strengthening communities with resources, and amplifying the
              voices of children who cannot yet speak for themselves.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. STRATEGIC PILLARS
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
                What We Stand For
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Our Strategic Pillars
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { title: "Maternal Health",       body: "Improving prenatal care and safe delivery systems across underserved communities.", icon: "🤱" },
              { title: "Child Survival",        body: "Reducing preventable child mortality through targeted intervention programmes.", icon: "👶" },
              { title: "Education",             body: "Promoting early childhood education, literacy, and learning awareness.", icon: "📚" },
              { title: "Community Empowerment", body: "Strengthening grassroots leadership, partnerships and self-sufficiency.", icon: "🤝" },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center px-4 py-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900 dark:text-white">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{pillar.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. FOUNDER
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
              Our Founder
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">

            {/* Portrait */}
            <Reveal>
              <div className="relative w-full max-w-sm mx-auto lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/founder.jpg"
                  alt="Professor Adenike Grange"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>

            {/* Bio */}
            <Reveal delay={0.15}>
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    Professor Adenike Grange
                  </h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Founder &amp; President · MBChB; DCH; FMCPAED; FWACP; FAAP
                  </p>
                  <div className="w-14 h-0.5 bg-pink-600 mt-4" />
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Distinguished paediatrician, medical educator, and Nigeria's first
                  female Minister of Health — with over four decades of leadership in
                  clinical medicine, academic reform, and national health governance.
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  Professor Grange has served as consultant to WHO, UNICEF, and USAID,
                  authored over sixty peer-reviewed publications, and championed the
                  creation of Nigeria's Department of Family Health. She currently
                  serves as Chairperson of the Board of Trustees of NUHCAN.
                </p>
                <blockquote className="border-l-4 border-pink-500 pl-5 italic text-gray-700 dark:text-gray-300">
                  "The health of a nation begins with the health of its mothers and children."
                </blockquote>
                <Link
                  href="/founder"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-500 transition-colors"
                >
                  Read full biography
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. LEADERSHIP TEAM
      ══════════════════════════════════════════════════════ */}
      <Suspense>
        <LeadershipSection />
      </Suspense>

      {/* ══════════════════════════════════════════════════════
          6. TRUST & GOVERNANCE
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
                Accountability &amp; Trust
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Governance &amp; Transparency
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                We are committed to the highest standards of organisational integrity,
                financial transparency, and accountability to our donors, partners,
                and the communities we serve.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Registered Organisation",
                body: "Formally registered in Nigeria and the United States of America, operating under applicable non-profit governance frameworks.",
                icon: "🏛️",
              },
              {
                title: "Financial Transparency",
                body: "Annual financial reports are prepared and reviewed to ensure responsible stewardship of all donations and grants received.",
                icon: "📊",
              },
              {
                title: "Independent Board",
                body: "An independent Board of Trustees provides strategic oversight, ensuring the foundation remains mission-focused and accountable.",
                icon: "✅",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Whether you donate, partner with us, or spread the word — every action
              moves us closer to a world where every child survives and thrives.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/donate"
                className="px-7 py-3 rounded-xl text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white transition-all duration-200 shadow-sm"
              >
                Donate Now
              </Link>
              <Link
                href="/partnerships"
                className="px-7 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
