import { describe, it, expect } from 'vitest'
import {
  calcHandlingBalance,
  calcMaxCornerSpeed,
  calcBalanceSensitivity,
} from '../cornering-balance'
import type { VehicleParams, TireModelParams, TrackGeometry } from '@/lib/types/vehicle-dynamics'

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

const tires: TireModelParams = {
  compound: 'hoosier-g60',
  baseMu: 0.90,
  loadSensitivity: 0.00015,
  pressureLF: 14,
  pressureRF: 14,
  pressureLR: 13,
  pressureRR: 13,
  optimalPressureFront: 14,
  optimalPressureRear: 13,
  diameter: 27,
}

// Painesville: ~1/5 mile oval, 85ft corner radius, 5° banking
const track: TrackGeometry = {
  cornerRadius: 85,
  banking: 5,
  straightLength: 200,
  surface: 'mixed',
}

describe('calcHandlingBalance', () => {
  it('returns grip margins for front and rear', () => {
    const result = calcHandlingBalance(vehicle, tires, track, 40, 'moderate')
    expect(result.gripMarginFront).toBeDefined()
    expect(result.gripMarginRear).toBeDefined()
  })

  it('identifies limiting axle', () => {
    const result = calcHandlingBalance(vehicle, tires, track, 40, 'moderate')
    expect(['front', 'rear']).toContain(result.limitingAxle)
  })

  it('returns positive understeer gradient when front-limited (push)', () => {
    // 900 front / 200 rear = very front-biased roll distribution → should push
    const result = calcHandlingBalance(vehicle, tires, track, 40, 'moderate')
    expect(result.understeerGradient).toBeGreaterThan(0)
    expect(result.limitingAxle).toBe('front')
  })

  it('returns negative understeer gradient when rear-limited (loose)', () => {
    const looseVehicle: VehicleParams = {
      ...vehicle,
      frontSpringRate: 200,
      rearSpringRate: 900,
      frontWeightPct: 0.48,
    }
    const result = calcHandlingBalance(looseVehicle, tires, track, 40, 'moderate')
    expect(result.understeerGradient).toBeLessThan(0)
    expect(result.limitingAxle).toBe('rear')
  })
})

describe('calcMaxCornerSpeed', () => {
  it('returns a reasonable speed for a 1/5 mile track', () => {
    const result = calcMaxCornerSpeed(vehicle, tires, track, 'moderate')
    expect(result.maxSpeedMph).toBeGreaterThan(20)
    expect(result.maxSpeedMph).toBeLessThan(80)
  })

  it('returns higher speed with more banking', () => {
    const banked: TrackGeometry = { ...track, banking: 15 }
    const flat = calcMaxCornerSpeed(vehicle, tires, track, 'moderate')
    const high = calcMaxCornerSpeed(vehicle, tires, banked, 'moderate')
    expect(high.maxSpeedMph).toBeGreaterThan(flat.maxSpeedMph)
  })

  it('returns higher speed with bigger radius', () => {
    const big: TrackGeometry = { ...track, cornerRadius: 200 }
    const small = calcMaxCornerSpeed(vehicle, tires, track, 'moderate')
    const large = calcMaxCornerSpeed(vehicle, tires, big, 'moderate')
    expect(large.maxSpeedMph).toBeGreaterThan(small.maxSpeedMph)
  })
})

describe('calcBalanceSensitivity', () => {
  it('returns a curve across the speed range', () => {
    const curve = calcBalanceSensitivity(vehicle, tires, track, 'moderate')
    expect(curve.length).toBeGreaterThan(3)
    expect(curve[0].speedMph).toBeLessThan(curve[curve.length - 1].speedMph)
  })
})
