import type { CamProfile } from '@/lib/types'

// ============================================================
// GM SBC Hydraulic Cam Catalog
// Sorted from mildest to most aggressive
// Legality is determined at runtime by DivisionEngineRules
// ============================================================

export const camCatalog: CamProfile[] = [
  {
    id: 'stock',
    name: 'Stock Replacement',
    lift: 0.360,
    duration: 194,
    lsa: 112,
    engineFamilyId: 'gm-sbc-350',
    notes: 'Factory-spec cam. Smooth idle, broad torque band peaking around 4,200 RPM. Great driveability, but leaves power on the table. Good starting point for a brand new racer.',
  },
  {
    id: 'rv-cam',
    name: 'RV / Tow Cam (.390")',
    lift: 0.390,
    duration: 204,
    lsa: 112,
    engineFamilyId: 'gm-sbc-350',
    notes: 'Classic "RV cam" — slight lope at idle but still mannered. Bumps torque across the whole range. Power band 2,000–5,200 RPM. Popular budget upgrade.',
  },
  {
    id: 'street-strip',
    name: 'Street/Strip (.420")',
    lift: 0.420,
    duration: 214,
    lsa: 110,
    engineFamilyId: 'gm-sbc-350',
    notes: 'Noticeable lope at idle — sounds like a race car. Good mid-range torque with more top-end pull. Power band 2,500–5,500 RPM. Sweet spot for most short track builds.',
  },
  {
    id: 'track',
    name: 'Track Grind (.440")',
    lift: 0.440,
    duration: 220,
    lsa: 108,
    engineFamilyId: 'gm-sbc-350',
    notes: 'Aggressive lope. Power band shifts up to 3,000–5,800 RPM. Needs good heads to breathe. Excellent match for Vortec #906 or #441 fuelie heads.',
  },
  {
    id: 'max-legal',
    name: 'Max Legal (.450")',
    lift: 0.450,
    duration: 224,
    lsa: 106,
    engineFamilyId: 'gm-sbc-350',
    notes: 'Maximum legal lift for Ironman F8. Strong lope, power peaks near 6,000 RPM. Best paired with high-flow heads (#441, #906) to take full advantage. Expect scrutiny at tech.',
  },
  {
    id: 'illegal-480',
    name: 'Hot Hydraulic (.480")',
    lift: 0.480,
    duration: 232,
    lsa: 106,
    engineFamilyId: 'gm-sbc-350',
    notes: 'Included for comparison. Shows what extra lift gains you — exceeds many division lift limits. This cam will fail tech in most classes.',
  },
]

export function getCamById(id: string): CamProfile | undefined {
  return camCatalog.find(c => c.id === id)
}
