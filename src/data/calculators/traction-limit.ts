import type {
  VehicleParams,
  TireModelParams,
  TrackGeometry,
  TractionResult,
} from '@/lib/types/vehicle-dynamics'
import type { TrackCondition } from '@/lib/types'
import { getEffectiveGrip } from './tire-model'
import { calcCornerWeightsAtSpeed } from './load-transfer'
import { calcRollDistribution } from './roll-couple'

// ============================================================
// Traction Limit Calculator
//
// Connects engine output to rear tire grip using the friction
// circle. On corner exit, the rear tires must simultaneously
// provide lateral grip (still turning) AND longitudinal grip
// (accelerating). The combined demand can't exceed total grip.
//
// driveForce = (torque * gearRatio * rearGearRatio) / tireRadius
// combined = sqrt(driveForce^2 + lateralForce^2)
// tractionLimited = combined > availableGrip
// ============================================================

const G = 32.174

/**
 * Total grip force available at the rear axle.
 * Sum of left rear + right rear grip (force = mu * load).
 */
export function calcAvailableTraction(
  rearAxleLoad: number,
  tires: TireModelParams,
  surface: TrackGeometry['surface'],
  condition: TrackCondition,
): number {
  // Split rear load evenly (simplified — in reality dynamic weights differ L/R)
  const perTire = rearAxleLoad / 2

  const gripL = getEffectiveGrip(
    perTire, tires.baseMu, tires.loadSensitivity,
    tires.pressureLR, tires.optimalPressureRear, surface, condition,
  ) * perTire

  const gripR = getEffectiveGrip(
    perTire, tires.baseMu, tires.loadSensitivity,
    tires.pressureRR, tires.optimalPressureRear, surface, condition,
  ) * perTire

  return gripL + gripR
}

/**
 * Drive force at the contact patch in lbs.
 * Converts engine torque through the drivetrain to force at the tire.
 */
export function calcRequiredDriveForce(
  engineTorque: number,    // ft-lbs
  gearRatio: number,       // transmission gear
  rearGearRatio: number,   // rear axle ratio
  tireDiameter: number,    // inches
): number {
  const tireRadiusFt = tireDiameter / 2 / 12
  return (engineTorque * gearRatio * rearGearRatio) / tireRadiusFt
}

/**
 * Traction balance at corner exit.
 * Combines lateral demand (still turning) with longitudinal demand (accelerating)
 * using the friction circle.
 */
export function calcTractionBalance(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  engineTorque: number,
  gearRatio: number,
  rearGearRatio: number,
  exitSpeedMph: number,
  condition: TrackCondition,
): TractionResult {
  // Lateral g at exit speed
  const speedFps = exitSpeedMph * 5280 / 3600
  const bankingRad = track.banking * Math.PI / 180
  const lateralG = Math.max(
    (speedFps * speedFps) / (track.cornerRadius * G) - Math.tan(bankingRad),
    0,
  )

  // Dynamic corner weights at exit (slight acceleration = negative longitudinal g)
  const rollDist = calcRollDistribution(vehicle)
  const weights = calcCornerWeightsAtSpeed(vehicle, lateralG, -0.15, rollDist)

  // Rear axle load
  const rearAxleLoad = weights.lr + weights.rr

  // Available grip
  const availableGrip = calcAvailableTraction(rearAxleLoad, tires, track.surface, condition)

  // Drive force
  const driveForce = calcRequiredDriveForce(engineTorque, gearRatio, rearGearRatio, tires.diameter)

  // Lateral force required at rear axle
  const rearWeightFraction = rearAxleLoad / vehicle.totalWeight
  const lateralForceRequired = vehicle.totalWeight * lateralG * rearWeightFraction

  // Friction circle: combined demand
  const combinedDemand = Math.sqrt(
    driveForce * driveForce + lateralForceRequired * lateralForceRequired,
  )

  const tractionMargin = availableGrip - combinedDemand
  const tractionLimited = tractionMargin < 0

  // Max usable torque: solve for torque where combined = available
  // available^2 = drive^2 + lateral^2
  // drive^2 = available^2 - lateral^2
  const maxDriveForce = Math.sqrt(
    Math.max(availableGrip * availableGrip - lateralForceRequired * lateralForceRequired, 0),
  )
  const tireRadiusFt = tires.diameter / 2 / 12
  const overallRatio = gearRatio * rearGearRatio
  const maxUsableTorque = overallRatio > 0
    ? (maxDriveForce * tireRadiusFt) / overallRatio
    : 0

  return {
    rearAxleLoad,
    availableGrip,
    driveForce,
    lateralForceRequired,
    combinedDemand,
    tractionMargin,
    tractionLimited,
    maxUsableTorque: Math.round(maxUsableTorque),
  }
}
