'use client'

import { useSearchParams } from 'next/navigation'

export default function ProgramsClient() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <div>
      {/* your existing JSX here */}
      Search query: {query}
    </div>
  )
}