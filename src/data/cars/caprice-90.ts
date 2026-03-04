import type { Car, SetupSheet } from '@/lib/types'

export const caprice90: Car = {
  id: 'caprice-90',
  name: '1990 Caprice',
  year: 1990,
  make: 'Chevrolet',
  model: 'Caprice',
  class: 'old-school-f8',
  eligibleDivisions: ['old-school-f8', 'juicebox'],
  engineFamilyId: 'gm-sbc-350',
  weight: 3500,
  wheelbase: 115.9,
  trackWidthFront: 61.7,
  trackWidthRear: 60.7,
  frontSuspension: 'sla-coil',
  rearSuspension: 'solid-axle-coil',
  engine: {
    displacement: 350,
    block: 'GM 350',
    heads: 'Cast iron',
    cam: 'Stock',
    carb: 'TBI fuel injection',
    compression: '9.3:1',
  },
  notes: 'GM B-body platform. Heavy but stable. Ex-police interceptors are common and cheap. TBI fuel injection. Long wheelbase makes it predictable in the figure 8. Frame is tough.',
}

export const caprice90Baseline: SetupSheet = {
  id: 'caprice90-baseline',
  carId: 'caprice-90',
  name: 'Old School F8 Baseline',
  date: '2026-03-01',
  springLF: 800, springRF: 800, springLR: 250, springRR: 250,
  rideHeightLF: 5.5, rideHeightRF: 5.5, rideHeightLR: 6.0, rideHeightRR: 6.0,
  camberLF: -1.5, camberRF: -1.5, casterLF: 3.0, casterRF: 3.0,
  toeFront: -0.0625, toeRear: 0,
  pressureLF: 15, pressureRF: 15, pressureLR: 14, pressureRR: 14,
  totalWeight: 3500, crossWeightPct: 50.0, leftPct: 50.0, rearPct: 50.0,
  cornerWeightLF: 875, cornerWeightRF: 875, cornerWeightLR: 875, cornerWeightRR: 875,
  swayBarFront: 'stock', shockLF: 'Stock', shockRF: 'Stock', shockLR: 'Stock', shockRR: 'Stock',
  gearRatio: '3.08:1', tireModel: 'DOT street / Hoosier G60',
  notes: 'Heavy car — stock springs are usually adequate. Focus on balance and tire pressures.',
}
