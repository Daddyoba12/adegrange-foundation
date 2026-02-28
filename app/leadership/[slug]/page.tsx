import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import ProfileLayout from "../../../components/ProfileLayout"

const leaders: any = {
  "obehi-ilenikhena": {
    name: "Obehi Ilenikhena",
    title: "Director of Programming",
    image: "/images/staffs/Obehi Ilenikhena.jpg",
    bio: `
Obehi “O” Ilenikhena is a public health professional and development advocate focused on strengthening health systems and empowering vulnerable communities.

She currently serves as the State Lead Project Coordinator for HIV Home Test Kit distribution and oversees strategic public health engagement initiatives.

Obehi holds a Master of Public Health (MPH) with specialization in Environmental and Global Health, with expertise in Water Quality.
    `,
  },

  "blessing-nwachukwu": {
    name: "Blessing Nwachukwu",
    title: "Director of Development & Communications",
    image: "/images/staffs/Blessing Nwachukwu.png",
    bio: `
Blessing C. Nwachukwu is a Registered Nurse and Public Health Specialist with expertise in regulatory compliance and biomedical informatics.

She holds an MPH and is a PhD candidate in Biomedical and Health Information Sciences.
    `,
  },

  "deborah-daka": {
    name: "Deborah Daka",
    title: "Director of Finance",
    image: "/images/staffs/Deborah Daka.png",
    bio: `
Deborah Daka is a healthcare management professional with dual expertise in Public Health and Business Administration (MPH, MBA).

She provides financial oversight and strategic advisory leadership.
    `,
  },

  "foyinsola-bankole": {
    name: "Foyinsola Bankole",
    title: "Director of Strategy",
    image: "/images/staffs/Foyinsola Bankole.jpeg",
    bio: `
Foyinsola Bankole is a development practitioner and policy analyst with expertise in project management and social development.
    `,
  },
}

export default async function LeadershipProfile({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const person = leaders[slug]

  if (!person) {
    notFound()
  }

  return (
    <ProfileLayout>
      <div className="min-h-screen py-28 px-6 relative overflow-hidden">

        {/* WATERMARK INITIALS */}
        <div className="absolute top-40 right-10 text-[200px] font-bold opacity-10 select-none pointer-events-none">
          {person.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* BREADCRUMB */}
          <div className="text-sm mb-16">
            <Link href="/">Home</Link>
            {" / "}
            <Link href="/">Leadership</Link>
            {" / "}
            <span>{person.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-start">

            {/* IMAGE */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="space-y-12">

              <div>
                <p className="uppercase tracking-[0.25em] text-xs mb-4">
                  {person.title}
                </p>

                <h1 className="text-5xl font-bold">
                  {person.name}
                </h1>

                <div className="w-20 h-[2px] mt-8 bg-current"></div>
              </div>

              <blockquote className="border-l-4 pl-6 italic text-lg">
                “Leadership is measured not by position, but by impact.”
              </blockquote>

              <div className="space-y-6 text-lg leading-relaxed">
                {person.bio.split("\n").map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </ProfileLayout>
  )
}