import type { Division, DivisionEngineRules } from '@/lib/types'
import { compactsRules, compactsTechChecklist } from '../rules/compacts-2026'

// ============================================================
// Compacts Division
// 4-cylinder FWD cars. Budget entry class. Civics, Cavaliers,
// Neons, Cobalts, Focuses. Stock everything. Figure 8 format.
// ============================================================

export const compactsEngineRules: DivisionEngineRules = {
  divisionId: 'compacts',
  allowedEngineFamilyIds: [],  // Compacts don't use the standard engine families
  boreLimits: {},
  maxCamLift: 0.500,    // stock only — no cam swaps, this is just a ceiling
  maxCompression: 12.0,  // stock is fine, just a safety ceiling
  maxIntakeValve: 2.00,
  maxExhaustValve: 1.60,
  maxIntakeRunner: 200,
  carbCfmLimit: 0,       // N/A — factory FI or carb
  requiresCastIron: false, // aluminum blocks fine (many 4-cyls are aluminum)
  allowsVortec: false,
  allowsBowtieParts: false,
  illegalHeadIds: [],
  illegalCamIds: [],
  notes: 'Stock engine only. No internal modifications. Factory FI/ECM permitted. No turbo/SC/nitrous. Engine must match make of car.',
}

export const compactsDivision: Division = {
  id: 'compacts',
  name: 'Compacts',
  trackId: 'painesville',
  trackName: 'Painesville Speedway',
  description: 'Budget 4-cylinder class. FWD or RWD, stock everything. Civics, Cavaliers, Neons, Cobalts. Lowest entry cost.',
  formats: ['figure-8'],
  allowedEngineFamilyIds: [],
  engineRules: compactsEngineRules,
  rules: compactsRules,
  techChecklist: compactsTechChecklist,
  minWeightLbs: 2300,
  maxWeightLbs: 3500,
  modificationLevel: 'stock',
  eligibleMakes: ['Honda', 'GM', 'Dodge', 'Ford', 'any'],
  notes: '4-cylinder only. Any make, any year. Stock engine matching car make.',
}
