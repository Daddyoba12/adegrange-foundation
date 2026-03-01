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

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles
  }

  if (fs.statSync(dirPath).isFile()) {
    return [dirPath]
  }

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

function getFileInfo(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
  const docExts = ['.pdf', '.doc', '.docx']
  
  if (imageExts.includes(ext)) {
    return { 
      type: 'image', 
      bucket: 'program-images', 
      contentType: ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : `image/${ext.slice(1)}` 
    }
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
  const { programId, displayName, folders, videoUrl } = config
  
  console.log(`\n${'='.repeat(70)}`)
  console.log(`📁 ${displayName}`)
  console.log(`${'='.repeat(70)}\n`)

  let totalFiles = 0
  let successCount = 0
  let errorCount = 0
  const errors = []

  // Handle video URL
  if (videoUrl) {
    console.log(`🎥 Saving video link: ${videoUrl}`)
    try {
      const { error } = await supabase
        .from('program_videos')
        .insert({
          program_id: programId,
          video_url: videoUrl,
          title: displayName
        })

      if (error) {
        console.error(`❌ Video error: ${error.message}`)
        errors.push({ file: 'Video URL', error: error.message })
      } else {
        console.log(`✅ Video saved\n`)
      }
    } catch (err) {
      console.error(`❌ Video exception: ${err.message}`)
      errors.push({ file: 'Video URL', error: err.message })
    }
  }

  // Upload media files
  for (const folder of folders) {
    const { fullPath, displayName: folderName } = folder
    
    console.log(`📂 ${folderName}`)
    
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️  Path not found: ${fullPath}\n`)
      continue
    }

    const allFiles = getAllFiles(fullPath)
    const mediaFiles = allFiles.filter(file => getFileInfo(file) !== null)
    
    console.log(`   Found ${mediaFiles.length} media files`)
    totalFiles += mediaFiles.length

    for (let i = 0; i < mediaFiles.length; i++) {
      const filePath = mediaFiles[i]
      const fileName = path.basename(filePath)
      const fileInfo = getFileInfo(filePath)
      if (!fileInfo) continue

      try {
        const fileBuffer = fs.readFileSync(filePath)
        const fileSize = (fileBuffer.length / 1024 / 1024).toFixed(2)
        const storagePath = `${programId}/${folderName}/${fileName}`
        
        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(fileInfo.bucket)
          .upload(storagePath, fileBuffer, {
            contentType: fileInfo.contentType,
            upsert: true,
            cacheControl: '3600'
          })

        if (uploadError) {
          console.error(`   ❌ [${i + 1}/${mediaFiles.length}] ${fileName}: ${uploadError.message}`)
          errors.push({ file: fileName, folder: folderName, error: uploadError.message })
          errorCount++
          continue
        }

        // Save to database
        const { error: dbError } = await supabase.from('program_media').insert({
          program_id: programId,
          media_type: fileInfo.type,
          media_url: storagePath,
          file_name: fileName,
          folder_name: folderName,
          display_order: i
        })

        if (dbError) {
          console.error(`   ❌ [${i + 1}/${mediaFiles.length}] DB Error for ${fileName}: ${dbError.message}`)
          errors.push({ file: fileName, folder: folderName, error: `DB: ${dbError.message}` })
          errorCount++
        } else {
          successCount++
          // Show progress every file for debugging
          console.log(`   ✅ [${i + 1}/${mediaFiles.length}] ${fileName} (${fileSize}MB)`)
        }

        // Small delay to avoid overwhelming the API
        if (i % 5 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }

      } catch (error) {
        console.error(`   ❌ [${i + 1}/${mediaFiles.length}] Exception for ${fileName}: ${error.message}`)
        errors.push({ file: fileName, folder: folderName, error: error.message })
        errorCount++
      }
    }
    console.log(``)
  }

  console.log(`${'─'.repeat(70)}`)
  console.log(`📊 ${displayName} - Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📁 Total: ${totalFiles}`)
  
  if (errors.length > 0) {
    console.log(`\n   ⚠️  Error Details:`)
    errors.forEach((err, idx) => {
      console.log(`   ${idx + 1}. ${err.file} (${err.folder || 'N/A'}): ${err.error}`)
    })
  }
  
  console.log(`${'─'.repeat(70)}\n`)
}

async function main() {
  console.log('\n🔍 Verifying Supabase connection...')
  
  const { data, error } = await supabase.from('program_media').select('count').limit(1)
  if (error) {
    console.error('❌ Supabase connection failed:', error.message)
    process.exit(1)
  }
  console.log('✅ Connected to Supabase\n')

  const base = 'C:\\Users\\babso\\Downloads\\Projects-20260228T131815Z-1-001\\Projects'

  const programs = [
    {
      programId: '2019-feeding-project',
      displayName: '2019 Feeding Project — Chicago, Illinois',
      folders: [
        { fullPath: path.join(base, '2019 Feeding Project Chicago, Illinois.docx'), displayName: 'Reports' }
      ]
    },
    {
      programId: '2019-girls-health-matter',
      displayName: 'Summer 2019 — Girls Health Matter',
      folders: [
        { fullPath: path.join(base, 'Summer 2019 Girls Health Matter', 'Day 1_ Girls Secondary School Kubwa'), displayName: 'Day 1 - Kubwa' },
        { fullPath: path.join(base, 'Summer 2019 Girls Health Matter', 'Day 2_ Girls Secondary School Byazin'), displayName: 'Day 2 - Byazin' },
        { fullPath: path.join(base, 'Summer 2019 Girls Health Matter', 'Girls Health Matter-Annual Report (Oct 2019).docx'), displayName: 'Reports' }
      ]
    },
    {
      programId: '2017-peer-to-peer',
      displayName: 'Summer 2017 — Peer-to-Peer Dialogue Program',
      videoUrl: 'https://www.youtube.com/watch?v=7Xn_ZcZEfac',
      folders: [
        { fullPath: path.join(base, 'Summer 2017 Peer-to-Peer Dialogue Program', 'DAY 1 - PICTURES'), displayName: 'Day 1' },
        { fullPath: path.join(base, 'Summer 2017 Peer-to-Peer Dialogue Program', 'DAY 2 - PICTURES'), displayName: 'Day 2' }
      ]
    },
    {
      programId: '2017-full-life-nursery',
      displayName: '2017 Partnership — Full Life Nursery & Primary School',
      folders: [
        { fullPath: path.join(base, '2017 Partnership with Full Life Nursery and Primary School'), displayName: 'All Photos' }
      ]
    },
    {
      programId: '2018-young-shapers-club',
      displayName: '2018 Partnership — Young Shapers Club',
      folders: [
        { fullPath: path.join(base, '2018 Partnership with Young Shapers Club'), displayName: 'Reports' }
      ]
    }
  ]

  console.log('🚀 Starting fresh upload...\n')
  console.log('⏱️  This may take a few minutes for 200+ files...\n')
  
  for (const program of programs) {
    await uploadProgram(program)
  }

  console.log('\n' + '🎉'.repeat(35))
  console.log('✅ UPLOAD COMPLETE!')
  console.log('🎉'.repeat(35) + '\n')
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  console.error(error.stack)
  process.exit(1)
})
