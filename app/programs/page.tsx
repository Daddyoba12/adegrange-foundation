'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProgramGallery from '@/components/ProgramGallery'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function ProgramsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [programs, setPrograms] = useState<any[]>([])
  const [programsLoading, setProgramsLoading] = useState(true)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrograms() {
      const { data } = await supabase
        .from('programs')
        .select('slug, title, description, year')
        .order('year', { ascending: true })
      setPrograms(data || [])
      setProgramsLoading(false)
    }
    fetchPrograms()
  }, [])

  useEffect(() => {
    const galleryId = searchParams.get('gallery')
    if (galleryId) {
      setSelectedProgram(galleryId)
      setGalleryOpen(true)
    }
  }, [searchParams])

  function openGallery(programId: string) {
    setSelectedProgram(programId)
    setGalleryOpen(true)
    router.push(`/programs?gallery=${programId}`, { scroll: false })
  }

  function closeGallery() {
    setGalleryOpen(false)
    setSelectedProgram(null)
    router.push('/programs', { scroll: false })
  }

  const selectedProgramData = programs.find(p => p.slug === selectedProgram)

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Our Programs &amp; Impact
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Explore our key partnerships and community projects. Each program includes photos, reports, and media.
          </p>
        </div>

        {/* Programs Grid — 1 col on mobile, 2 col on large screens */}
        {programsLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Loading programs...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {programs.map((program, index) => (
            <div
              key={program.slug}
              className="program-card group relative rounded-2xl p-5 sm:p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              style={{
                animationName: 'fadeInUp',
                animationDuration: '0.5s',
                animationTimingFunction: 'ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent"></div>

              <div className="space-y-4 sm:space-y-5">

                {/* Year badge */}
                <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  {program.year || program.slug.substring(0, 4)}
                </span>

                {/* Title — smaller on mobile, larger on desktop */}
                <h2 className="text-lg sm:text-xl font-bold leading-snug text-gray-900 dark:text-white">
                  {program.title}
                </h2>

                {/* Description — readable size on all screens */}
                <p className="text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {program.description}
                </p>

                {/* Divider + Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  {/* Stack buttons on very small screens, row on sm+ */}
                  <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="w-full sm:w-auto text-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 hover:scale-105
                                 bg-gray-900 text-white hover:bg-gray-700
                                 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                      View Program
                    </Link>

<button
  onClick={() => openGallery(program.slug)}
  onMouseEnter={e => {
    const el = e.currentTarget
    el.style.backgroundColor = 'rgba(107,114,128,0.15)'
    el.style.borderColor = 'rgba(107,114,128,0.6)'
  }}
  onMouseLeave={e => {
    const el = e.currentTarget
    el.style.backgroundColor = 'transparent'
    el.style.borderColor = ''
  }}
  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-200 active:scale-95
             border-gray-400 text-gray-700
             dark:border-gray-500 dark:text-gray-200"
  style={{ backgroundColor: 'transparent' }}
>
  Open Gallery
</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Gallery Modal */}
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <ProgramsContent />
    </Suspense>
  )
}
