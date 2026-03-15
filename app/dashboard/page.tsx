"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Get initials from email
  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "AD"

  const stats = [
    { label: "Programs",     value: "5",    icon: "📋" },
    { label: "Media Files",  value: "200+", icon: "🖼️" },
    { label: "Documents",    value: "12",   icon: "📄" },
    { label: "Team Members", value: "3",    icon: "👥" },
  ]

  const quickLinks = [
    { label: "Manage Programs",  href: "/admin",    icon: "⚙️",  desc: "Upload photos, docs and videos" },
    { label: "View Programs",    href: "/programs", icon: "📋",  desc: "See all public program pages" },
    { label: "Contact Messages", href: "/contact",  icon: "✉️",  desc: "View submitted contact forms" },
    { label: "Home Page",        href: "/",         icon: "🏠",  desc: "Return to the main website" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">

      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                Admin Dashboard
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px] sm:max-w-xs">
                {user.email}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                       text-gray-600 hover:text-red-600 hover:bg-red-50
                       dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20
                       border border-gray-200 dark:border-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden xs:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8 sm:space-y-10">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back 👋
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            AdeGrange Child Foundation — Admin Portal
          </p>
        </div>

        {/* Stats grid — 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links — 1 col mobile, 2 col desktop */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 group
                           bg-white dark:bg-gray-900
                           border-gray-200 dark:border-gray-800
                           hover:border-pink-300 dark:hover:border-pink-700
                           hover:shadow-md active:scale-[0.98]"
              >
                <div className="text-2xl flex-shrink-0">{link.icon}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {link.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {link.desc}
                  </p>
                </div>
                <svg className="w-4 h-4 ml-auto flex-shrink-0 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4">
          Authorised personnel only &mdash; AdeGrange Child Foundation
        </p>

      </div>
    </div>
  )
}
