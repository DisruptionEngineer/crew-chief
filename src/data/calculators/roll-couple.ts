import type { VehicleParams, TargetSpringRates } from '@/lib/types'

// ============================================================
// Roll Couple Distribution
//
// The ratio of front-to-rear roll stiffness is the master
// knob for handling balance. More front roll resistance =
// front tires transfer more weight = lose grip first = push.
//
// K_roll = 0.5 * springRate * (trackWidth/2)^2
// rollDistFront = K_front / (K_front + K_rear)
//
// Targets:
//   Oval: 55-60% front (slight understeer for safety)
//   Figure-8: 50-52% front (neutral, turns both ways)
// ============================================================

/**
 * Roll stiffness for one axle in lb-in^2.
 * K = 0.5 * springRate * (trackWidth/2)^2
 */
export function calcRollStiffness(
  springRate: number,
  trackWidth: number,
): number {
  const halfTrack = trackWidth / 2
  return 0.5 * springRate * halfTrack * halfTrack
}

/**
 * Front roll distribution (0-1).
 * > 0.5 means the front axle carries more of the roll resistance.
 */
export function calcRollDistribution(vehicle: VehicleParams): number {
  const kFront = calcRollStiffness(vehicle.frontSpringRate, vehicle.trackWidthFront)
  const kRear = calcRollStiffness(vehicle.rearSpringRate, vehicle.trackWidthRear)
  const total = kFront + kRear
  if (total === 0) return 0.5
  return kFront / total
}

/**
 * Body roll angle in degrees at a given lateral g.
 * Uses the roll axis height (interpolated between front/rear roll centers)
 * and total roll stiffness.
 */
export function calcRollAngle(
  vehicle: VehicleParams,
  lateralG: number,
): number {
  if (lateralG === 0) return 0

  const kFront = calcRollStiffness(vehicle.frontSpringRate, vehicle.trackWidthFront)
  const kRear = calcRollStiffness(vehicle.rearSpringRate, vehicle.trackWidthRear)
  const totalK = kFront + kRear

  if (totalK === 0) return 0

  // Roll axis height — linear interpolation between front and rear roll centers
  // weighted by front weight percentage
  const rollAxisHeight =
    vehicle.frontRollCenterHeight * vehicle.frontWeightPct +
    vehicle.rearRollCenterHeight * (1 - vehicle.frontWeightPct)

  // Moment arm = CG height above roll axis
  const momentArm = vehicle.cgHeight - rollAxisHeight

  // Roll moment = W * ay * momentArm (lb-in)
  const rollMoment = vehicle.totalWeight * lateralG * momentArm

  // Roll angle in radians, then convert to degrees
  const rollAngleRad = rollMoment / totalK
  return Math.abs(rollAngleRad * (180 / Math.PI))
}

/**
 * Reverse calculation: given a target front roll distribution,
 * solve for front/rear spring rates.
 *
 * Keeps total roll stiffness constant (preserves roll angle behavior)
 * and redistributes between front and rear.
 */
export function calcTargetSpringRates(
  vehicle: VehicleParams,
  targetRollDistFront: number,
): TargetSpringRates {
  const currentKFront = calcRollStiffness(vehicle.frontSpringRate, vehicle.trackWidthFront)
  const currentKRear = calcRollStiffness(vehicle.rearSpringRate, vehicle.trackWidthRear)
  const totalK = currentKFront + currentKRear

  // Target roll stiffness split
  const targetKFront = totalK * targetRollDistFront
  const targetKRear = totalK * (1 - targetRollDistFront)

  // Solve for spring rates: K = 0.5 * springRate * (trackWidth/2)^2
  // springRate = K / (0.5 * (trackWidth/2)^2)
  const halfFront = vehicle.trackWidthFront / 2
  const halfRear = vehicle.trackWidthRear / 2

  const frontSpringRate = targetKFront / (0.5 * halfFront * halfFront)
  const rearSpringRate = targetKRear / (0.5 * halfRear * halfRear)

  // Round to nearest 25 lbs/in (standard spring increments)
  const roundedFront = Math.round(frontSpringRate / 25) * 25
  const roundedRear = Math.round(rearSpringRate / 25) * 25

  // Calculate actual achieved distribution with rounded values
  const achievedKFront = calcRollStiffness(roundedFront, vehicle.trackWidthFront)
  const achievedKRear = calcRollStiffness(roundedRear, vehicle.trackWidthRear)
  const achievedDist = achievedKFront / (achievedKFront + achievedKRear)

  return {
    frontSpringRate: roundedFront,
    rearSpringRate: roundedRear,
    rollDistributionFront: achievedDist,
    rollAngleDeg: calcRollAngle(
      { ...vehicle, frontSpringRate: roundedFront, rearSpringRate: roundedRear },
      0.75, // reference lateral g
    ),
  }
}
