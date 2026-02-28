"use client"

import Image from "next/image"
import Link from "next/link"

const leaders = [
  {
    slug: "obehi-ilenikhena",
    name: "Obehi Ilenikhena",
    title: "Director of Programming",
    image: "/images/staffs/Obehi Ilenikhena.jpg",
  },
  {
    slug: "blessing-nwachukwu",
    name: "Blessing Nwachukwu",
    title: "Director of Development & Communications",
    image: "/images/staffs/Blessing Nwachukwu.png",
  },
  {
    slug: "deborah-daka",
    name: "Deborah Daka",
    title: "Director of Finance",
    image: "/images/staffs/Deborah Daka.png",
  },
  {
    slug: "foyinsola-bankole",
    name: "Foyinsola Bankole",
    title: "Director of Strategy",
    image: "/images/staffs/Foyinsola Bankole.jpeg",
  },
]

export default function LeadershipSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold">
          Leadership Team
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6 max-w-7xl mx-auto">

        {leaders.map((leader) => (
          <Link
            key={leader.slug}
            href={`/leadership/${leader.slug}`}
            className="group shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover object-[50%_30%] brightness-[0.95] saturate-[0.9]"
              />
            </div>

            <div className="p-6 text-center">
              <h3 className="font-semibold text-lg">
                {leader.name}
              </h3>
              <p className="text-pink-600 text-sm mt-2">
                {leader.title}
              </p>
            </div>
          </Link>
        ))}

      </div>
    </section>
  )
}