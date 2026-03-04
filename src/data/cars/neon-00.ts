import type { Car, SetupSheet } from '@/lib/types'

export const neon00: Car = {
  id: 'neon-00',
  name: '2000 Dodge Neon',
  year: 2000,
  make: 'Dodge',
  model: 'Neon',
  class: 'compacts',
  eligibleDivisions: ['compacts'],
  engineFamilyId: '',
  weight: 2500,
  wheelbase: 105.0,
  trackWidthFront: 57.6,
  trackWidthRear: 56.8,
  frontSuspension: 'macpherson-strut',
  rearSuspension: 'torsion-beam',
  engine: {
    displacement: 122,
    block: 'Chrysler 2.0L SOHC',
    heads: 'Aluminum SOHC',
    cam: 'Stock',
    carb: 'Fuel injection',
    compression: '9.8:1',
  },
  notes: 'PL platform. FWD, 2.0L makes ~132 HP. Surprisingly good handler. Light and nimble. The "Hi" Neon was a cult hit. Common in figure 8 compacts. MacPherson front, multilink rear.',
}

export const neon00Baseline: SetupSheet = {
  id: 'neon00-baseline',
  carId: 'neon-00',
  name: 'Compacts Baseline',
  date: '2026-03-01',
  springLF: 0, springRF: 0, springLR: 0, springRR: 0,
  rideHeightLF: 4.5, rideHeightRF: 4.5, rideHeightLR: 5.0, rideHeightRR: 5.0,
  camberLF: -0.5, camberRF: -0.5, casterLF: 3.0, casterRF: 3.0,
  toeFront: 0, toeRear: 0,
  pressureLF: 32, pressureRF: 32, pressureLR: 30, pressureRR: 30,
  totalWeight: 2500, crossWeightPct: 50.0, leftPct: 50.0, rearPct: 38.0,
  cornerWeightLF: 775, cornerWeightRF: 775, cornerWeightLR: 475, cornerWeightRR: 475,
  swayBarFront: 'stock', shockLF: 'Stock', shockRF: 'Stock', shockLR: 'Stock', shockRR: 'Stock',
  gearRatio: '3.94:1 final drive', tireModel: 'DOT street',
  notes: 'Light and nimble. Good natural balance. Focus on tire pressures and technique.',
}
