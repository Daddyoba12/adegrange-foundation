"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render icon after mount
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={`w-9 h-9 ${className}`} />
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200
                  hover:bg-white/10 active:scale-95 ${className}`}
    >
      {/* Sun icon — shown in dark mode (click to go light) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute w-5 h-5 text-yellow-400 transition-all duration-300
                    ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`}
      >
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2"  x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="2"  y1="12" x2="4"  y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
      </svg>

      {/* Moon icon — shown in light mode (click to go dark) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute w-5 h-5 text-gray-300 transition-all duration-300
                    ${!isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          AdeGrange
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-300 text-sm">
          <Link href="/about"    className="hover:text-white transition-colors duration-150">About</Link>
          <Link href="/founder"  className="hover:text-white transition-colors duration-150">Founder</Link>
          <Link href="/programs" className="hover:text-white transition-colors duration-150">Programs</Link>
          <Link href="/contact"  className="hover:text-white transition-colors duration-150">Contact</Link>
          <Link href="/login"    className="hover:text-white transition-colors duration-150">Login</Link>

          {/* Sun / Moon toggle */}
          <ThemeToggle />
        </nav>

        {/* Mobile right side — theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="text-white p-2 -mr-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu — animated slide down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-black/98 border-t border-gray-800">
          <div className="flex flex-col px-6 py-4">
            {[
              { href: "/about",    label: "About" },
              { href: "/founder",  label: "Founder" },
              { href: "/programs", label: "Programs" },
              { href: "/contact",  label: "Contact" },
              { href: "/login",    label: "Login" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3.5 border-b border-gray-800/60 text-gray-300 hover:text-white transition-colors duration-150 text-sm"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </header>
  )
}
