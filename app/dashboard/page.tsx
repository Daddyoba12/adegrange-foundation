"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
      }
    }

    checkUser()
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold">
          Welcome to Dashboard
        </h1>

        <p className="mt-6 leading-relaxed">
          Logged in as: {user.email}
        </p>

      </div>
    </div>
  )
}