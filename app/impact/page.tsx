import PDFPreview from "@/components/PDFPreview"

export default function ImpactPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6
                    bg-white dark:bg-gray-950">

      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">

        {/* ================= HEADER ================= */}
        <div className="text-center space-y-4 sm:space-y-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-600">
            Our Results
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Impact &amp; Accountability
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Transparency, measurable outcomes, and sustainable development
            remain at the core of AdeGrange Child Foundation's mission.
          </p>
        </div>

        {/* ================= IMPACT METRICS ================= */}
        {/* 2 col on mobile, 4 col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 text-center">
          {[
            { value: "10,000+", label: "Children Reached" },
            { value: "15+",     label: "Years of Impact" },
            { value: "4",       label: "Strategic Pillars" },
            { value: "2009",    label: "Founded" },
          ].map((stat, i) => (
            <div
              key={i}
              className="py-6 sm:py-8 px-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 mb-2">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ================= MILESTONES TIMELINE ================= */}
        <div className="space-y-8 sm:space-y-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 dark:text-white">
            Milestones Timeline
          </h2>

          <div className="max-w-3xl mx-auto space-y-0">
            {[
              { year: "2009",      event: "Foundation Established" },
              { year: "2011",      event: "First National Maternal Health Initiative" },
              { year: "2017-2018", event: "Expanded Community Outreach Programs" },
            ].map((milestone, i) => (
              <div
                key={i}
                className="relative flex gap-4 sm:gap-6 pb-8 sm:pb-10 last:pb-0"
              >
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-pink-600 mt-1 flex-shrink-0" />
                  {i < 2 && (
                    <div className="w-px flex-1 bg-pink-200 dark:bg-pink-900 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-1">
                  <h3 className="font-bold text-sm sm:text-base text-pink-600 mb-1">
                    {milestone.year}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ANNUAL REPORTS ================= */}
        <div className="space-y-8 sm:space-y-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 dark:text-white">
            Annual Reports
          </h2>

          {/* PDF Previews — stacked on mobile */}
          <div className="space-y-4">
            <PDFPreview file="/reports/annual-report-2011.pdf" />
            <PDFPreview file="/reports/annual-report-2017-2018.pdf" />
          </div>

          {/* Report cards — 1 col mobile, 2 col tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">

            {[
              {
                title: "Annual Report 2017-2018",
                description: "A comprehensive overview of programmatic milestones, community outreach, financial accountability, and strategic development initiatives during the 2017-2018 reporting cycle.",
                file: "/reports/annual-report-2017-2018.pdf"
              },
              {
                title: "Annual Report 2011",
                description: "Foundational impact report detailing early-stage community interventions, maternal health programs, and strategic establishment milestones.",
                file: "/reports/annual-report-2011.pdf"
              }
            ].map((report, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 sm:p-8 border space-y-4 sm:space-y-6
                           border-gray-200 dark:border-gray-800
                           bg-white dark:bg-gray-900
                           shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white pt-1">
                    {report.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  {report.description}
                </p>

                <a
                  href={report.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
                             bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>
            ))}

          </div>
        </div>

        {/* ================= GOVERNANCE ================= */}
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 py-8 sm:py-12 px-4 sm:px-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
            Governance &amp; Transparency
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
            AdeGrange Child Foundation is committed to responsible stewardship,
            financial integrity, and measurable program outcomes.
            We maintain clear reporting structures and strategic accountability
            frameworks aligned with international nonprofit governance standards.
          </p>
        </div>

      </div>
    </div>
  )
}
