import type { RimOffsetInput, RimOffsetResult } from '@/lib/types'

// ============================================================
// Rim Offset & Scrub Radius Calculator
//
// Calculates the effect of wheel offset on scrub radius,
// which affects steering feel, braking stability, and
// tire wear. Critical for stock-chassis racing where you
// can't change spindle geometry.
//
// Scrub Radius = distance from tire contact patch center
// to the steering axis intersection with the ground.
//
// Positive scrub = tire contact outboard of steering axis
// Negative scrub = tire contact inboard of steering axis
//
// Most stock cars have slight positive scrub. Moving the
// wheel outboard (less backspacing / more positive offset)
// increases scrub radius.
// ============================================================

export function calculateRimOffset(input: RimOffsetInput): RimOffsetResult {
  const {
    rimWidth,
    backspacing,
    tireWidth,
    stockBackspacing,
    stockRimWidth,
    kingpinOffset,
  } = input

  // Calculate offset from backspacing
  // Offset = backspacing - (rim width / 2)
  const rimWidthInches = rimWidth
  const offsetInches = backspacing - (rimWidthInches / 2)
  const offsetMm = Math.round(offsetInches * 25.4)

  // Stock offset for comparison
  const stockOffsetInches = stockBackspacing - ((stockRimWidth ?? rimWidth) / 2)
  const stockOffsetMm = Math.round(stockOffsetInches * 25.4)

  // How far the tire centerline moved from stock
  const centerlineShift = offsetInches - stockOffsetInches

  // Scrub radius change (positive = more outboard)
  // Each inch of outboard shift adds ~1" to scrub radius
  const scrubRadiusChange = -centerlineShift

  // Estimated scrub radius (stock kingpin offset + our change)
  const estimatedScrubRadius = (kingpinOffset ?? 1.5) + scrubRadiusChange

  // Track width change (both sides combined)
  const trackWidthChange = centerlineShift * -2  // both sides move in/out

  // Recommendations
  const warnings: string[] = []
  if (estimatedScrubRadius > 3.0) {
    warnings.push('High scrub radius — may cause heavy steering and uneven tire wear')
  }
  if (estimatedScrubRadius < 0) {
    warnings.push('Negative scrub radius — may cause the wheel to kick back under braking')
  }
  if (Math.abs(trackWidthChange) > 2) {
    warnings.push(`Track width changes ${Math.abs(trackWidthChange).toFixed(1)}" — check class maximum width rules`)
  }

  return {
    offsetInches: Math.round(offsetInches * 1000) / 1000,
    offsetMm,
    stockOffsetMm,
    centerlineShift: Math.round(centerlineShift * 1000) / 1000,
    scrubRadiusChange: Math.round(scrubRadiusChange * 1000) / 1000,
    estimatedScrubRadius: Math.round(estimatedScrubRadius * 100) / 100,
    trackWidthChange: Math.round(trackWidthChange * 100) / 100,
    warnings,
  }
}
