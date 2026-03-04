import type { CornerWeightInput, CornerWeightResult, LoadBoltAdjustment } from '@/lib/types'

// ============================================================
// Corner Weight Calculator with Load Bolt Adjustments
//
// Calculates cross-weight percentage, left %, rear %, and
// tells you exactly how many turns of the load bolt (or jack
// bolt) to add/remove weight at each corner.
//
// The "load bolt" (also called "weight jack" or "jack bolt")
// is a bolt threaded through the spring perch that preloads
// the spring. Turning it clockwise adds weight to that corner
// by compressing the spring more.
//
// Typical: 1 turn ≈ 10-15 lbs depending on spring rate and
// bolt thread pitch (usually 1/2"-13 or 5/8"-11).
// ============================================================

const DEFAULT_LBS_PER_TURN = 12  // typical for 1/2"-13 bolt with 200 lb/in spring

export function calculateCornerWeights(input: CornerWeightInput): CornerWeightResult {
  const { weightLF, weightRF, weightLR, weightRR, targetCrossWeight, targetLeftPct, targetRearPct } = input
  const lbsPerTurn = input.lbsPerTurn ?? DEFAULT_LBS_PER_TURN

  const totalWeight = weightLF + weightRF + weightLR + weightRR
  const crossWeight = weightRF + weightLR
  const crossWeightPct = totalWeight > 0 ? (crossWeight / totalWeight) * 100 : 0
  const leftWeight = weightLF + weightLR
  const leftPct = totalWeight > 0 ? (leftWeight / totalWeight) * 100 : 0
  const rearWeight = weightLR + weightRR
  const rearPct = totalWeight > 0 ? (rearWeight / totalWeight) * 100 : 0

  // Diagonal weight bias (useful for oval setup)
  const diagonalBias = crossWeightPct - 50

  // Calculate load bolt adjustments to reach target
  const loadBoltAdjustments: LoadBoltAdjustment[] = []

  if (targetCrossWeight !== undefined) {
    const targetCrossLbs = (targetCrossWeight / 100) * totalWeight
    const crossDiff = targetCrossLbs - crossWeight

    if (Math.abs(crossDiff) > 2) {
      // Cross-weight is adjusted by turning the RF jack bolt
      // Adding weight to RF corner adds cross-weight
      const turnsRF = crossDiff / lbsPerTurn
      loadBoltAdjustments.push({
        corner: 'RF',
        turns: Math.round(turnsRF * 10) / 10,
        direction: turnsRF > 0 ? 'in' : 'out',
        weightChange: Math.round(crossDiff),
        explanation: turnsRF > 0
          ? `Turn RF jack bolt ${Math.abs(Math.round(turnsRF * 10) / 10)} turns IN to add ${Math.round(crossDiff)} lbs cross-weight`
          : `Turn RF jack bolt ${Math.abs(Math.round(turnsRF * 10) / 10)} turns OUT to remove ${Math.abs(Math.round(crossDiff))} lbs cross-weight`,
      })
    }
  }

  return {
    totalWeight,
    crossWeight,
    crossWeightPct: Math.round(crossWeightPct * 100) / 100,
    leftWeight,
    leftPct: Math.round(leftPct * 100) / 100,
    rearWeight,
    rearPct: Math.round(rearPct * 100) / 100,
    diagonalBias: Math.round(diagonalBias * 100) / 100,
    loadBoltAdjustments,
  }
}
