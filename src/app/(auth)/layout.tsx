import Link from 'next/link'
import { TenthsLogo, TenthsWordmark } from '@/components/shared/TenthsLogo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <TenthsLogo size={40} />
        <TenthsWordmark className="text-lg" />
      </Link>
      {children}
    </div>
  )
}
