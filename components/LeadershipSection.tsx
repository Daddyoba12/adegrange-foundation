"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

const leaders = [
  {
    slug: "obehi-ilenikhena",
    name: "Obehi Ilenikhena",
    title: "Director of Programming",
    image: "/images/staffs/Obehi Ilenikhena.jpg",
    bio: "Public health professional specialising in environmental and global health systems, HIV prevention, and community empowerment."
  },
  {
    slug: "blessing-nwachukwu",
    name: "Blessing Nwachukwu",
    title: "Director of Development & Communications",
    image: "/images/staffs/Blessing Nwachukwu.png",
    bio: "Registered Nurse and Public Health specialist focused on healthcare equity, AI-driven access expansion and underserved community advocacy."
  },
  {
    slug: "deborah-daka",
    name: "Deborah Daka",
    title: "Director of Finance",
    image: "/images/staffs/Deborah Daka.png",
    bio: "MBA/MPH professional dedicated to healthcare administration, financial governance and youth empowerment."
  }
]

export default function LeadershipSection() {
  const router = useRouter()

  // ── Last-viewed highlight ────────────────────────────────────────────────
  const searchParams = useSearchParams()
  const fromSlug = searchParams.get("from")
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [badgeVisible, setBadgeVisible] = useState(false)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!fromSlug) return

    setHighlighted(fromSlug)
    setBadgeVisible(true)

    // Scroll the card into view after a brief paint delay
    const scrollTimer = setTimeout(() => {
      const card = cardRefs.current[fromSlug]
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 300)

    // Start fading the badge at 2.5 s
    const fadeTimer = setTimeout(() => {
      setBadgeVisible(false)
      // Remove ring after the CSS opacity transition finishes (500 ms)
      setTimeout(() => setHighlighted(null), 500)
    }, 2500)

    return () => {
      clearTimeout(scrollTimer)
      clearTimeout(fadeTimer)
    }
  }, [fromSlug])
  // ────────────────────────────────────────────────────────────────────────

  return (
    <section id="leadership" className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
            Our People
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Leadership Team
          </h2>
          <p className="text-sm sm:text-base max-w-2xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
            Dedicated professionals driving our mission to protect women and children across Africa.
          </p>
        </div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {leaders.map((leader, index) => {
            const isHighlighted = highlighted === leader.slug
            return (
              <div
                key={index}
                id={leader.slug}
                ref={(el) => { cardRefs.current[leader.slug] = el }}
                onClick={() => router.push(`/leadership/${leader.slug}`)}
                className="group cursor-pointer rounded-2xl overflow-hidden
                           bg-white dark:bg-gray-900
                           shadow-lg hover:shadow-2xl
                           transition-all duration-300
                           hover:-translate-y-2 hover:scale-[1.01]
                           relative"
                style={{
                  outline: isHighlighted ? "3px solid #ec4899" : "3px solid transparent",
                  outlineOffset: "3px",
                  transition: "outline-color 0.5s ease, box-shadow 0.3s, transform 0.3s",
                }}
              >
                {/* Last viewed badge */}
                <div
                  aria-hidden={!isHighlighted}
                  className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold
                             bg-pink-600 text-white shadow-md pointer-events-none
                             transition-opacity duration-500"
                  style={{ opacity: badgeVisible && isHighlighted ? 1 : 0 }}
                >
                  Last viewed
                </div>

                {/* Portrait — tall ratio so image leads */}
                <div
                  className="relative w-full bg-gray-100 dark:bg-gray-800 overflow-hidden"
                  style={{ paddingBottom: '120%' }}
                >
                  <Image
                    src={leader.image}
                    alt={`Portrait of ${leader.name}`}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Always-visible depth overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide mb-3">
                    {leader.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 mb-5">
                    {leader.bio}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 group-hover:text-pink-500 transition-all">
                    View Profile
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>

    </section>
  )
}
