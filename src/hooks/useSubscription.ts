'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useAuth } from '@/hooks/useAuth'
import type { Subscription, SubscriptionStatus } from '@/lib/types/subscription'
import { isSubscriptionActive } from '@/lib/types/subscription'

interface UseSubscriptionReturn {
  subscription: Subscription | null
  status: SubscriptionStatus | null
  isPro: boolean
  loading: boolean
  refresh: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setSubscription(data as Subscription | null)
    } catch {
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const status = subscription?.status ?? null
  const isPro = isSubscriptionActive(status)

  return { subscription, status, isPro, loading, refresh: fetchSubscription }
}
