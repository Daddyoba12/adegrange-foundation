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
  const [activeTab, setActiveTab] = useState('images')
  const [groupedImages, setGroupedImages] = useState({})

  useEffect(() => {
    if (isOpen && programId) {
      loadMedia()
    }
  }, [isOpen, programId])

  async function loadMedia() {
    setLoading(true)
    
    console.log('==========================================')
    console.log('🚀 STARTING LOAD MEDIA')
    console.log('Program ID:', programId)
    console.log('Supabase client exists:', !!supabase)
    console.log('==========================================')
    
    try {
      console.log('🔍 Loading media for program:', programId)
      
      // Fetch all media
      const { data: mediaData, error: mediaError } = await supabase
        .from('program_media')
        .select('*')
        .eq('program_id', programId)
        .order('folder_name', { ascending: true })
        .order('display_order', { ascending: true })
      
      if (mediaError) {
        console.error('❌ Media Error:', mediaError)
        console.error('Error code:', mediaError.code)
        console.error('Error message:', mediaError.message)
        throw mediaError
      }

      console.log('✅ Loaded media data:', mediaData?.length, 'items')

      // Fetch videos
      let videoData = []
      try {
        const { data: vData, error: videoError } = await supabase
          .from('program_videos')
          .select('*')
          .eq('program_id', programId)
        
        if (!videoError && vData) {
          videoData = vData
          console.log('✅ Loaded videos:', videoData.length)
        }
      } catch (videoErr) {
        console.warn('⚠️ Videos table might not exist:', videoErr)
      }

      // Process media with URLs
      const images = []
      const documents = []

      if (mediaData && mediaData.length > 0) {
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

      console.log('✅ Processed images:', images.length)
      console.log('✅ Processed documents:', documents.length)

      // Group images by folder
      const grouped = images.reduce((acc, img) => {
        const folder = img.folder_name || 'All Photos'
        if (!acc[folder]) acc[folder] = []
        acc[folder].push(img)
        return acc
      }, {})

      console.log('✅ Grouped into folders:', Object.keys(grouped))

      setGroupedImages(grouped)
      setMedia({ images, documents, videos: videoData })
      
      // Auto-switch to first available tab with content
      if (images.length > 0) {
        setActiveTab('images')
      } else if (documents.length > 0) {
        setActiveTab('documents')
      } else if (videoData.length > 0) {
        setActiveTab('videos')
      }
      
    } catch (error) {
      console.error('❌ Fatal error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header - UPDATED */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-black py-4 z-10">
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
            aria-label="Close gallery"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
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
          <div className="text-white text-center text-xl py-12">
            Loading gallery...
          </div>
        )}

        {/* Empty State */}
        {!loading && media.images.length === 0 && media.documents.length === 0 && media.videos.length === 0 && (
          <div className="text-white text-center py-12">
            <p className="text-xl mb-4">No media available for this program yet.</p>
            <p className="text-gray-400">Check back soon!</p>
          </div>
        )}

        {/* Images Tab */}
        {!loading && activeTab === 'images' && media.images.length > 0 && (
          <div>
            {Object.entries(groupedImages).map(([folderName, images]) => (
              <div key={folderName} className="mb-12">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {folderName}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square cursor-pointer hover:opacity-80 transition group"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.url}
                        alt={image.file_name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents Tab */}
        {!loading && activeTab === 'documents' && media.documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {media.documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <div className="text-4xl">
                  {doc.file_name.endsWith('.pdf') ? '📄' : '📝'}
                </div>
                <div>
                  <p className="text-white font-semibold">{doc.file_name}</p>
                  {doc.folder_name && (
                    <p className="text-gray-400 text-sm">{doc.folder_name}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {!loading && activeTab === 'videos' && media.videos.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {media.videos.map((video) => {
              const videoId = video.video_url.match(/[?&]v=([^&]+)/)?.[1]
              return (
                <div key={video.id} className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={video.title || 'Program Video'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-[70]"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <div className="relative max-w-7xl max-h-[90vh]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.file_name}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
