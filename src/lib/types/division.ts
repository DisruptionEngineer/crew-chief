// ============================================================
// Division & Division Engine Rules
// ============================================================

import type { RaceClass, RaceType } from './common'
import type { Rule, TechCheckItem } from './rules'

/**
 * Engine-level rules that compliance.ts checks against.
 * Each division provides its own instance — the same engine family may
 * have different limits in different classes.
 */
export interface DivisionEngineRules {
  divisionId: RaceClass
  /** Engine families allowed in this division */
  allowedEngineFamilyIds: string[]
  /** Per-family bore/stroke limits (keyed by engineFamilyId) */
  boreLimits: Record<string, { maxBore: number; maxStroke: number }>
  maxCamLift: number            // inches at valve
  maxCompression: number        // ratio
  maxIntakeValve: number        // inches
  maxExhaustValve: number       // inches
  maxIntakeRunner: number       // cc
  carbCfmLimit: number          // e.g. 500 for Holley 4412
  requiresCastIron: boolean     // no aluminum heads
  allowsVortec: boolean
  allowsBowtieParts: boolean
  /** Casting IDs banned by this division */
  illegalHeadIds: string[]
  illegalCamIds: string[]
  notes: string
}

/**
 * A racing division/class at a speedway.
 */
export interface Division {
  id: RaceClass
  name: string
  description: string
  formats: RaceType[]
  allowedEngineFamilyIds: string[]
  engineRules: DivisionEngineRules
  rules: Rule[]
  techChecklist: TechCheckItem[]
  // Track association
  trackId: string
  trackName: string
  // Weight limits
  minWeightLbs: number
  maxWeightLbs: number
  minLeftPct?: number
  minRearPct?: number
  // Character
  modificationLevel: 'stock' | 'limited' | 'open'
  eligibleMakes: ('GM' | 'Ford' | 'Mopar' | 'Honda' | 'Dodge' | 'any')[]
  notes: string
}
