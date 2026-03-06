'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSupabase } from '@/components/shared/SupabaseProvider'

export default function SignUpPage() {
  const { supabase } = useSupabase()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect || '/onboarding'}`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setConfirmationSent(true)
    setLoading(false)
  }

  if (confirmationSent) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#00B4FF]/10 border border-[#00B4FF]/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#D4D4E0]">Check Your Email</h1>
          <p className="text-sm text-[#7A7A90] mt-2">
            We sent a confirmation link to{' '}
            <span className="text-[#00B4FF] font-medium">{email}</span>.
            Click it to activate your account.
          </p>
        </div>
        <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
          <p className="text-xs text-[#555570]">
            Don&apos;t see it? Check your spam folder, or{' '}
            <button
              onClick={() => setConfirmationSent(false)}
              className="text-[#00B4FF] hover:text-[#33C4FF] font-semibold"
            >
              try again
            </button>.
          </p>
        </div>
        <p className="text-sm text-[#7A7A90]">
          Already confirmed?{' '}
          <Link href="/sign-in" className="text-[#00B4FF] hover:text-[#33C4FF] font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#D4D4E0]">Create Account</h1>
        <p className="text-sm text-[#7A7A90] mt-1">Join Tenths — every tenth matters</p>
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
            placeholder="At least 6 characters"
            required
            className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
          />
        </div>

        {error && (
          <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-md p-3">
            <p className="text-xs text-[#FF1744]">{error}</p>
          </div>
        )}

        <p className="text-[11px] text-[#555570]">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-[#7A7A90] hover:text-[#D4D4E0] underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#7A7A90] hover:text-[#D4D4E0] underline">Privacy Policy</Link>.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md font-semibold text-sm bg-[#00B4FF] text-[#0A0A0F] hover:bg-[#33C4FF] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-[#7A7A90]">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-[#00B4FF] hover:text-[#33C4FF] font-semibold">
          Sign In
        </Link>
      </p>
    </div>
  )
}
