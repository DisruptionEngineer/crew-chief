'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

interface Props {
  code: string
  trialDays: number
  description: string | null
}

export function PromoLandingClient({ code, trialDays, description }: Props) {
  const { user, loading: authLoading } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartTrial = async () => {
    setCheckoutLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode: code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError('Failed to start trial. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#FF8A00] flex items-center justify-center">
              <span className="text-[#0D0D0D] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>T</span>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Tenths</span>
          </Link>
        </div>

        {/* Promo Card */}
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-8 text-center shadow-2xl">
          {/* Trial badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00E676]/10 border border-[#00E676]/30 rounded-full mb-6">
            <svg className="w-4 h-4 text-[#00E676]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-[#00E676] text-xs font-bold uppercase tracking-wider">
              {trialDays}-Day Free Trial
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Try Tenths Pro Free
          </h1>

          {description && (
            <p className="text-sm text-[#888] mb-4">{description}</p>
          )}

          <p className="text-[#AAA] mb-6 text-sm leading-relaxed">
            Get <strong className="text-[#F5F5F5]">{trialDays} days of full Pro access</strong> — then {STRIPE_CONFIG.displayPrice}/month.
            Cancel anytime before your trial ends and you won&apos;t be charged.
          </p>

          {/* Feature list */}
          <ul className="text-left space-y-2.5 mb-8">
            {[
              'AI Crew Chief setup recommendations',
              'Engine Simulator & Comparison',
              'Session Logging & Analytics',
              'Multi-Car & Multi-Track Profiles',
              'Cloud-synced setups',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-[#CCC]">
                <svg className="w-4 h-4 text-[#00E676] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA — depends on auth state */}
          {authLoading ? (
            <div className="py-3 flex justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-[#FF8A00] border-t-transparent animate-spin" />
            </div>
          ) : user ? (
            <>
              <button
                onClick={handleStartTrial}
                disabled={checkoutLoading}
                className="w-full py-3.5 px-4 bg-[#FF8A00] hover:bg-[#FFA640] text-[#0D0D0D] font-bold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" opacity="0.25" />
                      <path d="M4 12a8 8 0 018-8" />
                    </svg>
                    Setting up your trial...
                  </span>
                ) : (
                  `Start ${trialDays}-Day Free Trial`
                )}
              </button>

              {error && (
                <p className="text-sm text-[#FF1744] mt-3">{error}</p>
              )}

              <p className="text-[10px] text-[#555] mt-3">
                You&apos;ll enter payment info on the next screen. No charge until your trial ends.
              </p>
            </>
          ) : (
            <>
              <Link
                href={`/sign-up?redirect=/promo/${code}`}
                className="block w-full py-3.5 px-4 bg-[#FF8A00] hover:bg-[#FFA640] text-[#0D0D0D] font-bold text-sm rounded-lg transition-colors text-center"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Create Account to Start Trial
              </Link>

              <p className="text-sm text-[#666] mt-4">
                Already have an account?{' '}
                <Link href={`/sign-in?redirect=/promo/${code}`} className="text-[#FF8A00] hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Promo code display */}
        <p className="text-center text-[10px] text-[#444] mt-4">
          Promo code: <span className="font-mono text-[#666]">{code}</span>
        </p>
      </div>
    </div>
  )
}
