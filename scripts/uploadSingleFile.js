import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function uploadSingleFile() {
  const filePath = 'C:\\Users\\babso\\Downloads\\Girls Health Matter-Annual Report.pdf'
  const programId = '2019-girls-health-matter'
  const folderName = 'Reports'
  
  console.log('\n📤 Uploading single file...\n')
  console.log('File:', filePath)
  console.log('Program:', programId)
  console.log('Folder:', folderName)
  console.log('')

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found!')
    return
  }

  try {
    const fileName = path.basename(filePath)
    const fileBuffer = fs.readFileSync(filePath)
    const fileSize = (fileBuffer.length / 1024 / 1024).toFixed(2)
    
    console.log(`📄 File: ${fileName} (${fileSize}MB)`)
    
    // Upload to Supabase Storage
    const storagePath = `${programId}/${folderName}/${fileName}`
    
    const { error: uploadError } = await supabase.storage
      .from('program-documents')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('❌ Upload failed:', uploadError.message)
      return
    }

    console.log('✅ Uploaded to storage')

    // Save metadata to database
    const { error: dbError } = await supabase
      .from('program_media')
      .insert({
        program_id: programId,
        media_type: 'document',
        media_url: storagePath,
        file_name: fileName,
        folder_name: folderName,
        display_order: 0
      })

    if (dbError) {
      console.error('❌ Database save failed:', dbError.message)
      return
    }

    console.log('✅ Saved to database')
    console.log('\n🎉 Upload complete!\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

uploadSingleFile()
