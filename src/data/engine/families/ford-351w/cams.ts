import type { CamProfile } from '@/lib/types'

// ============================================================
// Ford 351W Hydraulic Cam Catalog
// Sorted from mildest to most aggressive
// Legality is determined at runtime by DivisionEngineRules
// ============================================================

export const ford351wCams: CamProfile[] = [
  {
    id: 'ford-stock',
    engineFamilyId: 'ford-351w',
    name: 'Stock 351W',
    lift: 0.375,
    duration: 196,
    lsa: 114,
    notes: 'Factory cam for 1969-1996 351W. Smooth idle, wide power band peaking around 4,000 RPM. Stock Windsor torque monster — not much top-end but pulls hard from idle.',
  },
  {
    id: 'ford-rv',
    engineFamilyId: 'ford-351w',
    name: 'Tow / RV (.400")',
    lift: 0.400,
    duration: 206,
    lsa: 114,
    notes: 'Mild upgrade. Gentle lope at idle with improved mid-range torque. Power band 2,000–5,000 RPM. Great for heavier cars. Almost no driveability penalty.',
  },
  {
    id: 'ford-street',
    engineFamilyId: 'ford-351w',
    name: 'Street Performance (.430")',
    lift: 0.430,
    duration: 214,
    lsa: 112,
    notes: 'Noticeable lope. Good balance of street manners and track performance. Power band 2,500–5,500 RPM. Sweet spot for most 351W short track builds.',
  },
  {
    id: 'ford-track',
    engineFamilyId: 'ford-351w',
    name: 'Track Grind (.448")',
    lift: 0.448,
    duration: 218,
    lsa: 110,
    notes: 'Aggressive lope. Power band 3,000–5,800 RPM. Needs GT40 or equivalent heads to breathe. Good match with the better-flowing castings.',
  },
  {
    id: 'ford-max',
    engineFamilyId: 'ford-351w',
    name: 'Max Effort (.470")',
    lift: 0.470,
    duration: 226,
    lsa: 108,
    notes: 'Big cam for a Windsor. Rough idle, narrow power band up top. Only makes sense with the best heads and a loose division. Power peaks near 6,000 RPM.',
  },
]

export function getFord351wCamById(id: string): CamProfile | undefined {
  return ford351wCams.find(c => c.id === id)
}
