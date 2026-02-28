"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <nav className="flex justify-between items-center px-8 py-6 shadow-sm">
      <Link href="/" className="font-bold text-xl">
        AdeGrange
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/about">About</Link>
<Link href="/founder">Founder</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/blog">Blog</Link>
<Link href="/impact">Impact</Link>

        
        {!user ? (
          <>
            <Link href="/login">Login</Link>
            <Link
              href="/register"
              className="border px-3 py-1 rounded"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="border px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border px-3 py-1 rounded"
        >
          Toggle
        </button>
      </div>
    </nav>
  )
}