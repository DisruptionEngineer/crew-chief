import type { TrackCondition, TrackSurface } from './common'

// ============================================================
// Vehicle Dynamics Physics Engine types
// ============================================================

// --- Inputs ---

export interface TrackGeometry {
  cornerRadius: number        // feet
  banking: number             // degrees
  straightLength: number      // feet
  surface: TrackSurface
}

export interface VehicleParams {
  totalWeight: number         // lbs with driver
  wheelbase: number           // inches
  trackWidthFront: number     // inches
  trackWidthRear: number      // inches
  cgHeight: number            // inches — center of gravity height
  frontWeightPct: number      // 0-1
  leftWeightPct: number       // 0-1
  frontSpringRate: number     // lbs/in
  rearSpringRate: number      // lbs/in
  frontRollCenterHeight: number  // inches
  rearRollCenterHeight: number   // inches
  peakTorque?: number         // ft-lbs at wheels
  peakTorqueRpm?: number
}

export interface TireModelParams {
  compound: string
  baseMu: number              // base friction coefficient for this compound/surface
  loadSensitivity: number     // grip dropoff per lb of additional load
  pressureLF: number          // psi
  pressureRF: number
  pressureLR: number
  pressureRR: number
  optimalPressureFront: number // psi — center of pressure window
  optimalPressureRear: number
  diameter: number            // inches
}

// --- Tire Model outputs ---

export interface TireGripResult {
  mu: number                  // effective friction coefficient
  pressureModifier: number    // 0-1 multiplier from pressure
  surfaceModifier: number     // multiplier from surface/condition
  effectiveMu: number         // final combined grip
}

// --- Load Transfer outputs ---

export interface DynamicCornerWeights {
  lf: number
  rf: number
  lr: number
  rr: number
  totalLateralTransfer: number
  totalLongitudinalTransfer: number
  insideFrontLoad: number
}

export interface StaticCornerWeights {
  lf: number
  rf: number
  lr: number
  rr: number
}

// --- Roll Couple outputs ---

export interface RollCoupleResult {
  frontRollStiffness: number       // lb-in/deg
  rearRollStiffness: number        // lb-in/deg
  rollDistributionFront: number    // 0-1
  rollAngleDeg: number
}

export interface TargetSpringRates {
  frontSpringRate: number     // lbs/in
  rearSpringRate: number      // lbs/in
  rollDistributionFront: number
  rollAngleDeg: number
}

// --- Cornering Balance outputs ---

export interface CorneringResult {
  maxSpeedMph: number
  limitingAxle: 'front' | 'rear'
  lateralG: number
  gripMarginFront: number
  gripMarginRear: number
  understeerGradient: number
}

export interface BalancePoint {
  speedMph: number
  gradient: number
}

// --- Traction Limit outputs ---

export interface TractionResult {
  rearAxleLoad: number
  availableGrip: number       // lbs of force
  driveForce: number          // lbs of force from engine
  lateralForceRequired: number
  combinedDemand: number      // sqrt(drive^2 + lateral^2)
  tractionMargin: number      // available - combined
  tractionLimited: boolean
  maxUsableTorque: number     // ft-lbs before wheelspin
}

// --- Physics Insights ---

export interface PhysicsInsight {
  category: 'springs' | 'alignment' | 'weight' | 'tires' | 'gearing'
  finding: string
  suggestion: string
  severity: 'info' | 'warning' | 'critical'
}

// --- Orchestrator output ---

export interface VehicleDynamicsResult {
  staticWeights: StaticCornerWeights
  dynamicWeights: DynamicCornerWeights
  gripPerTire: { lf: number; rf: number; lr: number; rr: number }
  totalFrontGrip: number
  totalRearGrip: number
  rollDistributionFront: number
  rollAngleDeg: number
  maxCornerSpeedMph: number
  lateralG: number
  limitingAxle: 'front' | 'rear'
  understeerGradient: number
  balanceCurve: BalancePoint[]
  traction?: TractionResult
  physicsInsights: PhysicsInsight[]
}
