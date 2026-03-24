'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  /** When provided the button pushes /?from={slug}#leadership instead of router.back() */
  slug?: string
}

export default function BackButton({ slug }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (slug) {
      router.push(`/?from=${slug}#leadership`)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-500 transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Leadership
    </button>
  )
}
