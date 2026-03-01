import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import ProfileLayout from "../../../components/ProfileLayout"

const leaders: any = {
  "obehi-ilenikhena": {
    name: "Obehi Ilenikhena",
    title: "Director of Programming",
    image: "/images/staffs/Obehi Ilenikhena.jpg",
    bio: `BACKGROUND & INSPIRATION

Obehi “O” Ilenikhena’s journey began in Nigeria and later expanded to the United States, shaping her into a dedicated advocate for transformative healthcare and community empowerment. Personal experiences with her mother’s health challenges and misdiagnoses in Nigeria sparked her commitment to strengthening healthcare systems that prioritize patient wellbeing and dignity.

PROFESSIONAL LEADERSHIP

Obehi currently serves as the State Lead Project Coordinator for HIV Home Test Kit distribution, holding the role of HIV Home Testing Program Coordinator. In this capacity, she oversees strategic implementation, outreach coordination, and public health engagement initiatives aimed at expanding access to preventive healthcare services.

ACADEMIC & GLOBAL HEALTH EXPERIENCE

She holds a Master of Public Health (MPH) with specialization in Environmental Health and Global Health, with a focused expertise in Water Quality. Her international experience includes research collaboration with the Safe Water and AIDS Project (SWAP) in Western Kenya, where she contributed to initiatives improving clean and accessible water for underserved communities.

FOUNDATION ENGAGEMENT

Within AdeGrange Child Foundation, Obehi contributes as Director of Programming and Content Creator, channeling her passion for public health advocacy into impactful initiatives that amplify marginalized voices without stigma or bias.

VISION & PHILOSOPHY

Obehi envisions establishing a public health consulting firm in Nigeria to expand clean water access, maternal support systems, and youth empowerment programs. Guided by humility and service, she believes advocacy must empower communities rather than impose solutions.
`,
  },

  "blessing-nwachukwu": {
    name: "Blessing Nwachukwu",
    title: "Director of Development & Communications",
    image: "/images/staffs/Blessing Nwachukwu.png",
    bio: `
FOUNDATIONAL JOURNEY

Blessing C. Nwachukwu’s life journey spans Nigeria, Ukraine, and the United States, shaping her perspective on health equity and social disparities. Early exposure to stark differences between urban and rural living conditions deepened her commitment to addressing environmental and healthcare inequities affecting vulnerable populations.

PROFESSIONAL EXPERTISE

Blessing serves as a Hospital Accreditation and Regulatory Compliance Specialist and is a Registered BSc. Nurse. She is currently a PhD candidate in Biomedical and Health Information Sciences. Her academic credentials include a Master of Public Health with concentration in Environmental and Occupational Sciences. She holds certifications in Incident Command Response, Health and Safety, Healthcare Accreditation, and Certified Professional in Healthcare Quality (CPHQ).

Her professional focus includes healthcare compliance, accreditation systems, and interdisciplinary research in informatics tools that support improved clinical decision-making, particularly within low–middle income populations.

FOUNDATION LEADERSHIP

As Director of Development & Communications at AdeGrange Child Foundation, Blessing coordinates strategic partnerships, program growth, and institutional development. She remains committed to strengthening healthcare access and promoting education across underserved communities.

VISION & IMPACT

Blessing’s long-term vision centers on leveraging artificial intelligence to expand healthcare access for marginalized populations. She firmly believes that sustainable transformation begins with incremental action — that “little drops of water make a mighty ocean.”
`,
  },

  "deborah-daka": {
    name: "Deborah Daka",
    title: "Director of Finance",
    image: "/images/staffs/Deborah Daka.png",
    bio: `
FOUNDATIONAL JOURNEY

Blessing C. Nwachukwu’s life journey spans Nigeria, Ukraine, and the United States, shaping her perspective on health equity and social disparities. Early exposure to stark differences between urban and rural living conditions deepened her commitment to addressing environmental and healthcare inequities affecting vulnerable populations.

PROFESSIONAL EXPERTISE

Blessing serves as a Hospital Accreditation and Regulatory Compliance Specialist and is a Registered BSc. Nurse. She is currently a PhD candidate in Biomedical and Health Information Sciences. Her academic credentials include a Master of Public Health with concentration in Environmental and Occupational Sciences. She holds certifications in Incident Command Response, Health and Safety, Healthcare Accreditation, and Certified Professional in Healthcare Quality (CPHQ).

Her professional focus includes healthcare compliance, accreditation systems, and interdisciplinary research in informatics tools that support improved clinical decision-making, particularly within low–middle income populations.

FOUNDATION LEADERSHIP

As Director of Development & Communications at AdeGrange Child Foundation, Blessing coordinates strategic partnerships, program growth, and institutional development. She remains committed to strengthening healthcare access and promoting education across underserved communities.

VISION & IMPACT

Blessing’s long-term vision centers on leveraging artificial intelligence to expand healthcare access for marginalized populations. She firmly believes that sustainable transformation begins with incremental action — that “little drops of water make a mighty ocean.”
`,
  },

  "foyinsola-bankole": {
    name: "Foyinsola Bankole",
    title: "Director of Strategy",
    image: "/images/staffs/Foyinsola Bankole.jpeg",
    bio:  `
PROFESSIONAL PROFILE

Foyinsola Bankole is a development practitioner, policy analyst, social worker, and content creator with experience spanning national and international organizations. Her professional background includes human resource management, project coordination, and social development initiatives.

FOUNDATION ROLE

As Project Officer and Director of Strategy for AdeGrange Child Foundation, Foyinsola supports operational execution of programs addressing the needs of women and children across Africa. She ensures alignment between strategic objectives and field-level implementation.

COMMITMENT TO SOCIAL DEVELOPMENT

Her work focuses on advocacy, program design, and community engagement, strengthening institutional capacity while amplifying marginalized voices.

VISION

Foyinsola remains committed to advancing inclusive social development through evidence-based programming and strategic policy engagement.
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