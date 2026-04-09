'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Program {
  title: string
  description: string
  full_description: string
  year: string
  location: string
  beneficiaries: string
  impact: string[]
}

export default function ProgramDetailPage() {
  const params = useParams()
  const programId = params.id as string

  const [program, setProgram] = useState<Program | null>(null)
  const [programLoading, setProgramLoading] = useState(true)
  const [media, setMedia] = useState<{
    images: any[]
    documents: any[]
    videos: any[]
  }>({ images: [], documents: [], videos: [] })
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<any>(null)

  useEffect(() => {
    loadProgram()
    loadMedia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId])

  async function loadProgram() {
    setProgramLoading(true)
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', programId)
      .single()
    setProgram(data || null)
    setProgramLoading(false)
  }

  async function loadMedia() {
    try {
      const { data: mediaData } = await supabase
        .from('program_media')
        .select('*')
        .eq('program_id', programId)
        .limit(6)

      const { data: videoData } = await supabase
        .from('program_videos')
        .select('*')
        .eq('program_id', programId)

      const images: any[] = []
      const documents: any[] = []
      const seenImages = new Set()

      if (mediaData) {
        for (const item of mediaData) {
          const uniqueKey = `${item.folder_name}-${item.file_name}`
          if (seenImages.has(uniqueKey)) continue
          seenImages.add(uniqueKey)

          const bucket =
            item.media_type === 'image' ? 'program-images' : 'program-documents'
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(item.media_url)
          const mediaItem = { ...item, url: urlData.publicUrl }

          if (item.media_type === 'image') {
            images.push(mediaItem)
          } else {
            documents.push(mediaItem)
          }
        }
      }

      setMedia({ images, documents, videos: videoData || [] })
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  if (programLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Loading program...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Program Not Found
          </h1>
          <Link
            href="/programs"
            className="text-pink-600 hover:text-pink-500 hover:underline text-sm sm:text-base"
          >
            Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">

        {/* Breadcrumb */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-sm transition-colors
                     text-gray-600 hover:text-gray-900
                     dark:text-gray-300 dark:hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Programs
        </Link>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white leading-tight">
            {program.title}
          </h1>
          <p className="text-base sm:text-lg mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
            {program.description}
          </p>

          {/* Quick Stats — 2 col on mobile, 3 col on sm, auto on md */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
            {[
              { label: 'Year', value: program.year },
              { label: 'Location', value: program.location },
              { label: 'Beneficiaries', value: program.beneficiaries }
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-3 sm:p-4 border
                           bg-gray-50 border-gray-200
                           dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {label}
                </div>
                <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            About the Program
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {program.full_description}
          </p>
        </section>

        {/* Key Impact */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
            Key Impact
          </h2>
          <div className="grid gap-3 sm:gap-4">
            {program.impact.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl p-3 sm:p-4 border
                           bg-gray-50 border-gray-200
                           dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="mb-8 sm:mb-12">

          {/* Gallery header — stacks on mobile */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Gallery Preview
            </h2>
            <Link
              href={`/programs?gallery=${programId}`}
              className="text-sm font-semibold text-pink-600 hover:text-pink-500 hover:underline self-start sm:self-auto"
            >
              View Full Gallery →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 sm:py-12">
              <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Loading gallery...</p>
            </div>
          ) : media.images.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">
              No images available for this program.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {media.images.slice(0, 6).map((image: any) => (
                <div
                  key={image.id}
                  className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg sm:rounded-xl border
                             border-gray-200 dark:border-gray-700"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.url}
                    alt={image.file_name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Tap hint overlay on mobile */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg sm:rounded-xl" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reports & Documents */}
        {media.documents.length > 0 && (
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Reports &amp; Documents
            </h2>
            <div className="grid gap-3 sm:gap-4">
              {media.documents.map((doc: any) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors active:scale-95
                             bg-gray-50 border-gray-200 hover:border-gray-300
                             dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
                >
                  <div className="text-2xl sm:text-4xl flex-shrink-0">📄</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Tap to view
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button — large tap target on mobile */}
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <Image
              src={selectedImage.url}
              alt={selectedImage.file_name}
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />

            {/* File name caption */}
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60 px-4 truncate">
              {selectedImage.file_name}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
