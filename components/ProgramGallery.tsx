'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
interface Props {
  programId: string
  programTitle?: string
  isOpen: boolean
  onClose: () => void
}

export default function ProgramGallery({
  programId,
  programTitle,
  isOpen,
  onClose,
}: Props) {
  const [media, setMedia] = useState<any>({
    images: [],
    documents: [],
    videos: [],
  })

  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] =
    useState<'images' | 'documents' | 'videos'>('images')
  const [groupedImages, setGroupedImages] = useState<any>({})
  const [groupedDocuments, setGroupedDocuments] = useState<any>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    if (isOpen && programId) {
      loadMedia()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, programId])

  useEffect(() => {
    if (isPlaying && selectedImage) {
      const timer = setTimeout(() => navigateImage('next'), 3000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, selectedImageIndex])

  useEffect(() => {
    if (!selectedImage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateImage('prev')
      if (e.key === 'ArrowRight') navigateImage('next')
      if (e.key === 'Escape') closeLightbox()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, selectedImageIndex])

  async function loadMedia() {
    setLoading(true)

    try {
      const { data: mediaData } = await supabase
        .from('program_media')
        .select('*')
        .eq('program_id', programId)
        .order('folder_name', { ascending: true })
        .order('display_order', { ascending: true })

      let videoData: any[] = []
      const { data: vData } = await supabase
        .from('program_videos')
        .select('*')
        .eq('program_id', programId)

      if (vData) videoData = vData

      const images: any[] = []
      const documents: any[] = []
      const seenImages = new Set()

      if (mediaData) {
        for (const item of mediaData) {
          const bucket =
            item.media_type === 'image'
              ? 'program-images'
              : 'program-documents'

          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(item.media_url)

          const mediaItem = { ...item, url: urlData.publicUrl }

          if (item.media_type === 'image') {
            const key = `${item.folder_name}-${item.file_name}`
            if (!seenImages.has(key)) {
              seenImages.add(key)
              images.push(mediaItem)
            }
          } else {
            documents.push(mediaItem)
          }
        }
      }

      const groupedImgs = images.reduce((acc: any, img: any) => {
        const folder = img.folder_name || 'All Photos'
        if (!acc[folder]) acc[folder] = []
        acc[folder].push(img)
        return acc
      }, {})

      const groupedDocs = documents.reduce((acc: any, doc: any) => {
        const folder = doc.folder_name || 'Documents'
        if (!acc[folder]) acc[folder] = []
        acc[folder].push(doc)
        return acc
      }, {})

      setGroupedImages(groupedImgs)
      setGroupedDocuments(groupedDocs)
      setMedia({ images, documents, videos: videoData })

      if (images.length > 0) setActiveTab('images')
      else if (documents.length > 0) setActiveTab('documents')
      else if (videoData.length > 0) setActiveTab('videos')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function openLightbox(image: any, index: number) {
    setSelectedImage(image)
    setSelectedImageIndex(index)
    setIsPlaying(false)
  }

  function closeLightbox() {
    setSelectedImage(null)
    setIsPlaying(false)
  }

  function navigateImage(direction: 'next' | 'prev') {
    const allImages = media.images
    if (!allImages.length) return

    const newIndex =
      direction === 'next'
        ? (selectedImageIndex + 1) % allImages.length
        : (selectedImageIndex - 1 + allImages.length) % allImages.length

    setSelectedImageIndex(newIndex)
    setSelectedImage(allImages[newIndex])
  }

  function handleTouchStart(e: any) {
    setTouchStart(e.targetTouches[0].clientX)
  }

  function handleTouchMove(e: any) {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  function handleTouchEnd() {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) navigateImage('next')
    if (distance < -50) navigateImage('prev')
    setTouchStart(0)
    setTouchEnd(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 md:px-8 pb-24">

        {/* Premium Header */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-white/10 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              {programTitle || 'Program Gallery'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {media.images.length} photos · {media.documents.length} docs · {media.videos.length} videos
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white text-4xl hover:rotate-90 transition"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8 mb-10 border-b border-white/10">
          {['images', 'documents', 'videos'].map((tab) =>
            media[tab]?.length > 0 ? (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 font-medium transition ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({media[tab].length})
              </button>
            ) : null
          )}
        </div>

        {loading && (
          <div className="text-white text-center py-20">
            Loading media...
          </div>
        )}

        {/* Images Grid */}
        {!loading && activeTab === 'images' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {media.images.map((image: any, index: number) => (
              <div
                key={image.id}
                className="relative aspect-square cursor-pointer rounded-xl overflow-hidden"
                onClick={() => openLightbox(image, index)}
              >
                <Image
                  src={image.url}
                  alt={image.file_name}
                  fill
                  className="object-cover hover:scale-110 transition duration-500"
                />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULL LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black z-[60] flex flex-col"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-between items-center p-4 bg-black/90">
            <span className="text-white font-semibold">
              {selectedImageIndex + 1} / {media.images.length}
            </span>

            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPlaying(!isPlaying)
                }}
                className="text-white"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeLightbox()
                }}
                className="text-white text-3xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('prev')
              }}
              className="absolute left-4 text-white text-4xl"
            >
              ‹
            </button>

            <Image
              src={selectedImage.url}
              alt={selectedImage.file_name}
              width={1200}
              height={800}
              className="max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('next')
              }}
              className="absolute right-4 text-white text-4xl"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}