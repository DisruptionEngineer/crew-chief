'use client'

import Link from 'next/link'
import { LandingNav } from '@/components/landing/LandingNav'
import { SetupDemo } from '@/components/landing/SetupDemo'
import { ToolShowcase } from '@/components/landing/ToolShowcase'

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 w-full py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FF8A00]/10 border border-[#FF8A00]/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
                <span className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider">Free for racers</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Every Tenth{' '}
                <br className="hidden sm:block" />
                <span className="text-[#FF8A00]">Matters.</span>
              </h1>

              <p className="text-lg text-[#888] leading-relaxed mb-8 max-w-lg">
                Setup calculator, diagnostic troubleshooter, session logger, and rulebook — all in your pocket.
                Built for racers who wrench their own cars and chase every tenth.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center bg-[#FF8A00] text-[#0D0D0D] font-bold px-8 py-4 rounded-md hover:bg-[#FFA640] transition-colors text-base"
                >
                  Get Started Free
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center border border-[#333] text-[#F5F5F5] font-medium px-8 py-4 rounded-md hover:bg-[#1A1A1A] transition-colors text-base"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right: Hero graphic — tachometer-style visual */}
            <div className="relative flex items-center justify-center">
              <div className="w-full aspect-square max-w-md relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[#333]/50" />
                {/* Inner ring */}
                <div className="absolute inset-8 rounded-full border border-[#333]/30" />
                {/* Center data */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl md:text-8xl font-bold text-[#FF8A00]" style={{ fontFamily: 'var(--font-mono)' }}>0.1</span>
                  <span className="text-sm text-[#666] uppercase tracking-widest mt-2">seconds</span>
                  <span className="text-xs text-[#555] mt-1">The gap between winning and losing</span>
                </div>
                {/* Accent arcs */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#FF8A00" strokeWidth="3" strokeDasharray="200 365" opacity="0.6" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#FF8A00" strokeWidth="1.5" strokeDasharray="120 383" opacity="0.3" />
                </svg>
                {/* Corner stats */}
                <div className="absolute top-4 right-4 text-right">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider block">Springs</span>
                  <span className="text-sm font-mono text-[#888]">Calculated</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider block">Cross-Weight</span>
                  <span className="text-sm font-mono text-[#888]">Optimized</span>
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
            <p className="text-[10px] font-semibold text-[#FF8A00] uppercase tracking-widest mb-2">Try It Now</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">See Your Setup Before You Sign Up</h2>
            <p className="text-[#888] max-w-md mx-auto">
              Click the track conditions below and watch the recommendations change in real-time.
            </p>
          </div>
          <SetupDemo />
        </div>
      </section>

      {/* ===== TOOL SHOWCASE ===== */}
      <section id="features" className="py-16 md:py-24 border-t border-[#333]/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-[#FF8A00] uppercase tracking-widest mb-2">Beyond the Calculator</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Complete Racing Toolkit</h2>
            <p className="text-[#888] max-w-md mx-auto">
              Diagnosis, engine builds, session data, corner weights, gear ratios — everything you need to find your tenths.
            </p>
          </div>

          <ToolShowcase />
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-16 md:py-24 border-t border-[#333]/30">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-[#FF8A00] uppercase tracking-widest mb-2">Simple Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Free to Start. Pro When You&apos;re Ready.</h2>
            <p className="text-[#888] max-w-md mx-auto">
              Everything you need to get faster is free. Upgrade to Pro for advanced tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#F5F5F5]">Free</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-[#F5F5F5]">$0</span>
                  <span className="text-sm text-[#666]">/forever</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {['Setup Calculator', 'Diagnostic Troubleshooter', 'Gear & Offset Calculators', 'Rulebook & Tech Checklist', 'Single Car Profile'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#AAA]">
                    <svg className="w-4 h-4 text-[#00E676] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full py-3 px-4 text-center border border-[#333] text-[#F5F5F5] font-semibold text-sm rounded-lg hover:bg-[#252525] transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#1A1A1A] border-2 border-[#FF8A00]/40 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#FF8A00] text-[#0D0D0D] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#FF8A00]">Pro</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-[#F5F5F5]">$9.99</span>
                  <span className="text-sm text-[#666]">/month</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {['Everything in Free', 'Engine Build Simulator', 'Engine Comparison Tool', 'Session Logging & Analytics', 'Multi-Car Profiles', 'Priority Support'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#AAA]">
                    <svg className="w-4 h-4 text-[#FF8A00] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full py-3 px-4 text-center bg-[#FF8A00] text-[#0D0D0D] font-bold text-sm rounded-lg hover:bg-[#FFA640] transition-colors"
              >
                Start Free, Upgrade Anytime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUILT FOR THE GARAGE ===== */}
      <section className="py-16 md:py-24 border-t border-[#333]/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="checkered-divider mb-10" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for the Garage</h2>
          <p className="text-[#888] max-w-2xl mx-auto leading-relaxed mb-6">
            Tenths was built by racers who got tired of guessing. We wanted real setup data,
            real diagnostics, and a real log of what works — without needing a professional crew.
          </p>
          <p className="text-[#888] max-w-2xl mx-auto leading-relaxed mb-10">
            Whether you run street stock, modified, late model, or figure 8 — if you wrench your own car
            and want to find your tenths, this is for you.
          </p>
          <div className="checkered-divider mb-10" />

          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-[#FF8A00] text-[#0D0D0D] font-bold px-10 py-4 rounded-md hover:bg-[#FFA640] transition-colors text-lg"
          >
            Find Your Tenths
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#333]/30 py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF8A00] flex items-center justify-center">
                <span className="text-[#0D0D0D] font-bold text-xs" style={{ fontFamily: 'var(--font-heading)' }}>T</span>
              </div>
              <span className="text-sm text-[#666]">Tenths — Every tenth matters</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#666]">
              <Link href="/sign-in" className="hover:text-[#F5F5F5] transition-colors">Sign In</Link>
              <Link href="/sign-up" className="hover:text-[#F5F5F5] transition-colors">Sign Up</Link>
              <Link href="/terms" className="hover:text-[#F5F5F5] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#F5F5F5] transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
