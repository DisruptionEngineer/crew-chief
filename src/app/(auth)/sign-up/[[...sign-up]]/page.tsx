'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
const isClerkConfigured =
  (clerkKey.startsWith('pk_test_') || clerkKey.startsWith('pk_live_')) &&
  !clerkKey.includes('PLACEHOLDER')

// Only load Clerk's SignUp component when Clerk is actually configured
const ClerkSignUp = isClerkConfigured
  ? dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignUp })), {
      ssr: false,
      loading: () => <div className="h-96 flex items-center justify-center"><div className="w-8 h-8 rounded-lg bg-[#FFD600] animate-pulse" /></div>,
    })
  : null

export default function SignUpPage() {
  if (!ClerkSignUp) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-lg bg-[#FFD600] flex items-center justify-center mx-auto">
          <span className="text-[#0D0D0D] font-bold text-lg">CC</span>
        </div>
        <h1 className="text-xl font-bold">Authentication Not Configured</h1>
        <p className="text-sm text-[#888] max-w-sm mx-auto">
          Sign-up requires Clerk to be set up. For now, you can use the app without an account.
        </p>
        <Link href="/dashboard" className="inline-block mt-4 px-6 py-3 bg-[#FFD600] text-[#0D0D0D] font-semibold rounded-md hover:bg-[#FFEA00] transition-colors">
          Go to Dashboard →
        </Link>
      </div>
    )
  }

  return <ClerkSignUp />
}
