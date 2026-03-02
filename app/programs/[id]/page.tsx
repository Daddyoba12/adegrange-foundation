'use client'

import { useParams } from 'next/navigation'

const programsData = {
  '2017-full-life-nursery': {
    year: '2017',
    location: 'Nigeria',
    beneficiaries: '150+ children',
  },
  '2018-young-shapers-club': {
    year: '2018',
    location: 'Nigeria',
    beneficiaries: '200+ youth',
  },
  '2017-peer-to-peer': {
    year: '2017',
    location: 'Nigeria',
    beneficiaries: '100+ youth',
  },
  '2019-girls-health-matter': {
    year: '2019',
    location: 'Kubwa & Byazin, Nigeria',
    beneficiaries: '300+ girls',
  },
  '2019-feeding-project': {
    year: '2019',
    location: 'Chicago, Illinois, USA',
    beneficiaries: '500+ families',
  },
}

export default function ProgramDetailPage() {
  const params = useParams()
  const programId = params.id as string

  const program =
    programsData[programId as keyof typeof programsData]

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Program not found
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">

        {/* Quick Stats - Premium Corporate */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Year */}
            <div className="group relative overflow-hidden rounded-xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-blue-600 to-purple-600 transition-opacity duration-300" />
              <div className="relative z-10">
                <p className="text-xs tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Year
                </p>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {program.year}
                </h3>
              </div>
            </div>

            {/* Location */}
            <div className="group relative overflow-hidden rounded-xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-emerald-600 to-blue-600 transition-opacity duration-300" />
              <div className="relative z-10">
                <p className="text-xs tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Location
                </p>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {program.location}
                </h3>
              </div>
            </div>

            {/* Beneficiaries */}
            <div className="group relative overflow-hidden rounded-xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-purple-600 to-pink-600 transition-opacity duration-300" />
              <div className="relative z-10">
                <p className="text-xs tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Beneficiaries
                </p>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {program.beneficiaries}
                </h3>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}