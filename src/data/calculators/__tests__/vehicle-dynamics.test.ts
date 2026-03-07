import { describe, it, expect } from 'vitest'
import { analyzeVehicleDynamics } from '../vehicle-dynamics'
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

describe('analyzeVehicleDynamics', () => {
  it('returns a complete result with all fields', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    expect(result.staticWeights).toBeDefined()
    expect(result.dynamicWeights).toBeDefined()
    expect(result.gripPerTire).toBeDefined()
    expect(result.rollDistributionFront).toBeGreaterThan(0)
    expect(result.rollAngleDeg).toBeGreaterThan(0)
    expect(result.maxCornerSpeedMph).toBeGreaterThan(0)
    expect(result.lateralG).toBeGreaterThan(0)
    expect(result.understeerGradient).toBeDefined()
    expect(result.balanceCurve.length).toBeGreaterThan(0)
    expect(result.physicsInsights.length).toBeGreaterThan(0)
  })

  it('preserves total weight in static weights', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    const total = result.staticWeights.lf + result.staticWeights.rf +
                  result.staticWeights.lr + result.staticWeights.rr
    expect(total).toBeCloseTo(3300, 0)
  })

  it('preserves total weight in dynamic weights', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    const total = result.dynamicWeights.lf + result.dynamicWeights.rf +
                  result.dynamicWeights.lr + result.dynamicWeights.rr
    expect(total).toBeCloseTo(3300, 0)
  })

  it('generates insights about roll distribution', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    const rollInsight = result.physicsInsights.find(i => i.category === 'springs')
    expect(rollInsight).toBeDefined()
  })

  it('includes traction data when engine params are provided', () => {
    const withEngine: VehicleParams = {
      ...vehicle,
      peakTorque: 300,
      peakTorqueRpm: 3800,
    }
    const result = analyzeVehicleDynamics(withEngine, tires, track, 'moderate', 'oval')
    expect(result.traction).toBeDefined()
    expect(result.traction!.maxUsableTorque).toBeGreaterThan(0)
  })

  it('omits traction data when no engine params', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    expect(result.traction).toBeUndefined()
  })
})
