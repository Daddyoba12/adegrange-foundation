'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const leaders = [
  {
    slug: 'obehi-ilenikhena',
    name: 'Obehi Ilenikhena',
    title: 'Director of Programming',
    image: '/images/staffs/Obehi Ilenikhena.jpg',
    bio: 'Public health professional specialising in environmental and global health systems, HIV prevention, and community empowerment.'
  },
  {
    slug: 'blessing-nwachukwu',
    name: 'Blessing Nwachukwu',
    title: 'Director of Development & Communications',
    image: '/images/staffs/Blessing Nwachukwu.png',
    bio: 'Registered Nurse and Public Health specialist focused on healthcare equity, AI-driven access expansion and underserved community advocacy.'
  },
  {
    slug: 'deborah-daka',
    name: 'Deborah Daka',
    title: 'Director of Finance',
    image: '/images/staffs/Deborah Daka.png',
    bio: 'MBA/MPH professional dedicated to healthcare administration, financial governance and youth empowerment.'
  }
]

function LeadershipContent({
  onSelectPerson
}: {
  onSelectPerson?: (person: any) => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromSlug = searchParams.get('from')

  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [badgeVisible, setBadgeVisible] = useState(false)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!fromSlug) return
    setHighlighted(fromSlug)
    setBadgeVisible(true)

    const scrollTimer = setTimeout(() => {
      cardRefs.current[fromSlug]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)

    const fadeTimer = setTimeout(() => {
      setBadgeVisible(false)
      setTimeout(() => setHighlighted(null), 500)
    }, 2500)

    return () => {
      clearTimeout(scrollTimer)
      clearTimeout(fadeTimer)
    }
  }, [fromSlug])

  function handleCardClick(leader: typeof leaders[number]) {
    if (onSelectPerson) {
      onSelectPerson(leader)
    } else {
      router.push(`/leadership/${leader.slug}`)
    }
  }

  return (
    <section
      id="leadership"
      className="py-16 sm:py-20 lg:py-28 bg-gray-50 dark:bg-gray-950 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
            Our People
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Leadership Team
          </h2>
          <p className="text-sm sm:text-base max-w-2xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
            Dedicated professionals driving our mission to protect women and children across Africa.
          </p>
        </div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {leaders.map((leader, index) => {
            const isHighlighted = highlighted === leader.slug
            return (
              <div
                key={index}
                id={leader.slug}
                ref={el => { cardRefs.current[leader.slug] = el }}
                onClick={() => handleCardClick(leader)}
                

className="group relative cursor-pointer rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-950 shadow-md hover:shadow-xl transition-all duration-300 active:scale-[0.98] active:shadow-md"


                style={{
                  outline: isHighlighted ? '3px solid #ec4899' : '3px solid transparent',
                  outlineOffset: '3px',
                  transition: 'outline-color 0.5s ease, box-shadow 0.3s, transform 0.15s',
                }}
              >
                {/* Last viewed badge */}
                <div
                  aria-hidden={!isHighlighted}
                  className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-600 text-white shadow-md pointer-events-none transition-opacity duration-500"
                  style={{ opacity: badgeVisible && isHighlighted ? 1 : 0 }}
                >
                  Last viewed
                </div>

                {/* Portrait image */}
                <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={leader.image}
                    alt={`Portrait of ${leader.name}`}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Card content */}
                <div className="p-5 sm:p-6 lg:p-7 text-center">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-pink-600 font-semibold tracking-wide mb-3 leading-snug">
                    {leader.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-5">
                    {leader.bio}
                  </p>

                  {/* CTA */}
                  {onSelectPerson ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 group-hover:text-pink-500 transition-colors">
                      View Details
                      <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  ) : (
                    <Link
                      href={`/leadership/${leader.slug}`}
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600 hover:text-pink-500 transition-colors"
                    >
                      View Profile
                      <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default function LeadershipSection({
  onSelectPerson
}: {
  onSelectPerson?: (person: any) => void
}) {
  return (
    <Suspense fallback={
      <section className="py-16 sm:py-28 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto animate-pulse mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse h-96" />
            ))}
          </div>
        </div>
      </section>
    }>
      <LeadershipContent onSelectPerson={onSelectPerson} />
    </Suspense>
  )
}
