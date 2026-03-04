import type { HeadCasting } from '@/lib/types'

// ============================================================
// Ford 351 Windsor Cylinder Head Catalog
// Flow data at 28" H2O, unported stock castings
// Sources: Ford casting specs, published flow bench data
//
// Common in F-body and full-size Ford platforms for short track.
// 351W shares bellhousing pattern with 302 but has taller deck.
// ============================================================

export const ford351wHeads: HeadCasting[] = [
  {
    id: 'e7te',
    engineFamilyId: 'ford-351w',
    name: 'E7TE (Truck)',
    nicknames: ['E7', 'truck head'],
    chamberVolume: 60,
    intakeRunner: 132,
    intakeValve: 1.78,
    exhaustValve: 1.46,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 52, exhaustCfm: 40 },
      { lift: 0.200, intakeCfm: 92, exhaustCfm: 68 },
      { lift: 0.300, intakeCfm: 118, exhaustCfm: 86 },
      { lift: 0.400, intakeCfm: 135, exhaustCfm: 98 },
      { lift: 0.450, intakeCfm: 140, exhaustCfm: 101 },
    ],
    notes: 'The most common 351W head. Found on 1987-1996 trucks and vans. Small intake runner limits top-end but the 60cc chamber gives strong compression on flat-top pistons. Dirt cheap and everywhere.',
  },
  {
    id: 'd0oe-c',
    engineFamilyId: 'ford-351w',
    name: 'D0OE-C Open Chamber',
    nicknames: ['open chamber'],
    chamberVolume: 75,
    intakeRunner: 145,
    intakeValve: 2.04,
    exhaustValve: 1.66,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 58, exhaustCfm: 44 },
      { lift: 0.200, intakeCfm: 105, exhaustCfm: 78 },
      { lift: 0.300, intakeCfm: 140, exhaustCfm: 103 },
      { lift: 0.400, intakeCfm: 162, exhaustCfm: 118 },
      { lift: 0.450, intakeCfm: 170, exhaustCfm: 124 },
    ],
    notes: '1970-1974 351W open chamber head. Larger 2.04/1.66 valves flow well but 75cc chamber hurts compression. Good for budget builds where bigger valves matter more than CR. Common on Mustangs and Torinos.',
  },
  {
    id: 'd0oe-a',
    engineFamilyId: 'ford-351w',
    name: 'D0OE-A Closed Chamber',
    nicknames: ['closed chamber'],
    chamberVolume: 58,
    intakeRunner: 148,
    intakeValve: 2.04,
    exhaustValve: 1.66,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 60, exhaustCfm: 46 },
      { lift: 0.200, intakeCfm: 108, exhaustCfm: 80 },
      { lift: 0.300, intakeCfm: 145, exhaustCfm: 107 },
      { lift: 0.400, intakeCfm: 168, exhaustCfm: 122 },
      { lift: 0.450, intakeCfm: 176, exhaustCfm: 128 },
    ],
    notes: 'The sweet spot 351W head. Closed 58cc chamber boosts CR significantly. 2.04/1.66 valves. Found on 1969-1970 351W engines. Hard to find but worth it — best stock combo of flow and compression for the Windsor.',
  },
  {
    id: 'e3ae',
    engineFamilyId: 'ford-351w',
    name: 'E3AE Lightning Truck',
    nicknames: ['lightning head'],
    chamberVolume: 62,
    intakeRunner: 155,
    intakeValve: 1.94,
    exhaustValve: 1.54,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 56, exhaustCfm: 43 },
      { lift: 0.200, intakeCfm: 100, exhaustCfm: 75 },
      { lift: 0.300, intakeCfm: 135, exhaustCfm: 99 },
      { lift: 0.400, intakeCfm: 157, exhaustCfm: 115 },
      { lift: 0.450, intakeCfm: 164, exhaustCfm: 120 },
    ],
    notes: '1983-1985 F-150 heads. Improved port design over E7TE with better flow. 62cc chamber is a good middle ground. 1.94/1.54 valves. Decent junkyard upgrade over E7TE without spending money.',
  },
  {
    id: 'gt40',
    engineFamilyId: 'ford-351w',
    name: 'GT40 (Explorer)',
    nicknames: ['GT40', 'explorer head'],
    chamberVolume: 63,
    intakeRunner: 158,
    intakeValve: 1.94,
    exhaustValve: 1.54,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 62, exhaustCfm: 48 },
      { lift: 0.200, intakeCfm: 112, exhaustCfm: 84 },
      { lift: 0.300, intakeCfm: 150, exhaustCfm: 110 },
      { lift: 0.400, intakeCfm: 175, exhaustCfm: 128 },
      { lift: 0.450, intakeCfm: 183, exhaustCfm: 134 },
    ],
    notes: 'Ford\'s best factory small-block head for the Windsor. Found on 1996-2001 Explorer 5.0L GT40 engines. Excellent port design flows nearly as well as aftermarket heads. 63cc chamber. The "Ford Vortec" — best bang-for-buck Windsor head.',
  },
]

export function getFord351wHeadById(id: string): HeadCasting | undefined {
  return ford351wHeads.find(h => h.id === id)
}
