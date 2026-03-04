// ============================================================
// Calculator Tool types
// ============================================================

import type { RaceClass } from './common'

// --- Corner Weight Calculator ---

export interface CornerWeightInput {
  weightLF: number    // lbs
  weightRF: number
  weightLR: number
  weightRR: number
  targetCrossWeight?: number   // target cross-weight %
  targetLeftPct?: number       // target left %
  targetRearPct?: number       // target rear %
  lbsPerTurn?: number          // lbs per load-bolt turn (default ~12)
}

export interface LoadBoltAdjustment {
  corner: 'LF' | 'RF' | 'LR' | 'RR'
  turns: number
  direction: 'in' | 'out'
  weightChange: number         // lbs
  explanation: string
}

export interface CornerWeightResult {
  totalWeight: number
  crossWeight: number          // RF + LR
  crossWeightPct: number
  leftWeight: number
  leftPct: number
  rearWeight: number
  rearPct: number
  diagonalBias: number         // cross% - 50 (positive = diagonal heavy)
  loadBoltAdjustments: LoadBoltAdjustment[]
}

// --- Rim Offset Calculator ---

export interface RimOffsetInput {
  rimWidth: number             // inches
  backspacing: number          // inches
  tireWidth: number            // section width (e.g., 225)
  stockBackspacing: number     // stock backspacing inches
  stockRimWidth?: number       // stock rim width inches
  kingpinOffset?: number       // stock kingpin offset inches (default 1.5")
}

export interface RimOffsetResult {
  offsetInches: number
  offsetMm: number
  stockOffsetMm: number
  centerlineShift: number      // how far tire moved in/out from stock
  scrubRadiusChange: number
  estimatedScrubRadius: number
  trackWidthChange: number     // both sides combined
  warnings: string[]
}

// --- Transmission Advisor ---

export type TransmissionType =
  | 'TH350' | 'TH400' | 'Powerglide'
  | 'C4' | 'C6' | '4R70W'
  | 'A727 Torqueflite'
  | 'Muncie M21'
  | 'stock-auto'

export interface TransmissionInput {
  engineMake: 'GM' | 'Ford' | 'Mopar'
  engineTorque: number         // peak ft-lbs
  rearGearRatio: number
  divisionId?: RaceClass
  preferAutomatic?: boolean
}

export interface TransmissionScore {
  name: string
  type: 'automatic' | 'manual'
  score: number
  gears: number
  weight: number
  typicalCost: number
  firstGearRatio: number
  topGearRatio: number
  pros: string[]
  cons: string[]
  notes: string
}

export interface TransmissionResult {
  recommended: string
  options: TransmissionScore[]
}

// --- Gear Ratio Calculator ---

export interface GearRatioInput {
  rearGearRatio: number
  tireDiameter: number         // inches (e.g., 26.5)
  transmissionRatios: Record<string, number>  // { "1st": 2.52, "2nd": 1.52, "3rd": 1.00 }
  peakTorqueRpm?: number
  peakHpRpm?: number
  trackTopSpeed?: number       // mph
}

export interface RpmAtSpeedPoint {
  mph: number
  gearRpms: Record<string, number>   // RPM in each gear at this speed
}

export interface GearRatioResult {
  rpmAtSpeed: RpmAtSpeedPoint[]
  speedAtPeakTorque?: number
  speedAtPeakHp?: number
  effectiveRatio: number       // rear × top gear
  recommendations: string[]
}
