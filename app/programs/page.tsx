'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProgramGallery from '@/components/ProgramGallery'
import Link from 'next/link'

function ProgramsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  const programs = [
    {
      id: '2017-full-life-nursery',
      title: '2017 Partnership - Full Life Nursery & Primary School',
      description:
        'Supporting early childhood education through community partnership and engagement.'
    },
    {
      id: '2018-young-shapers-club',
      title: '2018 Partnership - Young Shapers Club',
      description:
        'Empowering youth leadership and structured development through mentorship initiatives.'
    },
    {
      id: '2017-peer-to-peer',
      title: 'Summer 2017 - Peer-to-Peer Dialogue Program',
      description:
        'Promoting cross-community dialogue and youth participation in leadership development.'
    },
    {
      id: '2019-girls-health-matter',
      title: 'Summer 2019 - Girls Health Matter',
      description:
        'Advancing adolescent health awareness and educational support for girls.'
    },
    {
      id: '2019-feeding-project',
      title: '2019 Feeding Project - Chicago, Illinois',
      description:
        'International outreach initiative supporting families through structured feeding and welfare services.'
    }
  ]

  useEffect(() => {
    const galleryId = searchParams.get('gallery')
    if (galleryId) {
      setSelectedProgram(galleryId)
      setGalleryOpen(true)
    }
  }, [searchParams])

  function openGallery(programId: string) {
    router.push(`/programs?gallery=${programId}`)
  }

  function closeGallery() {
    setGalleryOpen(false)
    setSelectedProgram(null)
    router.push('/programs')
  }

  const selectedProgramData = programs.find(p => p.id === selectedProgram)

  return (
    <div className="min-h-screen py-20 px-6 bg-gray-50 dark:bg-black transition-colors duration-500">
      <div className="container mx-auto max-w-7xl">

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Our Programs & Impact
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our key partnerships and community projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group relative rounded-2xl p-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {program.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {program.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">

                  <Link 
                    href={`/programs/${program.id}`}
                    className="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium transition-all duration-200 hover:scale-105"
                  >
                    View Program
                  </Link>

                  <button
                    onClick={() => openGallery(program.id)}
                    className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                  >
                    Open Gallery
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

        <ProgramGallery
          programId={selectedProgram || ''}
          programTitle={selectedProgramData?.title || 'Program Gallery'}
          isOpen={galleryOpen}
          onClose={closeGallery}
        />

      </div>
    </div>
  )
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProgramsContent />
    </Suspense>
  )
}