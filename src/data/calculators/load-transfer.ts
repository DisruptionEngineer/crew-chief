import type { VehicleParams, DynamicCornerWeights } from '@/lib/types'

// ============================================================
// Load Transfer Calculator
//
// Calculates how weight shifts during cornering, braking,
// and acceleration. The AMOUNT of shift is pure physics.
//
// Lateral:      dW = (W * ay * h_cg) / trackWidth
// Longitudinal: dW = (W * ax * h_cg) / wheelbase
//
// Positive lateral g = left turn (weight shifts right).
// Positive longitudinal g = braking (weight shifts forward).
// ============================================================

/**
 * Total lateral weight transfer in lbs.
 * Uses average of front and rear track widths.
 */
export function calcLateralLoadTransfer(
  vehicle: VehicleParams,
  lateralG: number,
): number {
  const avgTrackWidth = (vehicle.trackWidthFront + vehicle.trackWidthRear) / 2
  return (vehicle.totalWeight * lateralG * vehicle.cgHeight) / avgTrackWidth
}

/**
 * Total longitudinal weight transfer in lbs.
 * Positive ax = braking (shifts forward), negative = acceleration (shifts rearward).
 */
export function calcLongitudinalLoadTransfer(
  vehicle: VehicleParams,
  longitudinalG: number,
): number {
  return (vehicle.totalWeight * longitudinalG * vehicle.cgHeight) / vehicle.wheelbase
}

/**
 * Dynamic load on all four tires during cornering.
 *
 * rollDistFront controls how lateral transfer is split between axles.
 * Higher rollDistFront = more transfer through front = front loses more grip.
 *
 * Convention: positive lateralG = left turn (weight moves to right side).
 */
export function calcCornerWeightsAtSpeed(
  vehicle: VehicleParams,
  lateralG: number,
  longitudinalG: number,
  rollDistFront: number,
): DynamicCornerWeights {
  const totalLateral = calcLateralLoadTransfer(vehicle, lateralG)
  const totalLongitudinal = calcLongitudinalLoadTransfer(vehicle, longitudinalG)

  // Front/rear lateral split based on roll distribution
  const lateralFront = totalLateral * rollDistFront
  const lateralRear = totalLateral * (1 - rollDistFront)

  // Static weights
  const frontTotal = vehicle.totalWeight * vehicle.frontWeightPct
  const rearTotal = vehicle.totalWeight * (1 - vehicle.frontWeightPct)

  const staticLF = frontTotal * vehicle.leftWeightPct
  const staticRF = frontTotal * (1 - vehicle.leftWeightPct)
  const staticLR = rearTotal * vehicle.leftWeightPct
  const staticRR = rearTotal * (1 - vehicle.leftWeightPct)

  // Longitudinal transfer: braking adds to front, subtracts from rear
  const longiFront = totalLongitudinal / 2
  const longiRear = -totalLongitudinal / 2

  // Lateral transfer: left turn (positive) adds to right, subtracts from left
  const lf = staticLF - lateralFront / 2 + longiFront
  const rf = staticRF + lateralFront / 2 + longiFront
  const lr = staticLR - lateralRear / 2 + longiRear
  const rr = staticRR + lateralRear / 2 + longiRear

  return {
    lf,
    rf,
    lr,
    rr,
    totalLateralTransfer: totalLateral,
    totalLongitudinalTransfer: totalLongitudinal,
    insideFrontLoad: lf, // inside tire in a left turn
  }
}
