import type {
  VehicleParams,
  TireModelParams,
  TrackGeometry,
  StaticCornerWeights,
  VehicleDynamicsResult,
  PhysicsInsight,
} from '@/lib/types/vehicle-dynamics'
import type { RaceType, TrackCondition } from '@/lib/types'
import { getEffectiveGrip } from './tire-model'
import { calcCornerWeightsAtSpeed } from './load-transfer'
import { calcRollDistribution, calcRollAngle } from './roll-couple'
import { calcMaxCornerSpeed, calcBalanceSensitivity } from './cornering-balance'
import { calcTractionBalance } from './traction-limit'

// ============================================================
// Vehicle Dynamics Orchestrator
//
// Chains all physics layers into a complete analysis.
// This is the main entry point for the setup recommendation
// engine and the AI crew chief.
// ============================================================

function calcStaticWeights(vehicle: VehicleParams): StaticCornerWeights {
  const frontTotal = vehicle.totalWeight * vehicle.frontWeightPct
  const rearTotal = vehicle.totalWeight * (1 - vehicle.frontWeightPct)
  return {
    lf: frontTotal * vehicle.leftWeightPct,
    rf: frontTotal * (1 - vehicle.leftWeightPct),
    lr: rearTotal * vehicle.leftWeightPct,
    rr: rearTotal * (1 - vehicle.leftWeightPct),
  }
}

function calcGripPerTire(
  weights: { lf: number; rf: number; lr: number; rr: number },
  tires: TireModelParams,
  surface: TrackGeometry['surface'],
  condition: TrackCondition,
): { lf: number; rf: number; lr: number; rr: number } {
  return {
    lf: getEffectiveGrip(weights.lf, tires.baseMu, tires.loadSensitivity, tires.pressureLF, tires.optimalPressureFront, surface, condition),
    rf: getEffectiveGrip(weights.rf, tires.baseMu, tires.loadSensitivity, tires.pressureRF, tires.optimalPressureFront, surface, condition),
    lr: getEffectiveGrip(weights.lr, tires.baseMu, tires.loadSensitivity, tires.pressureLR, tires.optimalPressureRear, surface, condition),
    rr: getEffectiveGrip(weights.rr, tires.baseMu, tires.loadSensitivity, tires.pressureRR, tires.optimalPressureRear, surface, condition),
  }
}

function generateInsights(
  rollDist: number,
  raceType: RaceType,
  maxSpeed: ReturnType<typeof calcMaxCornerSpeed>,
  traction: ReturnType<typeof calcTractionBalance> | undefined,
  rollAngle: number,
): PhysicsInsight[] {
  const insights: PhysicsInsight[] = []
  const rollPct = Math.round(rollDist * 100)

  // Roll distribution insight
  if (raceType === 'figure-8') {
    if (rollDist > 0.53) {
      insights.push({
        category: 'springs',
        finding: `Front roll distribution is ${rollPct}% — car will push in both turn directions.`,
        suggestion: 'Reduce front spring rate or increase rear to bring closer to 50-52% for figure-8.',
        severity: rollDist > 0.58 ? 'warning' : 'info',
      })
    } else if (rollDist < 0.48) {
      insights.push({
        category: 'springs',
        finding: `Front roll distribution is ${rollPct}% — car will be loose in both directions.`,
        suggestion: 'Increase front spring rate or reduce rear to bring closer to 50-52% for figure-8.',
        severity: rollDist < 0.45 ? 'warning' : 'info',
      })
    } else {
      insights.push({
        category: 'springs',
        finding: `Front roll distribution is ${rollPct}% — well balanced for figure-8.`,
        suggestion: 'Roll distribution is in the target range for symmetric handling.',
        severity: 'info',
      })
    }
  } else {
    // Oval
    if (rollDist > 0.62) {
      insights.push({
        category: 'springs',
        finding: `Front roll distribution is ${rollPct}% — heavy push. Front axle is overloaded.`,
        suggestion: 'Soften front springs or stiffen rear. Target 55-60% for oval.',
        severity: 'warning',
      })
    } else if (rollDist < 0.53) {
      insights.push({
        category: 'springs',
        finding: `Front roll distribution is ${rollPct}% — car will be loose. Rear axle is overloaded.`,
        suggestion: 'Stiffen front springs or soften rear. Target 55-60% for oval.',
        severity: 'warning',
      })
    } else {
      insights.push({
        category: 'springs',
        finding: `Front roll distribution is ${rollPct}% — good balance for oval.`,
        suggestion: 'Roll distribution is in the target range.',
        severity: 'info',
      })
    }
  }

  // Roll angle insight
  if (rollAngle > 4.0) {
    insights.push({
      category: 'springs',
      finding: `Body roll is ${rollAngle.toFixed(1)}° — excessive. Weight transfer is slow and the car will feel lazy.`,
      suggestion: 'Stiffen both front and rear springs proportionally to reduce roll without changing balance.',
      severity: 'warning',
    })
  }

  // Limiting axle insight
  if (maxSpeed.limitingAxle === 'front' && maxSpeed.understeerGradient > 0.02) {
    insights.push({
      category: 'tires',
      finding: `Front tires are the grip limit at ${maxSpeed.maxSpeedMph.toFixed(0)} mph. Car pushes at the limit.`,
      suggestion: 'More negative front camber, lower front tire pressure, or softer front springs can help.',
      severity: 'info',
    })
  } else if (maxSpeed.limitingAxle === 'rear' && maxSpeed.understeerGradient < -0.02) {
    insights.push({
      category: 'tires',
      finding: `Rear tires are the grip limit at ${maxSpeed.maxSpeedMph.toFixed(0)} mph. Car is loose at the limit.`,
      suggestion: 'Lower rear tire pressure for more contact patch, or stiffen front springs to shift balance.',
      severity: 'info',
    })
  }

  // Traction insight
  if (traction) {
    if (traction.tractionLimited) {
      insights.push({
        category: 'gearing',
        finding: `Traction-limited on exit. Engine makes more torque (${traction.driveForce.toFixed(0)} lbs force) than rear tires can handle (${traction.availableGrip.toFixed(0)} lbs grip).`,
        suggestion: `Max usable torque is ${traction.maxUsableTorque} ft-lbs. A taller gear or softer cam would be faster on exit.`,
        severity: 'warning',
      })
    } else {
      insights.push({
        category: 'gearing',
        finding: `Rear tires can handle the engine torque on exit. Traction margin: ${traction.tractionMargin.toFixed(0)} lbs.`,
        suggestion: 'Power delivery is within the grip window. Could consider more aggressive gearing.',
        severity: 'info',
      })
    }
  }

  return insights
}

