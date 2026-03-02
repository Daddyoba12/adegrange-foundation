'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

interface MediaState {
  images: any[]
  documents: any[]
  videos: any[]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const programsData = {
  '2017-full-life-nursery': {
    title: '2017 Partnership — Full Life Nursery & Primary School',
    description: 'Supporting early childhood education through community partnership and engagement.',
    fullDescription: `The Full Life Nursery & Primary School partnership represents our commitment to early childhood development and educational excellence. Through community engagement and sustainable support, we've helped establish a foundation for quality education that serves hundreds of children annually.`,
    year: '2017',
    location: 'Nigeria',
    beneficiaries: '150+ children',
    impact: [
      'Provided educational materials and supplies',
      'Enhanced classroom facilities',
      'Supported teacher training programs',
      'Established sustainable community engagement model'
    ]
  },
  '2018-young-shapers-club': {
    title: '2018 Partnership — Young Shapers Club',
    description: 'Empowering youth leadership and structured development through mentorship initiatives.',
    fullDescription: `The Young Shapers Club partnership focuses on empowering displaced youth through structured leadership development and educational support. This program provides mentorship, educational resources, and leadership training to build resilient communities.`,
    year: '2018',
    location: 'Nigeria',
    beneficiaries: '200+ youth',
    impact: [
      'Financed IDP children\'s education',
      'Established youth leadership programs',
      'Provided mentorship opportunities',
      'Created sustainable development pathways'
    ]
  },
  '2017-peer-to-peer': {
    title: 'Summer 2017 — Peer-to-Peer Dialogue Program',
    description: 'Promoting cross-community dialogue and youth participation in leadership development.',
    fullDescription: `Our Peer-to-Peer Dialogue Program brings together youth from diverse backgrounds to foster understanding, build leadership skills, and promote peaceful coexistence. Through structured dialogue sessions and collaborative activities, participants develop critical thinking and conflict resolution skills.`,
    year: '2017',
    location: 'Nigeria',
    beneficiaries: '100+ youth',
    impact: [
      'Facilitated cross-community dialogue sessions',
      'Trained youth leaders in conflict resolution',
      'Built sustainable peace-building networks',
      'Documented best practices for youth engagement'
    ]
  },
  '2019-girls-health-matter': {
    title: 'Summer 2019 — Girls Health Matter',
    description: 'Advancing adolescent health awareness and educational support for girls.',
    fullDescription: `The Girls Health Matter program addresses critical gaps in adolescent health education and support. Through school-based interventions, we provide girls with essential knowledge, resources, and support systems to make informed decisions about their health and well-being.`,
    year: '2019',
    location: 'Kubwa & Byazin, Nigeria',
    beneficiaries: '300+ girls',
    impact: [
      'Conducted health awareness workshops',
      'Distributed hygiene and health supplies',
      'Established school health clubs',
      'Created sustainable support networks'
    ]
  },
  '2019-feeding-project': {
    title: '2019 Feeding Project — Chicago, Illinois',
    description: 'International outreach initiative supporting families through structured feeding and welfare services.',
    fullDescription: `Our Chicago Feeding Project extends our mission internationally, addressing food insecurity among vulnerable families. Through partnerships with local organizations, we provide nutritious meals and connect families with long-term support services.`,
    year: '2019',
    location: 'Chicago, Illinois, USA',
    beneficiaries: '500+ families',
    impact: [
      'Provided nutritious meals to families in need',
      'Connected families with social services',
      'Built international partnership networks',
      'Established replicable feeding program model'
    ]
  }
}

export default function ProgramDetailPage() {
  const params = useParams()
  const programId = params.id as string
  const program = programsData[programId as keyof typeof programsData]
  
  //const [media, setMedia] = useState({ images: [], documents: [], videos: [] })

const [media, setMedia] = useState<MediaState>({
  images: [],
  documents: [],
  videos: [],
})





  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<any>(null)

  useEffect(() => {
    loadMedia()
  }, [programId])

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

      if (mediaData) {
        for (const item of mediaData) {
          const bucket = item.media_type === 'image' ? 'program-images' : 'program-documents'
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

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Program Not Found</h1>
          <Link href="/programs" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <Link 
          href="/programs" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Programs
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{program.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{program.description}</p>
          
          {/* Quick Stats - FIXED FOR LIGHT MODE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Year</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{program.year}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{program.location}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 md:col-span-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Beneficiaries</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{program.beneficiaries}</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">About the Program</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {program.fullDescription}
          </p>
        </section>

        {/* Impact Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Key Impact</h2>
          <div className="grid gap-4">
            {program.impact.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Media Preview */}
        {media.images.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Preview</h2>
              <Link 
                href="/programs"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View Full Gallery →
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.images.slice(0, 6).map((image: any) => (
                  <div 
                    key={image.id}
                    className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.url}
                      alt={image.file_name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Documents */}
        {media.documents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Reports & Documents</h2>
            <div className="grid gap-4">
              {media.documents.map((doc: any) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="text-4xl">📄</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{doc.file_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to view</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <Image
              src={selectedImage.url}
              alt={selectedImage.file_name}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}
