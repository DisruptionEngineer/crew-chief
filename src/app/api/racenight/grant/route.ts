import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { promoCode } = await request.json()
  if (!promoCode) {
    return NextResponse.json({ error: 'Promo code required' }, { status: 400 })
  }

  const adminDb = createAdminSupabaseClient()

  // Validate promo code — must be active and flagged as racenight
  const { data: promo, error: promoError } = await adminDb
    .from('promotions')
    .select('*')
    .eq('code', promoCode.toUpperCase().trim())
    .eq('is_active', true)
    .eq('racenight', true)
    .single()

  if (promoError || !promo) {
    return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 })
  }

  // Check expiry
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This race night promo has expired' }, { status: 400 })
  }

  // Check max uses
  if (promo.max_uses !== null && promo.use_count >= promo.max_uses) {
    return NextResponse.json({ error: 'All free spots have been claimed' }, { status: 400 })
  }

  // Create the grant (unique constraint prevents duplicates)
  const { error: grantError } = await adminDb
    .from('racenight_grants')
    .insert({
      user_id: user.id,
      promo_code: promoCode.toUpperCase().trim(),
      track_name: promo.description?.replace(/^Race night promo - /, '').replace(/ \d+\/\d+$/, '') || 'Race Night',
      expires_at: promo.expires_at,
    })

  if (grantError) {
    if (grantError.code === '23505') { // unique_violation
      return NextResponse.json({ error: 'You already claimed this promo' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to activate promo' }, { status: 500 })
  }

  // Increment use count (best-effort, don't fail the grant)
  const { error: incrementError } = await adminDb.rpc('increment_promo_use_count', { promo_id: promo.id })
  if (incrementError) {
    console.error('[racenight] Failed to increment promo use count:', incrementError.message)
  }

  // Track redemption (best-effort)
  const { error: redemptionError } = await adminDb.from('promotion_redemptions').insert({
    promotion_id: promo.id,
    user_id: user.id,
  })
  if (redemptionError) {
    console.error('[racenight] Failed to track redemption:', redemptionError.message)
  }

  return NextResponse.json({
    success: true,
    expires_at: promo.expires_at,
    track_name: promo.description?.replace(/^Race night promo - /, '').replace(/ \d+\/\d+$/, '') || 'Race Night',
  })
}
