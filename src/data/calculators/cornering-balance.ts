import type {
  VehicleParams,
  TireModelParams,
  TrackGeometry,
  CorneringResult,
  BalancePoint,
} from '@/lib/types/vehicle-dynamics'
import type { TrackCondition } from '@/lib/types'
import { getEffectiveGrip } from './tire-model'
import { calcCornerWeightsAtSpeed } from './load-transfer'
import { calcRollDistribution } from './roll-couple'

// ============================================================
// Cornering Balance Calculator
//
// Ties tire model, load transfer, and roll distribution
// together to answer: will this car push or be loose?
//
// At any corner speed, each axle has grip available (from
// tire loads * friction). If front runs out first = push.
// If rear runs out first = loose.
// ============================================================

const G = 32.174 // ft/s^2

/**
 * Lateral g required to maintain a given speed around a corner.
 * Accounts for banking which reduces the required lateral grip.
 */
function requiredLateralG(speedMph: number, radiusFt: number, bankingDeg: number): number {
  const speedFps = speedMph * 5280 / 3600
  const bankingRad = bankingDeg * Math.PI / 180
  // ay = v^2 / (r * g) - tan(banking)
  const rawG = (speedFps * speedFps) / (radiusFt * G)
  const bankingAssist = Math.tan(bankingRad)
  return Math.max(rawG - bankingAssist, 0)
}

/**
 * Calculate grip available at front and rear axles for given dynamic weights.
 */
function calcAxleGrip(
  weights: { lf: number; rf: number; lr: number; rr: number },
  tires: TireModelParams,
  surface: TrackGeometry['surface'],
  condition: TrackCondition,
): { frontGrip: number; rearGrip: number } {
  const gripLF = getEffectiveGrip(
    weights.lf, tires.baseMu, tires.loadSensitivity,
    tires.pressureLF, tires.optimalPressureFront, surface, condition,
  ) * weights.lf

  const gripRF = getEffectiveGrip(
    weights.rf, tires.baseMu, tires.loadSensitivity,
    tires.pressureRF, tires.optimalPressureFront, surface, condition,
  ) * weights.rf

  const gripLR = getEffectiveGrip(
    weights.lr, tires.baseMu, tires.loadSensitivity,
    tires.pressureLR, tires.optimalPressureRear, surface, condition,
  ) * weights.lr

  const gripRR = getEffectiveGrip(
    weights.rr, tires.baseMu, tires.loadSensitivity,
    tires.pressureRR, tires.optimalPressureRear, surface, condition,
  ) * weights.rr

  return {
    frontGrip: gripLF + gripRF,
    rearGrip: gripLR + gripRR,
  }
}

/**
 * Handling balance at a specific speed.
 * Returns grip margins and understeer gradient.
 */
export function calcHandlingBalance(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  speedMph: number,
  condition: TrackCondition,
): CorneringResult {
  const lateralG = requiredLateralG(speedMph, track.cornerRadius, track.banking)
  const rollDist = calcRollDistribution(vehicle)
  const weights = calcCornerWeightsAtSpeed(vehicle, lateralG, 0, rollDist)
  const { frontGrip, rearGrip } = calcAxleGrip(weights, tires, track.surface, condition)

  // Required lateral force per axle (proportional to weight on that axle)
  const frontWeight = weights.lf + weights.rf
  const rearWeight = weights.lr + weights.rr
  const totalWeight = frontWeight + rearWeight
  const requiredForce = totalWeight * lateralG
  const requiredFront = requiredForce * (frontWeight / totalWeight)
  const requiredRear = requiredForce * (rearWeight / totalWeight)

  const gripMarginFront = frontGrip - requiredFront
  const gripMarginRear = rearGrip - requiredRear

  // Understeer gradient: positive = push, negative = loose
  // Normalized difference in grip margin as fraction of required force
  const understeerGradient = totalWeight > 0
    ? (gripMarginRear - gripMarginFront) / totalWeight
    : 0

  const limitingAxle: 'front' | 'rear' = gripMarginFront < gripMarginRear ? 'front' : 'rear'

  return {
    maxSpeedMph: speedMph,
    limitingAxle,
    lateralG,
    gripMarginFront,
    gripMarginRear,
    understeerGradient,
  }
}

/**
 * Find the maximum cornering speed before the limiting axle loses grip.
 * Binary search between 10 and 100 mph.
 */
export function calcMaxCornerSpeed(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  condition: TrackCondition,
): CorneringResult {
  let low = 5
  let high = 100
  let bestResult = calcHandlingBalance(vehicle, tires, track, low, condition)

  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2
    const result = calcHandlingBalance(vehicle, tires, track, mid, condition)
    const minMargin = Math.min(result.gripMarginFront, result.gripMarginRear)

    if (minMargin > 0) {
      low = mid
      bestResult = result
    } else {
      high = mid
    }
  }

  return {
    ...bestResult,
    maxSpeedMph: Math.round((low + high) / 2 * 10) / 10,
  }
}

/**
 * Balance curve: understeer gradient across a speed range.
 * Shows how handling changes with speed.
 */
export function calcBalanceSensitivity(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  condition: TrackCondition,
): BalancePoint[] {
  const maxResult = calcMaxCornerSpeed(vehicle, tires, track, condition)
  const maxSpeed = Math.min(maxResult.maxSpeedMph, 80)
  const minSpeed = 15
  const step = Math.max((maxSpeed - minSpeed) / 10, 2)

  const points: BalancePoint[] = []
  for (let speed = minSpeed; speed <= maxSpeed; speed += step) {
    const result = calcHandlingBalance(vehicle, tires, track, speed, condition)
    points.push({
      speedMph: Math.round(speed * 10) / 10,
      gradient: Math.round(result.understeerGradient * 10000) / 10000,
    })
  }

  return points
}
