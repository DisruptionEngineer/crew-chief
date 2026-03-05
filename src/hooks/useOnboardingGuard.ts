'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Checks if the user has completed onboarding.
 * Redirects to /onboarding if they haven't.
 * Returns { isReady } — false while checking, true once resolved.
 */
export function useOnboardingGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Don't guard the onboarding page itself
    if (pathname?.startsWith('/onboarding')) {
      setIsReady(true)
      return
    }

    const onboarded = localStorage.getItem('tenths-onboarded') || localStorage.getItem('crew-chief-onboarded')

    if (onboarded === 'true') {
      setIsReady(true)
    } else {
      // User hasn't completed onboarding — redirect
      router.replace('/onboarding')
    }
  }, [pathname, router])

  return { isReady }
}
