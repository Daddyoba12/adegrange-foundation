'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPanel() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('2017-full-life-nursery')
  const [folderName, setFolderName] = useState('')

  const programs = [
    { id: '2017-full-life-nursery', name: '2017 Full Life Nursery' },
    { id: '2018-young-shapers-club', name: '2018 Young Shapers Club' },
    { id: '2017-peer-to-peer', name: '2017 Peer-to-Peer' },
    { id: '2019-girls-health-matter', name: '2019 Girls Health Matter' },
    { id: '2019-feeding-project', name: '2019 Feeding Project' }
  ]

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setMessage(`Uploading ${files.length} files...`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      
      // Determine file type
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '')
      const isDoc = ['pdf', 'doc', 'docx'].includes(fileExt || '')
      
      if (!isImage && !isDoc) continue

      const bucket = isImage ? 'program-images' : 'program-documents'
      const mediaType = isImage ? 'image' : 'document'
      const storagePath = `${selectedProgram}/${folderName}/${file.name}`

      try {
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, file, {
            upsert: false,
            cacheControl: '3600'
          })

        if (uploadError) throw uploadError

        // Save metadata
        const { error: dbError } = await supabase
          .from('program_media')
          .insert({
            program_id: selectedProgram,
            media_type: mediaType,
            media_url: storagePath,
            file_name: file.name,
            folder_name: folderName,
            display_order: i
          })

        if (dbError) throw dbError

        successCount++
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        errorCount++
      }

      setMessage(`Uploading... ${i + 1}/${files.length}`)
    }

    setMessage(`✅ Upload complete! Success: ${successCount}, Errors: ${errorCount}`)
    setUploading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Upload Media</h2>

      {/* Program Select */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Program</label>
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        >
          {programs.map(prog => (
            <option key={prog.id} value={prog.id}>{prog.name}</option>
          ))}
        </select>
      </div>

      {/* Folder Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Folder Name (e.g., "Day 1", "Reports")</label>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="All Photos"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Files</label>
        <input
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        />
      </div>

      {/* Status Message */}
      {message && (
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p>{message}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select the program</li>
          <li>Enter a folder name (optional)</li>
          <li>Choose files to upload</li>
          <li>Wait for upload to complete</li>
        </ol>
      </div>
    </div>
  )
}
