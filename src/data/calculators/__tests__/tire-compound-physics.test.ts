import { describe, it, expect } from 'vitest'
import { buildTireModelParams } from '../tire-model'
import { getTireCompound } from '@/data/setup/tires'

describe('buildTireModelParams', () => {
  it('builds params for Hoosier G60 on mixed surface', () => {
    const compound = getTireCompound('hoosier-g60')!
    const params = buildTireModelParams(compound, 'mixed', {
      pressureLF: 14, pressureRF: 14, pressureLR: 13, pressureRR: 13,
      diameter: 27,
    })
    expect(params.baseMu).toBeGreaterThan(0)
    expect(params.loadSensitivity).toBeGreaterThan(0)
    expect(params.optimalPressureFront).toBeGreaterThan(0)
  })

  it('uses dirt baseMu on dirt surface', () => {
    const compound = getTireCompound('hoosier-g60')!
    const dirt = buildTireModelParams(compound, 'dirt', {
      pressureLF: 14, pressureRF: 14, pressureLR: 13, pressureRR: 13,
      diameter: 27,
    })
    const asphalt = buildTireModelParams(compound, 'asphalt', {
      pressureLF: 24, pressureRF: 24, pressureLR: 22, pressureRR: 22,
      diameter: 27,
    })
    expect(dirt.baseMu).not.toBe(asphalt.baseMu)
  })

  it('sets optimal pressure from midpoint of effective range', () => {
    const compound = getTireCompound('hoosier-g60')!
    const params = buildTireModelParams(compound, 'dirt', {
      pressureLF: 14, pressureRF: 14, pressureLR: 13, pressureRR: 13,
      diameter: 27,
    })
    // G60 dirt front range: 12-16, midpoint = 14
    expect(params.optimalPressureFront).toBe(14)
  })

  it('works for all tire compounds', () => {
    const ids = [
      'hoosier-g60', 'hoosier-d55', 'hoosier-d40', 'hoosier-d25',
      'hoosier-f45', 'hoosier-f35', 'american-racer-33', 'american-racer-44',
      'american-racer-56', 'tct-recap', 'dot-street',
    ]
    for (const id of ids) {
      const compound = getTireCompound(id)!
      const params = buildTireModelParams(compound, 'mixed', {
        pressureLF: 20, pressureRF: 20, pressureLR: 18, pressureRR: 18,
        diameter: 27,
      })
      expect(params.baseMu).toBeGreaterThan(0.5)
      expect(params.loadSensitivity).toBeGreaterThan(0)
    }
  })
})
