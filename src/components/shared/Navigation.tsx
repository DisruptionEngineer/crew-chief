'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCar } from '@/hooks/useCar'
import { useAuth } from '@/hooks/useAuth'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon, isPro: false },
  { href: '/garage', label: 'Garage', icon: GarageIcon, isPro: false },
  { href: '/tracks', label: 'Tracks', icon: TrackIcon, isPro: false },
  { href: '/setup', label: 'Setup', icon: WrenchIcon, isPro: false },
  { href: '/engine', label: 'Engine', icon: EngineIcon, isPro: true },
  { href: '/calculators', label: 'Calc', icon: CalculatorIcon, isPro: false },
  { href: '/troubleshoot', label: 'Diag', icon: SearchIcon, isPro: false },
  { href: '/sessions', label: 'Log', icon: ClipboardIcon, isPro: true },
  { href: '/rules', label: 'Rules', icon: BookIcon, isPro: false },
]

export function Navigation() {
  const pathname = usePathname()
  const { cars, currentCar, setCurrentCarId } = useCar()
  const { isPro } = useSubscriptionContext()

  return (
    <>
      {/* Mobile Top Bar — user avatar + account link */}
      <MobileHeader />

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#14141F]/95 backdrop-blur-md border-t border-[#2A2A3A]/80">
        <div className="flex items-center justify-around h-16 w-full" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'max(4px, env(safe-area-inset-left, 4px))', paddingRight: 'max(4px, env(safe-area-inset-right, 4px))' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[44px] transition-all duration-200 ${
                  isActive ? 'text-[#00B4FF]' : 'text-[#3A3A4A] active:scale-95'
                }`}
              >
                <div className="relative">
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.isPro && !isPro && (
                    <LockBadge className="absolute -top-1 -right-2" />
                  )}
                </div>
                <span className={`text-[10px] transition-colors ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                {/* Active indicator dot */}
                <div className={`absolute -top-0.5 w-1 h-1 rounded-full bg-[#00B4FF] transition-all duration-200 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`} />
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col w-20 lg:w-60 bg-[#14141F] border-r border-[#2A2A3A]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#2A2A3A]">
          <div className="w-10 h-10 rounded-lg bg-[#00B4FF] flex items-center justify-center shadow-[0_0_16px_rgba(255,138,0,0.15)]">
            <span className="text-[#0A0A0F] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>T</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold text-[#D4D4E0] tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
              Tenths
            </h1>
            <p className="text-[10px] text-[#3A3A4A] uppercase tracking-widest">Find Your Tenths</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#00B4FF]/10 text-[#00B4FF]'
                    : 'text-[#555570] hover:text-[#D4D4E0] hover:bg-[#1A1A28]'
                }`}
              >
                {/* Active indicator bar — left edge */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-[#00B4FF] transition-all duration-200 ${
                  isActive ? 'h-6 opacity-100' : 'h-0 opacity-0'
                }`} />
                <div className="relative flex-shrink-0">
                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? '' : 'group-hover:scale-110'
                  }`} />
                  {item.isPro && !isPro && (
                    <LockBadge className="absolute -top-1 -right-2" />
                  )}
                </div>
                <span className={`hidden lg:block text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                {item.isPro && !isPro && (
                  <span className="hidden lg:inline-block ml-auto text-[9px] px-1.5 py-0.5 rounded bg-[#00B4FF]/10 text-[#00B4FF] font-bold uppercase">Pro</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Car Selector */}
        <div className="px-3 py-3 border-t border-[#2A2A3A]">
          <div className="relative">
            <select
              value={currentCar.id}
              onChange={(e) => setCurrentCarId(e.target.value)}
              className="w-full bg-[#1A1A28] text-[#D4D4E0] text-xs border border-[#2A2A3A] rounded-md px-2 py-2.5 pr-7 focus:outline-none focus:ring-1 focus:ring-[#00B4FF] cursor-pointer appearance-none transition-colors hover:border-[#3A3A4A]"
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.year} {car.model}
                </option>
              ))}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555570] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* User Account */}
        <UserSection />
      </aside>
    </>
  )
}

