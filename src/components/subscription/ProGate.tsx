'use client'

import { useState } from 'react'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

interface ProGateProps {
  children: React.ReactNode
  /** 'full-page' replaces content entirely; 'blur-overlay' shows blurred preview */
  variant?: 'full-page' | 'blur-overlay'
  feature?: string
}

export function ProGate({ children, variant = 'full-page', feature }: ProGateProps) {
  const { isPro, loading } = useSubscriptionContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-lg bg-[#FFD600] animate-pulse" />
      </div>
    )
  }

  if (isPro) return <>{children}</>

  if (variant === 'blur-overlay') {
    // Don't render children — avoids data fetching and DOM leaks for free users
    return (
      <div className="relative">
        <div className="pointer-events-none select-none blur-sm opacity-50">
          <BlurPlaceholder />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D]/60 backdrop-blur-[2px] rounded-lg">
          <PaywallCard feature={feature} />
        </div>
      </div>
    )
  }

  // full-page variant
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <PaywallCard feature={feature} />
    </div>
  )
}

function BlurPlaceholder() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-8 bg-[#252525] rounded w-48" />
      <div className="h-4 bg-[#1A1A1A] rounded w-64" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 h-20" />
        ))}
      </div>
    </div>
  )
}

function PaywallCard({ feature }: { feature?: string }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#333] rounded-xl p-6 text-center shadow-2xl">
      {/* Pro badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-full mb-4">
        <svg className="w-4 h-4 text-[#FFD600]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-[#FFD600] text-xs font-bold uppercase tracking-wider">Pro Feature</span>
      </div>

      <h3 className="text-lg font-bold text-[#F5F5F5] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        Unlock {feature || 'This Feature'}
      </h3>
      <p className="text-sm text-[#888] mb-6">
        Get full access to all Crew Chief Pro tools including engine simulation, session logging, and multi-car support.
      </p>

      {/* Price */}
      <div className="mb-5">
        <span className="text-3xl font-bold text-[#F5F5F5]">{STRIPE_CONFIG.displayPrice}</span>
        <span className="text-sm text-[#666]">/month</span>
      </div>

      {/* Feature list */}
      <ul className="text-left space-y-2 mb-6">
        {[
          'Engine Simulator & Comparison',
          'Session Logging & Analytics',
          'Multi-Car Profiles',
          'Priority Support',
        ].map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-[#AAA]">
            <svg className="w-4 h-4 text-[#FFD600] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full py-3 px-4 bg-[#FFD600] hover:bg-[#FFD600]/90 text-[#0D0D0D] font-bold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {loading ? 'Redirecting...' : 'Upgrade to Pro'}
      </button>
    </div>
  )
}
