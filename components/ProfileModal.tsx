"use client"

import { useEffect } from "react"
import Image from "next/image"

export default function ProfileModal({
  person,
  onClose,
}: {
  person: any
  onClose: () => void
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full sm:max-w-4xl sm:mx-4 lg:mx-auto
                   bg-white dark:bg-gray-900
                   rounded-t-3xl sm:rounded-2xl
                   shadow-2xl overflow-hidden
                   max-h-[92vh] flex flex-col sm:flex-row"
      >

        {/* Close button — large tap target */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20
                     w-9 h-9 flex items-center justify-center rounded-full
                     bg-black/20 hover:bg-black/40
                     text-white text-lg font-bold
                     transition-colors duration-150 backdrop-blur-sm"
        >
          ✕
        </button>

        {/* Drag handle — mobile only (visual cue) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Image — shorter on mobile, full height on desktop */}
        <div className="relative w-full sm:w-2/5 flex-shrink-0
                        h-48 sm:h-auto sm:min-h-[420px]">
          <Image
            src={person.image}
            alt={person.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 40vw"
          />
          {/* Gradient fade into content on mobile */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent sm:hidden" />
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-8 space-y-4">

          {/* Title + name */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-pink-600 mb-1">
              {person.title}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {person.name}
            </h2>
            <div className="w-10 h-0.5 bg-pink-600 mt-3" />
          </div>

          {/* Bio — filter empty lines */}
          <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pb-4">
            {person.bio
              ?.split("\n")
              .filter((p: string) => p.trim() !== "")
              .map((p: string, i: number) =>
                p === p.toUpperCase() && p.trim().length > 0 ? (
                  <h3
                    key={i}
                    className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-4 first:mt-0"
                  >
                    {p}
                  </h3>
                ) : (
                  <p key={i}>{p}</p>
                )
              )}
          </div>

        </div>
      </div>
    </div>
  )
}
