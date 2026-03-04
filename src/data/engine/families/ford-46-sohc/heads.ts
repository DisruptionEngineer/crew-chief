import type { HeadCasting } from '@/lib/types'

// ============================================================
// Ford 4.6L SOHC (Modular) Cylinder Head Catalog
// Flow data at 28" H2O, unported stock castings
//
// The Ford Modular 4.6L is a completely different architecture
// from the Windsor — overhead cam, 2 valves per cylinder.
// Found in 1991-2011 Crown Victorias, Grand Marquis, Town Cars,
// and Mustang GTs.
//
// NOTE: In "stock" or "Old School" divisions, these engines
// typically run as-is with minimal modifications. The engine
// sim for SOHC is more about understanding what you have
// than building from scratch.
// ============================================================

export const ford46Heads: HeadCasting[] = [
  {
    id: 'pi-head',
    engineFamilyId: 'ford-46-sohc',
    name: 'PI Head (1999+)',
    nicknames: ['performance improved', 'PI'],
    chamberVolume: 42,
    intakeRunner: 125,
    intakeValve: 1.79,
    exhaustValve: 1.34,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 48, exhaustCfm: 36 },
      { lift: 0.200, intakeCfm: 95, exhaustCfm: 68 },
      { lift: 0.300, intakeCfm: 132, exhaustCfm: 95 },
      { lift: 0.400, intakeCfm: 155, exhaustCfm: 112 },
      { lift: 0.450, intakeCfm: 162, exhaustCfm: 117 },
    ],
    notes: 'Performance Improved head from 1999+ Crown Vic / Mustang GT. Better port design and cam timing than NPI. ~260 HP factory in Mustang tune. The standard for most Old School F8 Crown Vic builds.',
  },
  {
    id: 'npi-head',
    engineFamilyId: 'ford-46-sohc',
    name: 'NPI Head (1996-1998)',
    nicknames: ['non-PI', 'NPI'],
    chamberVolume: 44,
    intakeRunner: 118,
    intakeValve: 1.79,
    exhaustValve: 1.34,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 42, exhaustCfm: 32 },
      { lift: 0.200, intakeCfm: 82, exhaustCfm: 60 },
      { lift: 0.300, intakeCfm: 115, exhaustCfm: 83 },
      { lift: 0.400, intakeCfm: 135, exhaustCfm: 98 },
      { lift: 0.450, intakeCfm: 142, exhaustCfm: 103 },
    ],
    notes: 'Non-PI head from 1996-1998 4.6L. Smaller runners and weaker port design than PI heads. ~215 HP factory. If your car came with these, a PI head swap is one of the easiest upgrades.',
  },
  {
    id: 'explorer-head',
    engineFamilyId: 'ford-46-sohc',
    name: 'Explorer SOHC (2002-2005)',
    nicknames: ['explorer'],
    chamberVolume: 43,
    intakeRunner: 128,
    intakeValve: 1.79,
    exhaustValve: 1.34,
    isVortec: false,
    isBowtiePart: false,
    flowData: [
      { lift: 0.100, intakeCfm: 50, exhaustCfm: 38 },
      { lift: 0.200, intakeCfm: 98, exhaustCfm: 72 },
      { lift: 0.300, intakeCfm: 136, exhaustCfm: 98 },
      { lift: 0.400, intakeCfm: 160, exhaustCfm: 116 },
      { lift: 0.450, intakeCfm: 168, exhaustCfm: 122 },
    ],
    notes: 'Explorer 4.6L SOHC head with slightly improved runners over standard PI. Nearly identical flow but marginally better casting quality. Easy junkyard swap to PI-equipped cars.',
  },
]

export function getFord46HeadById(id: string): HeadCasting | undefined {
  return ford46Heads.find(h => h.id === id)
}
