import { describe, it, expect } from 'vitest'
import { calculateCornerWeights } from '../corner-weight'

describe('smoke test — vitest is working', () => {
  it('calculates cross-weight percentage', () => {
    const result = calculateCornerWeights({
      weightLF: 825,
      weightRF: 825,
      weightLR: 825,
      weightRR: 825,
    })
    expect(result.crossWeightPct).toBe(50)
  })
})
