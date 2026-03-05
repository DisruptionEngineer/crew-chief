'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'

/**
 * Checks if the user has completed onboarding.
 * Redirects to /onboarding if they haven't.
 * Checks localStorage first (fast), then Supabase profile (cross-device).
 * Returns { isReady } — false while checking, true once resolved.
 */
export function useOnboardingGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const { supabase } = useSupabase()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Don't guard the onboarding page itself
    if (pathname?.startsWith('/onboarding')) {
      setIsReady(true)
      return
    }

    // Fast path: check localStorage first
    const onboarded = localStorage.getItem('tenths-onboarded') || localStorage.getItem('crew-chief-onboarded')
    if (onboarded === 'true') {
      setIsReady(true)
      return
    }

    // Wait for auth to resolve before checking Supabase
    if (authLoading) return

    // If authenticated, check Supabase profile
    if (user) {
      supabase
        .from('user_profiles')
        .select('onboarding_complete')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.onboarding_complete) {
            // Sync to localStorage so future checks are instant
            localStorage.setItem('tenths-onboarded', 'true')
            setIsReady(true)
          } else {
            router.replace('/onboarding')
          }
        })
    } else {
      // Not authenticated, no localStorage — redirect to onboarding
      router.replace('/onboarding')
    }
  }, [pathname, router, user, authLoading, supabase])

  return { isReady }
}
