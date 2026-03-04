'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#333]/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FFD600] flex items-center justify-center">
              <span className="text-[#0D0D0D] font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>CC</span>
            </div>
            <span className="text-sm font-bold text-[#F5F5F5] tracking-wider uppercase hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
              Crew Chief
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#features"
              className="hidden sm:block text-sm text-[#888] hover:text-[#F5F5F5] transition-colors"
            >
              Features
            </a>
            <Link
              href="/sign-in"
              className="text-sm text-[#888] hover:text-[#F5F5F5] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-[#FFD600] text-[#0D0D0D] px-4 py-2 rounded-md hover:bg-[#FFEA00] transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
