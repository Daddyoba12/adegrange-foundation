'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Upload, FileText, BookOpen, LogOut, CheckCircle, AlertCircle } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AdminPanelProps {
  onLogout: () => void
}

type Tab = 'media' | 'blog' | 'program'

// ─── Shared UI ───────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = `w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700
  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
  placeholder-gray-400 dark:placeholder-gray-500
  focus:ring-2 focus:ring-pink-500 focus:outline-none transition text-sm`

function StatusBanner({ msg }: { msg: string }) {
  const ok = msg.startsWith('✅')
  return (
    <div className={`flex items-start gap-2 p-3.5 rounded-xl text-sm ${
      ok ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
         : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
    }`}>
      {ok ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
      {msg}
    </div>
  )
}

// ─── Tab 1: Media Upload ─────────────────────────────────────────────────────

const existingPrograms = [
  { id: '2017-full-life-nursery',     name: '2017 Full Life Nursery' },
  { id: '2018-young-shapers-club',    name: '2018 Young Shapers Club' },
  { id: '2017-peer-to-peer',          name: 'Summer 2017 Peer-to-Peer' },
  { id: '2019-girls-health-matter',   name: 'Summer 2019 Girls Health Matter' },
  { id: '2019-feeding-project',       name: '2019 Feeding Project Chicago' },
]

function MediaUpload() {
  const [selectedProgram, setSelectedProgram] = useState('')
  const [folderName, setFolderName]           = useState('')
  const [files, setFiles]                     = useState<FileList | null>(null)
  const [uploading, setUploading]             = useState(false)
  const [progress, setProgress]               = useState(0)
  const [message, setMessage]                 = useState('')

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProgram || !folderName || !files || files.length === 0) {
      setMessage('⚠ Please fill all fields and select files')
      return
    }
    setUploading(true); setProgress(0); setMessage('')
    let ok = 0, fail = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext  = file.name.split('.').pop()?.toLowerCase()
      const isImg = ['jpg','jpeg','png','gif','webp'].includes(ext || '')
      const isDoc = ['pdf','doc','docx'].includes(ext || '')
      if (!isImg && !isDoc) continue

      const bucket      = isImg ? 'program-images' : 'program-documents'
      const mediaType   = isImg ? 'image' : 'document'
      const storagePath = `${selectedProgram}/${folderName}/${file.name}`

      try {
        const { error: upErr } = await supabase.storage.from(bucket).upload(storagePath, file, { upsert: true, cacheControl: '3600' })
        if (upErr) throw upErr
        const { error: dbErr } = await supabase.from('program_media').insert({
          program_id: selectedProgram, media_type: mediaType, media_url: storagePath,
          file_name: file.name, folder_name: folderName, display_order: i
        })
        if (dbErr) throw dbErr
        ok++
      } catch { fail++ }

      setProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setUploading(false)
    setMessage(`✅ Done! ${ok} uploaded, ${fail} failed.`)
    setFiles(null);
    (e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      <Field label="Program">
        <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className={inputCls} required>
          <option value="">Select a program…</option>
          {existingPrograms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </Field>

      <Field label="Folder / Gallery Name">
        <input type="text" value={folderName} onChange={e => setFolderName(e.target.value)}
          placeholder="e.g. Day 1, Reports, All Photos" className={inputCls} required />
      </Field>

      <Field label="Files">
        <input type="file" multiple accept="image/*,.pdf,.doc,.docx"
          onChange={e => setFiles(e.target.files)}
          className={`${inputCls} file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700`}
          required />
        <p className="text-xs text-gray-400 mt-1.5">Images (jpg, png, gif, webp) and documents (pdf, doc, docx)</p>
      </Field>

      {uploading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-pink-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {message && <StatusBanner msg={message} />}

      <button type="submit" disabled={uploading}
        className="w-full py-3 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
        {uploading ? `Uploading… ${progress}%` : 'Upload Files'}
      </button>
    </form>
  )
}

// ─── Tab 2: Add Blog Post ────────────────────────────────────────────────────

const blogCategories = ['Health & Tips', 'Program Stories', 'Thought Leadership']

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function AddBlogPost() {
  const empty = { title: '', slug: '', category: '', author: '', authorRole: '', excerpt: '', content: '', readTime: '', imageUrl: '', tags: '', featured: false, date: new Date().toISOString().split('T')[0] }
  const [form, setForm]     = useState(empty)
  const [saving, setSaving] = useState(false)
  const [message, setMsg]   = useState('')
  const [imgFile, setImgFile] = useState<File | null>(null)

  function set(k: keyof typeof empty, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.category || !form.author || !form.excerpt) {
      setMsg('⚠ Please fill all required fields.')
      return
    }
    setSaving(true); setMsg('')

    let imageUrl = form.imageUrl

    // Upload cover image if one was selected
    if (imgFile) {
      const ext  = imgFile.name.split('.').pop()
      const path = `blog/${form.slug || slugify(form.title)}.${ext}`
      const { error: upErr } = await supabase.storage.from('program-images').upload(path, imgFile, { upsert: true })
      if (upErr) {
        setMsg('⚠ Image upload failed: ' + upErr.message)
        setSaving(false); return
      }
      const { data: urlData } = supabase.storage.from('program-images').getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }

    const slug = form.slug || slugify(form.title)
    const { error } = await supabase.from('blog_posts').insert({
      slug,
      title:       form.title,
      excerpt:     form.excerpt,
      content:     form.content,
      category:    form.category,
      author:      form.author,
      author_role: form.authorRole,
      date:        form.date,
      read_time:   parseInt(form.readTime) || 5,
      image_url:   imageUrl,
      tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured:    form.featured,
    })

    setSaving(false)
    if (error) {
      setMsg('⚠ Error: ' + error.message)
    } else {
      setMsg('✅ Blog post published successfully!')
      setForm(empty)
      setImgFile(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title *">
          <input type="text" value={form.title}
            onChange={e => { set('title', e.target.value); set('slug', slugify(e.target.value)) }}
            placeholder="Article title" className={inputCls} required />
        </Field>
        <Field label="Slug (auto-generated)">
          <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)}
            placeholder="url-friendly-slug" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category *">
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls} required>
            <option value="">Select category…</option>
            {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Date *">
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Author *">
          <input type="text" value={form.author} onChange={e => set('author', e.target.value)}
            placeholder="Author name" className={inputCls} required />
        </Field>
        <Field label="Author Role">
          <input type="text" value={form.authorRole} onChange={e => set('authorRole', e.target.value)}
            placeholder="e.g. Health Programme Lead" className={inputCls} />
        </Field>
      </div>

      <Field label="Excerpt *">
        <textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
          placeholder="Short summary shown on blog listing…" className={`${inputCls} resize-none`} required />
      </Field>

      <Field label="Full Content">
        <textarea rows={8} value={form.content} onChange={e => set('content', e.target.value)}
          placeholder="Write the full article here…" className={`${inputCls} resize-y`} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Cover Image (upload)">
          <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] ?? null)}
            className={`${inputCls} file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700`} />
        </Field>
        <Field label="Or Image URL">
          <input type="text" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)}
            placeholder="https://… or /images/…" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Read Time (minutes)">
          <input type="number" min="1" value={form.readTime} onChange={e => set('readTime', e.target.value)}
            placeholder="5" className={inputCls} />
        </Field>
        <Field label="Tags (comma-separated)">
          <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
            placeholder="nigeria, health, children" className={inputCls} />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Featured post</span>
      </label>

      {message && <StatusBanner msg={message} />}

      <button type="submit" disabled={saving}
        className="w-full py-3 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
        {saving ? 'Publishing…' : 'Publish Blog Post'}
      </button>
    </form>
  )
}

// ─── Tab 3: Add Program ───────────────────────────────────────────────────────

function AddProgram() {
  const empty = { name: '', id: '', description: '', year: '', location: '', beneficiaries: '', pillar: '' }
  const [form, setForm]     = useState(empty)
  const [saving, setSaving] = useState(false)
  const [message, setMsg]   = useState('')

  function set(k: keyof typeof empty, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.year || !form.location) {
      setMsg('⚠ Please fill all required fields.')
      return
    }
    setSaving(true); setMsg('')

    const id = form.id || slugify(form.name)
    const { error } = await supabase.from('programs').insert({
      id,
      name:          form.name,
      description:   form.description,
      year:          parseInt(form.year),
      location:      form.location,
      beneficiaries: parseInt(form.beneficiaries) || 0,
      pillar:        form.pillar,
    })

    setSaving(false)
    if (error) {
      setMsg('⚠ Error: ' + error.message)
    } else {
      setMsg('✅ Program added successfully!')
      setForm(empty)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Program Name *">
          <input type="text" value={form.name}
            onChange={e => { set('name', e.target.value); set('id', slugify(e.target.value)) }}
            placeholder="e.g. Girls Health Matter 2024" className={inputCls} required />
        </Field>
        <Field label="Program ID (auto-generated)">
          <input type="text" value={form.id} onChange={e => set('id', e.target.value)}
            placeholder="girls-health-matter-2024" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Year *">
          <input type="number" min="2000" max="2099" value={form.year} onChange={e => set('year', e.target.value)}
            placeholder="2024" className={inputCls} required />
        </Field>
        <Field label="Location *">
          <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
            placeholder="Lagos, Nigeria" className={inputCls} required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Beneficiaries Reached">
          <input type="number" min="0" value={form.beneficiaries} onChange={e => set('beneficiaries', e.target.value)}
            placeholder="150" className={inputCls} />
        </Field>
        <Field label="Strategic Pillar">
          <select value={form.pillar} onChange={e => set('pillar', e.target.value)} className={inputCls}>
            <option value="">Select pillar…</option>
            <option>Maternal Health</option>
            <option>Child Education</option>
            <option>Community Outreach</option>
            <option>Health Advocacy</option>
            <option>Nutrition</option>
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Describe the programme goals, activities, and outcomes…" className={`${inputCls} resize-y`} />
      </Field>

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
        After adding a program here, go to the <strong>Media Upload</strong> tab to upload photos and documents for it.
      </div>

      {message && <StatusBanner msg={message} />}

      <button type="submit" disabled={saving}
        className="w-full py-3 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
        {saving ? 'Saving…' : 'Add Program'}
      </button>
    </form>
  )
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'media',   label: 'Media Upload',   icon: <Upload size={16} /> },
  { id: 'blog',    label: 'Add Blog Post',  icon: <BookOpen size={16} /> },
  { id: 'program', label: 'Add Program',    icon: <FileText size={16} /> },
]

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('media')

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">AdeGrange Child Foundation</p>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <LogOut size={15} />
            Logout
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-6 bg-white dark:bg-gray-900">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>

          {activeTab === 'media'   && <MediaUpload />}
          {activeTab === 'blog'    && <AddBlogPost />}
          {activeTab === 'program' && <AddProgram />}
        </div>

      </div>
    </div>
  )
}
