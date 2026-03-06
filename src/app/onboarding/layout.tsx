import Link from 'next/link'
import { TenthsLogo, TenthsWordmark } from '@/components/shared/TenthsLogo'

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
          <TenthsLogo size={36} />
          <span className="hidden sm:block"><TenthsWordmark className="text-sm" /></span>
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
