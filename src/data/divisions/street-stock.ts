import type { Division, DivisionEngineRules } from '@/lib/types'
import { streetStockRules, streetStockTechChecklist } from '../rules/street-stock-2026'

// ============================================================
// Street Stock Division
// The "open but affordable" class. More mods than Ironman —
// porting OK, higher cam lift, adjustable shocks, load bolts,
// tubular control arms. This is where chassis setup knowledge
// and airflow tuning really pay off.
// ============================================================

export const streetStockEngineRules: DivisionEngineRules = {
  divisionId: 'street-stock',
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360'],
  boreLimits: {
    'gm-sbc-350': { maxBore: 4.060, maxStroke: 3.480 },
    'ford-351w': { maxBore: 4.060, maxStroke: 3.500 },
    'mopar-360': { maxBore: 4.060, maxStroke: 3.580 },
  },
  maxCamLift: 0.480,
  maxCompression: 11.0,
  maxIntakeValve: 2.02,
  maxExhaustValve: 1.60,
  maxIntakeRunner: 195,
  carbCfmLimit: 650,
  requiresCastIron: true,
  allowsVortec: true,
  allowsBowtieParts: false,
  illegalHeadIds: [],
  illegalCamIds: [],
  notes: 'Porting/bowl blending PERMITTED. Headers 1.750" max. Dual-plane intake. Adjustable shocks OK (<$200). Load bolts front/rear.',
}

export const streetStockDivision: Division = {
  id: 'street-stock',
  name: 'Street Stock',
  trackId: 'painesville',
  trackName: 'Painesville Speedway',
  description: 'The "open but affordable" oval class. Porting allowed, higher cam lifts, adjustable shocks, load bolts, tubular A-arms. Where setup knowledge pays off.',
  formats: ['oval'],
  allowedEngineFamilyIds: ['gm-sbc-350', 'ford-351w', 'mopar-360'],
  engineRules: streetStockEngineRules,
  rules: streetStockRules,
  techChecklist: streetStockTechChecklist,
  minWeightLbs: 3100,
  maxWeightLbs: 4000,
  minLeftPct: 57,
  minRearPct: 52,
  modificationLevel: 'open',
  eligibleMakes: ['GM', 'Ford', 'Mopar'],
  notes: 'Any American car 1964-present, RWD, carbureted only. Minimum 107" wheelbase.',
}
