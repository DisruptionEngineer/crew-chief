import type { Car, SetupSheet } from '@/lib/types'

export const civic98: Car = {
  id: 'civic-98',
  name: '1998 Honda Civic',
  year: 1998,
  make: 'Honda',
  model: 'Civic',
  class: 'compacts',
  eligibleDivisions: ['compacts'],
  engineFamilyId: '',  // Compacts don't use standard engine families
  weight: 2400,
  wheelbase: 103.2,
  trackWidthFront: 58.1,
  trackWidthRear: 57.5,
  frontSuspension: 'macpherson-strut',
  rearSuspension: 'torsion-beam',
  engine: {
    displacement: 106,
    block: 'Honda D16Y8',
    heads: 'Aluminum SOHC VTEC',
    cam: 'Stock',
    carb: 'Fuel injection',
    compression: '9.6:1',
  },
  notes: '6th gen Civic (1996-2000). FWD, lightweight, reliable. D16 SOHC VTEC makes ~127 HP stock. Popular compact class car — they last forever and parts are cheap. MacPherson strut front, torsion beam rear.',
}

export const civic98Baseline: SetupSheet = {
  id: 'civic98-baseline',
  carId: 'civic-98',
  name: 'Compacts Baseline',
  date: '2026-03-01',
  springLF: 0, springRF: 0, springLR: 0, springRR: 0,  // stock springs - rate unknown
  rideHeightLF: 4.5, rideHeightRF: 4.5, rideHeightLR: 5.0, rideHeightRR: 5.0,
  camberLF: -0.5, camberRF: -0.5, casterLF: 3.0, casterRF: 3.0,
  toeFront: 0, toeRear: 0,
  pressureLF: 32, pressureRF: 32, pressureLR: 30, pressureRR: 30,
  totalWeight: 2400, crossWeightPct: 50.0, leftPct: 50.0, rearPct: 38.0,
  cornerWeightLF: 720, cornerWeightRF: 720, cornerWeightLR: 480, cornerWeightRR: 480,
  swayBarFront: 'stock', shockLF: 'Stock', shockRF: 'Stock', shockLR: 'Stock', shockRR: 'Stock',
  gearRatio: '4.06:1 final drive', tireModel: 'DOT street',
  notes: 'Stock everything. Focus on tire pressures and driving technique. FWD means front tires do all the work.',
}
