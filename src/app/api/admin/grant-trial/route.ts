import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { STRIPE_CONFIG } from '@/lib/stripe/config'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

/**
 * Admin API: Grant a free trial to an existing user.
 *
 * POST /api/admin/grant-trial
 * Headers: Authorization: Bearer <ADMIN_API_KEY>
 * Body: { userId: string, trialDays: number }
 *
 * Returns a Stripe Checkout URL with trial_period_days injected.
 * The user opens this URL to start their trial (card required).
 */
export async function POST(request: NextRequest) {
  // Verify admin API key
  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) {
    return NextResponse.json({ error: 'Admin API not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ') || authHeader.slice(7) !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { userId, trialDays } = await request.json()

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }
    if (!trialDays || typeof trialDays !== 'number' || trialDays < 1 || trialDays > 30) {
      return NextResponse.json({ error: 'trialDays must be between 1 and 30' }, { status: 400 })
    }

    const adminDb = createAdminSupabaseClient()

    // Verify user exists
    const { data: { user }, error: userError } = await adminDb.auth.admin.getUserById(userId)
    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has an active subscription
    const { data: existingSub } = await adminDb
      .from('subscriptions')
      .select('status, stripe_customer_id')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .limit(1)
      .maybeSingle()

    if (existingSub) {
      return NextResponse.json(
        { error: `User already has an ${existingSub.status} subscription` },
        { status: 409 }
      )
    }

    // Create Stripe Checkout Session with trial
    const stripe = getStripe()
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Look for existing Stripe customer ID
    const { data: anySub } = await adminDb
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()

    const sessionParams: Record<string, unknown> = {
      mode: 'subscription',
      line_items: [{ price: STRIPE_CONFIG.priceId, quantity: 1 }],
      success_url: `${origin}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/account`,
      metadata: { userId, grantedByAdmin: 'true' },
      subscription_data: {
        metadata: { userId },
        trial_period_days: trialDays,
      },
    }

    if (anySub?.stripe_customer_id) {
      sessionParams.customer = anySub.stripe_customer_id
    } else {
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(
      sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0]
    )

    return NextResponse.json({
      checkoutUrl: session.url,
      userId,
      trialDays,
      email: user.email,
    })
  } catch (error) {
    console.error('Admin grant-trial error:', error)
    return NextResponse.json(
      { error: 'Failed to create trial checkout' },
      { status: 500 }
    )
  }
}
