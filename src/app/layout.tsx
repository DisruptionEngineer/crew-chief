import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { SupabaseProvider } from '@/components/shared/SupabaseProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tenths — Find Your Tenths',
  description: 'Every tenth matters. Setup calculator, diagnostic troubleshooter, session logger, and rulebook for short track racing.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tenths',
  },
}

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="crew-chief.vercel.app"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased min-h-screen">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
