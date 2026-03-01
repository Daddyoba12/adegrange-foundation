import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper function to get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

// Determine file type and bucket
function getFileInfo(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
  const docExts = ['.pdf', '.doc', '.docx']
  
  if (imageExts.includes(ext)) {
    return { type: 'image', bucket: 'program-images', contentType: `image/${ext.slice(1)}` }
  } else if (docExts.includes(ext)) {
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
    return { type: 'document', bucket: 'program-documents', contentType: contentTypes[ext] }
  }
  
  return null
}

async function uploadProgram(config) {
  const { programId, basePath, folders, videos, displayName } = config
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📁 Starting upload for: ${displayName}`)
  console.log(`${'='.repeat(60)}\n`)

  let totalFiles = 0
  let successCount = 0
  let errorCount = 0

  // Handle YouTube videos first
  if (videos && videos.length > 0) {
    console.log(`\n🎥 Saving ${videos.length} video link(s)...\n`)
    
    for (const videoUrl of videos) {
      try {
        const { error } = await supabase
          .from('program_videos')
          .insert({
            program_id: programId,
            video_url: videoUrl,
            title: displayName
          })

        if (error) throw error
        console.log(`✅ Video link saved: ${videoUrl}`)
      } catch (error) {
        console.error(`❌ Failed to save video: ${error.message}`)
      }
    }
  }

  // Process folders
  for (const folderConfig of folders) {
    const { path: folderPath, name: folderName } = folderConfig
    const fullPath = path.join(basePath, folderPath)

    console.log(`\n📂 Processing folder: ${folderName || folderPath}`)
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Folder not found: ${fullPath}`)
      continue
    }

    // Get all files recursively
    const allFiles = getAllFiles(fullPath)
    const mediaFiles = allFiles.filter(file => {
      const info = getFileInfo(file)
      return info !== null
    })

    console.log(`   Found ${mediaFiles.length} media files`)
    totalFiles += mediaFiles.length

    for (let i = 0; i < mediaFiles.length; i++) {
      const filePath = mediaFiles[i]
      const fileName = path.basename(filePath)
      const fileInfo = getFileInfo(filePath)
      
      if (!fileInfo) continue

      try {
        // Read file
        const fileBuffer = fs.readFileSync(filePath)
        
        // Create storage path
        const storagePath = folderName 
          ? `${programId}/${folderName}/${fileName}`
          : `${programId}/${fileName}`
        
        // Upload to appropriate bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(fileInfo.bucket)
          .upload(storagePath, fileBuffer, {
            contentType: fileInfo.contentType,
            upsert: false,
            cacheControl: '3600'
          })

        if (uploadError) {
          console.error(`   ❌ [${i + 1}/${mediaFiles.length}] ${fileName} - ${uploadError.message}`)
          errorCount++
          continue
        }

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('program_media')
          .insert({
            program_id: programId,
            media_type: fileInfo.type,
            media_url: storagePath,
            file_name: fileName,
            folder_name: folderName || null,
            display_order: i
          })

        if (dbError) {
          console.error(`   ⚠️  Uploaded ${fileName} but DB save failed: ${dbError.message}`)
        }

        successCount++
        console.log(`   ✅ [${i + 1}/${mediaFiles.length}] ${fileName}`)
        
        // Rate limiting
        if (i % 10 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }

      } catch (error) {
        console.error(`   ❌ [${i + 1}/${mediaFiles.length}] ${fileName}: ${error.message}`)
        errorCount++
      }
    }
  }

  console.log(`\n${'━'.repeat(60)}`)
  console.log(`📊 ${displayName} - Complete!`)
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📁 Total: ${totalFiles}`)
  console.log(`${'━'.repeat(60)}\n`)
}

// ====================
// 🎯 MAIN CONFIGURATION
// ====================

async function main() {
  const baseProjectPath = 'C:\\Users\\babso\\Downloads\\Projects-20260228T131815Z-1-001\\Projects'

  const programs = [
    // 1. Summer 2019 - Girls Health Matter
    {
      programId: '2019-girls-health-matter',
      displayName: 'Summer 2019 — Girls Health Matter',
      basePath: path.join(baseProjectPath, 'Summer 2019 Girls Health Matter'),
      folders: [
        { path: 'Day 1_ Girls Secondary School Kubwa', name: 'Day 1 - Kubwa' },
        { path: 'Day 2_ Girls Secondary School Byazin', name: 'Day 2 - Byazin' },
        { path: '.', name: 'Reports' } // For the Word doc in root
      ],
      videos: []
    },

    // 2. Summer 2017 - Peer-to-Peer
    {
      programId: '2017-peer-to-peer',
      displayName: 'Summer 2017 — Peer-to-Peer Dialogue Program',
      basePath: path.join(baseProjectPath, 'Summer 2017 Peer-to-Peer Dialogue Program'),
      folders: [
        { path: 'DAY 1 - PICTURES', name: 'Day 1' },
        { path: 'DAY 2 - PICTURES', name: 'Day 2' }
      ],
      videos: ['https://www.youtube.com/watch?v=7Xn_ZcZEfac']
    },

    // 3. 2017 Full Life Nursery
    {
      programId: '2017-full-life-nursery',
      displayName: '2017 Partnership — Full Life Nursery & Primary School',
      basePath: path.join(baseProjectPath, '2017 Partnership with Full Life Nursery and Primary School'),
      folders: [
        { path: '.', name: null } // All files in root
      ],
      videos: []
    },

    // 4. 2018 Young Shapers Club
    {
      programId: '2018-young-shapers-club',
      displayName: '2018 Partnership — Young Shapers Club',
      basePath: path.join(baseProjectPath, '2018 Partnership with Young Shapers Club'),
      folders: [
        { path: '.', name: null }
      ],
      videos: []
    },

    // 5. 2019 Feeding Project Chicago
    {
      programId: '2019-feeding-project',
      displayName: '2019 Feeding Project — Chicago, Illinois',
      basePath: baseProjectPath,
      folders: [
        { path: '2019 Feeding Project Chicago, Illinois.docx', name: 'Reports' }
      ],
      videos: []
    }
  ]

  // Upload all programs
  for (const program of programs) {
    await uploadProgram(program)
  }

  console.log(`\n${'🎉'.repeat(30)}`)
  console.log(`✅ ALL PROGRAMS UPLOADED SUCCESSFULLY!`)
  console.log(`${'🎉'.repeat(30)}\n`)
}

main().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
