import { describe, it, expect } from 'vitest'
import {
  calcLateralLoadTransfer,
  calcLongitudinalLoadTransfer,
  calcCornerWeightsAtSpeed,
} from '../load-transfer'
import type { VehicleParams } from '@/lib/types'

const vehicle: VehicleParams = {
  totalWeight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  cgHeight: 20,
  frontWeightPct: 0.53,
  leftWeightPct: 0.50,
  frontSpringRate: 900,
  rearSpringRate: 200,
  frontRollCenterHeight: 4,
  rearRollCenterHeight: 8,
}

describe('calcLateralLoadTransfer', () => {
  it('returns 0 at 0 lateral g', () => {
    expect(calcLateralLoadTransfer(vehicle, 0)).toBe(0)
  })

  it('returns positive value for positive lateral g', () => {
    const transfer = calcLateralLoadTransfer(vehicle, 0.5)
    expect(transfer).toBeGreaterThan(0)
  })

  it('calculates dW = (W * ay * cgH) / avgTrackWidth', () => {
    // avgTrackWidth = (61.5 + 59.5) / 2 = 60.5
    // dW = (3300 * 0.75 * 20) / 60.5 = 49500 / 60.5 ≈ 818.2
    const transfer = calcLateralLoadTransfer(vehicle, 0.75)
    expect(transfer).toBeCloseTo(818.2, 0)
  })

  it('scales linearly with lateral g', () => {
    const half = calcLateralLoadTransfer(vehicle, 0.5)
    const full = calcLateralLoadTransfer(vehicle, 1.0)
    expect(full).toBeCloseTo(half * 2, 0)
  })
})

describe('calcLongitudinalLoadTransfer', () => {
  it('returns 0 at 0 longitudinal g', () => {
    expect(calcLongitudinalLoadTransfer(vehicle, 0)).toBe(0)
  })

  it('calculates dW = (W * ax * cgH) / wheelbase', () => {
    // dW = (3300 * 0.3 * 20) / 116 ≈ 170.7
    const transfer = calcLongitudinalLoadTransfer(vehicle, 0.3)
    expect(transfer).toBeCloseTo(170.7, 0)
  })
})

describe('calcCornerWeightsAtSpeed', () => {
  it('returns static weights at 0 lateral g', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0, 0, 0.55)
    // 50% left, 53% front → LF=874.5, RF=874.5, LR=775.5, RR=775.5
    const frontWeight = vehicle.totalWeight * vehicle.frontWeightPct
    const rearWeight = vehicle.totalWeight * (1 - vehicle.frontWeightPct)
    expect(weights.lf).toBeCloseTo(frontWeight * vehicle.leftWeightPct)
    expect(weights.rf).toBeCloseTo(frontWeight * (1 - vehicle.leftWeightPct))
    expect(weights.lr).toBeCloseTo(rearWeight * vehicle.leftWeightPct)
    expect(weights.rr).toBeCloseTo(rearWeight * (1 - vehicle.leftWeightPct))
  })

  it('total weight is preserved during cornering', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0.75, 0, 0.55)
    expect(weights.lf + weights.rf + weights.lr + weights.rr).toBeCloseTo(3300, 0)
  })

  it('shifts weight to the right in a left turn (positive lateral g)', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0.75, 0, 0.55)
    const staticWeights = calcCornerWeightsAtSpeed(vehicle, 0, 0, 0.55)
    expect(weights.rf).toBeGreaterThan(staticWeights.rf)
    expect(weights.lf).toBeLessThan(staticWeights.lf)
  })

  it('reports inside front load', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0.75, 0, 0.55)
    expect(weights.insideFrontLoad).toBe(weights.lf)
  })
})
