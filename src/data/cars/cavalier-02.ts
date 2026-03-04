import type { Car, SetupSheet } from '@/lib/types'

export const cavalier02: Car = {
  id: 'cavalier-02',
  name: '2002 Cavalier',
  year: 2002,
  make: 'Chevrolet',
  model: 'Cavalier',
  class: 'compacts',
  eligibleDivisions: ['compacts'],
  engineFamilyId: '',
  weight: 2600,
  wheelbase: 104.1,
  trackWidthFront: 56.8,
  trackWidthRear: 56.2,
  frontSuspension: 'macpherson-strut',
  rearSuspension: 'torsion-beam',
  engine: {
    displacement: 134,
    block: 'GM Ecotec 2.2L',
    heads: 'Aluminum DOHC',
    cam: 'Stock',
    carb: 'Fuel injection',
    compression: '9.5:1',
  },
  notes: 'J-body platform. FWD, 2.2L Ecotec makes ~140 HP. Heavier than Civic but still competitive. Very common and cheap. MacPherson strut front, torsion beam rear.',
}

export const cavalier02Baseline: SetupSheet = {
  id: 'cavalier02-baseline',
  carId: 'cavalier-02',
  name: 'Compacts Baseline',
  date: '2026-03-01',
  springLF: 0, springRF: 0, springLR: 0, springRR: 0,
  rideHeightLF: 4.5, rideHeightRF: 4.5, rideHeightLR: 5.0, rideHeightRR: 5.0,
  camberLF: -0.5, camberRF: -0.5, casterLF: 3.0, casterRF: 3.0,
  toeFront: 0, toeRear: 0,
  pressureLF: 32, pressureRF: 32, pressureLR: 30, pressureRR: 30,
  totalWeight: 2600, crossWeightPct: 50.0, leftPct: 50.0, rearPct: 38.0,
  cornerWeightLF: 806, cornerWeightRF: 806, cornerWeightLR: 494, cornerWeightRR: 494,
  swayBarFront: 'stock', shockLF: 'Stock', shockRF: 'Stock', shockLR: 'Stock', shockRR: 'Stock',
  gearRatio: '3.94:1 final drive', tireModel: 'DOT street',
  notes: 'Stock everything. A bit heavier than the Civic but more torque from the Ecotec.',
}