/**
 * Complete vehicle dynamics analysis.
 * Chains tire model → load transfer → roll couple → cornering balance → traction.
 */
export function analyzeVehicleDynamics(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  condition: TrackCondition,
  raceType: RaceType,
): VehicleDynamicsResult {
  // Static weights
  const staticWeights = calcStaticWeights(vehicle)

  // Roll distribution
  const rollDist = calcRollDistribution(vehicle)
  const rollAngle = calcRollAngle(vehicle, 0.75) // reference at 0.75g

  // Max corner speed and balance
  const maxCorner = calcMaxCornerSpeed(vehicle, tires, track, condition)
  const balanceCurve = calcBalanceSensitivity(vehicle, tires, track, condition)

  // Dynamic weights at max corner speed
  const dynamicWeights = calcCornerWeightsAtSpeed(vehicle, maxCorner.lateralG, 0, rollDist)

  // Grip per tire at dynamic weights
  const gripPerTire = calcGripPerTire(dynamicWeights, tires, track.surface, condition)

  // Traction (only if engine data provided)
  let traction: ReturnType<typeof calcTractionBalance> | undefined
  if (vehicle.peakTorque && vehicle.peakTorqueRpm) {
    // Estimate exit speed as 70% of max corner speed
    const exitSpeed = maxCorner.maxSpeedMph * 0.7
    traction = calcTractionBalance(
      vehicle, tires, track,
      vehicle.peakTorque,
      1.0, // assume top gear (1:1) at exit
      3.73, // common rear gear — TODO: make this an input
      exitSpeed,
      condition,
    )
  }

  // Physics insights
  const insights = generateInsights(rollDist, raceType, maxCorner, traction, rollAngle)

  return {
    staticWeights,
    dynamicWeights,
    gripPerTire,
    totalFrontGrip: gripPerTire.lf * dynamicWeights.lf + gripPerTire.rf * dynamicWeights.rf,
    totalRearGrip: gripPerTire.lr * dynamicWeights.lr + gripPerTire.rr * dynamicWeights.rr,
    rollDistributionFront: rollDist,
    rollAngleDeg: rollAngle,
    maxCornerSpeedMph: maxCorner.maxSpeedMph,
    lateralG: maxCorner.lateralG,
    limitingAxle: maxCorner.limitingAxle,
    understeerGradient: maxCorner.understeerGradient,
    balanceCurve,
    traction,
    physicsInsights: insights,
  }
}
