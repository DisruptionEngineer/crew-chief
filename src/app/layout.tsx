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
          async
          src="https://plausible.io/js/pa-PhL4tUkbEPSt9ciXQrlDq.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </head>
      <body className="antialiased min-h-screen">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
