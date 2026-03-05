import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

const relevantEvents = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  const subscription = event.data.object as Stripe.Subscription
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No userId in subscription metadata:', subscription.id)
    return NextResponse.json({ received: true })
  }

  const supabase = createAdminSupabaseClient()
  const firstItem = subscription.items.data[0]
  const priceId = firstItem?.price?.id ?? null

  // Period dates are now on SubscriptionItem, not Subscription
  const periodStart = firstItem?.current_period_start
    ? new Date(firstItem.current_period_start * 1000).toISOString()
    : new Date(subscription.start_date * 1000).toISOString()
  const periodEnd = firstItem?.current_period_end
    ? new Date(firstItem.current_period_end * 1000).toISOString()
    : null

  const eventTimestamp = new Date(event.created * 1000).toISOString()

  if (event.type === 'customer.subscription.deleted') {
    // Upsert instead of update — handles case where row doesn't exist
    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          status: 'canceled',
          price_id: priceId,
          current_period_start: periodStart,
          current_period_end: periodEnd,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: eventTimestamp,
        },
        { onConflict: 'stripe_subscription_id' }
      )

    if (error) console.error('Error upserting canceled subscription:', error)
  } else {
    // Guard against out-of-order delivery: only update if this event is newer
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('updated_at')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (existing?.updated_at && new Date(existing.updated_at) >= new Date(eventTimestamp)) {
      // Stale event — skip
      return NextResponse.json({ received: true })
    }

    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          price_id: priceId,
          current_period_start: periodStart,
          current_period_end: periodEnd,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: eventTimestamp,
        },
        { onConflict: 'stripe_subscription_id' }
      )

    if (error) console.error('Error upserting subscription:', error)
  }

  return NextResponse.json({ received: true })
}
