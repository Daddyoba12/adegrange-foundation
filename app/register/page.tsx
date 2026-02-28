"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Registered successfully!")
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <form
        onSubmit={handleRegister}
        className="p-10 shadow-xl rounded-2xl space-y-6 w-full max-w-md backdrop-blur"
      >
        <h2 className="text-3xl font-bold text-center">
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg bg-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg bg-transparent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-pink-600 hover:opacity-90 py-3 rounded-lg font-semibold transition">
          Register
        </button>

      </form>

    </div>
  )
}