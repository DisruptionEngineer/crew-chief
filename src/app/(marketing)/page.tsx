'use client'

import Link from 'next/link'
import { LandingNav } from '@/components/landing/LandingNav'
import { SetupDemo } from '@/components/landing/SetupDemo'
import { FeatureCard } from '@/components/landing/FeatureCard'

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
              <div className="inline-flex items-center gap-2 bg-[#FFD600]/10 border border-[#FFD600]/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FFD600] animate-pulse" />
                <span className="text-xs font-semibold text-[#FFD600] uppercase tracking-wider">Free for racers</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                No Crew Chief?{' '}
                <br className="hidden sm:block" />
                No Budget?{' '}
                <br className="hidden sm:block" />
                <span className="text-[#FFD600]">No Problem.</span>
              </h1>

              <p className="text-lg text-[#888] leading-relaxed mb-8 max-w-lg">
                Your pit crew in your pocket. Setup calculator, diagnostic troubleshooter, session logger,
                and rulebook — all tuned for short track racing.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center bg-[#FFD600] text-[#0D0D0D] font-bold px-8 py-4 rounded-md hover:bg-[#FFEA00] transition-colors text-base"
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

            {/* Right: YouTube Video */}
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden border border-[#333] bg-[#1A1A1A]">
                <iframe
                  src="https://www.youtube.com/embed/UY0OE4-MJqk?rel=0&modestbranding=1"
                  title="Flyin Finn Racing — In-car footage"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-[#888]">
                <span className="text-[#FFD600] font-semibold">@flyinfinnracing</span> — Painesville Speedway
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE DEMO ===== */}
      <section id="demo" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] font-semibold text-[#FFD600] uppercase tracking-widest mb-2">Try It Now</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">See Your Setup Before You Sign Up</h2>
            <p className="text-[#888] max-w-md mx-auto">
              Click the track conditions below and watch the recommendations change in real-time.
            </p>
          </div>
          <SetupDemo />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-16 md:py-24 border-t border-[#333]/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-[#FFD600] uppercase tracking-widest mb-2">Everything You Need</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Four Tools. One App.</h2>
            <p className="text-[#888] max-w-md mx-auto">
              Built for Saturday night racers who wrench their own cars and want every edge they can get.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
              }
              title="Setup Calculator"
              description="Get chassis recommendations tuned to your car, track conditions, and race type. Springs, alignment, tire pressures, cross-weight — all calculated."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
              title="Troubleshooter"
              description="Tell us what your car is doing wrong. We'll tell you what to fix first — prioritized from easiest to most involved, with explanations."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              }
              title="Session Logger"
              description="Track your changes, lap times, and handling notes race by race. Build a history of what works at your track in your conditions."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              }
              title="Rulebook"
              description="Full Ironman Figure 8 rules with searchable tech inspection checklist. Never get caught at tech again."
            />
          </div>
        </div>
      </section>

      {/* ===== BUILT BY RACERS ===== */}
      <section className="py-16 md:py-24 border-t border-[#333]/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="checkered-divider mb-10" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built by Racers, for Racers</h2>
          <p className="text-[#888] max-w-2xl mx-auto leading-relaxed mb-6">
            We race Ironman Figure 8 at Painesville Speedway every Saturday night.
            We built Crew Chief because we needed it ourselves — real setup knowledge
            without the cost of a real crew chief.
          </p>
          <p className="text-[#888] max-w-2xl mx-auto leading-relaxed mb-10">
            Whether you run figure 8, oval, old school, or street stock — if you wrench your own car
            and want to get faster, this is for you.
          </p>
          <div className="checkered-divider mb-10" />

          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-[#FFD600] text-[#0D0D0D] font-bold px-10 py-4 rounded-md hover:bg-[#FFEA00] transition-colors text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#333]/30 py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFD600] flex items-center justify-center">
                <span className="text-[#0D0D0D] font-bold text-xs" style={{ fontFamily: 'var(--font-heading)' }}>CC</span>
              </div>
              <span className="text-sm text-[#666]">Crew Chief — Your pit crew in your pocket</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#666]">
              <Link href="/sign-in" className="hover:text-[#F5F5F5] transition-colors">Sign In</Link>
              <Link href="/sign-up" className="hover:text-[#F5F5F5] transition-colors">Sign Up</Link>
              <a href="https://www.youtube.com/@flyinfinnracing" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5F5] transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
