import type { Division, DivisionEngineRules } from '@/lib/types'
import { oldSchoolF8Rules, oldSchoolTechChecklist } from '../rules/old-school-f8-2026'

// ============================================================
// Old School Figure 8 Division
// "Run what you brung" class. Stock engines, factory FI allowed.
// Crown Vics, Caprices, Impalas — the big boats.
// Lower barrier to entry than Ironman.
// ============================================================

export const oldSchoolF8EngineRules: DivisionEngineRules = {
  divisionId: 'old-school-f8',
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360', 'ford-46-sohc'],
  boreLimits: {
    'gm-sbc-350': { maxBore: 4.030, maxStroke: 3.480 },
    'ford-351w': { maxBore: 4.030, maxStroke: 3.500 },
    'mopar-360': { maxBore: 4.030, maxStroke: 3.580 },
    'ford-46-sohc': { maxBore: 3.552, maxStroke: 3.543 },
  },
  maxCamLift: 0.480,    // stock cam only, but PI cam is .472"
  maxCompression: 10.0,  // stock is fine
  maxIntakeValve: 2.04,
  maxExhaustValve: 1.66,
  maxIntakeRunner: 200,
  carbCfmLimit: 750,     // stock carb or FI
  requiresCastIron: false, // aluminum blocks OK if factory
  allowsVortec: true,
  allowsBowtieParts: false,
  illegalHeadIds: [],
  illegalCamIds: [],
  notes: 'Stock engine for chassis. No engine swaps. Factory FI permitted. Stock cam only.',
}

export const oldSchoolF8Division: Division = {
  id: 'old-school-f8',
  name: 'Old School Figure 8',
  description: 'Stock-bodied, "run what you brung" figure 8 class. Factory FI allowed. Lower entry barrier — perfect for Crown Vics and big sedans.',
  formats: ['figure-8'],
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360', 'ford-46-sohc'],
  engineRules: oldSchoolF8EngineRules,
  rules: oldSchoolF8Rules,
  techChecklist: oldSchoolTechChecklist,
  minWeightLbs: 3200,
  maxWeightLbs: 5000,
  modificationLevel: 'stock',
  eligibleMakes: ['GM', 'Ford', 'Mopar'],
  notes: 'Any American car 1969-present, RWD only. ECM/FI vehicles ARE permitted.',
}
