import { describe, it, expect } from 'vitest'
import { buildVehicleParams } from '../vehicle-defaults'
import type { Car } from '@/lib/types'

const mockMonteCarlo: Car = {
  id: 'monte-carlo-75',
  name: '1975 Monte Carlo',
  year: 1975,
  make: 'Chevrolet',
  model: 'Monte Carlo',
  class: 'ironman-f8',
  eligibleDivisions: ['ironman-f8', 'street-stock'],
  engineFamilyId: 'gm-sbc-350',
  weight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  frontSuspension: 'sla-coil',
  rearSuspension: 'solid-axle-coil',
  engine: {
    displacement: 350,
    block: 'GM 350',
    heads: 'Cast iron straight plug',
    cam: 'Hydraulic, .450" max lift',
    carb: 'Holley 4412 500 CFM',
    compression: '10.5:1 max',
  },
  notes: '',
}

describe('buildVehicleParams', () => {
  it('builds params from car with default estimates', () => {
    const params = buildVehicleParams(mockMonteCarlo)
    expect(params.totalWeight).toBe(3300)
    expect(params.wheelbase).toBe(116)
    expect(params.trackWidthFront).toBe(61.5)
    expect(params.trackWidthRear).toBe(59.5)
    expect(params.cgHeight).toBeGreaterThan(0)
    expect(params.frontRollCenterHeight).toBeGreaterThan(0)
    expect(params.rearRollCenterHeight).toBeGreaterThan(0)
    expect(params.frontWeightPct).toBeGreaterThan(0)
    expect(params.frontWeightPct).toBeLessThan(1)
  })

  it('uses SLA front roll center for sla-coil suspension', () => {
    const params = buildVehicleParams(mockMonteCarlo)
    expect(params.frontRollCenterHeight).toBe(4)
  })

  it('allows user overrides', () => {
    const params = buildVehicleParams(mockMonteCarlo, {
      cgHeight: 18,
      totalWeight: 3400,
      frontWeightPct: 0.52,
    })
    expect(params.cgHeight).toBe(18)
    expect(params.totalWeight).toBe(3400)
    expect(params.frontWeightPct).toBe(0.52)
    // Non-overridden values still use defaults/car data
    expect(params.wheelbase).toBe(116)
  })

  it('uses macpherson-strut front roll center for strut cars', () => {
    const compact: Car = {
      ...mockMonteCarlo,
      id: 'civic-98',
      frontSuspension: 'macpherson-strut',
      rearSuspension: 'torsion-beam',
    }
    const params = buildVehicleParams(compact)
    expect(params.frontRollCenterHeight).toBe(2)
  })
})
