'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useSubscription } from '@/hooks/useSubscription'
import type { Subscription, SubscriptionStatus, RacenightGrant } from '@/lib/types/subscription'

interface SubscriptionContextType {
  subscription: Subscription | null
  status: SubscriptionStatus | null
  isPro: boolean
  racenightGrant: RacenightGrant | null
  isRacenightAccess: boolean
  loading: boolean
  refresh: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const value = useSubscription()

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscriptionContext(): SubscriptionContextType {
  const context = useContext(SubscriptionContext)
  if (!context) throw new Error('useSubscriptionContext must be used within SubscriptionProvider')
  return context
}
