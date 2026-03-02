'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ProgramGallery({ programId, programTitle, isOpen, onClose }) {
  const [media, setMedia] = useState({ images: [], documents: [], videos: [] })
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('images')
  const [groupedImages, setGroupedImages] = useState({})
  const [groupedDocuments, setGroupedDocuments] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isOpen && programId) {
      loadMedia()
    }
  }, [isOpen, programId])

  useEffect(() => {
    if (isPlaying && selectedImage) {
      const timer = setTimeout(() => {
        navigateImage('next')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, selectedImage, selectedImageIndex])

  useEffect(() => {
    if (!selectedImage) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') navigateImage('prev')
      if (e.key === 'ArrowRight') navigateImage('next')
      if (e.key === 'Escape') {
        setSelectedImage(null)
        setIsPlaying(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, selectedImageIndex])

  async function loadMedia() {
    setLoading(true)
    
    try {
      const { data: mediaData, error: mediaError } = await supabase
        .from('program_media')
        .select('*')
        .eq('program_id', programId)
        .order('folder_name', { ascending: true })
        .order('display_order', { ascending: true })
      
      if (mediaError) throw mediaError

      let videoData = []
      try {
        const { data: vData } = await supabase
          .from('program_videos')
          .select('*')
          .eq('program_id', programId)
        
        if (vData) videoData = vData
      } catch (videoErr) {
        console.warn('Videos table might not exist:', videoErr)
      }

      const images = []
      const documents = []
      const seenImages = new Set() // Track duplicates

      if (mediaData && mediaData.length > 0) {
        for (const item of mediaData) {
          const bucket = item.media_type === 'image' ? 'program-images' : 'program-documents'
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(item.media_url)
          
          const mediaItem = { ...item, url: urlData.publicUrl }
          
          if (item.media_type === 'image') {
            // Check for duplicates by file_name + folder_name
            const uniqueKey = `${item.folder_name}-${item.file_name}`
            if (!seenImages.has(uniqueKey)) {
              seenImages.add(uniqueKey)
              images.push(mediaItem)
            }
          } else {
            documents.push(mediaItem)
          }
        }
      }

      const groupedImgs = images.reduce((acc, img) => {
        const folder = img.folder_name || 'All Photos'
        if (!acc[folder]) acc[folder] = []
        acc[folder].push(img)
        return acc
      }, {})

      const groupedDocs = documents.reduce((acc, doc) => {
        const folder = doc.folder_name || 'Documents'
        if (!acc[folder]) acc[folder] = []
        acc[folder].push(doc)
        return acc
      }, {})

      setGroupedImages(groupedImgs)
      setGroupedDocuments(groupedDocs)
      setMedia({ images, documents, videos: videoData })
      
      if (images.length > 0) {
        setActiveTab('images')
      } else if (documents.length > 0) {
        setActiveTab('documents')
      } else if (videoData.length > 0) {
        setActiveTab('videos')
      }
      
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  function openLightbox(image, index) {
    setSelectedImage(image)
    setSelectedImageIndex(index)
    setIsPlaying(false)
  }

  function navigateImage(direction) {
    const allImages = media.images
    const newIndex = direction === 'next' 
      ? (selectedImageIndex + 1) % allImages.length
      : (selectedImageIndex - 1 + allImages.length) % allImages.length
    
    setSelectedImageIndex(newIndex)
    setSelectedImage(allImages[newIndex])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-black bg-opacity-95 py-4 z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {programTitle || 'Program Gallery'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {media.images.length} photos · {media.documents.length} documents · {media.videos.length} videos
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white text-4xl hover:text-gray-300 transition"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {media.images.length > 0 && (
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'images'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Photos ({media.images.length})
            </button>
          )}
          
          {media.documents.length > 0 && (
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'documents'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Documents ({media.documents.length})
            </button>
          )}
          
          {media.videos.length > 0 && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'videos'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Videos ({media.videos.length})
            </button>
          )}
        </div>

        {loading && (
          <div className="text-white text-center text-xl py-12">Loading...</div>
        )}

        {/* Photos Tab */}
        {!loading && activeTab === 'images' && media.images.length > 0 && (
          <div>
            {Object.entries(groupedImages).map(([folderName, images]) => (
              <div key={folderName} className="mb-12">
                <h3 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">
                  {folderName} <span className="text-gray-500 text-lg">({images.length})</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map((image, folderIndex) => {
                    const globalIndex = media.images.indexOf(image)
                    return (
                      <div
                        key={image.id}
                        className="relative aspect-square group cursor-pointer"
                        onClick={() => openLightbox(image, globalIndex)}
                      >
                        <div className="relative w-full h-full overflow-hidden rounded-lg">
                          <Image
                            src={image.url}
                            alt={image.file_name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                          
                          {/* Image number */}
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-80 rounded text-white text-sm font-medium">
                            {globalIndex + 1}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents Tab - VIEW ONLY */}
        {!loading && activeTab === 'documents' && media.documents.length > 0 && (
          <div>
            {Object.entries(groupedDocuments).map(([folderName, documents]) => (
              <div key={folderName} className="mb-12">
                <h3 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">
                  {folderName} <span className="text-gray-500 text-lg">({documents.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-750 transition group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-4xl flex-shrink-0">
                          {doc.file_name.endsWith('.pdf') ? '📄' : '📝'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-semibold truncate group-hover:text-blue-400 transition" title={doc.file_name}>
                            {doc.file_name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {doc.file_name.endsWith('.pdf') ? 'PDF Document' : 'Word Document'}
                          </p>
                        </div>
                      </div>
                      
                      {/* View icon */}
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {!loading && activeTab === 'videos' && media.videos.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">
              Videos <span className="text-gray-500 text-lg">({media.videos.length})</span>
            </h3>
            <div className="grid grid-cols-1 gap-8">
              {media.videos.map((video) => {
                const videoId = video.video_url.match(/[?&]v=([^&]+)/)?.[1]
                return (
                  <div key={video.id}>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title || 'Program Video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {video.title && (
                      <p className="text-white mt-3 text-lg">{video.title}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Lightbox - NO DOWNLOAD */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black z-[60] flex flex-col"
            onClick={() => {
              setSelectedImage(null)
              setIsPlaying(false)
            }}
          >
            {/* Top Controls */}
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-95">
              <div className="text-white flex items-center gap-4">
                <span className="text-lg font-semibold">
                  {selectedImageIndex + 1} / {media.images.length}
                </span>
                <span className="text-gray-400 text-sm hidden md:block">{selectedImage.file_name}</span>
              </div>
              
              <div className="flex gap-2">
                {/* Slideshow button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPlaying(!isPlaying)
                  }}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
                  title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>

                {/* Close button */}
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setIsPlaying(false)
                  }}
                  className="text-white text-3xl hover:text-gray-300 px-3 transition"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
              {/* Previous button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('prev')
                }}
                className="absolute left-4 p-3 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white z-10 transition"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative max-w-7xl max-h-full">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.file_name}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[calc(100vh-150px)] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Next button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('next')
                }}
                className="absolute right-4 p-3 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white z-10 transition"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Bottom hint */}
            <div className="p-3 bg-black bg-opacity-95 text-center text-gray-400 text-sm">
              Use ← → arrow keys to navigate • Press ESC to close
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
