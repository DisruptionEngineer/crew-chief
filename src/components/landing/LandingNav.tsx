'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TenthsLogo, TenthsWordmark } from '@/components/shared/TenthsLogo'

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
        scrolled ? 'bg-[#0A0A0F]/90 backdrop-blur-md border-b border-[#2A2A3A]/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <TenthsLogo size={36} />
            <span className="hidden sm:block"><TenthsWordmark className="text-sm" /></span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#features"
              className="hidden sm:block text-sm text-[#7A7A90] hover:text-[#D4D4E0] transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hidden sm:block text-sm text-[#7A7A90] hover:text-[#D4D4E0] transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/sign-in"
              className="text-sm text-[#7A7A90] hover:text-[#D4D4E0] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-[#00B4FF] text-[#0A0A0F] px-4 py-2 rounded-md hover:bg-[#33C4FF] transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
