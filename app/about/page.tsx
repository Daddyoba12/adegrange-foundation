"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* HERO */}
       <section className="relative h-[65vh] flex items-center justify-center text-center overflow-hidden">

  <Image
    src="/images/about-hero.jpg"
    alt="Community outreach"
    fill
    priority
    className="object-cover brightness-105 contrast-110"
  />

  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="relative z-10 max-w-3xl px-6 text-white"
  >
    <h1 className="text-5xl font-bold mb-6">
      About AdeGrange Child Foundation
    </h1>

    <p className="text-lg text-white/90">
      Advancing maternal and child health through sustainable community development.
    </p>
  </motion.div>

</section>
      {/* INTRO */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
          <p>
            Established in 2009, AdeGrange Child Foundation is a mission-driven
            organization committed to improving maternal and child health
            outcomes across Africa.
          </p>

          <p>
            We confront the deeply rooted challenges of poverty, limited
            healthcare access, and systemic inequities that contribute to
            preventable child mortality.
          </p>
        </div>
      </section>

      {/* STRATEGIC PILLARS */}
      <section className="py-24 px-6 border-t">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold">Our Strategic Pillars</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto text-center">
          <div>
            <h3 className="font-semibold text-xl mb-4">Maternal Health</h3>
            <p className="text-sm">
              Improving prenatal care and safe delivery systems.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Child Survival</h3>
            <p className="text-sm">
              Reducing preventable child mortality through intervention programs.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Education</h3>
            <p className="text-sm">
              Promoting early childhood education and awareness.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Community Empowerment</h3>
            <p className="text-sm">
              Strengthening grassroots leadership and partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* SPLIT SECTION */}
      <section className="py-24 px-6 border-t">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1920"
              alt="Community outreach"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">
              Building Sustainable Impact
            </h2>

            <p className="leading-relaxed">
              Our approach integrates healthcare access, community engagement,
              and policy advocacy to create measurable and sustainable impact.
            </p>

            <p className="leading-relaxed">
              Through partnerships with local and international stakeholders,
              we ensure accountability, transparency, and long-term
              transformation.
            </p>
          </div>

        </div>
      </section>

      {/* IMPACT BAND */}
      <section className="py-20 border-t text-center">
        <div className="max-w-4xl mx-auto">
          <blockquote className="text-2xl italic">
            “Healthy mothers raise healthy nations.”
          </blockquote>
        </div>
      </section>

    </div>
  )
}