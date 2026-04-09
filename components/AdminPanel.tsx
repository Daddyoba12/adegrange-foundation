'use client'

import { useState, useEffect } from 'react'
import {
  Upload, FileText, BookOpen, LogOut, CheckCircle, AlertCircle,
  Image as ImageIcon, Mail, Users, Shield, HelpCircle, Trash2,
  Eye, EyeOff, Plus, AlertTriangle, Pencil, BookMarked, ChevronDown
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AdminPanelProps { onLogout: () => void }
type Tab = 'media' | 'blog' | 'program' | 'messages' | 'registrations' | 'software' | 'help' | 'guide'

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = `w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
  bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base
  placeholder-gray-400 dark:placeholder-gray-500
  focus:ring-2 focus:ring-pink-500 focus:outline-none transition`

const fileCls = `${inputCls} file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
  file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700
  file:cursor-pointer cursor-pointer`

function StatusBanner({ msg }: { msg: string }) {
  const ok = msg.startsWith('✅')
  return (
    <div className={`flex items-start gap-2 p-3.5 rounded-xl text-sm ${
      ok
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
    }`}>
      {ok
        ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
        : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
      <span>{msg}</span>
    </div>
  )
}

function SubmitBtn({ loading, label, loadingLabel }: {
  loading: boolean; label: string; loadingLabel: string
}) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-3.5 rounded-xl font-semibold text-white text-sm sm:text-base
                 bg-pink-600 hover:bg-pink-700 active:scale-95
                 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
      {loading ? loadingLabel : label}
    </button>
  )
}

// ─── Tab: Media Upload ────────────────────────────────────────────────────────

