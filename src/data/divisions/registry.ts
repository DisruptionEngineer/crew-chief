import type { Division, DivisionEngineRules, RaceClass } from '@/lib/types'
import { ironmanF8Division, ironmanF8EngineRules } from './ironman-f8'
import { oldSchoolF8Division, oldSchoolF8EngineRules } from './old-school-f8'
import { streetStockDivision, streetStockEngineRules } from './street-stock'
import { compactsDivision, compactsEngineRules } from './compacts'
import { juiceboxDivision, juiceboxEngineRules } from './juicebox'

// ============================================================
// Division Registry
//
// Central lookup for all Painesville Speedway divisions.
// Every rules page, compliance check, and UI selector uses this.
// ============================================================

export const divisions: Division[] = [
  ironmanF8Division,
  oldSchoolF8Division,
  streetStockDivision,
  compactsDivision,
  juiceboxDivision,
]

const divisionMap = new Map(divisions.map(d => [d.id, d]))

export function getDivisionById(id: RaceClass): Division | undefined {
  return divisionMap.get(id)
}

export function getEngineRulesForDivision(id: RaceClass): DivisionEngineRules | undefined {
  return divisionMap.get(id)?.engineRules
}

/**
 * Get all divisions that a specific engine family is eligible for.
 */
export function getDivisionsForEngineFamily(engineFamilyId: string): Division[] {
  return divisions.filter(d =>
    d.allowedEngineFamilyIds.length === 0 || // compacts: no specific families
    d.allowedEngineFamilyIds.includes(engineFamilyId)
  )
}

/**
 * Get all divisions that a specific car make is eligible for.
 */
export function getDivisionsForMake(make: string): Division[] {
  return divisions.filter(d =>
    d.eligibleMakes.includes('any') ||
    d.eligibleMakes.includes(make as Division['eligibleMakes'][number])
  )
}

// Re-export engine rules for direct access
export {
  ironmanF8EngineRules,
  oldSchoolF8EngineRules,
  streetStockEngineRules,
  compactsEngineRules,
  juiceboxEngineRules,
}
