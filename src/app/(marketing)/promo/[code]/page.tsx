import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { PromoLandingClient } from './PromoLandingClient'

interface Props {
  params: Promise<{ code: string }>
}

export default async function PromoPage({ params }: Props) {
  const { code } = await params
  const upperCode = code.toUpperCase().trim()

  const adminDb = createAdminSupabaseClient()

  // Look up the promotion
  const { data: promo } = await adminDb
    .from('promotions')
    .select('code, trial_days, description, expires_at, max_uses, use_count, is_active')
    .eq('code', upperCode)
    .eq('is_active', true)
    .maybeSingle()

  // Validate
  let error: string | null = null

  if (!promo) {
    error = 'Invalid promo code'
  } else {
    const now = new Date()
    if (promo.expires_at && new Date(promo.expires_at) < now) {
      error = 'This promo has expired'
    } else if (promo.max_uses !== null && promo.use_count >= promo.max_uses) {
      error = 'This promo has been fully redeemed'
    }
  }

  if (error || !promo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#FF1744]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#FF1744]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">{error}</h1>
          <p className="text-[#7A7A90] mb-6">
            This promo link is no longer valid. Check for typos or contact us for help.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center bg-[#00B4FF] text-[#0A0A0F] font-bold px-6 py-3 rounded-md hover:bg-[#33C4FF] transition-colors"
          >
            Go to Tenths
          </a>
        </div>
      </div>
    )
  }

  return (
    <PromoLandingClient
      code={promo.code}
      trialDays={promo.trial_days}
      description={promo.description}
    />
  )
}
