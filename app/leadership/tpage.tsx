"use client"

import { useState } from "react"
import Image from "next/image"

const leaders = [
  {
    name: "Obehi Ilenikhena",
    title: "Director of Programming",
    image: "/images/staffs/Obehi Ilenikhena.jpg",
    bio: "Public health professional specializing in environmental and global health systems, HIV prevention, and community empowerment."
  },
  {
    name: "Blessing Nwachukwu",
    title: "Director of Development & Communications",
    image: "/images/staffs/Blessing Nwachukwu.png",
    bio: "Registered Nurse and Public Health specialist focused on healthcare equity, AI-driven access expansion and underserved community advocacy."
  },
  {
    name: "Deborah Daka",
    title: "Director of Finance",
    image: "/images/staffs/Deborah Daka.png",
    bio: "MBA/MPH professional dedicated to healthcare administration, financial governance and youth empowerment."
  },
  {
    name: "Foyinsola Bankole",
    title: "Project Officer",
    image: "/images/staffs/Foyinsola Bankole.jpeg",
    bio: "International public speaker and development strategist  years experience in youth development and governance."
  }
]

export default function LeadershipSection() {
  const [selected, setSelected] = useState<any>(null)

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">Leadership Team</h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6">

        {leaders.map((leader, index) => (
          <div
            key={index}
            onClick={() => setSelected(leader)}
            className="cursor-pointer bg-white dark:bg-zinc-800 shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-64 w-full">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                className="object-cover object-top"
              />
            </div>

            <div className="p-4 text-center">
              <h3 className="font-semibold">{leader.name}</h3>
              <p className="text-pink-600 text-sm">{leader.title}</p>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 w-full">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover object-top"
              />
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">
                {selected.name}
              </h3>
              <p className="text-pink-600 mb-4">
                {selected.title}
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {selected.bio}
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}