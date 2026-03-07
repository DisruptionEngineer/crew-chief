import { describe, it, expect } from 'vitest'
import {
  calcAvailableTraction,
  calcRequiredDriveForce,
  calcTractionBalance,
} from '../traction-limit'
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

const track: TrackGeometry = {
  cornerRadius: 85,
  banking: 5,
  straightLength: 200,
  surface: 'mixed',
}

describe('calcAvailableTraction', () => {
  it('returns a positive grip force', () => {
    const grip = calcAvailableTraction(800, tires, 'mixed', 'moderate')
    expect(grip).toBeGreaterThan(0)
  })

  it('increases with more rear axle load', () => {
    const light = calcAvailableTraction(600, tires, 'mixed', 'moderate')
    const heavy = calcAvailableTraction(1000, tires, 'mixed', 'moderate')
    expect(heavy).toBeGreaterThan(light)
  })
})

describe('calcRequiredDriveForce', () => {
  it('calculates force at the contact patch', () => {
    // 300 ft-lbs * 3.73 * 1.0 / (27/2/12) = 1119 / 1.125 ≈ 994.7 lbs
    const force = calcRequiredDriveForce(300, 1.0, 3.73, 27)
    expect(force).toBeCloseTo(994.7, 0)
  })

  it('scales with gear ratio', () => {
    const low = calcRequiredDriveForce(300, 1.0, 3.73, 27)
    const high = calcRequiredDriveForce(300, 2.5, 3.73, 27)
    expect(high).toBeGreaterThan(low)
  })
})

describe('calcTractionBalance', () => {
  it('detects traction-limited condition with high torque', () => {
    const result = calcTractionBalance(
      vehicle, tires, track,
      400, // high torque
      1.0, 3.73,
      30, // corner exit speed
      'moderate',
    )
    expect(result.tractionLimited).toBeDefined()
    expect(result.maxUsableTorque).toBeGreaterThan(0)
  })

  it('is not traction-limited with low torque', () => {
    const result = calcTractionBalance(
      vehicle, tires, track,
      100, // very low torque
      1.0, 3.73,
      30,
      'moderate',
    )
    expect(result.tractionLimited).toBe(false)
    expect(result.tractionMargin).toBeGreaterThan(0)
  })

  it('reports combined demand from friction circle', () => {
    const result = calcTractionBalance(
      vehicle, tires, track,
      300, 1.0, 3.73, 35, 'moderate',
    )
    // Combined should be sqrt(drive^2 + lateral^2)
    const expected = Math.sqrt(
      result.driveForce * result.driveForce +
      result.lateralForceRequired * result.lateralForceRequired,
    )
    expect(result.combinedDemand).toBeCloseTo(expected, 0)
  })
})
