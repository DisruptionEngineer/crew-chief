import type { HeadCasting } from '@/lib/types'

// ============================================================
// Mopar 360 (5.9L LA-Series) Cylinder Head Catalog
// Flow data at 28" H2O, unported stock castings
// Sources: Mopar casting specs, published flow bench data
//
// The LA-series small block (273/318/340/360) uses the same
// basic casting family. 360 heads differ from 340 in runner
// size and valve diameter.
// ============================================================

export const mopar360Heads: HeadCasting[] = [
  {
    id: '302',
    engineFamilyId: 'mopar-360',
    name: '#302 Open Chamber',
    nicknames: ['smog head'],
    chamberVolume: 71,
    intakeRunner: 155,
    intakeValve: 1.88,
    exhaustValve: 1.60,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 55, exhaustCfm: 44 },
      { lift: 0.200, intakeCfm: 100, exhaustCfm: 76 },
      { lift: 0.300, intakeCfm: 132, exhaustCfm: 100 },
      { lift: 0.400, intakeCfm: 152, exhaustCfm: 114 },
      { lift: 0.450, intakeCfm: 158, exhaustCfm: 118 },
    ],
    notes: '1971-1979 360 casting. Open 71cc chamber hurts compression. 1.88/1.60 valves. Common junkyard find but not the best choice. Adequate for mild builds.',
  },
  {
    id: '346',
    engineFamilyId: 'mopar-360',
    name: '#346 Closed Chamber',
    nicknames: ['closed chamber'],
    chamberVolume: 58,
    intakeRunner: 160,
    intakeValve: 1.88,
    exhaustValve: 1.60,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 57, exhaustCfm: 46 },
      { lift: 0.200, intakeCfm: 103, exhaustCfm: 79 },
      { lift: 0.300, intakeCfm: 138, exhaustCfm: 104 },
      { lift: 0.400, intakeCfm: 160, exhaustCfm: 119 },
      { lift: 0.450, intakeCfm: 166, exhaustCfm: 123 },
    ],
    notes: '1970 360 closed-chamber casting. 58cc chamber gives much better CR than the open #302. Same 1.88/1.60 valves. Worth the search — the compression bump alone is worth 10+ HP.',
  },
  {
    id: '915',
    engineFamilyId: 'mopar-360',
    name: '#915 J-Head',
    nicknames: ['J head'],
    chamberVolume: 62,
    intakeRunner: 168,
    intakeValve: 2.02,
    exhaustValve: 1.60,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 62, exhaustCfm: 49 },
      { lift: 0.200, intakeCfm: 112, exhaustCfm: 85 },
      { lift: 0.300, intakeCfm: 150, exhaustCfm: 112 },
      { lift: 0.400, intakeCfm: 174, exhaustCfm: 130 },
      { lift: 0.450, intakeCfm: 182, exhaustCfm: 136 },
    ],
    notes: 'Later production 360 head with improved port design. 2.02/1.60 valves flow significantly better than 1.88 heads. 62cc chamber. The go-to head for a serious budget Mopar 360 build.',
  },
  {
    id: 'x-head',
    engineFamilyId: 'mopar-360',
    name: '#452 X-Head',
    nicknames: ['X head', '340 head'],
    chamberVolume: 57,
    intakeRunner: 175,
    intakeValve: 2.02,
    exhaustValve: 1.60,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 66, exhaustCfm: 52 },
      { lift: 0.200, intakeCfm: 118, exhaustCfm: 90 },
      { lift: 0.300, intakeCfm: 156, exhaustCfm: 117 },
      { lift: 0.400, intakeCfm: 182, exhaustCfm: 136 },
      { lift: 0.450, intakeCfm: 190, exhaustCfm: 142 },
    ],
    notes: 'The legendary 340/360 "X" head. Best factory LA-series head. 57cc chamber + 2.02/1.60 valves + 175cc runners = the Mopar equivalent of the Chevy #441 fuelie. Rare but the king of stock Mopar heads.',
  },
  {
    id: '360-magnum',
    engineFamilyId: 'mopar-360',
    name: '#671 Magnum',
    nicknames: ['magnum'],
    chamberVolume: 59,
    intakeRunner: 170,
    intakeValve: 1.92,
    exhaustValve: 1.62,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 64, exhaustCfm: 51 },
      { lift: 0.200, intakeCfm: 116, exhaustCfm: 88 },
      { lift: 0.300, intakeCfm: 155, exhaustCfm: 116 },
      { lift: 0.400, intakeCfm: 180, exhaustCfm: 134 },
      { lift: 0.450, intakeCfm: 188, exhaustCfm: 140 },
    ],
    notes: '1992-2003 Magnum casting. Modern port design with heart-shaped intake. Flows nearly as well as X-heads. 59cc chamber. Requires Magnum-specific intake manifold. The "Mopar Vortec" — excellent modern junkyard head.',
  },
]

export function getMopar360HeadById(id: string): HeadCasting | undefined {
  return mopar360Heads.find(h => h.id === id)
}
