'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const { subscription, isPro, loading } = useSubscriptionContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-lg bg-[#FF8A00] animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight uppercase">Account</h1>
        <p className="text-sm text-[#888] mt-1">Manage your subscription and account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
            isPro ? 'bg-[#FF8A00] text-[#0D0D0D] ring-2 ring-[#FF8A00]/30' : 'bg-[#FF8A00] text-[#0D0D0D]'
          }`}>
            {(user?.email?.[0] ?? '?').toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5F5F5]">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {subscription?.status === 'trialing' ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/10 text-[#00E676] font-bold uppercase border border-[#00E676]/20">
                  Free Trial
                </span>
              ) : isPro ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] font-bold uppercase border border-[#FF8A00]/20">
                  Pro Member
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#333] text-[#888] font-bold uppercase">
                  Free Plan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      {isPro && subscription ? (
        <ActiveSubscriptionCard subscription={subscription} />
      ) : (
        <UpgradeCard />
      )}

      {/* Feature Comparison */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#333]">
          <h2 className="text-sm font-bold uppercase tracking-wider">Plan Comparison</h2>
        </div>
        <div className="divide-y divide-[#333]">
          <FeatureRow feature="Setup Calculator" free pro />
          <FeatureRow feature="Tire & Gear Calculators" free pro />
          <FeatureRow feature="Troubleshooting Guide" free pro />
          <FeatureRow feature="Division Rules Reference" free pro />
          <FeatureRow feature="Engine Build Simulator" pro />
          <FeatureRow feature="Engine Comparison" pro />
          <FeatureRow feature="Session Logging" pro />
          <FeatureRow feature="Multi-Car Profiles" pro />
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="w-full py-3 border border-[#333] rounded-lg text-sm text-[#888] hover:text-[#F5F5F5] hover:border-[#555] transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}

function ActiveSubscriptionCard({ subscription }: { subscription: { status: string; current_period_end: string | null; cancel_at_period_end: boolean } }) {
  const [loading, setLoading] = useState(false)
  const isTrialing = subscription.status === 'trialing'

  const handleManage = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  const endDate = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className={`bg-[#1A1A1A] border rounded-lg p-5 ${isTrialing ? 'border-[#00E676]/20' : 'border-[#FF8A00]/20'}`}>
      <div className="flex items-center gap-2 mb-3">
        {isTrialing ? (
          <>
            <svg className="w-5 h-5 text-[#00E676]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#00E676]">Free Trial Active</h2>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#FF8A00]">Tenths Pro</h2>
          </>
        )}
      </div>

      {isTrialing ? (
        <div className="space-y-2">
          <p className="text-sm text-[#CCC]">
            You have full Pro access until <span className="font-semibold text-[#F5F5F5]">{endDate}</span>
          </p>
          <p className="text-xs text-[#888]">
            Your card will be charged {STRIPE_CONFIG.displayPrice}/month after your trial ends.
            Cancel anytime before then and you won&apos;t be charged.
          </p>
        </div>
      ) : (
        <p className="text-sm text-[#888]">
          {STRIPE_CONFIG.displayPrice}/month
          {subscription.cancel_at_period_end && endDate
            ? ` \u2022 Cancels ${endDate}`
            : endDate
            ? ` \u2022 Renews ${endDate}`
            : ''}
        </p>
      )}

      <button
        onClick={handleManage}
        disabled={loading}
        className="mt-4 w-full py-2.5 border border-[#333] rounded-lg text-sm text-[#888] hover:text-[#F5F5F5] hover:border-[#555] transition-colors disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Manage Subscription'}
      </button>
    </div>
  )
}

function UpgradeCard() {
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
    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <h2 className="text-sm font-bold uppercase tracking-wider">Upgrade to Pro</h2>
      </div>
      <p className="text-sm text-[#888] mb-1">
        Unlock all features for <span className="text-[#F5F5F5] font-semibold">{STRIPE_CONFIG.displayPrice}/month</span>
      </p>
      <ul className="space-y-1.5 my-4">
        {['Engine Build Simulator', 'Engine Comparison Tool', 'Session Logging & Tracking', 'Multi-Car Profiles'].map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-[#AAA]">
            <svg className="w-3.5 h-3.5 text-[#FF8A00] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full py-3 bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#0D0D0D] font-bold text-sm rounded-lg transition-colors disabled:opacity-50"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {loading ? 'Redirecting...' : 'Upgrade Now'}
      </button>
    </div>
  )
}

function FeatureRow({ feature, free, pro }: { feature: string; free?: boolean; pro?: boolean }) {
  return (
    <div className="flex items-center px-5 py-3">
      <span className="flex-1 text-sm text-[#AAA]">{feature}</span>
      <div className="flex gap-8">
        <div className="w-12 flex justify-center">
          {free ? (
            <svg className="w-4 h-4 text-[#00E676]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>
        <div className="w-12 flex justify-center">
          {pro ? (
            <svg className="w-4 h-4 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
