"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* HERO */}
       <section className="relative h-[60vh] md:h-[65vh] lg:h-[650px] max-h-[700px] flex items-center justify-center text-center overflow-hidden">

  <Image
    src="/images/about-hero.jpg"
    alt="Community outreach"
    fill
    priority
    className="object-cover object-[center_30%] brightness-105 contrast-110"
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
    <section className="relative h-[75vh] w-full flex items-center justify-center overflow-hidden">

  {/* Blurred Background */}
  <Image
    src="/images/about-hero.jpg"
    alt=""
    fill
    className="object-cover blur-xl scale-110 opacity-40"
  />

  {/* Sharp Center Image */}
  <div className="relative z-10 h-[85%]">
    <Image
      src="/images/about-hero2.jpg"
      alt="Mother and Child"
      width={800}
      height={600}
      className="object-contain h-full w-auto"
    />
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