import type { Rule, TechCheckItem } from '@/lib/types'

// ============================================================
// Compacts Rules — Painesville Speedway 2026
//
// 4-cylinder front-wheel-drive cars. Budget-friendly entry class
// for small cars. Civic, Cavalier, Neon, Cobalt, Focus, etc.
// Stock or very mild modifications. Figure 8 format.
// ============================================================

export const compactsRules: Rule[] = [
  // Weight
  { id: 'cp-w1', section: '1', number: 'CP-1.1', text: 'Minimum 2,300 lbs with driver.', category: 'weight' },
  { id: 'cp-w2', section: '1', number: 'CP-1.2', text: 'No weight percentage mandates.', category: 'weight' },

  // Engine
  { id: 'cp-e1', section: '2', number: 'CP-2.1', text: '4-cylinder engines only. Engine must match make of car (Honda to Honda, etc).', category: 'engine' },
  { id: 'cp-e2', section: '2', number: 'CP-2.2', text: 'Stock engine — no internal modifications. No porting, no cam swaps.', category: 'engine' },
  { id: 'cp-e3', section: '2', number: 'CP-2.3', text: 'Factory fuel injection or carburetor. ECM permitted.', category: 'engine' },
  { id: 'cp-e4', section: '2', number: 'CP-2.4', text: 'Stock exhaust manifold. No headers. Exhaust must exit behind driver.', category: 'engine' },
  { id: 'cp-e5', section: '2', number: 'CP-2.5', text: 'No turbo, supercharger, or nitrous. VTEC must remain stock.', category: 'engine' },
  { id: 'cp-e6', section: '2', number: 'CP-2.6', text: 'Stock air intake. No cold air intakes or ram air.', category: 'engine' },

  // Suspension
  { id: 'cp-s1', section: '3', number: 'CP-3.1', text: 'Stock suspension. No aftermarket springs, shocks, or struts.', category: 'suspension' },
  { id: 'cp-s2', section: '3', number: 'CP-3.2', text: 'Stock sway bars. Removal permitted.', category: 'suspension' },
  { id: 'cp-s3', section: '3', number: 'CP-3.3', text: 'No lowering or raising. Stock ride height ±1".', category: 'suspension' },

  // Tires & Wheels
  { id: 'cp-t1', section: '4', number: 'CP-4.1', text: 'DOT street tires only. No racing tires.', category: 'tires' },
  { id: 'cp-t2', section: '4', number: 'CP-4.2', text: 'Stock steel wheels or same-size steel replacement. No alloy.', category: 'tires' },
  { id: 'cp-t3', section: '4', number: 'CP-4.3', text: 'Lug nuts must be present and torqued. All 4 (or 5) per wheel.', category: 'tires' },

  // Drivetrain
  { id: 'cp-d1', section: '5', number: 'CP-5.1', text: 'Stock transmission — automatic or manual. No swaps.', category: 'drivetrain' },
  { id: 'cp-d2', section: '5', number: 'CP-5.2', text: 'FWD cars must remain FWD. No RWD conversions.', category: 'drivetrain' },

  // Safety
  { id: 'cp-sf1', section: '6', number: 'CP-6.1', text: 'Four-point roll cage required. 1.50" OD .083" wall minimum.', category: 'safety' },
  { id: 'cp-sf2', section: '6', number: 'CP-6.2', text: 'Minimum 3 door bars on driver side.', category: 'safety' },
  { id: 'cp-sf3', section: '6', number: 'CP-6.3', text: 'SFI fire suit, SA2020+ helmet, fire gloves, shoes.', category: 'safety' },
  { id: 'cp-sf4', section: '6', number: 'CP-6.4', text: '5-point belt with crotch belt. Window net. Kill switch.', category: 'safety' },
  { id: 'cp-sf5', section: '6', number: 'CP-6.5', text: 'Fire extinguisher 2.5 lb min. Battery secured in trunk or interior.', category: 'safety' },
  { id: 'cp-sf6', section: '6', number: 'CP-6.6', text: 'Tow hooks or straps front and rear.', category: 'safety' },
  { id: 'cp-sf7', section: '6', number: 'CP-6.7', text: 'All glass removed. Door panels removed.', category: 'safety' },
  { id: 'cp-sf8', section: '6', number: 'CP-6.8', text: 'Gas tank: OEM in stock location, or fuel cell. Skid plate if stock tank.', category: 'safety' },
  { id: 'cp-sf9', section: '6', number: 'CP-6.9', text: 'NO ANTIFREEZE.', category: 'safety' },

  // General
  { id: 'cp-g1', section: '7', number: 'CP-7.1', text: '4-cylinder cars only. Any make, any year, FWD or RWD.', category: 'general' },
  { id: 'cp-g2', section: '7', number: 'CP-7.2', text: 'No trucks, SUVs, or vans.', category: 'general' },
  { id: 'cp-g3', section: '7', number: 'CP-7.3', text: 'Driver must be 16+ with valid license or waiver.', category: 'general' },
]

export const compactsTechChecklist: TechCheckItem[] = [
  { id: 'cp-tc1', category: 'Weight', label: 'Minimum 2,300 lbs with driver', rule: 'CP-1.1', checked: false },
  { id: 'cp-tc2', category: 'Roll Cage', label: 'Four-point cage, 1.50" OD .083" wall', rule: 'CP-6.1', checked: false },
  { id: 'cp-tc3', category: 'Roll Cage', label: '3 door bars driver side', rule: 'CP-6.2', checked: false },
  { id: 'cp-tc4', category: 'Safety', label: 'Window net, kill switch, tow hooks', rule: 'CP-6.4', checked: false },
  { id: 'cp-tc5', category: 'Safety', label: 'Fire extinguisher, battery secured', rule: 'CP-6.5', checked: false },
  { id: 'cp-tc6', category: 'Safety', label: 'Helmet SA2020+, SFI suit, belts', rule: 'CP-6.3', checked: false },
  { id: 'cp-tc7', category: 'Engine', label: '4-cylinder, stock engine, matching make', rule: 'CP-2.1', checked: false },
  { id: 'cp-tc8', category: 'Engine', label: 'No turbo/SC/nitrous, stock intake', rule: 'CP-2.5', checked: false },
  { id: 'cp-tc9', category: 'Engine', label: 'Stock exhaust manifold, exits behind driver', rule: 'CP-2.4', checked: false },
  { id: 'cp-tc10', category: 'Suspension', label: 'Stock suspension, no modifications', rule: 'CP-3.1', checked: false },
  { id: 'cp-tc11', category: 'Tires', label: 'DOT street tires, stock steel wheels', rule: 'CP-4.1', checked: false },
  { id: 'cp-tc12', category: 'Body', label: 'All glass removed, door panels removed', rule: 'CP-6.7', checked: false },
  { id: 'cp-tc13', category: 'Fuel', label: 'Stock tank or fuel cell, skid plate if stock', rule: 'CP-6.8', checked: false },
  { id: 'cp-tc14', category: 'Fuel', label: 'NO ANTIFREEZE', rule: 'CP-6.9', checked: false },
]
