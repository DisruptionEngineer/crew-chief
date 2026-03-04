import type { Car, SetupSheet, RaceClass } from '@/lib/types'
import { monteCarlo75, monteCarloBaseline } from './monte-carlo-75'
import { crownVic06, crownVicBaseline } from './crown-vic-06'
import { camaro78, camaro78Baseline } from './camaro-78'
import { cutlass81, cutlass81Baseline } from './cutlass-81'
import { grandPrix78, grandPrix78Baseline } from './grand-prix-78'
import { caprice90, caprice90Baseline } from './caprice-90'
import { impala96, impala96Baseline } from './impala-96'
import { civic98, civic98Baseline } from './civic-98'
import { cavalier02, cavalier02Baseline } from './cavalier-02'
import { neon00, neon00Baseline } from './neon-00'

// ============================================================
// Car Registry
//
// Central lookup for all car profiles and their baseline setups.
// useCar hook and onboarding quick-select use this.
// ============================================================

export const allCars: Car[] = [
  monteCarlo75,
  camaro78,
  cutlass81,
  grandPrix78,
  crownVic06,
  caprice90,
  impala96,
  civic98,
  cavalier02,
  neon00,
]

export const allBaselines: Record<string, SetupSheet> = {
  'monte-carlo-75': monteCarloBaseline,
  'camaro-78': camaro78Baseline,
  'cutlass-81': cutlass81Baseline,
  'grand-prix-78': grandPrix78Baseline,
  'crown-vic-06': crownVicBaseline,
  'caprice-90': caprice90Baseline,
  'impala-96': impala96Baseline,
  'civic-98': civic98Baseline,
  'cavalier-02': cavalier02Baseline,
  'neon-00': neon00Baseline,
}

const carMap = new Map(allCars.map(c => [c.id, c]))

export function getCarById(id: string): Car | undefined {
  return carMap.get(id)
}

export function getBaselineForCar(carId: string): SetupSheet | undefined {
  return allBaselines[carId]
}

/**
 * Get all cars eligible for a specific division.
 */
export function getCarsForDivision(divisionId: RaceClass): Car[] {
  return allCars.filter(c => c.eligibleDivisions.includes(divisionId))
}

/**
 * Get all cars that use a specific engine family.
 */
export function getCarsForEngineFamily(engineFamilyId: string): Car[] {
  return allCars.filter(c => c.engineFamilyId === engineFamilyId)
}
