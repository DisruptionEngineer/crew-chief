import type { Division, DivisionEngineRules } from '@/lib/types'
import { ironmanF8Rules, ironmanTechChecklist } from '../rules/ironman-f8-2026'

// ============================================================
// Ironman Figure 8 Division
// Painesville Speedway's flagship class. Full-bodied American
// muscle cars, figure 8 format. Limited modifications keep costs
// down while rewarding driver skill and smart engine building.
// ============================================================

export const ironmanF8EngineRules: DivisionEngineRules = {
  divisionId: 'ironman-f8',
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360'],
  boreLimits: {
    'gm-sbc-350': { maxBore: 4.060, maxStroke: 3.480 },
    'ford-351w': { maxBore: 4.060, maxStroke: 3.500 },
    'mopar-360': { maxBore: 4.060, maxStroke: 3.580 },
  },
  maxCamLift: 0.450,
  maxCompression: 10.5,
  maxIntakeValve: 2.02,
  maxExhaustValve: 1.60,
  maxIntakeRunner: 180,
  carbCfmLimit: 500,
  requiresCastIron: true,
  allowsVortec: true,
  allowsBowtieParts: false,
  illegalHeadIds: [],
  illegalCamIds: [],
  notes: 'Holley 4412 500 CFM only. No porting/polishing. Edelbrock dual-plane intake. HEI ignition only.',
}

export const ironmanF8Division: Division = {
  id: 'ironman-f8',
  name: 'Ironman Figure 8',
  description: 'Full-bodied American muscle, figure 8 format. Limited modifications reward driver skill and smart engine building.',
  formats: ['figure-8'],
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360'],
  engineRules: ironmanF8EngineRules,
  rules: ironmanF8Rules,
  techChecklist: ironmanTechChecklist,
  minWeightLbs: 3300,
  maxWeightLbs: 3600,
  minLeftPct: 55,
  minRearPct: 49,
  modificationLevel: 'limited',
  eligibleMakes: ['GM', 'Ford', 'Mopar'],
  notes: 'Any American car 1969-present, RWD only. No ECM/FI vehicles. CRATE OPTION: GM 602 at 3,200 lbs/56% left.',
}
