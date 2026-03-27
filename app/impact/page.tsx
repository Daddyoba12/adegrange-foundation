'use client'

import { motion } from 'framer-motion'
import PDFPreview from '@/components/PDFPreview'

const stats = [
  { value: '10,000+', label: 'Children Reached' },
  { value: '15+',     label: 'Years of Impact'  },
  { value: '4',       label: 'Strategic Pillars' },
  { value: '2009',    label: 'Founded'           },
]

const milestones = [
  {
    year: '2009',
    title: 'Foundation Established',
    body:  'AdeGrange Child Foundation was founded with a mission to advance maternal and child health across Africa.'
  },
  {
    year: '2011',
    title: 'First National Maternal Health Initiative',
    body:  'Launched our first structured maternal health programme, reaching underserved communities across Nigeria.'
  },
  {
    year: '2017',
    title: 'Full Life Nursery & Primary School Partnership',
    body:  'Partnered with Full Life Nursery to provide educational materials, facilities and teacher training.'
  },
  {
    year: '2018',
    title: 'Young Shapers Club — IDP Children',
    body:  'Financed education and leadership development for 200+ displaced youth through the Young Shapers Club.'
  },
  {
    year: '2019',
    title: 'Girls Health Matter & Chicago Feeding Project',
    body:  'Delivered health education to 300+ girls across Kubwa & Byazin, and extended our mission internationally to Chicago, Illinois.'
  },
]

const reports = [
  {
    title:       'Annual Report 2017–2018',
    description: 'Comprehensive overview of programmatic milestones, community outreach, financial accountability and strategic development initiatives.',
    file:        '/reports/annual-report-2017-2018.pdf',
  },
  {
    title:       'Annual Report 2011',
    description: 'Foundational impact report detailing early-stage community interventions, maternal health programmes and establishment milestones.',
    file:        '/reports/annual-report-2011.pdf',
  },
]

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">

      {/* ===================== HERO BAND ===================== */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden border-b border-gray-100 dark:border-gray-800">
        {/* Soft radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.07), transparent)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-6"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600">
            Our Results
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Impact &amp; Accountability
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Transparency, measurable outcomes, and sustainable development remain
            at the core of AdeGrange Child Foundation&apos;s mission.
          </p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20 sm:space-y-28 py-16 sm:py-24">

        {/* ===================== STATS ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center py-7 sm:py-10 px-3 sm:px-6 rounded-2xl border
                         border-gray-100 dark:border-gray-800
                         bg-gray-50 dark:bg-gray-900
                         hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 mb-2">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ===================== TIMELINE ===================== */}
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-600">
              Our Journey
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Milestones Timeline
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative flex gap-4 sm:gap-6 pb-8 sm:pb-10 last:pb-0"
              >
                {/* Line + dot */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-pink-600 ring-4 ring-pink-100 dark:ring-pink-900/30 mt-1.5" />
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-pink-300 to-pink-100 dark:from-pink-800 dark:to-pink-950 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-1 pt-0.5">
                  <span className="inline-block text-xs font-bold tracking-widest uppercase text-pink-600 mb-1">
                    {m.year}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {m.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===================== ANNUAL REPORTS ===================== */}
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-600">
              Documents
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Annual Reports
            </h2>
          </div>

          {/* PDF Previews */}
          <div className="space-y-4">
            <PDFPreview file="/reports/annual-report-2011.pdf" />
            <PDFPreview file="/reports/annual-report-2017-2018.pdf" />
          </div>

          {/* Report download cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {reports.map((report, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-5 sm:p-7 border space-y-4
                           border-gray-200 dark:border-gray-800
                           bg-white dark:bg-gray-900
                           shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Icon + title */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white pt-1 leading-snug">
                    {report.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {report.description}
                </p>

                <a
                  href={report.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95
                             bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===================== GOVERNANCE ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6
                     py-10 sm:py-14 px-6 sm:px-10 rounded-3xl
                     border border-gray-100 dark:border-gray-800
                     bg-gradient-to-b from-gray-50 to-white
                     dark:from-gray-900 dark:to-gray-950"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-900/20 mb-2">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Governance &amp; Transparency
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-400">
            AdeGrange Child Foundation is committed to responsible stewardship,
            financial integrity and measurable programme outcomes. We maintain
            clear reporting structures and strategic accountability frameworks
            aligned with international nonprofit governance standards.
          </p>
        </motion.div>

      </div>
    </main>
  )
}
