import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#00B4FF] flex items-center justify-center">
          <span className="text-[#0A0A0F] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>T</span>
        </div>
        <span className="text-lg font-bold text-[#D4D4E0] tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
          Tenths
        </span>
      </Link>
      {children}
    </div>
  )
}
