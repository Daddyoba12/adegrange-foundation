import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import ProfileLayout from "../../../components/ProfileLayout"
import BackButton from "../../../components/BackButton"

const leaders: any = {
  "obehi-ilenikhena": {
    name: "Obehi Ilenikhena",
    title: "Director of Programming",
    image: "/images/staffs/Obehi Ilenikhena.jpg",
    bio: `BACKGROUND & INSPIRATION

Obehi "O" Ilenikhena's journey began in Nigeria and later expanded to the United States, shaping her into a dedicated advocate for transformative healthcare and community empowerment. Personal experiences with her mother's health challenges and misdiagnoses in Nigeria sparked her commitment to strengthening healthcare systems that prioritize patient wellbeing and dignity.

PROFESSIONAL LEADERSHIP

Obehi currently serves as the State Lead Project Coordinator for HIV Home Test Kit distribution, holding the role of HIV Home Testing Program Coordinator. In this capacity, she oversees strategic implementation, outreach coordination, and public health engagement initiatives aimed at expanding access to preventive healthcare services.

ACADEMIC & GLOBAL HEALTH EXPERIENCE

She holds a Master of Public Health (MPH) with specialization in Environmental Health and Global Health, with a focused expertise in Water Quality. Her international experience includes research collaboration with the Safe Water and AIDS Project (SWAP) in Western Kenya, where she contributed to initiatives improving clean and accessible water for underserved communities.

FOUNDATION ENGAGEMENT

Within AdeGrange Child Foundation, Obehi contributes as Director of Programming and Content Creator, channeling her passion for public health advocacy into impactful initiatives that amplify marginalized voices without stigma or bias.

VISION & PHILOSOPHY

Obehi envisions establishing a public health consulting firm in Nigeria to expand clean water access, maternal support systems, and youth empowerment programs. Guided by humility and service, she believes advocacy must empower communities rather than impose solutions.`,
  },

  "blessing-nwachukwu": {
    name: "Blessing Nwachukwu",
    title: "Director of Development & Communications",
    image: "/images/staffs/Blessing Nwachukwu.png",
    bio: `FOUNDATIONAL JOURNEY

Blessing C. Nwachukwu's life journey spans Nigeria, Ukraine, and the United States, shaping her perspective on health equity and social disparities. Early exposure to stark differences between urban and rural living conditions deepened her commitment to addressing environmental and healthcare inequities affecting vulnerable populations.

PROFESSIONAL EXPERTISE

Blessing serves as a Hospital Accreditation and Regulatory Compliance Specialist and is a Registered BSc. Nurse. She is currently a PhD candidate in Biomedical and Health Information Sciences. Her academic credentials include a Master of Public Health with concentration in Environmental and Occupational Sciences. She holds certifications in Incident Command Response, Health and Safety, Healthcare Accreditation, and Certified Professional in Healthcare Quality (CPHQ).

Her professional focus includes healthcare compliance, accreditation systems, and interdisciplinary research in informatics tools that support improved clinical decision-making, particularly within low-middle income populations.

FOUNDATION LEADERSHIP

As Director of Development & Communications at AdeGrange Child Foundation, Blessing coordinates strategic partnerships, program growth, and institutional development. She remains committed to strengthening healthcare access and promoting education across underserved communities.

VISION & IMPACT

Blessing's long-term vision centres on leveraging artificial intelligence to expand healthcare access for marginalised populations. She firmly believes that sustainable transformation begins with incremental action — that "little drops of water make a mighty ocean."`,
  },

  "deborah-daka": {
    name: "Deborah Daka",
    title: "Director of Finance",
    image: "/images/staffs/Deborah Daka.png",
    bio: `FOUNDATIONAL JOURNEY

Deborah Daka brings a unique combination of healthcare administration and financial governance expertise to AdeGrange Child Foundation. Her academic background spans an MBA and Master of Public Health, equipping her with both the business acumen and public health perspective needed to drive sustainable organisational growth.

PROFESSIONAL EXPERTISE

Deborah's professional experience spans healthcare administration, financial oversight, and programme management. She is dedicated to ensuring that the Foundation's resources are managed with transparency, accountability, and strategic foresight to maximise community impact.

FOUNDATION LEADERSHIP

As Director of Finance at AdeGrange Child Foundation, Deborah oversees financial planning, budgeting, and compliance. She ensures that every programme is adequately resourced and that donor funds are stewarded responsibly in service of the Foundation's mission.

VISION & IMPACT

Deborah is passionate about youth empowerment and believes that strong financial governance is the backbone of any sustainable development organisation. Her vision is to build financial systems that support long-term growth while remaining responsive to the communities the Foundation serves.`,
  },
}

// Helper — detect ALL CAPS section headings (min 4 chars, not just punctuation)
function isSectionHeading(text: string): boolean {
  const trimmed = text.trim()
  return (
    trimmed.length >= 4 &&
    trimmed === trimmed.toUpperCase() &&
    /[A-Z]/.test(trimmed)
  )
}

export default async function LeadershipProfile({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const person = leaders[slug]

  if (!person) notFound()

  return (
    <ProfileLayout>
      <div className="min-h-screen py-14 sm:py-24 px-4 sm:px-6 relative overflow-hidden">

        {/* Watermark — desktop only */}
        <div className="hidden lg:block absolute top-40 right-10 text-[180px] font-black opacity-[0.03] select-none pointer-events-none leading-none">
          {person.name.split(" ").map((n: string) => n[0]).join("")}
        </div>

        <div className="max-w-5xl mx-auto relative z-10">

          {/* Breadcrumb — truncates gracefully on small phones */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm mb-8 sm:mb-12 text-gray-400 dark:text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#leadership" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Leadership
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[140px] sm:max-w-none">
              {person.name}
            </span>
          </nav>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">

            {/* Image — shorter on mobile, taller on desktop */}
            <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Subtle gradient at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Bio content */}
            <div className="space-y-6 sm:space-y-8">

              {/* Name and title */}
              <div>
                <p className="uppercase tracking-widest text-xs text-pink-600 font-semibold mb-2 sm:mb-3">
                  {person.title}
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  {person.name}
                </h1>
                <div className="w-12 sm:w-16 h-0.5 mt-4 sm:mt-6 bg-pink-600" />
              </div>

              {/* Quote */}
              <blockquote className="border-l-4 border-pink-600 pl-4 sm:pl-5 italic text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                "Leadership is measured not by position, but by impact."
              </blockquote>

              {/* Bio text — section headings auto-detected */}
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {person.bio
                  .split("\n")
                  .filter((p: string) => p.trim() !== "")
                  .map((paragraph: string, i: number) =>
                    isSectionHeading(paragraph) ? (
                      <h3
                        key={i}
                        className="text-sm sm:text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide pt-3 sm:pt-4 first:pt-0"
                      >
                        {paragraph}
                      </h3>
                    ) : (
                      <p key={i} className="text-gray-600 dark:text-gray-300">
                        {paragraph}
                      </p>
                    )
                  )}
              </div>

              {/* Back button */}
              <div className="pt-2">
                <BackButton />
              </div>

            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}
