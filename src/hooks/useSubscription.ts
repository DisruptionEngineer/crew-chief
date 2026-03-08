'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useAuth } from '@/hooks/useAuth'
import type { Subscription, SubscriptionStatus, RacenightGrant } from '@/lib/types/subscription'
import { isSubscriptionActive } from '@/lib/types/subscription'

interface UseSubscriptionReturn {
  subscription: Subscription | null
  status: SubscriptionStatus | null
  isPro: boolean
  racenightGrant: RacenightGrant | null
  isRacenightAccess: boolean
  loading: boolean
  refresh: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [racenightGrant, setRacenightGrant] = useState<RacenightGrant | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setRacenightGrant(null)
      setLoading(false)
      return
    }

    try {
      const [subscriptionResult, grantResult] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('racenight_grants')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gt('expires_at', new Date().toISOString())
          .order('expires_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      setSubscription(subscriptionResult.data as Subscription | null)
      setRacenightGrant(grantResult.data as RacenightGrant | null)
    } catch {
      setSubscription(null)
      setRacenightGrant(null)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const status = subscription?.status ?? null
  // User has Pro access if they have an active Stripe subscription OR an active racenight grant
  const isPro = isSubscriptionActive(status) || !!racenightGrant

  return {
    subscription,
    status,
    isPro,
    racenightGrant,
    isRacenightAccess: !!racenightGrant,
    loading,
    refresh: fetchSubscription,
  }
}
