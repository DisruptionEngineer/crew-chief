import { describe, it, expect } from 'vitest'
import {
  getTireGrip,
  getPressureGripModifier,
  getSurfaceGripModifier,
  getEffectiveGrip,
} from '../tire-model'

describe('getTireGrip', () => {
  it('returns baseMu at zero additional load', () => {
    expect(getTireGrip(0, 1.0, 0.00015)).toBe(1.0)
  })

  it('decreases grip with more load (load sensitivity)', () => {
    const gripAt500 = getTireGrip(500, 1.0, 0.00015)
    const gripAt1000 = getTireGrip(1000, 1.0, 0.00015)
    expect(gripAt500).toBeGreaterThan(gripAt1000)
  })

  it('calculates correctly: mu = baseMu - loadSens * load', () => {
    // 1.0 - 0.00015 * 800 = 1.0 - 0.12 = 0.88
    expect(getTireGrip(800, 1.0, 0.00015)).toBeCloseTo(0.88)
  })

  it('floors at a minimum grip of 0.1', () => {
    // Extreme load: 1.0 - 0.00015 * 10000 = -0.5 → floor at 0.1
    expect(getTireGrip(10000, 1.0, 0.00015)).toBe(0.1)
  })
})

describe('getPressureGripModifier', () => {
  it('returns 1.0 at optimal pressure', () => {
    expect(getPressureGripModifier(14, 14)).toBe(1.0)
  })

  it('returns less than 1.0 above optimal', () => {
    expect(getPressureGripModifier(18, 14)).toBeLessThan(1.0)
  })

  it('returns less than 1.0 below optimal', () => {
    expect(getPressureGripModifier(10, 14)).toBeLessThan(1.0)
  })

  it('is symmetric around optimal', () => {
    const above = getPressureGripModifier(16, 14)
    const below = getPressureGripModifier(12, 14)
    expect(above).toBeCloseTo(below)
  })

  it('floors at 0.7 for extreme deviation', () => {
    expect(getPressureGripModifier(5, 14)).toBeGreaterThanOrEqual(0.7)
  })
})

describe('getSurfaceGripModifier', () => {
  it('returns 1.0 for asphalt/moderate baseline', () => {
    expect(getSurfaceGripModifier('asphalt', 'moderate')).toBe(1.0)
  })

  it('returns less grip for concrete than asphalt', () => {
    const concrete = getSurfaceGripModifier('concrete', 'moderate')
    const asphalt = getSurfaceGripModifier('asphalt', 'moderate')
    expect(concrete).toBeLessThan(asphalt)
  })

  it('returns more grip for heavy than slick conditions', () => {
    const heavy = getSurfaceGripModifier('asphalt', 'heavy')
    const slick = getSurfaceGripModifier('asphalt', 'slick')
    expect(heavy).toBeGreaterThan(slick)
  })
})

describe('getEffectiveGrip', () => {
  it('combines all factors into a single effective mu', () => {
    const mu = getEffectiveGrip(800, 1.0, 0.00015, 14, 14, 'asphalt', 'moderate')
    // baseMu adjusted for load: 0.88
    // pressure modifier: 1.0 (at optimal)
    // surface modifier: 1.0 (asphalt/moderate baseline)
    expect(mu).toBeCloseTo(0.88)
  })

  it('reduces grip when pressure is off-optimal', () => {
    const optimal = getEffectiveGrip(800, 1.0, 0.00015, 14, 14, 'asphalt', 'moderate')
    const offPressure = getEffectiveGrip(800, 1.0, 0.00015, 20, 14, 'asphalt', 'moderate')
    expect(offPressure).toBeLessThan(optimal)
  })
})