function MediaTab() {
  const [programId, setProgramId] = useState('')
  const [folderName, setFolderName] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [programs, setPrograms] = useState<{ value: string; label: string }[]>([])

  // Inline new-program form
  const [showNewProgram, setShowNewProgram] = useState(false)
  const [newProg, setNewProg] = useState({ title: '', slug: '', year: '' })
  const [savingProg, setSavingProg] = useState(false)
  const [progMsg, setProgMsg] = useState('')

  // Existing media for selected program
  const [existingMedia, setExistingMedia] = useState<any[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)

  useEffect(() => { loadPrograms() }, [])

  async function loadPrograms() {
    const { data } = await supabase
      .from('programs')
      .select('slug, title, year')
      .order('year', { ascending: true })
    setPrograms(
      (data || []).map(p => ({
        value: p.slug,
        label: `${p.year ? p.year + ' — ' : ''}${p.title}`,
      }))
    )
  }

  async function handleProgramSelect(slug: string) {
    setProgramId(slug)
    if (!slug) { setExistingMedia([]); return }
    setMediaLoading(true)
    const { data } = await supabase
      .from('program_media')
      .select('*')
      .eq('program_id', slug)
      .order('created_at', { ascending: false })
    const enriched = (data || []).map(item => {
      const bucket = item.media_type === 'image' ? 'program-images' : 'program-documents'
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(item.media_url)
      return { ...item, url: urlData.publicUrl }
    })
    setExistingMedia(enriched)
    setMediaLoading(false)
  }

  async function deleteMedia(item: any) {
    if (!confirm(`Delete "${item.file_name}"? This cannot be undone.`)) return
    const bucket = item.media_type === 'image' ? 'program-images' : 'program-documents'
    await supabase.storage.from(bucket).remove([item.media_url])
    await supabase.from('program_media').delete().eq('id', item.id)
    setExistingMedia(prev => prev.filter(m => m.id !== item.id))
  }

  async function createProgram(e: React.FormEvent) {
    e.preventDefault()
    setSavingProg(true)
    setProgMsg('')
    const { error } = await supabase.from('programs').insert({
      title: newProg.title,
      slug: newProg.slug,
      year: newProg.year,
      description: '',
    })
    setSavingProg(false)
    if (error) { setProgMsg('⚠ ' + error.message); return }
    setProgMsg('✅ Program created!')
    await loadPrograms()
    setProgramId(newProg.slug)
    handleProgramSelect(newProg.slug)
    setNewProg({ title: '', slug: '', year: '' })
    setShowNewProgram(false)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!files || files.length === 0) { setMsg('⚠ Please select at least one file.'); return }
    setLoading(true)
    setMsg('')
    let successCount = 0
    let errorCount = 0

    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith('image/')
      const bucket = isImage ? 'program-images' : 'program-documents'
      const folder = folderName || programId
      const filePath = `${folder}/${file.name}`

      const { error: uploadErr } = await supabase.storage
        .from(bucket).upload(filePath, file, { upsert: true })

      if (uploadErr) { errorCount++; continue }

      const { error: dbErr } = await supabase.from('program_media').insert({
        program_id: programId,
        folder_name: folder,
        file_name: file.name,
        media_url: filePath,
        media_type: isImage ? 'image' : 'document',
      })

      if (dbErr) errorCount++
      else successCount++
    }

    const resultMsg = errorCount === 0
      ? `✅ ${successCount} file(s) uploaded successfully.`
      : `⚠ ${successCount} uploaded, ${errorCount} failed.`
    setMsg(resultMsg)
    setLoading(false)
    // Refresh the existing media list
    if (programId) handleProgramSelect(programId)
  }

  return (
    <div className="space-y-6">

      {/* ── Upload form ─────────────────────────────────────── */}
      <form onSubmit={handleUpload} className="space-y-5">

        {/* Program selector + inline create */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
            Program
          </label>
          <select value={programId}
            onChange={e => handleProgramSelect(e.target.value)}
            required className={inputCls}>
            <option value="">Select program</option>
            {programs.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Inline "create new program" toggle */}
          <button type="button"
            onClick={() => setShowNewProgram(s => !s)}
            className="mt-2 flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-500 font-semibold">
            <Plus size={12} />
            {showNewProgram ? 'Cancel — hide form' : 'Program not listed? Create it here'}
          </button>

          {showNewProgram && (
            <div className="mt-3 p-4 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10 space-y-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quick-create a new program</p>
              <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3">
                <input placeholder="Program title" value={newProg.title}
                  onChange={e => setNewProg(p => ({ ...p, title: e.target.value }))}
                  className={inputCls} />
                <input placeholder="Slug (e.g. 2025-new-drive)" value={newProg.slug}
                  onChange={e => setNewProg(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className={inputCls} />
                <input placeholder="Year (e.g. 2025)" value={newProg.year}
                  onChange={e => setNewProg(p => ({ ...p, year: e.target.value }))}
                  className={inputCls} />
              </div>
              {progMsg && <StatusBanner msg={progMsg} />}
              <button type="button" onClick={createProgram} disabled={savingProg || !newProg.title || !newProg.slug}
                className="w-full py-2.5 rounded-xl font-semibold text-white text-sm bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition">
                {savingProg ? 'Creating…' : 'Create Program & Select It'}
              </button>
              <p className="text-[11px] text-gray-400">You can add full details (description, location, impact) later in the Program Manager tab.</p>
            </div>
          )}
        </div>

        <Field label="Folder Name (optional)">
          <input type="text" value={folderName}
            onChange={e => setFolderName(e.target.value)}
            placeholder="e.g. gallery-2025" className={inputCls} />
        </Field>
        <Field label="Files">
          <input type="file" multiple
            onChange={e => setFiles(e.target.files)}
            className={fileCls}
            accept="image/*,.pdf,.doc,.docx" />
        </Field>
        {msg && <StatusBanner msg={msg} />}
        <SubmitBtn loading={loading} label="Upload Files" loadingLabel="Uploading..." />
      </form>

      {/* ── Existing files for selected program ─────────────── */}
      {programId && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Uploaded Files
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {existingMedia.length} file{existingMedia.length !== 1 ? 's' : ''}
            </span>
          </div>

          {mediaLoading && (
            <p className="text-sm text-gray-400 py-4 text-center">Loading files…</p>
          )}

          {!mediaLoading && existingMedia.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              No files uploaded for this program yet.
            </p>
          )}

          {!mediaLoading && existingMedia.length > 0 && (
            <div className="space-y-2">
              {existingMedia.map(item => (
                <div key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  {/* Thumbnail or doc icon */}
                  {item.media_type === 'image' ? (
                    <img src={item.url} alt={item.file_name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 flex-shrink-0 text-lg">
                      📄
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.file_name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{item.media_type}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 hover:text-blue-500"
                      title="View file">
                      <Eye size={14} />
                    </a>
                    <button onClick={() => deleteMedia(item)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-500"
                      title="Delete file">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Tab: Blog ────────────────────────────────────────────────────────────────

function BlogTab() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [showForm, setShowForm] = useState(false)
  const empty = { title: '', slug: '', excerpt: '', content: '', published: false }
  const [form, setForm] = useState(empty)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('blog_posts').insert(form)
    setSaving(false)
    if (error) { setMsg('⚠ Error: ' + error.message); return }
    setMsg('✅ Post created.')
    setForm(empty)
    setShowForm(false)
    fetchPosts()
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    fetchPosts()
  }

  async function togglePublish(id: string, current: boolean) {
    await supabase.from('blog_posts').update({ published: !current }).eq('id', id)
    fetchPosts()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{posts.length} posts</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition">
          <Plus size={12} /> New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave}
          className="space-y-4 p-4 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">New Blog Post</h3>
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3">
            <input type="text" placeholder="Title" required value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
            <input type="text" placeholder="Slug (e.g. my-post)" required value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} />
          </div>
          <input type="text" placeholder="Excerpt (short summary)" value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className={inputCls} />
          <textarea rows={6} placeholder="Full content..." required value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className={`${inputCls} resize-none`} />
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" checked={form.published}
              onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 accent-pink-600" />
            Publish immediately
          </label>
          {msg && <StatusBanner msg={msg} />}
          <SubmitBtn loading={saving} label="Save Post" loadingLabel="Saving..." />
        </form>
      )}

      {loading && <p className="text-sm text-gray-400 py-8 text-center">Loading posts...</p>}
      {!loading && posts.length === 0 && (
        <p className="text-center py-12 text-gray-400 text-sm">No posts yet.</p>
      )}

      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id}
            className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{post.title}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  post.published
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              {post.excerpt && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{post.excerpt}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {new Date(post.created_at).toLocaleString('en-GB')}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => togglePublish(post.id, post.published)}
                title={post.published ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400">
                {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => deletePost(post.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Program Manager ─────────────────────────────────────────────────────

const emptyProgram = {
  title: '', slug: '', description: '',
  year: '', location: '', beneficiaries: '',
  full_description: '', impact_text: ''
}

function ProgramTab() {
  const [programs, setPrograms] = useState<any[]>([])
  const [form, setForm] = useState(emptyProgram)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchPrograms() }, [])

  async function fetchPrograms() {
    const { data } = await supabase.from('programs').select('*').order('year', { ascending: true })
    setPrograms(data || [])
  }

  async function saveProgram(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    // Convert the impact textarea (one per line) into an array
    const impact = form.impact_text
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      year: form.year,
      location: form.location,
      beneficiaries: form.beneficiaries,
      full_description: form.full_description,
      impact,
    }

    if (editingId) {
      const { error } = await supabase.from('programs').update(payload).eq('id', editingId)
      setMsg(error ? '⚠ Error: ' + error.message : '✅ Program updated.')
    } else {
      const { error } = await supabase.from('programs').insert(payload)
      setMsg(error ? '⚠ Error: ' + error.message : '✅ Program added.')
    }
    setSaving(false)
    setForm(emptyProgram)
    setEditingId(null)
    setShowForm(false)
    fetchPrograms()
  }

  function startEdit(p: any) {
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      description: p.description || '',
      year: p.year || '',
      location: p.location || '',
      beneficiaries: p.beneficiaries || '',
      full_description: p.full_description || '',
      impact_text: Array.isArray(p.impact) ? p.impact.join('\n') : (p.impact || ''),
    })
    setEditingId(p.id)
    setShowForm(true)
    setMsg('')
  }

  function cancelEdit() {
    setForm(emptyProgram)
    setEditingId(null)
    setShowForm(false)
    setMsg('')
  }

  async function deleteProgram(id: string) {
    if (!confirm('Delete this program? This cannot be undone.')) return
    await supabase.from('programs').delete().eq('id', id)
    fetchPrograms()
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{programs.length} program{programs.length !== 1 ? 's' : ''}</p>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyProgram) }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition">
            <Plus size={12} /> Add Program
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={saveProgram}
          className="space-y-3 p-4 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {editingId ? 'Edit Program' : 'Add New Program'}
          </h3>

          {/* Title + Slug */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Title</label>
              <input placeholder="e.g. 2017 Partnership - Full Life School" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                URL Slug <span className="normal-case font-normal text-gray-400">(no spaces)</span>
              </label>
              <input placeholder="e.g. 2017-full-life-nursery" value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                required className={inputCls} />
            </div>
          </div>

          {/* Year + Location + Beneficiaries */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Year</label>
              <input placeholder="e.g. 2019" value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Location</label>
              <input placeholder="e.g. Lagos, Nigeria" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Beneficiaries</label>
              <input placeholder="e.g. 200+ youth" value={form.beneficiaries}
                onChange={e => setForm({ ...form, beneficiaries: e.target.value })}
                className={inputCls} />
            </div>
          </div>

          {/* Short description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Short Description</label>
            <textarea placeholder="One or two sentences shown on the programs listing page." rows={2} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} resize-none`} />
          </div>

          {/* Full description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Full Description</label>
            <textarea placeholder="Full paragraph shown on the program detail page." rows={4} value={form.full_description}
              onChange={e => setForm({ ...form, full_description: e.target.value })}
              className={`${inputCls} resize-none`} />
          </div>

          {/* Impact points */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Key Impact Points <span className="normal-case font-normal text-gray-400">(one per line)</span>
            </label>
            <textarea
              placeholder={'e.g.\nProvided educational materials\nTrained 50 teachers\nReached 200 families'}
              rows={5} value={form.impact_text}
              onChange={e => setForm({ ...form, impact_text: e.target.value })}
              className={`${inputCls} resize-none`} />
          </div>

          {msg && <StatusBanner msg={msg} />}
          <div className="flex gap-2">
            <SubmitBtn loading={saving}
              label={editingId ? 'Update Program' : 'Save Program'}
              loadingLabel="Saving..." />
            <button type="button" onClick={cancelEdit}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Programs list */}
      {programs.length === 0 && !showForm && (
        <p className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No programs yet. Click "Add Program" to get started.</p>
      )}
      <div className="space-y-3">
        {programs.map(p => (
          <div key={p.id}
            className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{p.title}</p>
                {p.year && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {p.year}
                  </span>
                )}
              </div>
              {p.location && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">📍 {p.location}</p>}
              {p.beneficiaries && <p className="text-xs text-gray-400 dark:text-gray-500">👥 {p.beneficiaries}</p>}
              {p.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{p.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => startEdit(p)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 hover:text-blue-500">
                <Pencil size={14} />
              </button>
              <button onClick={() => deleteProgram(p.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Messages ────────────────────────────────────────────────────────────

function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function markRead(id: string, current: boolean) {
    await supabase.from('contact_messages').update({ is_read: !current }).eq('id', id)
    fetchMessages()
  }

  async function deleteMsg(id: string) {
    if (!confirm('Delete this message?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    fetchMessages()
  }

  const unread = messages.filter(m => !m.is_read).length

  if (loading) return <p className="text-sm text-gray-400 py-8 text-center">Loading messages...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {messages.length} total &mdash;
          <span className="text-pink-600 font-semibold ml-1">{unread} unread</span>
        </p>
        <button onClick={fetchMessages}
          className="text-xs text-pink-600 hover:text-pink-500 underline underline-offset-2">
          Refresh
        </button>
      </div>

      {messages.length === 0 && (
        <p className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No messages yet.</p>
      )}

      {messages.map(msg => (
        <div key={msg.id}
          className={`rounded-xl border p-4 transition-all ${
            msg.is_read
              ? 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
              : 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10'
          }`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{msg.name}</span>
                {!msg.is_read && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-pink-600 text-white px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              <a href={`mailto:${msg.email}`}
                className="text-xs text-pink-600 hover:underline break-all">{msg.email}</a>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {new Date(msg.created_at).toLocaleString('en-GB')}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => markRead(msg.id, msg.is_read)}
                title={msg.is_read ? 'Mark unread' : 'Mark read'}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400">
                {msg.is_read ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => deleteMsg(msg.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${
              expanded === msg.id ? '' : 'line-clamp-2'
            }`}>
              {msg.message}
            </p>
            {msg.message?.length > 120 && (
              <button
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="text-xs text-pink-600 hover:text-pink-500 mt-1">
                {expanded === msg.id ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Tab: Registrations ───────────────────────────────────────────────────────

function RegistrationsTab() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const empty = { full_name: '', email: '', type: 'visitor', amount: '', notes: '' }
  const [form, setForm] = useState(empty)

  useEffect(() => { fetchRecords() }, [])

  async function fetchRecords() {
    setLoading(true)
    const { data } = await supabase
      .from('registrations').select('*').order('created_at', { ascending: false })
    setRecords(data || [])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('registrations').insert({
      full_name: form.full_name,
      email: form.email,
      type: form.type,
      amount: form.amount ? parseFloat(form.amount) : null,
      notes: form.notes,
    })
    setSaving(false)
    if (error) { setMsg('⚠ Error: ' + error.message); return }
    setMsg('✅ Record added.')
    setForm(empty)
    fetchRecords()
  }

  async function deleteRecord(id: string) {
    if (!confirm('Delete this record?')) return
    await supabase.from('registrations').delete().eq('id', id)
    fetchRecords()
  }

  const typeBadge: Record<string, string> = {
    visitor:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    donor:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    registered: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{records.length} records</p>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition">
          <Plus size={12} /> Add Record
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd}
          className="space-y-3 p-4 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Add New Record</h3>
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3">

            <input type="text" placeholder="Full name" value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className={inputCls} />
            <input type="email" placeholder="Email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
            <select value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls}>
              <option value="visitor">Visitor</option>
              <option value="donor">Donor</option>
              <option value="registered">Registered</option>
            </select>
            <input type="number" placeholder="Amount (if donor)" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className={inputCls} />
          </div>
          <input type="text" placeholder="Notes" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} />
          {msg && <StatusBanner msg={msg} />}
          <SubmitBtn loading={saving} label="Add Record" loadingLabel="Saving..." />
        </form>
      )}

      {loading && <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>}
      {!loading && records.length === 0 && (
        <p className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No records yet.</p>
      )}

      <div className="space-y-3">
        {records.map(rec => (
          <div key={rec.id}
            className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {rec.full_name || 'Anonymous'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${typeBadge[rec.type] || typeBadge.visitor}`}>
                  {rec.type}
                </span>
                {rec.amount && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                    £{rec.amount}
                  </span>
                )}
              </div>
              {rec.email && (
                <a href={`mailto:${rec.email}`} className="text-xs text-pink-600 hover:underline break-all">
                  {rec.email}
                </a>
              )}
              {rec.notes && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{rec.notes}</p>}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {new Date(rec.created_at).toLocaleString('en-GB')}
              </p>
            </div>
        

            <button onClick={() => deleteRecord(rec.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-500 flex-shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Software Tracker ────────────────────────────────────────────────────

function SoftwareTracker() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [showPwd, setShowPwd] = useState<string | null>(null)
  const empty = {
    service_name: '', category: 'Hosting', login_url: '',
    username: '', password_hint: '', responsible_person: '',
    start_date: '', expiry_date: '', notify_email: '', notes: ''
  }
  const [form, setForm] = useState(empty)

  useEffect(() => { fetchRecords() }, [])

    async function fetchRecords() {
    setLoading(true)
    const { data } = await supabase
      .from('software_tracker')
      .select('*')
      .order('created_at', { ascending: false })
    setRecords(data || [])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('software_tracker').insert(form)
    setSaving(false)
    if (error) { setMsg('⚠ Error: ' + error.message); return }
    setMsg('✅ Record added.')
    setForm(empty)
    fetchRecords()
  }

  async function deleteRecord(id: string) {
    if (!confirm('Delete this record?')) return
    await supabase.from('software_tracker').delete().eq('id', id)
    fetchRecords()
  }

  const categories = ['Hosting', 'Domain', 'Email', 'CRM', 'Analytics', 'Design', 'Other']

  const isExpiringSoon = (date: string) => {
    if (!date) return false
    const diff = new Date(date).getTime() - Date.now()
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 30
  }

  const isExpired = (date: string) => {
    if (!date) return false
    return new Date(date).getTime() < Date.now()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{records.length} services tracked</p>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition">
          <Plus size={12} /> Add Service
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd}
          className="space-y-3 p-4 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Add New Service</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Service name (e.g. Vercel)" required
              value={form.service_name}
              onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
              className={inputCls} />

            <select value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className={inputCls}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <input type="url" placeholder="Login URL" value={form.login_url}
              onChange={e => setForm(f => ({ ...f, login_url: e.target.value }))}
              className={inputCls} />

            <input type="text" placeholder="Username / Email" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className={inputCls} />

            <input type="text" placeholder="Password hint (not full password)" value={form.password_hint}
              onChange={e => setForm(f => ({ ...f, password_hint: e.target.value }))}
              className={inputCls} />

            <input type="text" placeholder="Responsible person" value={form.responsible_person}
              onChange={e => setForm(f => ({ ...f, responsible_person: e.target.value }))}
              className={inputCls} />

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
              <input type="date" value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                className={inputCls} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Expiry Date</label>
              <input type="date" value={form.expiry_date}
                onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                className={inputCls} />
            </div>

            <input type="email" placeholder="Notify email (for expiry alerts)" value={form.notify_email}
              onChange={e => setForm(f => ({ ...f, notify_email: e.target.value }))}
              className={inputCls} />

            <input type="text" placeholder="Notes" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className={inputCls} />
          </div>

          {msg && <StatusBanner msg={msg} />}
          <SubmitBtn loading={saving} label="Add Service" loadingLabel="Saving..." />
        </form>
      )}

      {loading && <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>}
      {!loading && records.length === 0 && (
        <p className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No services tracked yet.</p>
      )}

      <div className="space-y-3">
        {records.map(rec => (
          <div key={rec.id}
            className={`p-4 rounded-xl border transition-all ${
              isExpired(rec.expiry_date)
                ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                : isExpiringSoon(rec.expiry_date)
                ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {rec.service_name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                    {rec.category}
                  </span>
                  {isExpired(rec.expiry_date) && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle size={9} /> Expired
                    </span>
                  )}
                  {isExpiringSoon(rec.expiry_date) && !isExpired(rec.expiry_date) && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle size={9} /> Expiring Soon
                    </span>
                  )}
                </div>

<div className="mt-2 grid grid-cols-1 min-[480px]:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 break-all">

                  {rec.username && (
                    <span>👤 {rec.username}</span>
                  )}
                  {rec.password_hint && (
  <span className="flex items-center gap-1 flex-wrap">
    <span>🔑</span>
    <span className="break-all">
      {showPwd === rec.id ? rec.password_hint : '••••••••'}
    </span>
    <button
      onClick={() => setShowPwd(showPwd === rec.id ? null : rec.id)}
      className="text-pink-600 hover:text-pink-500 flex-shrink-0"
    >
      {showPwd === rec.id ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  </span>
)}

                  {rec.responsible_person && <span>👷 {rec.responsible_person}</span>}
                  {rec.start_date && <span>📅 Started: {new Date(rec.start_date).toLocaleDateString('en-GB')}</span>}
                  {rec.expiry_date && <span>⏳ Expires: {new Date(rec.expiry_date).toLocaleDateString('en-GB')}</span>}
                  {rec.notify_email && <span>📧 {rec.notify_email}</span>}
                  {rec.notes && <span className="sm:col-span-2">📝 {rec.notes}</span>}
                </div>

                {rec.login_url && (
                  <a href={rec.login_url} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-pink-600 hover:text-pink-500 underline underline-offset-2">
                    Open Login →
                  </a>
                )}
              </div>

              <button onClick={() => deleteRecord(rec.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-500 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


// ─── Tab: Help ────────────────────────────────────────────────────────────────

function HelpTab() {
  const faqs = [
    {
      q: 'How do I upload images for a program?',
      a: 'Go to the Media Upload tab, select the program, optionally enter a folder name, then choose your files. Images go to the program-images bucket and documents go to program-documents automatically.'
    },
    {
      q: 'How do I publish a blog post?',
      a: 'In the Blog tab click New Post, fill in the title, slug, excerpt and content. Check "Publish immediately" to make it live, or leave unchecked to save as a draft. You can toggle publish status any time using the eye icon.'
    },
    {
      q: 'How do I delete a file from a program gallery?',
      a: 'Go to the Program Manager tab, filter by program if needed, then click the red trash icon on any file. This removes it from both Supabase Storage and the database.'
    },
    {
      q: 'What is the Software Tracker for?',
      a: 'It tracks all services, subscriptions and tools the foundation uses — hosting, domains, CRMs, etc. You can log credentials (hints only, not full passwords), expiry dates and responsible persons. Cards turn yellow when expiring within 30 days and red when expired.'
    },
    {
      q: 'How do I add a donor or visitor record?',
      a: 'Go to the Registrations tab and click Add Record. Fill in the name, email, type (visitor, donor, registered) and optionally an amount in GBP. Records are stored in the registrations table in Supabase.'
    },
    {
      q: 'How do I read and reply to contact messages?',
      a: 'Go to the Messages tab. Unread messages are highlighted in pink. Click the eye icon to mark as read. Click the email link to open your mail client and reply directly. Use the trash icon to delete.'
    },
    {
      q: 'How do I log out?',
      a: 'Click the Logout button in the top right corner of the admin panel. This clears your session and returns you to the login screen.'
    },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Frequently asked questions about using the admin panel.
      </p>

      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left
                       bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {faq.q}
            </span>
            <svg
              className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                open === i ? 'rotate-180' : ''
              }`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open === i && (
            <div className="px-4 pb-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-3">
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Tab: User Guide ─────────────────────────────────────────────────────────

function GuideTab() {
  const [open, setOpen] = useState<number | null>(0)

  const sections = [
    {
      title: '1 — How to Log In',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Before you can manage anything, you need to log in to this admin panel. It is a private area only you can access.
          </p>
          <ol className="space-y-2 ml-1">
            {[
              'Open any web browser (Chrome, Safari, Edge — all work).',
              'Go to your website address and add /admin at the end — e.g. adegrangecf.org/admin',
              'Type in the admin password and click Log In.',
              'You are now inside the admin panel. Use the tabs on the left to navigate.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 text-xs text-gray-700 dark:text-gray-300">
            💡 Keep the password safe — do not share it with anyone who should not have website access.
          </div>
        </div>
      )
    },
    {
      title: '2 — Uploading Photos & Documents',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Use the <strong>Media Upload</strong> tab to add photos and documents to any program. They appear on the live website instantly.
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Allowed file types</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Photos: JPG, PNG, GIF, WebP, BMP &nbsp;|&nbsp; Documents: PDF, DOC, DOCX</p>
          <ol className="space-y-2 ml-1">
            {[
              'Click the Media Upload tab.',
              'Choose a program from the dropdown. If your program is not listed, click "Program not listed? Create it here" to add it on the spot.',
              'Optionally type a Folder Name to group files — e.g. "gallery-2024". Leave it blank if unsure.',
              'Click Choose Files and select one or more files from your computer.',
              'Click Upload Files. A green message confirms success.',
              'To delete a file: select the program, find the file in the list below, and click the red bin icon.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 text-xs text-gray-700 dark:text-gray-300">
            💡 Photos show in the Gallery Preview. Documents show in the Reports & Documents section of the program page.
          </div>
        </div>
      )
    },
    {
      title: '3 — Writing & Publishing Blog Posts',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Use the <strong>Blog</strong> tab to write news, stories, and updates. You control when each post goes live.
          </p>
          <ol className="space-y-2 ml-1">
            {[
              'Click the Blog tab, then click the pink New Post button.',
              'Title — the headline visitors see. E.g. "Girls Health Matter Reaches 300 Students".',
              'Slug — the web address for this post. Use lowercase with hyphens. E.g. "girls-health-matter-300-students".',
              'Excerpt — a short 1–2 sentence summary shown on the blog listing page.',
              'Content — the full article body.',
              'Tick "Publish immediately" to make it live now, or leave it as a draft.',
              'Click Save Post. A green message confirms it was saved.',
              'To publish a draft later: find it in the list and click the eye icon (👁).',
              'To delete a post: click the red bin icon and confirm.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )
    },
    {
      title: '4 — Adding & Editing Programs',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Use the <strong>Program Manager</strong> tab to add new programs or update existing ones. Changes go live immediately — no developer needed.
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2">To add a new program</p>
          <ol className="space-y-2 ml-1">
            {[
              'Click Program Manager, then click the pink Add Program button.',
              'Fill in: Title, URL Slug (lowercase, hyphens only), Year, Location, Beneficiaries.',
              'Short Description — 1–2 sentences shown on the Programs listing page.',
              'Full Description — a longer paragraph shown on the program\'s own detail page.',
              'Key Impact Points — type each achievement on its own line, one per line.',
              'Click Save Program. It appears on the website straight away.',
              'Then go to Media Upload to add photos for this program.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2">To edit an existing program</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Find it in the list → click the pencil icon → update fields → click Update Program.</p>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-xs text-gray-700 dark:text-gray-300">
            ⚠ Deleting a program removes it from the website permanently. Uploaded photos are not deleted automatically.
          </div>
        </div>
      )
    },
    {
      title: '5 — Reading Contact Messages',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            When someone submits the contact form on your website, their message is saved in the <strong>Messages</strong> tab. Unread messages are highlighted in pink.
          </p>
          <ol className="space-y-2 ml-1">
            {[
              'Click the Messages tab to see all messages.',
              'Unread messages are highlighted in pink with a "New" badge.',
              'Click on a message to expand and read the full content.',
              'Click the eye icon to mark it as read or unread.',
              'Click the email address link to open your email app and reply directly.',
              'Click the bin icon to delete a message you no longer need.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 text-xs text-gray-700 dark:text-gray-300">
            💡 Check Messages regularly so you do not miss enquiries from the public or potential partners.
          </div>
        </div>
      )
    },
    {
      title: '6 — Registrations',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            The <strong>Registrations</strong> tab keeps a record of donors, visitors, and registered users. You can add records manually or view ones submitted through the website.
          </p>
          <ol className="space-y-2 ml-1">
            {[
              'Click Registrations, then click Add Record.',
              'Fill in the person\'s Full Name and Email Address.',
              'Choose Type — Visitor, Donor, or Registered.',
              'If they donated, enter the Amount in GBP.',
              'Add any Notes (e.g. how you met them, what they are interested in).',
              'Click Save. The record appears in the list immediately.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )
    },
    {
      title: '7 — Software & Subscription Tracker',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            The <strong>Software Tracker</strong> keeps track of all online services the foundation uses — hosting, domains, email, and any subscriptions. It alerts you before anything expires.
          </p>
          <ol className="space-y-2 ml-1">
            {[
              'Click Software Tracker, then Add Service.',
              'Service Name — e.g. "Website Hosting" or "Domain Name".',
              'Category — Hosting, Domain, Email, CRM, Analytics, Design, or Other.',
              'Login URL — the web address where you manage this service.',
              'Username and Password Hint (just a clue, not the full password).',
              'Responsible Person — who manages this account.',
              'Start Date and Expiry Date — when the subscription began and when it expires.',
              'Notification Email — the address that receives renewal reminders.',
              'Add Notes, then save.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 text-xs text-yellow-800 dark:text-yellow-300">
              🟡 Yellow card = expiring within 30 days. Act soon.
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              🔴 Red card = already expired. Renew immediately.
            </div>
          </div>
        </div>
      )
    },
    {
      title: '8 — Quick Reference',
      content: (
        <div className="space-y-2">
          {[
            ['Upload a photo or document', 'Media Upload → select program → choose file → Upload Files'],
            ['Delete an uploaded file', 'Media Upload → select program → find file in list → bin icon'],
            ['Add a new program', 'Program Manager → Add Program → fill in all fields → Save'],
            ['Edit an existing program', 'Program Manager → pencil icon → update → Save'],
            ['Write a blog post', 'Blog → New Post → fill in fields → Save Post'],
            ['Publish a draft post', 'Blog → find post → eye icon (👁)'],
            ['Read a contact message', 'Messages → click the message'],
            ['Reply to a message', 'Messages → click the email address link'],
            ['Add a donor/visitor record', 'Registrations → Add Record → fill in → Save'],
            ['Check subscription expiries', 'Software Tracker → review yellow/red cards'],
            ['Log out', 'Click Logout button — top right corner'],
          ].map(([task, where]) => (
            <div key={task} className="grid grid-cols-5 gap-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
              <div className="col-span-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">{task}</div>
              <div className="col-span-3 px-3 py-2 bg-white dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">{where}</div>
            </div>
          ))}
        </div>
      )
    },
  ]

  return (
    <div className="space-y-3 max-w-2xl">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Step-by-step guide for managing all parts of the website — no technical knowledge needed.
      </p>
      {sections.map((section, i) => (
        <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left
                       bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</span>
            <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="px-4 pb-4 pt-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>('media')

  const tabs: { id: Tab; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    { id: 'media',         label: 'Media Upload',      shortLabel: 'Media',    icon: <ImageIcon size={16} /> },
    { id: 'blog',          label: 'Blog',               shortLabel: 'Blog',     icon: <BookOpen size={16} /> },
    { id: 'program',       label: 'Program Manager',    shortLabel: 'Programs', icon: <FileText size={16} /> },
    { id: 'messages',      label: 'Messages',           shortLabel: 'Messages', icon: <Mail size={16} /> },
    { id: 'registrations', label: 'Registrations',      shortLabel: 'Regs',    icon: <Users size={16} /> },
    { id: 'software',      label: 'Software Tracker',   shortLabel: 'Software', icon: <Shield size={16} /> },
    { id: 'help',          label: 'Help & FAQ',         shortLabel: 'Help',     icon: <HelpCircle size={16} /> },
    { id: 'guide',         label: 'User Guide',         shortLabel: 'Guide',    icon: <BookMarked size={16} /> },
  ]

  const titles: Record<Tab, string> = {
    media:         'Media Upload',
    blog:          'Blog Manager',
    program:       'Program Manager',
    messages:      'Contact Messages',
    registrations: 'Registrations',
    software:      'Software Tracker',
    help:          'Help & FAQ',
    guide:         'User Guide',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
            AdeGrange Child Foundation
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl
                     border border-gray-300 dark:border-gray-700
                     text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors duration-150"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="flex flex-col sm:flex-row min-h-[calc(100vh-57px)]">

        {/* Sidebar — hidden on mobile, visible sm+ */}
        <aside className="hidden sm:flex flex-col w-52 lg:w-60 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 py-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left
                ${tab === t.id
                  ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 border-r-2 border-pink-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </aside>

      {/* Bottom tab bar — mobile only — horizontally scrollable */}
<nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40
                bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800
                flex overflow-x-auto scrollbar-none">
  {tabs.map(t => (
    <button
      key={t.id}
      onClick={() => setTab(t.id)}
      className={`flex-shrink-0 flex flex-col items-center justify-center
                  py-2.5 px-3 gap-1 text-[10px] font-semibold transition-colors min-w-[60px]
                  ${tab === t.id
                    ? 'text-pink-600'
                    : 'text-gray-400 dark:text-gray-500'
                  }`}
    >
      {/* Slightly larger icons for touch targets */}
      <span className={tab === t.id ? 'text-pink-600' : ''}>
        {t.id === 'media'         && <ImageIcon size={18} />}
        {t.id === 'blog'          && <BookOpen size={18} />}
        {t.id === 'program'       && <FileText size={18} />}
        {t.id === 'messages'      && <Mail size={18} />}
        {t.id === 'registrations' && <Users size={18} />}
        {t.id === 'software'      && <Shield size={18} />}
        {t.id === 'help'          && <HelpCircle size={18} />}
        {t.id === 'guide'         && <BookMarked size={18} />}
      </span>
      {t.shortLabel}
    </button>
  ))}
</nav>


        {/* Main content */}
       {/* was pb-24 sm:pb-6 */}
<main className="flex-1 px-4 sm:px-6 py-6 pb-28 sm:pb-6 overflow-y-auto">


          {/* Page title */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {titles[tab]}
            </h2>
            <div className="mt-1 h-0.5 w-10 bg-pink-600 rounded-full" />
          </div>

          {/* Tab content */}
          {tab === 'media'         && <MediaTab />}
          {tab === 'blog'          && <BlogTab />}
          {tab === 'program'       && <ProgramTab />}
          {tab === 'messages'      && <MessagesTab />}
          {tab === 'registrations' && <RegistrationsTab />}
          {tab === 'software'      && <SoftwareTracker />}
          {tab === 'help'          && <HelpTab />}
          {tab === 'guide'         && <GuideTab />}

        </main>
      </div>
    </div>
  )
}

