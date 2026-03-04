import type { Rule, TechCheckItem } from '@/lib/types'

// ============================================================
// Street Stock Rules — Painesville Speedway 2026
//
// The "open but affordable" class. More modifications allowed
// than Ironman — aftermarket springs, adjustable shocks, load
// bolts, porting, higher cam lifts, etc. Still budget-capped
// by spec carburetor and weight rules. Oval racing only.
//
// This is the "David Vizard" class — where understanding
// airflow, compression, cam timing, and suspension geometry
// actually pays off with more knobs to turn.
// ============================================================

export const streetStockRules: Rule[] = [
  // Weight
  { id: 'ss-w1', section: '1', number: 'SS-1.1', text: 'Minimum 3,100 lbs with driver.', category: 'weight' },
  { id: 'ss-w2', section: '1', number: 'SS-1.2', text: '57% maximum left side weight.', category: 'weight' },
  { id: 'ss-w3', section: '1', number: 'SS-1.3', text: '52% maximum rear weight.', category: 'weight' },
  { id: 'ss-w4', section: '1', number: 'SS-1.4', text: 'All added weight painted white with car number, minimum 2x 1/2" bolts.', category: 'weight' },

  // Engine
  { id: 'ss-e1', section: '2', number: 'SS-2.1', text: 'GM 350 / Ford 351W / Mopar 360 maximum displacement. Cast iron block required.', category: 'engine' },
  { id: 'ss-e2', section: '2', number: 'SS-2.2', text: '.060" maximum overbore for cleanup. No stroker cranks.', category: 'engine' },
  { id: 'ss-e3', section: '2', number: 'SS-2.3', text: 'Cast iron heads only. Porting and bowl blending PERMITTED.', category: 'engine' },
  { id: 'ss-e4', section: '2', number: 'SS-2.4', text: 'Maximum valve size: 2.02" intake, 1.60" exhaust.', category: 'engine' },
  { id: 'ss-e5', section: '2', number: 'SS-2.5', text: 'Maximum cam lift .480" at valve, hydraulic flat-tappet.', category: 'engine' },
  { id: 'ss-e6', section: '2', number: 'SS-2.6', text: 'Maximum compression ratio 11.0:1.', category: 'engine' },
  { id: 'ss-e7', section: '2', number: 'SS-2.7', text: 'Holley 4412 500 CFM or track-approved 650 CFM. No modifications.', category: 'engine' },
  { id: 'ss-e8', section: '2', number: 'SS-2.8', text: 'Dual-plane intake manifold only. Edelbrock Performer series or equivalent.', category: 'engine' },
  { id: 'ss-e9', section: '2', number: 'SS-2.9', text: 'Maximum intake runner volume 195cc.', category: 'engine' },
  { id: 'ss-e10', section: '2', number: 'SS-2.10', text: 'Headers allowed: 1.750" primary diameter max, 3" collector max.', category: 'engine' },
  { id: 'ss-e11', section: '2', number: 'SS-2.11', text: 'HEI or approved aftermarket electronic ignition. One coil, no multi-spark.', category: 'engine' },
  { id: 'ss-e12', section: '2', number: 'SS-2.12', text: 'Vortec heads allowed. Bowtie Vortec NOT allowed.', category: 'engine' },

  // Suspension
  { id: 'ss-s1', section: '3', number: 'SS-3.1', text: 'Factory mounting points must be in stock location.', category: 'suspension' },
  { id: 'ss-s2', section: '3', number: 'SS-3.2', text: 'Aftermarket racing springs allowed, minimum 5" diameter, one per corner.', category: 'suspension' },
  { id: 'ss-s3', section: '3', number: 'SS-3.3', text: 'Load bolts permitted front and rear.', category: 'suspension' },
  { id: 'ss-s4', section: '3', number: 'SS-3.4', text: 'Aftermarket tubular upper AND lower control arms permitted.', category: 'suspension' },
  { id: 'ss-s5', section: '3', number: 'SS-3.5', text: 'Adjustable shocks permitted (non-remote reservoir). Max $200 each.', category: 'suspension' },
  { id: 'ss-s6', section: '3', number: 'SS-3.6', text: 'Sway bar: stock style, aftermarket allowed. No splined. One per axle.', category: 'suspension' },
  { id: 'ss-s7', section: '3', number: 'SS-3.7', text: 'Frame height minimum 5" with driver.', category: 'suspension' },
  { id: 'ss-s8', section: '3', number: 'SS-3.8', text: 'Aftermarket Panhard bar or track bar permitted for rear axle location.', category: 'suspension' },
  { id: 'ss-s9', section: '3', number: 'SS-3.9', text: 'Rear coil-over conversion permitted with stock-style mounting.', category: 'suspension' },

  // Tires & Wheels
  { id: 'ss-t1', section: '4', number: 'SS-4.1', text: 'Hoosier G60 or track-approved tire. No softening. Durometer 55 min.', category: 'tires' },
  { id: 'ss-t2', section: '4', number: 'SS-4.2', text: '15" steel racing wheels, max 10" width. 1" lugnuts.', category: 'tires' },
  { id: 'ss-t3', section: '4', number: 'SS-4.3', text: 'Maximum offset: +1" from rim center to hub face.', category: 'tires' },

  // Drivetrain
  { id: 'ss-d1', section: '5', number: 'SS-5.1', text: 'Automatic or manual transmission. Bert/Brinn NOT allowed.', category: 'drivetrain' },
  { id: 'ss-d2', section: '5', number: 'SS-5.2', text: 'Ford 9" rearend permitted. Quick-change NOT allowed.', category: 'drivetrain' },
  { id: 'ss-d3', section: '5', number: 'SS-5.3', text: 'Limited slip or spool permitted.', category: 'drivetrain' },
  { id: 'ss-d4', section: '5', number: 'SS-5.4', text: 'Steel driveshaft painted white. Safety loop mandatory.', category: 'drivetrain' },

  // Safety (same as Ironman baseline)
  { id: 'ss-sf1', section: '6', number: 'SS-6.1', text: 'Four point perimeter roll cage. 1.75" main, 1.50" secondary.', category: 'safety' },
  { id: 'ss-sf2', section: '6', number: 'SS-6.2', text: '4 door bars on driver side with .125" steel plates.', category: 'safety' },
  { id: 'ss-sf3', section: '6', number: 'SS-6.3', text: 'SFI fire suit (post-2020), gloves, shoes. SA2020+ helmet.', category: 'safety' },
  { id: 'ss-sf4', section: '6', number: 'SS-6.4', text: '5-point belt, crotch belt. Window net. Kill switch. Tow hooks.', category: 'safety' },
  { id: 'ss-sf5', section: '6', number: 'SS-6.5', text: 'Fire extinguisher 2.5 lb min. Battery disconnect from outside.', category: 'safety' },
  { id: 'ss-sf6', section: '6', number: 'SS-6.6', text: 'Fuel cell 22 gal max, foam, 11" from ground, protection bar.', category: 'safety' },
  { id: 'ss-sf7', section: '6', number: 'SS-6.7', text: 'NO ANTIFREEZE. Pump gas or racing fuel only.', category: 'safety' },

  // General
  { id: 'ss-g1', section: '7', number: 'SS-7.1', text: 'Any American car 1964-present. RWD only.', category: 'general' },
  { id: 'ss-g2', section: '7', number: 'SS-7.2', text: 'No ECM/fuel injection. Carbureted engines only.', category: 'general' },
  { id: 'ss-g3', section: '7', number: 'SS-7.3', text: 'Minimum 107" wheelbase.', category: 'general' },
]

