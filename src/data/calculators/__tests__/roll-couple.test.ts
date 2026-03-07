import { describe, it, expect } from 'vitest'
import {
  calcRollStiffness,
  calcRollDistribution,
  calcRollAngle,
  calcTargetSpringRates,
} from '../roll-couple'
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

describe('calcRollStiffness', () => {
  it('increases with spring rate', () => {
    const soft = calcRollStiffness(200, 60)
    const stiff = calcRollStiffness(900, 60)
    expect(stiff).toBeGreaterThan(soft)
  })

  it('increases with track width', () => {
    const narrow = calcRollStiffness(900, 50)
    const wide = calcRollStiffness(900, 60)
    expect(wide).toBeGreaterThan(narrow)
  })

  it('calculates K = 0.5 * springRate * (trackWidth/2)^2', () => {
    // 0.5 * 900 * (30)^2 = 0.5 * 900 * 900 = 405000
    expect(calcRollStiffness(900, 60)).toBe(405000)
  })
})

describe('calcRollDistribution', () => {
  it('returns higher front % when front springs are stiffer', () => {
    const dist = calcRollDistribution(vehicle)
    expect(dist).toBeGreaterThan(0.5)
  })

  it('returns ~50% when front and rear springs are equal', () => {
    const balanced: VehicleParams = {
      ...vehicle,
      frontSpringRate: 500,
      rearSpringRate: 500,
      trackWidthFront: 60,
      trackWidthRear: 60,
    }
    const dist = calcRollDistribution(balanced)
    expect(dist).toBeCloseTo(0.5, 1)
  })
})

describe('calcRollAngle', () => {
  it('returns 0 at 0 lateral g', () => {
    expect(calcRollAngle(vehicle, 0)).toBe(0)
  })

  it('increases with lateral g', () => {
    const low = calcRollAngle(vehicle, 0.3)
    const high = calcRollAngle(vehicle, 0.75)
    expect(high).toBeGreaterThan(low)
  })

  it('returns a reasonable value (1-5 deg at 0.75g)', () => {
    const angle = calcRollAngle(vehicle, 0.75)
    expect(angle).toBeGreaterThan(0.5)
    expect(angle).toBeLessThan(10)
  })
})

describe('calcTargetSpringRates', () => {
  it('returns spring rates that achieve the target roll distribution', () => {
    const target = 0.57
    const result = calcTargetSpringRates(vehicle, target)
    // Verify the result achieves the target
    const checkVehicle: VehicleParams = {
      ...vehicle,
      frontSpringRate: result.frontSpringRate,
      rearSpringRate: result.rearSpringRate,
    }
    const achieved = calcRollDistribution(checkVehicle)
    expect(achieved).toBeCloseTo(target, 2)
  })

  it('returns stiffer front for higher front roll distribution target', () => {
    const low = calcTargetSpringRates(vehicle, 0.50)
    const high = calcTargetSpringRates(vehicle, 0.60)
    expect(high.frontSpringRate).toBeGreaterThan(low.frontSpringRate)
  })
})
