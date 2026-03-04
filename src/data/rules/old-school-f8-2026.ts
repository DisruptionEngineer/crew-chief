import type { Rule, TechCheckItem } from '@/lib/types'

// ============================================================
// Old School Figure 8 Rules — Painesville Speedway 2026
//
// Stock-bodied, "run what you brung" figure 8 class.
// Factory fuel injection allowed (Crown Vics, etc).
// Lower entry barrier than Ironman — good beginner class.
// ============================================================

export const oldSchoolF8Rules: Rule[] = [
  // Weight
  { id: 'os-w1', section: '1', number: 'OS-1.1', text: 'Minimum 3,200 lbs with driver.', category: 'weight' },
  { id: 'os-w2', section: '1', number: 'OS-1.2', text: 'No left side or rear weight percentage mandate.', category: 'weight' },
  { id: 'os-w3', section: '1', number: 'OS-1.3', text: 'All added weight painted white with car number, bolted securely.', category: 'weight' },

  // Engine
  { id: 'os-e1', section: '2', number: 'OS-2.1', text: 'Stock appearing engine for car chassis. No engine swaps.', category: 'engine' },
  { id: 'os-e2', section: '2', number: 'OS-2.2', text: 'Factory fuel injection permitted — car must retain original ECM.', category: 'engine' },
  { id: 'os-e3', section: '2', number: 'OS-2.3', text: 'Carbureted cars: stock 2-barrel or 4-barrel for car, unmodified.', category: 'engine' },
  { id: 'os-e4', section: '2', number: 'OS-2.4', text: 'No porting, polishing, or head modifications.', category: 'engine' },
  { id: 'os-e5', section: '2', number: 'OS-2.5', text: 'Stock cam only — no aftermarket camshafts.', category: 'engine' },
  { id: 'os-e6', section: '2', number: 'OS-2.6', text: 'Stock exhaust manifolds or factory replacement headers (1.625" max).', category: 'engine' },
  { id: 'os-e7', section: '2', number: 'OS-2.7', text: 'No nitrous oxide, turbo, or supercharger.', category: 'engine' },
  { id: 'os-e8', section: '2', number: 'OS-2.8', text: 'Air filter must be present and functional.', category: 'engine' },

  // Suspension
  { id: 'os-s1', section: '3', number: 'OS-3.1', text: 'Stock suspension only — no racing springs, no aftermarket control arms.', category: 'suspension' },
  { id: 'os-s2', section: '3', number: 'OS-3.2', text: 'Stock sway bars only. Removal permitted.', category: 'suspension' },
  { id: 'os-s3', section: '3', number: 'OS-3.3', text: 'Stock shocks or direct replacement. No adjustable shocks.', category: 'suspension' },
  { id: 'os-s4', section: '3', number: 'OS-3.4', text: 'Frame height minimum 4" with driver.', category: 'suspension' },
  { id: 'os-s5', section: '3', number: 'OS-3.5', text: 'No load bolts.', category: 'suspension' },

  // Tires & Wheels
  { id: 'os-t1', section: '4', number: 'OS-4.1', text: 'DOT street tires or Hoosier G60 allowed. No slicks.', category: 'tires' },
  { id: 'os-t2', section: '4', number: 'OS-4.2', text: '15" steel wheels, max 8" width.', category: 'tires' },
  { id: 'os-t3', section: '4', number: 'OS-4.3', text: 'Minimum tire durometer 55.', category: 'tires' },

  // Drivetrain
  { id: 'os-d1', section: '5', number: 'OS-5.1', text: 'Stock transmission only. Automatic or manual.', category: 'drivetrain' },
  { id: 'os-d2', section: '5', number: 'OS-5.2', text: 'Stock rear axle assembly. Limited slip permitted.', category: 'drivetrain' },
  { id: 'os-d3', section: '5', number: 'OS-5.3', text: 'Steel driveshaft painted white with safety loop.', category: 'drivetrain' },

  // Safety
  { id: 'os-sf1', section: '6', number: 'OS-6.1', text: 'Four point roll cage required. 1.75" OD .095" wall main, 1.50" OD .083" wall secondary.', category: 'safety' },
  { id: 'os-sf2', section: '6', number: 'OS-6.2', text: 'Minimum 4 door bars on driver side, plated .125" steel.', category: 'safety' },
  { id: 'os-sf3', section: '6', number: 'OS-6.3', text: 'SFI fire suit (dated after Jan 1, 2020), gloves, shoes.', category: 'safety' },
  { id: 'os-sf4', section: '6', number: 'OS-6.4', text: 'SA2020 or newer Snell-rated helmet required.', category: 'safety' },
  { id: 'os-sf5', section: '6', number: 'OS-6.5', text: '5-point belt with crotch belt. 2" minimum width.', category: 'safety' },
  { id: 'os-sf6', section: '6', number: 'OS-6.6', text: 'Driver side window net. Kill switch in reach. Tow hooks front/rear.', category: 'safety' },
  { id: 'os-sf7', section: '6', number: 'OS-6.7', text: 'Fire extinguisher 2.5 lb min in reach. Battery disconnect from outside.', category: 'safety' },
  { id: 'os-sf8', section: '6', number: 'OS-6.8', text: 'Fuel cell 22 gal max with foam. 11" from ground, protection bar.', category: 'safety' },
  { id: 'os-sf9', section: '6', number: 'OS-6.9', text: 'NO ANTIFREEZE in cooling system.', category: 'safety' },

  // General
  { id: 'os-g1', section: '7', number: 'OS-7.1', text: 'Any American car 1969-present. RWD only.', category: 'general' },
  { id: 'os-g2', section: '7', number: 'OS-7.2', text: 'ECM/fuel injection vehicles ARE permitted in Old School.', category: 'general' },
  { id: 'os-g3', section: '7', number: 'OS-7.3', text: 'Transponder on left rear axle tube. One-way scanner, 469.5000.', category: 'general' },
]

