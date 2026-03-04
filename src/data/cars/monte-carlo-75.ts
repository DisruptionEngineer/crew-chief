import type { Car, SetupSheet } from '@/lib/types'

export const monteCarlo75: Car = {
  id: 'monte-carlo-75',
  name: '1975 Monte Carlo',
  year: 1975,
  make: 'Chevrolet',
  model: 'Monte Carlo',
  class: 'ironman-f8',
  eligibleDivisions: ['ironman-f8', 'street-stock'],
  engineFamilyId: 'gm-sbc-350',
  weight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  frontSuspension: 'sla-coil',
  rearSuspension: 'solid-axle-coil',
  engine: {
    displacement: 350,
    block: 'GM 350',
    heads: 'Cast iron straight plug',
    cam: 'Hydraulic, .450" max lift',
    carb: 'Holley 4412 500 CFM',
    compression: '10.5:1 max',
  },
  notes: 'GM A-body "Colonnade" platform (1973-1977). SLA double A-arm front suspension, triangulated four-link coil spring rear. Stock curb weight ~3,927 lbs. Shares front suspension with F-body and B/C-body GM platforms. Stock caster: +5 degrees.',
}

export const monteCarloBaseline: SetupSheet = {
  id: 'mc75-baseline',
  carId: 'monte-carlo-75',
  name: 'Figure 8 Baseline',
  date: '2026-03-01',
  // Springs - symmetric for Figure 8
  springLF: 900,
  springRF: 900,
  springLR: 200,
  springRR: 200,
  // Ride heights
  rideHeightLF: 5.5,
  rideHeightRF: 5.5,
  rideHeightLR: 6.0,
  rideHeightRR: 6.0,
  // Alignment - symmetric for Figure 8
  camberLF: -2.0,
  camberRF: -2.0,
  casterLF: 3.5,
  casterRF: 3.5,
  toeFront: -0.0625,  // 1/16" toe-out
  toeRear: 0,
  // Tire pressures - moderate track
  pressureLF: 14,
  pressureRF: 14,
  pressureLR: 13,
  pressureRR: 13,
  // Weight - targets for Figure 8 (more neutral than oval)
  totalWeight: 3300,
  crossWeightPct: 50.0,
  leftPct: 50.0,
  rearPct: 50.0,
  cornerWeightLF: 825,
  cornerWeightRF: 825,
  cornerWeightLR: 825,
  cornerWeightRR: 825,
  // Other
  swayBarFront: 'removed',
  shockLF: 'Economy non-adjustable',
  shockRF: 'Economy non-adjustable',
  shockLR: 'Economy non-adjustable',
  shockRR: 'Economy non-adjustable',
  gearRatio: '3.73:1',
  tireModel: 'Hoosier G60 (features) / TCT Recap (ovals)',
  notes: 'Starting baseline for Figure 8 racing at Painesville Speedway. Symmetric setup for equal left/right turn capability. Sway bar removed to reduce understeer. Equal spring rates side-to-side.',
}
