"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function FounderPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen py-20 sm:py-24 px-4 sm:px-6 founder-page">

      <div className="max-w-6xl mx-auto">

        {/* ================= NGO HEADER ================= */}
        <div className="mb-10 sm:mb-14">

          {/* Section label */}
          <p className="text-xs uppercase tracking-widest text-pink-600 mb-3 font-semibold">
            Leadership
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-4">
            <button
              onClick={() => {
                if (window.history.length > 1) router.back()
                else router.push("/about")
              }}
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              About
            </button>
            <span>/</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Founder
            </span>
          </div>

          {/* Back link */}
          <button
            onClick={() => {
              if (window.history.length > 1) router.back()
              else router.push("/about")
            }}
            className="inline-flex items-center gap-2 text-sm font-medium
                       text-gray-500 hover:text-gray-900
                       dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to About
          </button>
        </div>

        {/* Sections — tighter gap on mobile, larger on desktop */}
        <div className="space-y-12 sm:space-y-16 md:space-y-24">

          {/* ================= HERO ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Portrait */}
            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto lg:max-w-none aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/images/founder.jpg"
                alt="Professor Adenike Grange"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>

            {/* Identity */}
            <div className="space-y-5 sm:space-y-6">
              <div>
                <p className="uppercase tracking-[0.2em] text-xs font-semibold text-gray-500 mb-2 sm:mb-3">
                  Founder &amp; President
                </p>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                  Professor Adenike Grange
                </h1>

                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  MBChB; DCH; FMCPAED; FWACP; FAAP
                </p>

                <div className="w-12 h-[2px] bg-pink-600 mt-4 sm:mt-5"></div>
              </div>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Distinguished paediatrician, medical educator, and former Minister of Health of the Federal Republic of Nigeria — with over four decades of leadership in clinical medicine, academic reform, and national health governance.
              </p>
            </div>
          </section>

          {/* ================= CONTENT ================= */}
          <section className="max-w-4xl space-y-5 sm:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              Legacy of Leadership
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Born into the distinguished lineage of Pharmacist Robert Adebowale of Commercial Medicine Stores, Lagos, Professor Grange's foundation in healthcare and service was established early in life. She received her education in Lagos and England before graduating from the University of St Andrews, Scotland in 1964.
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Over three decades, she advanced through postgraduate training and global professional development while mentoring generations of medical professionals.
            </p>
          </section>

          {/* ================= GRID ================= */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-16">

            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                Academic Leadership
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                In 1995, she attained the position of Professor of Paediatrics at the College of Medicine, University of Lagos. Her institutional roles included Head of Department, Director of the Institute of Child Health, and Dean of Clinical Sciences.
              </p>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                She authored over sixty peer-reviewed publications and served as consultant to WHO, UNICEF, and USAID.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                Global Health Impact
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Professor Grange actively participated in international paediatric associations, fostering collaboration across more than thirty countries.
              </p>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                She also served on the Board of GAVI, contributing to global immunisation strategy.
              </p>
            </div>

          </section>

          {/* ================= NATIONAL ================= */}
          <section className="max-w-5xl space-y-5 sm:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              National Health Reform
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
              In 2007, Professor Grange became Nigeria's first female Minister of Health, championing structural reforms in primary healthcare, maternal care, and disease control systems.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Her work laid foundations for improved healthcare coordination across federal and state systems.
            </p>
          </section>

          {/* ================= QUOTE ================= */}
          <section className="border-t border-gray-200 dark:border-gray-800 pt-10 sm:pt-12">
            <blockquote className="max-w-3xl mx-auto text-center px-2 sm:px-6">
              <p className="text-lg sm:text-xl md:text-2xl italic font-medium text-gray-900 dark:text-white leading-relaxed">
                &ldquo;The health of a nation begins with the health of its mothers and children.&rdquo;
              </p>
              <footer className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                &mdash; Professor Adenike Grange
              </footer>
            </blockquote>
          </section>

        </div>
      </div>
    </div>
  )
}
