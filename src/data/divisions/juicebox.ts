import type { Division, DivisionEngineRules } from '@/lib/types'
import { juiceboxRules, juiceboxTechChecklist } from '../rules/juicebox-2026'

// ============================================================
// JuiceBox Division
// Demolition derby / enduro hybrid. Cheap entry, maximum fun.
// Full-size American cars, completely stock, figure 8 format.
// Contact racing IS expected. Spectator favorite.
// ============================================================

export const juiceboxEngineRules: DivisionEngineRules = {
  divisionId: 'juicebox',
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360', 'ford-46-sohc'],
  boreLimits: {
    'gm-sbc-350': { maxBore: 4.030, maxStroke: 3.480 },
    'ford-351w': { maxBore: 4.030, maxStroke: 3.500 },
    'mopar-360': { maxBore: 4.030, maxStroke: 3.580 },
    'ford-46-sohc': { maxBore: 3.552, maxStroke: 3.543 },
  },
  maxCamLift: 0.500,    // stock only
  maxCompression: 10.5,
  maxIntakeValve: 2.10,
  maxExhaustValve: 1.70,
  maxIntakeRunner: 200,
  carbCfmLimit: 750,
  requiresCastIron: false,
  allowsVortec: true,
  allowsBowtieParts: false,
  illegalHeadIds: [],
  illegalCamIds: [],
  notes: 'Stock engine. No modifications. If it came from the factory, it runs.',
}

export const juiceboxDivision: Division = {
  id: 'juicebox',
  name: 'JuiceBox',
  description: 'Demolition derby meets enduro. Stock full-size cars, figure 8 format. Contact racing expected. Cheapest entry, maximum entertainment.',
  formats: ['figure-8'],
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360', 'ford-46-sohc'],
  engineRules: juiceboxEngineRules,
  rules: juiceboxRules,
  techChecklist: juiceboxTechChecklist,
  minWeightLbs: 3000,
  maxWeightLbs: 5000,
  modificationLevel: 'stock',
  eligibleMakes: ['GM', 'Ford', 'Mopar'],
  notes: 'Full-size American cars 1969-present, RWD only. Contact racing expected. Door-hits = DQ.',
}
