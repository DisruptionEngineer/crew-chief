import type { Rule, TechCheckItem } from '@/lib/types'

// ============================================================
// JuiceBox Rules — Painesville Speedway 2026
//
// Demolition derby / enduro hybrid class. Cheapest entry point.
// Full-size American cars, minimal prep, maximum fun.
// Spectator-favorite class — carnage and entertainment.
// Figure 8 format.
// ============================================================

export const juiceboxRules: Rule[] = [
  // Weight
  { id: 'jb-w1', section: '1', number: 'JB-1.1', text: 'Minimum 3,000 lbs with driver.', category: 'weight' },
  { id: 'jb-w2', section: '1', number: 'JB-1.2', text: 'No weight percentage mandates.', category: 'weight' },

  // Engine
  { id: 'jb-e1', section: '2', number: 'JB-2.1', text: 'Stock engine for car. No engine swaps. As-delivered from factory.', category: 'engine' },
  { id: 'jb-e2', section: '2', number: 'JB-2.2', text: 'No internal engine modifications whatsoever.', category: 'engine' },
  { id: 'jb-e3', section: '2', number: 'JB-2.3', text: 'Stock exhaust. No headers.', category: 'engine' },
  { id: 'jb-e4', section: '2', number: 'JB-2.4', text: 'Factory fuel injection or carburetor. Must run as delivered.', category: 'engine' },
  { id: 'jb-e5', section: '2', number: 'JB-2.5', text: 'Stock air cleaner and air intake.', category: 'engine' },

  // Suspension
  { id: 'jb-s1', section: '3', number: 'JB-3.1', text: 'Stock suspension only. No modifications.', category: 'suspension' },
  { id: 'jb-s2', section: '3', number: 'JB-3.2', text: 'No load bolts, no shims, no camber/caster adjustments.', category: 'suspension' },
  { id: 'jb-s3', section: '3', number: 'JB-3.3', text: 'Stock sway bar or removed.', category: 'suspension' },

  // Tires & Wheels
  { id: 'jb-t1', section: '4', number: 'JB-4.1', text: 'DOT street tires only. No racing tires.', category: 'tires' },
  { id: 'jb-t2', section: '4', number: 'JB-4.2', text: 'Steel wheels only. OEM or equivalent size.', category: 'tires' },

  // Drivetrain
  { id: 'jb-d1', section: '5', number: 'JB-5.1', text: 'Stock transmission. No modifications.', category: 'drivetrain' },
  { id: 'jb-d2', section: '5', number: 'JB-5.2', text: 'Stock rear axle. No limited slip or spool unless factory.', category: 'drivetrain' },

  // Safety
  { id: 'jb-sf1', section: '6', number: 'JB-6.1', text: 'Roll cage required — minimum 4-point with door bars. 1.50" OD .083" minimum.', category: 'safety' },
  { id: 'jb-sf2', section: '6', number: 'JB-6.2', text: 'Minimum 3 door bars on driver side.', category: 'safety' },
  { id: 'jb-sf3', section: '6', number: 'JB-6.3', text: 'SFI fire suit, SA2020+ helmet, gloves, shoes.', category: 'safety' },
  { id: 'jb-sf4', section: '6', number: 'JB-6.4', text: '5-point belt. Window net. Kill switch marked ON/OFF.', category: 'safety' },
  { id: 'jb-sf5', section: '6', number: 'JB-6.5', text: 'Fire extinguisher 2.5 lb min. Tow hooks front/rear.', category: 'safety' },
  { id: 'jb-sf6', section: '6', number: 'JB-6.6', text: 'Battery relocated to interior, covered marine box.', category: 'safety' },
  { id: 'jb-sf7', section: '6', number: 'JB-6.7', text: 'Gas tank: must be properly secured. Fuel cell recommended but not required.', category: 'safety' },
  { id: 'jb-sf8', section: '6', number: 'JB-6.8', text: 'All glass removed. Dashboard stripped. Interior gutted.', category: 'safety' },
  { id: 'jb-sf9', section: '6', number: 'JB-6.9', text: 'NO ANTIFREEZE.', category: 'safety' },
  { id: 'jb-sf10', section: '6', number: 'JB-6.10', text: 'Doors welded shut or chained closed.', category: 'safety' },

  // General
  { id: 'jb-g1', section: '7', number: 'JB-7.1', text: 'Full-size American cars 1969-present. RWD only.', category: 'general' },
  { id: 'jb-g2', section: '7', number: 'JB-7.2', text: 'Contact racing IS expected. Door-to-door, bumper-to-bumper OK.', category: 'general' },
  { id: 'jb-g3', section: '7', number: 'JB-7.3', text: 'Driver-door hits are NOT allowed and will result in disqualification.', category: 'general' },
  { id: 'jb-g4', section: '7', number: 'JB-7.4', text: 'Car must be able to move under own power at all times during event.', category: 'general' },
]

export const juiceboxTechChecklist: TechCheckItem[] = [
  { id: 'jb-tc1', category: 'Weight', label: 'Minimum 3,000 lbs with driver', rule: 'JB-1.1', checked: false },
  { id: 'jb-tc2', category: 'Roll Cage', label: 'Roll cage 4-point, door bars', rule: 'JB-6.1', checked: false },
  { id: 'jb-tc3', category: 'Roll Cage', label: '3 door bars driver side', rule: 'JB-6.2', checked: false },
  { id: 'jb-tc4', category: 'Safety', label: 'Window net, kill switch, tow hooks', rule: 'JB-6.4', checked: false },
  { id: 'jb-tc5', category: 'Safety', label: 'Fire extinguisher in reach', rule: 'JB-6.5', checked: false },
  { id: 'jb-tc6', category: 'Safety', label: 'Helmet SA2020+, SFI suit, belts', rule: 'JB-6.3', checked: false },
  { id: 'jb-tc7', category: 'Safety', label: 'Battery in interior, marine box', rule: 'JB-6.6', checked: false },
  { id: 'jb-tc8', category: 'Safety', label: 'All glass removed, interior gutted', rule: 'JB-6.8', checked: false },
  { id: 'jb-tc9', category: 'Safety', label: 'Doors welded or chained', rule: 'JB-6.10', checked: false },
  { id: 'jb-tc10', category: 'Engine', label: 'Stock engine, no modifications', rule: 'JB-2.1', checked: false },
  { id: 'jb-tc11', category: 'Suspension', label: 'Stock suspension, no mods', rule: 'JB-3.1', checked: false },
  { id: 'jb-tc12', category: 'Tires', label: 'DOT tires, steel wheels', rule: 'JB-4.1', checked: false },
  { id: 'jb-tc13', category: 'Fuel', label: 'Fuel tank secured, NO ANTIFREEZE', rule: 'JB-6.7', checked: false },
]