export const streetStockTechChecklist: TechCheckItem[] = [
  { id: 'ss-tc1', category: 'Frame & Body', label: 'Frame height minimum 5" with driver', rule: 'SS-3.7', checked: false },
  { id: 'ss-tc2', category: 'Frame & Body', label: 'Minimum 107" wheelbase', rule: 'SS-7.3', checked: false },
  { id: 'ss-tc3', category: 'Weight', label: 'Minimum 3,100 lbs with driver', rule: 'SS-1.1', checked: false },
  { id: 'ss-tc4', category: 'Weight', label: '57% max left, 52% max rear', rule: 'SS-1.2', checked: false },
  { id: 'ss-tc5', category: 'Weight', label: 'Added weight painted white with car #', rule: 'SS-1.4', checked: false },
  { id: 'ss-tc6', category: 'Roll Cage', label: 'Four-point cage, correct tubing spec', rule: 'SS-6.1', checked: false },
  { id: 'ss-tc7', category: 'Roll Cage', label: '4 door bars with steel plates', rule: 'SS-6.2', checked: false },
  { id: 'ss-tc8', category: 'Safety', label: 'Window net, kill switch, tow hooks', rule: 'SS-6.4', checked: false },
  { id: 'ss-tc9', category: 'Safety', label: 'Fire extinguisher + battery disconnect', rule: 'SS-6.5', checked: false },
  { id: 'ss-tc10', category: 'Safety', label: 'Helmet SA2020+, SFI suit, belts', rule: 'SS-6.3', checked: false },
  { id: 'ss-tc11', category: 'Engine', label: 'Cast iron block, stock location', rule: 'SS-2.1', checked: false },
  { id: 'ss-tc12', category: 'Engine', label: 'Max .060 overbore, no strokers', rule: 'SS-2.2', checked: false },
  { id: 'ss-tc13', category: 'Engine', label: 'Cam lift .480" max (hydraulic)', rule: 'SS-2.5', checked: false },
  { id: 'ss-tc14', category: 'Engine', label: 'Compression 11.0:1 max', rule: 'SS-2.6', checked: false },
  { id: 'ss-tc15', category: 'Engine', label: 'Holley 4412 or approved 650, unmodified', rule: 'SS-2.7', checked: false },
  { id: 'ss-tc16', category: 'Engine', label: 'Dual-plane intake only', rule: 'SS-2.8', checked: false },
  { id: 'ss-tc17', category: 'Suspension', label: 'Factory mounting points in stock location', rule: 'SS-3.1', checked: false },
  { id: 'ss-tc18', category: 'Suspension', label: 'Shocks: max $200 each', rule: 'SS-3.5', checked: false },
  { id: 'ss-tc19', category: 'Tires', label: 'Hoosier G60 or approved, durometer 55+', rule: 'SS-4.1', checked: false },
  { id: 'ss-tc20', category: 'Tires', label: '15" wheels, 10" max width, 1" lugs', rule: 'SS-4.2', checked: false },
  { id: 'ss-tc21', category: 'Drivetrain', label: 'Steel driveshaft, white, safety loop', rule: 'SS-5.4', checked: false },
  { id: 'ss-tc22', category: 'Fuel', label: 'Fuel cell with foam, protection bar', rule: 'SS-6.6', checked: false },
  { id: 'ss-tc23', category: 'Fuel', label: 'NO ANTIFREEZE', rule: 'SS-6.7', checked: false },
]
