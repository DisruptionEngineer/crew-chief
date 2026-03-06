'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/components/shared/SupabaseProvider'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push(redirect || '/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#D4D4E0]">Sign In</h1>
        <p className="text-sm text-[#7A7A90] mt-1">Welcome back to Tenths</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="driver@example.com"
            required
            className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
          />
        </div>

        {error && (
          <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-md p-3">
            <p className="text-xs text-[#FF1744]">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md font-semibold text-sm bg-[#00B4FF] text-[#0A0A0F] hover:bg-[#33C4FF] transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-[#7A7A90]">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-[#00B4FF] hover:text-[#33C4FF] font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