function UserSection() {
  const { user, signOut } = useAuth()
  const { isPro } = useSubscriptionContext()

  if (!user) {
    return (
      <div className="px-3 py-3 border-t border-[#2A2A3A] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1A1A28] border border-[#2A2A3A] flex items-center justify-center text-[10px] text-[#555570]">?</div>
        <span className="hidden lg:block text-xs text-[#555570]">Account</span>
      </div>
    )
  }

  const initial = (user.email?.[0] ?? '?').toUpperCase()

  return (
    <div className="px-3 py-3 border-t border-[#2A2A3A]">
      {/* Upgrade CTA for free users */}
      {!isPro && (
        <Link
          href="/account"
          className="hidden lg:flex items-center gap-2 w-full px-3 py-2 mb-2 rounded-md bg-[#00B4FF]/10 border border-[#00B4FF]/20 hover:bg-[#00B4FF]/20 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-[#00B4FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[11px] font-bold text-[#00B4FF]">Upgrade to Pro</span>
        </Link>
      )}
      <Link href="/account" className="flex items-center gap-3 group">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
          isPro ? 'bg-[#00B4FF] text-[#0A0A0F] ring-2 ring-[#00B4FF]/30' : 'bg-[#00B4FF] text-[#0A0A0F]'
        }`}>
          {initial}
        </div>
        <div className="hidden lg:block flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#7A7A90] truncate">{user.email}</span>
            {isPro && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00B4FF]/10 text-[#00B4FF] font-bold uppercase flex-shrink-0">Pro</span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={signOut}
        className="hidden md:block w-full mt-2 text-xs text-[#555570] hover:text-[#D4D4E0] text-left transition-colors"
        title="Sign Out"
      >
        <span className="hidden lg:inline">Sign Out</span>
        <svg className="lg:hidden w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  )
}

function MobileHeader() {
  const { user, signOut } = useAuth()
  const { isPro } = useSubscriptionContext()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) return null

  const initial = (user.email?.[0] ?? '?').toUpperCase()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0F]/95 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00B4FF] flex items-center justify-center shadow-[0_0_12px_rgba(255,138,0,0.15)]">
            <span className="text-[#0A0A0F] font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>T</span>
          </div>
          <span className="text-sm font-bold text-[#D4D4E0] tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
            Tenths
          </span>
        </div>

        {/* User avatar button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
            isPro ? 'bg-[#00B4FF] text-[#0A0A0F] ring-2 ring-[#00B4FF]/30' : 'bg-[#00B4FF] text-[#0A0A0F]'
          }`}
        >
          {initial}
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-3 top-14 z-50 w-48 bg-[#14141F] border border-[#2A2A3A] rounded-lg shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A2A3A]">
              <p className="text-xs text-[#7A7A90] truncate">{user.email}</p>
              {isPro && (
                <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-[#00B4FF]/10 text-[#00B4FF] font-bold uppercase">Pro</span>
              )}
            </div>
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-[#CCC] hover:bg-[#1A1A28] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Account
            </Link>
            <button
              onClick={() => { setMenuOpen(false); signOut() }}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#7A7A90] hover:text-[#D4D4E0] hover:bg-[#1A1A28] transition-colors border-t border-[#2A2A3A]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function LockBadge({ className }: { className?: string }) {
  return (
    <svg className={`w-3 h-3 text-[#00B4FF] ${className || ''}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.24 2 7 4.24 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.76-2.24-5-5-5zm3 8H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
    </svg>
  )
}

// Icon components (simple SVG icons)
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  )
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="12" y1="18" x2="16" y2="18" />
    </svg>
  )
}

function TrackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6l3-3h12l3 3" />
      <path d="M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6" />
      <ellipse cx="12" cy="13" rx="7" ry="5" />
      <ellipse cx="12" cy="13" rx="3" ry="2" />
    </svg>
  )
}

function GarageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M4 20V8l8-5 8 5v12" />
      <rect x="8" y="14" width="8" height="6" rx="1" />
      <path d="M10 14v-2a2 2 0 014 0v2" />
    </svg>
  )
}

function EngineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="8" rx="1" />
      <path d="M8 10V6a1 1 0 011-1h6a1 1 0 011 1v4" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <path d="M2 13h2" />
      <path d="M20 13h2" />
    </svg>
  )
}
