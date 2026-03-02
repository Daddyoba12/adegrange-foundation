'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AdminPanelProps {
  onLogout: () => void
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [selectedProgram, setSelectedProgram] = useState('')
  const [folderName, setFolderName] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')

  const programs = [
    { id: '2017-full-life-nursery', name: '2017 Full Life Nursery' },
    { id: '2018-young-shapers-club', name: '2018 Young Shapers Club' },
    { id: '2017-peer-to-peer', name: 'Summer 2017 Peer-to-Peer' },
    { id: '2019-girls-health-matter', name: 'Summer 2019 Girls Health Matter' },
    { id: '2019-feeding-project', name: '2019 Feeding Project Chicago' }
  ]

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    
    if (!selectedProgram || !folderName || !files || files.length === 0) {
      setMessage('Please fill all fields and select files')
      return
    }

    setUploading(true)
    setProgress(0)
    setMessage('')

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = file.name
      const fileExt = fileName.split('.').pop()?.toLowerCase()

      try {
        // Determine bucket and type
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '')
        const isDocument = ['pdf', 'doc', 'docx'].includes(fileExt || '')

        if (!isImage && !isDocument) {
          console.log(`Skipping ${fileName} - unsupported format`)
          continue
        }

        const bucket = isImage ? 'program-images' : 'program-documents'
        const mediaType = isImage ? 'image' : 'document'
        const storagePath = `${selectedProgram}/${folderName}/${fileName}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, file, {
            upsert: true,
            cacheControl: '3600'
          })

        if (uploadError) throw uploadError

        // Save to database
        const { error: dbError } = await supabase
          .from('program_media')
          .insert({
            program_id: selectedProgram,
            media_type: mediaType,
            media_url: storagePath,
            file_name: fileName,
            folder_name: folderName,
            display_order: i
          })

        if (dbError) throw dbError

        successCount++
      } catch (error: any) {
        console.error(`Error uploading ${fileName}:`, error)
        errorCount++
      }

      setProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setUploading(false)
    setMessage(`✅ Upload complete! ${successCount} succeeded, ${errorCount} failed`)
    
    // Reset form
    setFiles(null)
    const form = e.target as HTMLFormElement
    form.reset()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Upload Media</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Program Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Select a program...</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Folder Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Folder Name</label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g., Day 1, Reports, All Photos"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Files</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setFiles(e.target.files)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Supported: Images (jpg, png, gif, webp), Documents (pdf, doc, docx)
              </p>
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {uploading ? `Uploading... ${progress}%` : 'Upload Files'}
            </button>

            {/* Progress Bar */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Select the program you want to upload to</li>
            <li>Enter a folder name (e.g., "Day 1", "Day 2", "Reports")</li>
            <li>Choose multiple files (images or documents)</li>
            <li>Click "Upload Files" and wait for completion</li>
            <li>Files will be organized by folder in the gallery</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
