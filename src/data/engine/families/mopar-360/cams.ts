import type { CamProfile } from '@/lib/types'

// ============================================================
// Mopar 360 Hydraulic Cam Catalog
// Sorted from mildest to most aggressive
// Legality is determined at runtime by DivisionEngineRules
// ============================================================

export const mopar360Cams: CamProfile[] = [
  {
    id: 'mopar-stock',
    engineFamilyId: 'mopar-360',
    name: 'Stock 360',
    lift: 0.373,
    duration: 196,
    lsa: 114,
    notes: 'Factory cam. Smooth idle, broad torque. The 360 is a torque motor from the factory — this cam makes the most of that character. Power band 1,500–4,500 RPM.',
  },
  {
    id: 'mopar-mild',
    engineFamilyId: 'mopar-360',
    name: 'Mild Street (.410")',
    lift: 0.410,
    duration: 206,
    lsa: 112,
    notes: 'Modest upgrade with a slight lope. Broadens the torque curve without sacrificing low-end. Power band 2,000–5,200 RPM. Good first upgrade for a 360.',
  },
  {
    id: 'mopar-street',
    engineFamilyId: 'mopar-360',
    name: 'Street/Strip (.430")',
    lift: 0.430,
    duration: 214,
    lsa: 110,
    notes: 'Solid lope at idle. Mid-range torque machine with decent top-end pull. Power band 2,500–5,500 RPM. Best all-around choice for short track 360.',
  },
  {
    id: 'mopar-track',
    engineFamilyId: 'mopar-360',
    name: 'Track Grind (.446")',
    lift: 0.446,
    duration: 220,
    lsa: 108,
    notes: 'Aggressive lope. Needs good heads (X or Magnum) to breathe. Power band 3,000–5,800 RPM. The 360 responds very well to cam — this is where it starts to wake up.',
  },
  {
    id: 'mopar-hot',
    engineFamilyId: 'mopar-360',
    name: 'Hot Street (.468")',
    lift: 0.468,
    duration: 228,
    lsa: 106,
    notes: 'Big cam for the LA 360. Rough idle, narrow power band. Only worthwhile with X-heads or Magnums and good intake. Exceeds most division lift limits.',
  },
]

export function getMopar360CamById(id: string): CamProfile | undefined {
  return mopar360Cams.find(c => c.id === id)
}
