import type { CamProfile } from '@/lib/types'

// ============================================================
// Ford 4.6L SOHC Cam Catalog
// NOTE: The 4.6L SOHC uses chain-driven overhead cams, not
// pushrods. Cam swaps are much more involved than pushrod engines.
// Most stock/Old School divisions won't allow cam changes.
//
// Sorted from mildest to most aggressive.
// Legality is determined at runtime by DivisionEngineRules.
// ============================================================

export const ford46Cams: CamProfile[] = [
  {
    id: 'ford46-npi-stock',
    engineFamilyId: 'ford-46-sohc',
    name: 'NPI Stock (1996-1998)',
    lift: 0.408,
    duration: 192,
    lsa: 120,
    notes: 'Factory NPI cam. Wide LSA gives smooth idle. Power band 1,500–5,000 RPM. ~215 HP factory. The cam that came in pre-1999 Crown Vics and Mustang GTs.',
  },
  {
    id: 'ford46-pi-stock',
    engineFamilyId: 'ford-46-sohc',
    name: 'PI Stock (1999+)',
    lift: 0.472,
    duration: 204,
    lsa: 116,
    notes: 'Factory PI cam — significantly more aggressive than NPI. 1999+ Crown Vic P71 (Police Interceptor) comes with this cam. ~240 HP. Most Old School divisions run this stock.',
  },
  {
    id: 'ford46-mild',
    engineFamilyId: 'ford-46-sohc',
    name: 'Mild Performance (.500")',
    lift: 0.500,
    duration: 212,
    lsa: 114,
    notes: 'Modest upgrade for divisions that allow cam changes. Adds top-end without killing low-end torque. Power band 2,000–5,500 RPM. Requires PI or better heads.',
  },
  {
    id: 'ford46-hot',
    engineFamilyId: 'ford-46-sohc',
    name: 'Stage 2 (.520")',
    lift: 0.520,
    duration: 220,
    lsa: 112,
    notes: 'Aggressive OHC cam. Noticeable idle lope (unusual for a mod motor). Power band shifts to 3,000–6,000 RPM. Only for open divisions — most stock classes won\'t allow this.',
  },
]

export function getFord46CamById(id: string): CamProfile | undefined {
  return ford46Cams.find(c => c.id === id)
}
