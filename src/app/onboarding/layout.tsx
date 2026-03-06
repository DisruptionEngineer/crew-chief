import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#2A2A3A]/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00B4FF] flex items-center justify-center">
            <span className="text-[#0A0A0F] font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>T</span>
          </div>
          <span className="text-sm font-bold text-[#D4D4E0] tracking-wider uppercase hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
            Tenths
          </span>
        </Link>
        <span className="text-xs text-[#555570]">Getting you dialed in</span>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </div>
    </div>
  )
}
