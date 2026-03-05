'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCar } from '@/hooks/useCar'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/setup', label: 'Setup', icon: WrenchIcon },
  { href: '/engine', label: 'Engine', icon: EngineIcon },
  { href: '/calculators', label: 'Calc', icon: CalculatorIcon },
  { href: '/troubleshoot', label: 'Diag', icon: SearchIcon },
  { href: '/sessions', label: 'Log', icon: ClipboardIcon },
  { href: '/rules', label: 'Rules', icon: BookIcon },
]

export function Navigation() {
  const pathname = usePathname()
  const { cars, currentCar, setCurrentCarId } = useCar()

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#1A1A1A]/95 backdrop-blur-md border-t border-[#333]/80">
        <div className="flex items-center justify-around h-16" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] transition-all duration-200 ${
                  isActive ? 'text-[#FFD600]' : 'text-[#555] active:scale-95'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className={`text-[10px] transition-colors ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                {/* Active indicator dot */}
                <div className={`absolute -top-0.5 w-1 h-1 rounded-full bg-[#FFD600] transition-all duration-200 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`} />
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col w-20 lg:w-60 bg-[#1A1A1A] border-r border-[#333]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#333]">
          <div className="w-10 h-10 rounded-lg bg-[#FFD600] flex items-center justify-center shadow-[0_0_16px_rgba(255,214,0,0.15)]">
            <span className="text-[#0D0D0D] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>CC</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold text-[#F5F5F5] tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
              Crew Chief
            </h1>
            <p className="text-[10px] text-[#555] uppercase tracking-widest">Virtual Pit Crew</p>
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
                    ? 'bg-[#FFD600]/10 text-[#FFD600]'
                    : 'text-[#666] hover:text-[#F5F5F5] hover:bg-[#252525]'
                }`}
              >
                {/* Active indicator bar — left edge */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-[#FFD600] transition-all duration-200 ${
                  isActive ? 'h-6 opacity-100' : 'h-0 opacity-0'
                }`} />
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`} />
                <span className={`hidden lg:block text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Car Selector */}
        <div className="px-3 py-3 border-t border-[#333]">
          <div className="relative">
            <select
              value={currentCar.id}
              onChange={(e) => setCurrentCarId(e.target.value)}
              className="w-full bg-[#252525] text-[#F5F5F5] text-xs border border-[#333] rounded-md px-2 py-2.5 pr-7 focus:outline-none focus:ring-1 focus:ring-[#FFD600] cursor-pointer appearance-none transition-colors hover:border-[#555]"
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.year} {car.model}
                </option>
              ))}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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

  if (!user) {
    return (
      <div className="px-3 py-3 border-t border-[#333] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#252525] border border-[#333] flex items-center justify-center text-[10px] text-[#666]">?</div>
        <span className="hidden lg:block text-xs text-[#666]">Account</span>
      </div>
    )
  }

  const initial = (user.email?.[0] ?? '?').toUpperCase()

  return (
    <div className="px-3 py-3 border-t border-[#333]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FFD600] flex items-center justify-center text-[10px] font-bold text-[#0D0D0D] flex-shrink-0">
          {initial}
        </div>
        <span className="hidden lg:block text-xs text-[#888] truncate flex-1">{user.email}</span>
      </div>
      <button
        onClick={signOut}
        className="hidden lg:block w-full mt-2 text-xs text-[#666] hover:text-[#F5F5F5] text-left transition-colors"
      >
        Sign Out
      </button>
    </div>
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
