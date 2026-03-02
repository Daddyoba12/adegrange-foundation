"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          AdeGrange
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-300">
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/founder" className="hover:text-white transition">Founder</Link>
          <Link href="/programs" className="hover:text-white transition">Programs</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
          <Link href="/login" className="hover:text-white transition">Login</Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="border border-gray-600 px-3 py-1 rounded-lg text-sm hover:border-white transition"
          >
            Toggle
          </button>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2 -mr-2"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="flex flex-col px-6 py-6">

            <Link href="/about" onClick={() => setOpen(false)} className="py-4 border-b border-gray-800">
              About
            </Link>

            <Link href="/founder" onClick={() => setOpen(false)} className="py-4 border-b border-gray-800">
              Founder
            </Link>

            <Link href="/programs" onClick={() => setOpen(false)} className="py-4 border-b border-gray-800">
              Programs
            </Link>

            <Link href="/contact" onClick={() => setOpen(false)} className="py-4 border-b border-gray-800">
              Contact
            </Link>

            <Link href="/login" onClick={() => setOpen(false)} className="py-4 border-b border-gray-800">
              Login
            </Link>

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                setOpen(false)
              }}
              className="mt-4 border border-gray-600 px-4 py-2 rounded-lg text-left"
            >
              Toggle Theme
            </button>

          </div>
        </div>
      )}
    </header>
  )
}