'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
const isClerkConfigured = clerkKey.startsWith('pk_test_') || clerkKey.startsWith('pk_live_')

// Only validate if key looks like a real Clerk key (not a placeholder)
const hasValidKey = isClerkConfigured && !clerkKey.includes('PLACEHOLDER')

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!hasValidKey) {
    // Render without Clerk in dev/build when keys aren't configured
    return <>{children}</>
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#FFD600',
          colorBackground: '#1A1A1A',
          colorInputBackground: '#252525',
          colorText: '#F5F5F5',
          colorTextSecondary: '#888888',
          borderRadius: '0.5rem',
        },
        elements: {
          card: 'bg-[#1A1A1A] border border-[#333] shadow-none',
          formButtonPrimary: 'bg-[#FFD600] text-[#0D0D0D] hover:bg-[#FFEA00] font-semibold',
          footerActionLink: 'text-[#FFD600] hover:text-[#FFEA00]',
          headerTitle: 'text-[#F5F5F5]',
          headerSubtitle: 'text-[#888]',
          socialButtonsBlockButton: 'bg-[#252525] border-[#333] text-[#F5F5F5] hover:bg-[#333]',
          formFieldInput: 'bg-[#252525] border-[#333] text-[#F5F5F5]',
          dividerLine: 'bg-[#333]',
          dividerText: 'text-[#666]',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
