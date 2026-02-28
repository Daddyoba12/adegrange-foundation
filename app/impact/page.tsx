import Link from "next/link"
import PDFPreview from "@/components/PDFPreview"
import FinancialChart from "@/components/FinancialChart"

export default function ImpactPage() {
  return (
    <div className="min-h-screen py-28 px-6">

      <div className="max-w-7xl mx-auto space-y-24">

        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold">
            Impact & Accountability
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed">
            Transparency, measurable outcomes, and sustainable development 
            remain at the core of AdeGrange Child Foundation’s mission.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-bold text-pink-600">10,000+</h3>
            <p>Children Reached</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-pink-600">15+</h3>
            <p>Years of Impact</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-pink-600">4</h3>
            <p>Strategic Pillars</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-pink-600">2009</h3>
            <p>Founded</p>
          </div>
        </div>
<div className="space-y-12 mt-32">
  <h2 className="text-3xl font-semibold text-center">
    Milestones Timeline
  </h2>

  <div className="space-y-8 max-w-3xl mx-auto">

    <div>
      <h3 className="font-semibold">2009</h3>
      <p>Foundation Established</p>
    </div>

    <div>
      <h3 className="font-semibold">2011</h3>
      <p>First National Maternal Health Initiative</p>
    </div>

    <div>
      <h3 className="font-semibold">2017–2018</h3>
      <p>Expanded Community Outreach Programs</p>
    </div>

  </div>
</div>

        {/* Annual Reports */}
        <div className="space-y-12">
          <h2 className="text-3xl font-semibold text-center">
            Annual Reports
<PDFPreview file="/reports/annual-report-2011.pdf" />
<PDFPreview file="/reports/annual-report-2017-2018.pdf" />
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {/* 2017-2018 */}
            <div className="border rounded-2xl p-8 shadow-lg space-y-6">
              <h3 className="text-2xl font-semibold">
                Annual Report 2017–2018
              </h3>

              <p className="leading-relaxed">
                A comprehensive overview of programmatic milestones, 
                community outreach, financial accountability, and strategic 
                development initiatives during the 2017–2018 reporting cycle.
              </p>

              <a
                href="/reports/annual-report-2017-2018.pdf"
                target="_blank"
                className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg"
              >

                Download PDF
              </a>
            </div>

            {/* 2011 */}
            <div className="border rounded-2xl p-8 shadow-lg space-y-6">
              <h3 className="text-2xl font-semibold">
                Annual Report 2011
              </h3>

              <p className="leading-relaxed">
                Foundational impact report detailing early-stage community 
                interventions, maternal health programs, and strategic 
                establishment milestones.
              </p>

              <a
                href="/reports/annual-report-2011.pdf"
                target="_blank"
                className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg"
              >
                Download PDF
              </a>
            </div>

          </div>
        </div>

        {/* Governance Statement */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Governance & Transparency
          </h2>

          <p className="leading-relaxed">
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