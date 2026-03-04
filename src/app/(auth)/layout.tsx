import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#FFD600] flex items-center justify-center">
          <span className="text-[#0D0D0D] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>CC</span>
        </div>
        <span className="text-lg font-bold text-[#F5F5F5] tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
          Crew Chief
        </span>
      </Link>
      {children}
    </div>
  )
}
