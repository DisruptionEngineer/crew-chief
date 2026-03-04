import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/components/shared/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crew Chief — Virtual Race Team',
  description: 'Your pit crew in your pocket. Setup calculator, session logger, troubleshooting, and rulebook for short track racing.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Crew Chief',
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
      <body className="antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
