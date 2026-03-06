import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { STRIPE_CONFIG } from '@/lib/stripe/config'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Parse optional body (existing callers POST with no body, so handle gracefully)
    let promoCode: string | undefined
    try {
      const body = await request.json()
      promoCode = body?.promoCode
    } catch {
      // No body or invalid JSON — that's fine, proceed without promo
    }

    // Validate promo code if provided
    let trialDays: number | undefined
    if (promoCode) {
      const adminDb = createAdminSupabaseClient()

      // Look up the promotion
      const { data: promo } = await adminDb
        .from('promotions')
        .select('*')
        .eq('code', promoCode.toUpperCase().trim())
        .eq('is_active', true)
        .maybeSingle()

      if (!promo) {
        return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 })
      }

      // Check expiration
      const now = new Date()
      if (promo.expires_at && new Date(promo.expires_at) < now) {
        return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 })
      }

      // Check max uses
      if (promo.max_uses !== null && promo.use_count >= promo.max_uses) {
        return NextResponse.json({ error: 'This promo code has been fully redeemed' }, { status: 400 })
      }

      // Record redemption
      const { error: redeemError } = await adminDb
        .from('promotion_redemptions')
        .insert({
          promotion_id: promo.id,
          user_id: user.id,
        })

      if (redeemError) {
        console.error('Promo redemption error:', redeemError)
        // Don't block checkout — just skip the trial
      } else {
        // Increment use count
        await adminDb.rpc('increment_promo_use_count', { promo_id: promo.id })
        trialDays = promo.trial_days
      }
    }

    const stripe = getStripe()
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Check if user already has a Stripe customer ID
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [{ price: STRIPE_CONFIG.priceId, quantity: 1 }],
      success_url: `${origin}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/account`,
      metadata: { userId: user.id },
      subscription_data: {
        metadata: { userId: user.id },
        ...(trialDays ? { trial_period_days: trialDays } : {}),
      },
    }

    // Reuse existing customer or set email for new one
    if (existingSub?.stripe_customer_id) {
      sessionParams.customer = existingSub.stripe_customer_id
    } else {
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
