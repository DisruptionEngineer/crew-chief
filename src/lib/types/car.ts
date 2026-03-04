// ============================================================
// Car & Setup Sheet types
// ============================================================

import type { RaceClass, SuspensionType } from './common'

export interface EngineSpec {
  displacement: number   // cubic inches
  block: string          // e.g. "GM 350"
  heads: string
  cam: string
  carb: string
  compression: string
}

export interface Car {
  id: string
  name: string
  year: number
  make: string
  model: string
  /** @deprecated Use eligibleDivisions instead. Kept for DB backward compat. */
  class: RaceClass
  /** Divisions this car is eligible to compete in */
  eligibleDivisions: RaceClass[]
  /** Engine family ID for the engine simulator */
  engineFamilyId: string
  weight: number         // current weight in lbs
  wheelbase: number      // inches
  trackWidthFront: number
  trackWidthRear: number
  frontSuspension: SuspensionType
  rearSuspension: SuspensionType
  engine: EngineSpec
  notes: string
}

export interface SetupSheet {
  id: string
  carId: string
  name: string
  date: string
  // Springs (lbs/in)
  springLF: number
  springRF: number
  springLR: number
  springRR: number
  // Ride heights (inches)
  rideHeightLF: number
  rideHeightRF: number
  rideHeightLR: number
  rideHeightRR: number
  // Alignment
  camberLF: number       // degrees, negative = top in
  camberRF: number
  casterLF: number       // degrees
  casterRF: number
  toeFront: number       // inches total, negative = toe-out
  toeRear: number
  // Tire pressures (psi)
  pressureLF: number
  pressureRF: number
  pressureLR: number
  pressureRR: number
  // Weight
  totalWeight: number
  crossWeightPct: number
  leftPct: number
  rearPct: number
  cornerWeightLF: number
  cornerWeightRF: number
  cornerWeightLR: number
  cornerWeightRR: number
  // Other
  swayBarFront: string
  shockLF: string
  shockRF: string
  shockLR: string
  shockRR: string
  gearRatio: string
  tireModel: string
  notes: string
}
