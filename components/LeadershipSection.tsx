"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

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
  const [selected, setSelected] = useState<any>(null)

  return (
    <section className="leadership-section py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600 mb-3">
            Our People
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold leadership-heading">
            Leadership Team
          </h2>
          <p className="mt-4 text-sm sm:text-base max-w-xl mx-auto leadership-sub">
            Dedicated professionals driving our mission to protect women and children across Africa.
          </p>
        </div>

        {/* 3 cards — centred on all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {leaders.map((leader, index) => (
            <div
              key={index}
              className="leader-card group w-full rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => setSelected(leader)}
            >
              {/* Photo */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card body */}
              <div className="p-5 text-center">
                <h3 className="font-bold text-base sm:text-lg leader-name">
                  {leader.name}
                </h3>
                <p className="text-pink-600 text-xs sm:text-sm mt-1 font-medium">
                  {leader.title}
                </p>
                <p className="leader-bio text-xs sm:text-sm mt-3 leading-relaxed line-clamp-3">
                  {leader.bio}
                </p>

                {/* View profile link */}
                <Link
                  href={`/leadership/${leader.slug}`}
                  onClick={e => e.stopPropagation()}
                  className="inline-block mt-4 text-xs font-semibold tracking-wide uppercase text-pink-600 hover:text-pink-500 border-b border-pink-600 hover:border-pink-500 transition-colors pb-0.5"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal image */}
            <div className="relative h-56 sm:h-72 w-full">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>

            {/* Modal body */}
            <div className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold modal-name">
                {selected.name}
              </h3>
              <p className="text-pink-600 text-sm mt-1 mb-4 font-medium">
                {selected.title}
              </p>
              <p className="modal-bio text-sm sm:text-base leading-relaxed">
                {selected.bio}
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/leadership/${selected.slug}`}
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-pink-600 text-white hover:bg-pink-700"
                  onClick={() => setSelected(null)}
                >
                  Full Profile
                </Link>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200
                             border-gray-300 text-gray-700 hover:bg-gray-100
                             dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
