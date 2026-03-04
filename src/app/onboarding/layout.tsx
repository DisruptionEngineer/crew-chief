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
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#333]/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FFD600] flex items-center justify-center">
            <span className="text-[#0D0D0D] font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>CC</span>
          </div>
          <span className="text-sm font-bold text-[#F5F5F5] tracking-wider uppercase hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
            Crew Chief
          </span>
        </Link>
        <span className="text-xs text-[#666]">Setting up your pit crew</span>
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
