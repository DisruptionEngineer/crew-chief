import type { Car, SetupSheet } from '@/lib/types'

export const impala96: Car = {
  id: 'impala-96',
  name: '1996 Impala SS',
  year: 1996,
  make: 'Chevrolet',
  model: 'Impala SS',
  class: 'old-school-f8',
  eligibleDivisions: ['old-school-f8', 'juicebox'],
  engineFamilyId: 'gm-sbc-350',
  weight: 3550,
  wheelbase: 115.9,
  trackWidthFront: 62.0,
  trackWidthRear: 61.0,
  frontSuspension: 'sla-coil',
  rearSuspension: 'solid-axle-coil',
  engine: {
    displacement: 350,
    block: 'GM LT1 350',
    heads: 'Cast iron LT1',
    cam: 'Stock',
    carb: 'Sequential fuel injection',
    compression: '10.5:1',
  },
  notes: 'Final generation B-body Impala SS. LT1 engine with reverse-flow cooling. More power than TBI Caprice. Heavy but the LT1 has good stock HP. Popular in Old School F8.',
}

export const impala96Baseline: SetupSheet = {
  id: 'impala96-baseline',
  carId: 'impala-96',
  name: 'Old School F8 Baseline',
  date: '2026-03-01',
  springLF: 825, springRF: 825, springLR: 250, springRR: 250,
  rideHeightLF: 5.5, rideHeightRF: 5.5, rideHeightLR: 6.0, rideHeightRR: 6.0,
  camberLF: -1.5, camberRF: -1.5, casterLF: 3.0, casterRF: 3.0,
  toeFront: -0.0625, toeRear: 0,
  pressureLF: 15, pressureRF: 15, pressureLR: 14, pressureRR: 14,
  totalWeight: 3550, crossWeightPct: 50.0, leftPct: 50.0, rearPct: 50.0,
  cornerWeightLF: 888, cornerWeightRF: 888, cornerWeightLR: 888, cornerWeightRR: 888,
  swayBarFront: 'stock', shockLF: 'Stock', shockRF: 'Stock', shockLR: 'Stock', shockRR: 'Stock',
  gearRatio: '3.08:1', tireModel: 'DOT street / Hoosier G60',
  notes: 'LT1 power is a nice advantage in Old School. Keep it stock — any mods void the class.',
}
