'use client'

import { Navigation } from '@/components/shared/Navigation'
import { CarProvider } from '@/hooks/useCar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SubscriptionProvider } from '@/components/subscription/SubscriptionProvider'
import { useOnboardingGuard } from '@/hooks/useOnboardingGuard'
import { TenthsLogo } from '@/components/shared/TenthsLogo'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isReady } = useOnboardingGuard()

  // Show loading state while checking onboarding status
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-pulse">
            <TenthsLogo size={40} />
          </div>
          <span className="text-xs text-[#555570]">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <SubscriptionProvider>
      <CarProvider>
        <div className="flex flex-col md:flex-row min-h-screen">
          <Navigation />
          <main className="flex-1 pt-14 pb-nav md:pt-0 md:pb-0 md:ml-20 lg:ml-60">
            <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </CarProvider>
      </SubscriptionProvider>
    </TooltipProvider>
  )
}
