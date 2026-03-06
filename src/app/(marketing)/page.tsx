'use client'

import Link from 'next/link'
import { LandingNav } from '@/components/landing/LandingNav'
import { SetupDemo } from '@/components/landing/SetupDemo'
import { TenthsLogo } from '@/components/shared/TenthsLogo'
import { ToolShowcase } from '@/components/landing/ToolShowcase'

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-start pt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 w-full pt-8 md:pt-12 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00B4FF]/10 border border-[#00B4FF]/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#00B4FF] animate-pulse" />
                <span className="text-xs font-semibold text-[#00B4FF] uppercase tracking-wider">Free for racers</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Every Tenth{' '}
                <br className="hidden sm:block" />
                <span className="text-[#00B4FF]">Matters.</span>
              </h1>

              <p className="text-lg text-[#7A7A90] leading-relaxed mb-8 max-w-lg">
                Setup calculator, diagnostic troubleshooter, session logger, and rulebook — all in your pocket.
                Built for racers who wrench their own cars and chase every tenth.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center bg-[#00B4FF] text-[#0A0A0F] font-bold px-8 py-4 rounded-md hover:bg-[#33C4FF] transition-colors text-base"
                >
                  Get Started Free
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center border border-[#2A2A3A] text-[#D4D4E0] font-medium px-8 py-4 rounded-md hover:bg-[#14141F] transition-colors text-base"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right: Hero graphic — tachometer-style visual */}
            <div className="relative flex items-center justify-center">
              <div className="w-full aspect-square max-w-md relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[#2A2A3A]/50" />
                {/* Inner ring */}
                <div className="absolute inset-8 rounded-full border border-[#2A2A3A]/30" />
                {/* Center data */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl md:text-8xl font-bold text-[#00B4FF]" style={{ fontFamily: 'var(--font-mono)' }}>0.1</span>
                  <span className="text-sm text-[#555570] uppercase tracking-widest mt-2">seconds</span>
                  <span className="text-xs text-[#3A3A4A] mt-1">The gap between winning and losing</span>
                </div>
                {/* Accent arcs */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#00B4FF" strokeWidth="3" strokeDasharray="200 365" opacity="0.6" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#00B4FF" strokeWidth="1.5" strokeDasharray="120 383" opacity="0.3" />
                </svg>
                {/* Corner stats */}
                <div className="absolute top-4 right-4 text-right">
                  <span className="text-[10px] text-[#3A3A4A] uppercase tracking-wider block">Springs</span>
                  <span className="text-sm font-mono text-[#7A7A90]">Calculated</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] text-[#3A3A4A] uppercase tracking-wider block">Cross-Weight</span>
                  <span className="text-sm font-mono text-[#7A7A90]">Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE DEMO ===== */}
      <section id="demo" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] font-semibold text-[#00B4FF] uppercase tracking-widest mb-2">Try It Now</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">See Your Setup Before You Sign Up</h2>
            <p className="text-[#7A7A90] max-w-md mx-auto">
              Click the track conditions below and watch the recommendations change in real-time.
            </p>
          </div>
          <SetupDemo />
        </div>
      </section>

      {/* ===== TOOL SHOWCASE ===== */}
      <section id="features" className="py-16 md:py-24 border-t border-[#2A2A3A]/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-[#00B4FF] uppercase tracking-widest mb-2">Beyond the Calculator</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Complete Racing Toolkit</h2>
            <p className="text-[#7A7A90] max-w-md mx-auto">
              Diagnosis, engine builds, session data, corner weights, gear ratios — everything you need to find your tenths.
            </p>
          </div>

          <ToolShowcase />
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-16 md:py-24 border-t border-[#2A2A3A]/30">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-[#00B4FF] uppercase tracking-widest mb-2">Simple Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Free to Start. Pro When You&apos;re Ready.</h2>
            <p className="text-[#7A7A90] max-w-md mx-auto">
              Everything you need to get faster is free. Upgrade to Pro for advanced tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#D4D4E0]">Free</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-[#D4D4E0]">$0</span>
                  <span className="text-sm text-[#555570]">/forever</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {['Setup Calculator', 'Diagnostic Troubleshooter', 'Gear & Offset Calculators', 'Rulebook & Tech Checklist', 'Single Car Profile'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#9A9AB0]">
                    <svg className="w-4 h-4 text-[#00E676] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full py-3 px-4 text-center border border-[#2A2A3A] text-[#D4D4E0] font-semibold text-sm rounded-lg hover:bg-[#1A1A28] transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#14141F] border-2 border-[#00B4FF]/40 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#00B4FF] text-[#0A0A0F] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#00B4FF]">Pro</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-[#D4D4E0]">$9.99</span>
                  <span className="text-sm text-[#555570]">/month</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {['Everything in Free', 'Engine Build Simulator', 'Engine Comparison Tool', 'Session Logging & Analytics', 'Multi-Car Profiles', 'Priority Support'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#9A9AB0]">
                    <svg className="w-4 h-4 text-[#00B4FF] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full py-3 px-4 text-center bg-[#00B4FF] text-[#0A0A0F] font-bold text-sm rounded-lg hover:bg-[#33C4FF] transition-colors"
              >
                Start Free, Upgrade Anytime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUILT FOR THE GARAGE ===== */}
      <section className="py-16 md:py-24 border-t border-[#2A2A3A]/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="checkered-divider mb-10" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for the Garage</h2>
          <p className="text-[#7A7A90] max-w-2xl mx-auto leading-relaxed mb-6">
            Tenths was built by racers who got tired of guessing. We wanted real setup data,
            real diagnostics, and a real log of what works — without needing a professional crew.
          </p>
          <p className="text-[#7A7A90] max-w-2xl mx-auto leading-relaxed mb-10">
            Whether you run street stock, modified, late model, or figure 8 — if you wrench your own car
            and want to find your tenths, this is for you.
          </p>
          <div className="checkered-divider mb-10" />

          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-[#00B4FF] text-[#0A0A0F] font-bold px-10 py-4 rounded-md hover:bg-[#33C4FF] transition-colors text-lg"
          >
            Find Your Tenths
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#2A2A3A]/30 py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TenthsLogo size={32} />
              <span className="text-sm text-[#555570]">Tenths — Every tenth matters</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#555570]">
              <Link href="/sign-in" className="hover:text-[#D4D4E0] transition-colors">Sign In</Link>
              <Link href="/sign-up" className="hover:text-[#D4D4E0] transition-colors">Sign Up</Link>
              <Link href="/terms" className="hover:text-[#D4D4E0] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#D4D4E0] transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
