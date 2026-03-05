export const STRIPE_CONFIG = {
  priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
  productId: 'prod_U5caf6k0le6syu',
  price: 999, // cents
  currency: 'usd',
  interval: 'month' as const,
  displayPrice: '$9.99',
  planName: 'Crew Chief Pro',
} as const

export const PRO_FEATURES = [
  'engine',        // Engine simulator
  'engine-compare', // Engine comparison
  'sessions',      // Session logging
  'multi-car',     // Multiple car profiles
] as const

export const FREE_FEATURES = [
  'dashboard',
  'setup',
  'calculators',
  'troubleshoot',
  'rules',
] as const

export type ProFeature = (typeof PRO_FEATURES)[number]

export function isProFeature(feature: string): boolean {
  return (PRO_FEATURES as readonly string[]).includes(feature)
}
