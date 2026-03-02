'use client'

import { useState } from 'react'
import ProgramGallery from '@/components/ProgramGallery'
import Link from 'next/link'


export default function ProgramsPage() {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  const programs = [
    {
      id: '2017-full-life-nursery',
      title: '2017 Partnership — Full Life Nursery & Primary School',
      description: 'Supporting early childhood education through community partnership and engagement.'
    },
    {
      id: '2018-young-shapers-club',
      title: '2018 Partnership — Young Shapers Club',
      description: 'Empowering youth leadership and structured development through mentorship initiatives.'
    },
    {
      id: '2017-peer-to-peer',
      title: 'Summer 2017 — Peer-to-Peer Dialogue Program',
      description: 'Promoting cross-community dialogue and youth participation in leadership development.'
    },
    {
      id: '2019-girls-health-matter',
      title: 'Summer 2019 — Girls Health Matter',
      description: 'Advancing adolescent health awareness and educational support for girls.'
    },
    {
      id: '2019-feeding-project',
      title: '2019 Feeding Project — Chicago, Illinois',
      description: 'International outreach initiative supporting families through structured feeding and welfare services.'
    }
  ]

  function openGallery(programId: string) {
    setSelectedProgram(programId)
    setGalleryOpen(true)
  }

  const selectedProgramData = programs.find(p => p.id === selectedProgram)

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Programs & Impact
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore our key partnerships and community projects. Each program page includes 
            a short write-up and direct access to photos, reports, and media.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent opacity-50"></div>
              
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {program.title}
                </h2>
                
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {program.description}
                </p>
                
                {/* Buttons */}
<div className="flex flex-wrap gap-4 pt-2">
  <Link 
    href={`/programs/${program.id}`}
    className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105"
  >
    View Program
  </Link>
  
  <button
    onClick={() => openGallery(program.id)}
    className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
  >
    Open Gallery
  </button>
</div>

              </div>

              {/* Subtle corner decoration on hover */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-gray-100 dark:from-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Gallery Modal */}
        <ProgramGallery
          programId={selectedProgram || ''}
          programTitle={selectedProgramData?.title || 'Program Gallery'}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
        />
      </div>

      {/* Inline animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