export const oldSchoolTechChecklist: TechCheckItem[] = [
  { id: 'os-tc1', category: 'Frame & Body', label: 'Frame height minimum 4" with driver', rule: 'OS-3.4', checked: false },
  { id: 'os-tc2', category: 'Frame & Body', label: 'Hood and deck pins secure', rule: 'OS-7.1', checked: false },
  { id: 'os-tc3', category: 'Weight', label: 'Minimum 3,200 lbs with driver', rule: 'OS-1.1', checked: false },
  { id: 'os-tc4', category: 'Weight', label: 'Added weight painted white with car #', rule: 'OS-1.3', checked: false },
  { id: 'os-tc5', category: 'Roll Cage', label: 'Four-point cage installed', rule: 'OS-6.1', checked: false },
  { id: 'os-tc6', category: 'Roll Cage', label: '4 door bars on driver side, steel plates', rule: 'OS-6.2', checked: false },
  { id: 'os-tc7', category: 'Safety', label: 'Window net on driver side', rule: 'OS-6.6', checked: false },
  { id: 'os-tc8', category: 'Safety', label: 'Fire extinguisher in reach', rule: 'OS-6.7', checked: false },
  { id: 'os-tc9', category: 'Safety', label: 'Kill switch in reach, marked ON/OFF', rule: 'OS-6.6', checked: false },
  { id: 'os-tc10', category: 'Safety', label: 'Tow hooks front and rear', rule: 'OS-6.6', checked: false },
  { id: 'os-tc11', category: 'Safety', label: 'Battery disconnect from outside', rule: 'OS-6.7', checked: false },
  { id: 'os-tc12', category: 'Safety', label: 'Helmet SA2020+, fire suit, gloves, shoes', rule: 'OS-6.3', checked: false },
  { id: 'os-tc13', category: 'Safety', label: '5-point belts with crotch belt', rule: 'OS-6.5', checked: false },
  { id: 'os-tc14', category: 'Engine', label: 'Stock engine for chassis (no swaps)', rule: 'OS-2.1', checked: false },
  { id: 'os-tc15', category: 'Engine', label: 'Stock cam — no aftermarket cams', rule: 'OS-2.5', checked: false },
  { id: 'os-tc16', category: 'Engine', label: 'Air filter present', rule: 'OS-2.8', checked: false },
  { id: 'os-tc17', category: 'Fuel', label: 'Fuel cell with foam, protection bar', rule: 'OS-6.8', checked: false },
  { id: 'os-tc18', category: 'Fuel', label: 'NO ANTIFREEZE', rule: 'OS-6.9', checked: false },
  { id: 'os-tc19', category: 'Suspension', label: 'Stock suspension, no racing springs', rule: 'OS-3.1', checked: false },
  { id: 'os-tc20', category: 'Suspension', label: 'Stock shocks, no adjustable', rule: 'OS-3.3', checked: false },
  { id: 'os-tc21', category: 'Tires', label: 'DOT tires or Hoosier G60, durometer 55+', rule: 'OS-4.1', checked: false },
  { id: 'os-tc22', category: 'Drivetrain', label: 'Steel driveshaft painted white, safety loop', rule: 'OS-5.3', checked: false },
  { id: 'os-tc23', category: 'Transponder', label: 'Transponder on left rear axle tube', rule: 'OS-7.3', checked: false },
]
