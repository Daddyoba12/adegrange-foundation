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

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {rec.username && (
                    <span>👤 {rec.username}</span>
                  )}
                  {rec.password_hint && (
                    <span className="flex items-center gap-1">
                      🔑 {showPwd === rec.id ? rec.password_hint : '••••••••'}
                      <button onClick={() => setShowPwd(showPwd === rec.id ? null : rec.id)}
                        className="text-pink-600 hover:text-pink-500 ml-1">
                        {showPwd === rec.id ? <EyeOff size={11} /> : <Eye size={11} />}
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
  const items = [
    {
      q: 'How do I upload images or documents for a program?',
      a: 'Go to the Media Upload tab. Select the program, optionally enter a folder name, then choose your files and click Upload Files. Images go to the program-images bucket and documents to program-documents automatically.'
    },
    {
      q: 'How do I manage blog posts?',
      a: 'Go to the Blog tab. Click New Post, fill in the title, slug, excerpt and content. Tick Publish immediately to make it live, or leave unticked to save as a draft. You can publish or unpublish any post later using the eye icon.'
    },
    {
      q: 'What is the Program Manager tab for?',
      a: 'It shows all uploaded media files across programs. You can filter by program and delete individual files. Deleting here removes both the file from storage and the database record.'
    },
    {
      q: 'How do I read contact messages?',
      a: 'Go to the Messages tab. Unread messages are highlighted in pink. Click the eye icon to mark a message as read or unread. Click the bin icon to delete it permanently.'
    },
    {
      q: 'What is the Software Tracker for?',
      a: 'It tracks all software services, logins, and subscription expiry dates used by the foundation. Services expiring within 30 days show a yellow warning. Expired services show in red.'
    },
    {
      q: 'How do I add a visitor or donor record?',
      a: 'Go to the Registrations tab. Click Add Record, fill in the details and select the type (Visitor, Donor, or Registered). Donor records can include an amount in GBP.'
    },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Frequently asked questions about using this admin panel.
      </p>
      {items.map((item, i) => (
        <div key={i}
          className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.q}</span>
            <span className={`text-pink-600 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
              <Plus size={16} />
            </span>
          </button>
          {open === i && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.a}</p>
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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'media',         label: 'Media Upload',      icon: <Upload size={15} /> },
    { id: 'blog',          label: 'Blog',               icon: <BookOpen size={15} /> },
    { id: 'program',       label: 'Program Manager',    icon: <ImageIcon size={15} /> },
    { id: 'messages',      label: 'Messages',           icon: <Mail size={15} /> },
    { id: 'registrations', label: 'Registrations',      icon: <Users size={15} /> },
    { id: 'software',      label: 'Software Tracker',   icon: <Shield size={15} /> },
    { id: 'help',          label: 'Help',               icon: <HelpCircle size={15} /> },
  ]

  const titles: Record<Tab, string> = {
    media:         'Media Upload',
    blog:          'Blog Manager',
    program:       'Program Manager',
    messages:      'Contact Messages',
    registrations: 'Registrations',
    software:      'Software Tracker',
    help:          'Help & Guide',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            AdeGrange Child Foundation
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <LogOut size={13} /> Logout
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">

        {/* Tab bar — horizontally scrollable on mobile */}
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 mb-6 sm:mb-8">
          <div className="flex gap-1 min-w-max sm:min-w-0 sm:flex-wrap pb-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  tab === t.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                {t.icon}
                <span className="hidden xs:inline sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-5 sm:mb-6">
            {titles[tab]}
          </h2>

          {tab === 'media'         && <MediaTab />}
          {tab === 'blog'          && <BlogTab />}
          {tab === 'program'       && <ProgramTab />}
          {tab === 'messages'      && <MessagesTab />}
          {tab === 'registrations' && <RegistrationsTab />}
          {tab === 'software'      && <SoftwareTracker />}
          {tab === 'help'          && <HelpTab />}
        </div>

      </div>
    </div>
  )
}
