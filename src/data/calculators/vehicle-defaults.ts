import type { Car, SuspensionType } from '@/lib/types'
import type { VehicleParams } from '@/lib/types/vehicle-dynamics'

// ============================================================
// Vehicle Defaults
//
// Estimates physics parameters from car registry data.
// CG height, roll center heights, and weight distribution
// are derived from suspension type and body style.
//
// Users can override any value with measured data.
// ============================================================

const frontRollCenterByType: Record<SuspensionType, number> = {
  'sla-coil': 4,
  'macpherson-strut': 2,
  'solid-axle-coil': 5,
  'solid-axle-leaf': 5,
  'watts-link': 3,
  'torsion-beam': 2,
}

const rearRollCenterByType: Record<SuspensionType, number> = {
  'sla-coil': 6,
  'macpherson-strut': 6,
  'solid-axle-coil': 8,
  'solid-axle-leaf': 10,
  'watts-link': 6,
  'torsion-beam': 8,
}

// CG height estimated from body style via weight and wheelbase heuristic
// Heavier, taller cars have higher CG
function estimateCgHeight(car: Car): number {
  // Compacts and purpose-built cars: lower CG
  if (car.weight < 2800) return 16
  if (car.frontSuspension === 'macpherson-strut' && car.weight < 3200) return 18
  // Full-size sedans and trucks: higher CG
  if (car.weight > 3500) return 22
  // Mid-size sedans (A/G-body, Fox, etc.): typical
  return 20
}

// Default front weight % by suspension layout
function estimateFrontWeightPct(car: Car): number {
  // Front-engine, RWD stock cars typically 52-55% front
  if (car.frontSuspension === 'macpherson-strut' && car.rearSuspension === 'torsion-beam') {
    return 0.60 // FWD compacts are front-heavy
  }
  return 0.53 // typical RWD V8 stock car
}

export function buildVehicleParams(
  car: Car,
  overrides?: Partial<VehicleParams>,
): VehicleParams {
  const defaults: VehicleParams = {
    totalWeight: car.weight,
    wheelbase: car.wheelbase,
    trackWidthFront: car.trackWidthFront,
    trackWidthRear: car.trackWidthRear,
    cgHeight: estimateCgHeight(car),
    frontWeightPct: estimateFrontWeightPct(car),
    leftWeightPct: 0.50, // assume balanced unless overridden
    frontSpringRate: 900, // placeholder — will be set by setup or recommendation
    rearSpringRate: 200,
    frontRollCenterHeight: frontRollCenterByType[car.frontSuspension] ?? 4,
    rearRollCenterHeight: rearRollCenterByType[car.rearSuspension] ?? 8,
  }

  return { ...defaults, ...overrides }
}
