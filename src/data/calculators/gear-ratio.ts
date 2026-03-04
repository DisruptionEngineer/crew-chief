import type { GearRatioInput, GearRatioResult, RpmAtSpeedPoint } from '@/lib/types'

// ============================================================
// Gear Ratio Calculator
//
// Calculates RPM at various speeds for a given combination
// of rear axle ratio, tire diameter, and transmission ratios.
//
// Key for short track: you want peak torque RPM to coincide
// with corner exit speed, and peak HP RPM near the end of
// the straightaway. On a 1/5 mile track, you're rarely
// going faster than 60-70 mph, so gear ratio choice matters
// A LOT more than on big tracks.
// ============================================================

export function calculateGearRatios(input: GearRatioInput): GearRatioResult {
  const {
    rearGearRatio,
    tireDiameter,
    transmissionRatios,
    peakTorqueRpm,
    peakHpRpm,
    trackTopSpeed,
  } = input

  // Tire circumference in feet
  const tireCircumferenceFt = (tireDiameter * Math.PI) / 12

  // Calculate RPM at speed for each gear
  const rpmAtSpeed: RpmAtSpeedPoint[] = []

  // Speed range: 10 mph to trackTopSpeed in 5 mph increments
  const maxSpeed = trackTopSpeed ?? 70
  for (let mph = 10; mph <= maxSpeed; mph += 5) {
    // Feet per minute at this speed
    const fpm = mph * 88 // 1 mph = 88 ft/min

    // Wheel RPM
    const wheelRpm = fpm / tireCircumferenceFt

    const gearRpms: Record<string, number> = {}
    const gearNames = Object.keys(transmissionRatios)

    for (const gearName of gearNames) {
      const gearRatio = transmissionRatios[gearName]
      const engineRpm = Math.round(wheelRpm * rearGearRatio * gearRatio)
      gearRpms[gearName] = engineRpm
    }

    rpmAtSpeed.push({
      mph,
      gearRpms,
    })
  }

  // Find speed at peak torque RPM in top gear
  const topGearName = Object.keys(transmissionRatios).pop() || 'high'
  const topGearRatio = transmissionRatios[topGearName] || 1.0
  const overallRatio = rearGearRatio * topGearRatio
  const speedAtPeakTorque = peakTorqueRpm
    ? Math.round((peakTorqueRpm * tireCircumferenceFt) / (overallRatio * 88))
    : undefined
  const speedAtPeakHp = peakHpRpm
    ? Math.round((peakHpRpm * tireCircumferenceFt) / (overallRatio * 88))
    : undefined

  // Effective overall ratio (rear × top gear)
  const effectiveRatio = Math.round(overallRatio * 100) / 100

  // Recommendations based on track
  const recommendations: string[] = []

  if (speedAtPeakTorque !== undefined && trackTopSpeed !== undefined) {
    if (speedAtPeakTorque > trackTopSpeed * 0.7) {
      recommendations.push(`Peak torque at ${speedAtPeakTorque} mph — may be too tall for this track. Consider a numerically higher (shorter) rear gear.`)
    } else if (speedAtPeakTorque < trackTopSpeed * 0.3) {
      recommendations.push(`Peak torque at ${speedAtPeakTorque} mph — gearing is very short. Good corner exit but may over-rev on straights.`)
    } else {
      recommendations.push(`Peak torque at ${speedAtPeakTorque} mph — good match for corner exit speed.`)
    }
  }

  if (speedAtPeakHp !== undefined && trackTopSpeed !== undefined) {
    if (speedAtPeakHp > trackTopSpeed) {
      recommendations.push(`Peak HP at ${speedAtPeakHp} mph — you'll never reach peak power on this track. Shorter gear needed.`)
    } else if (speedAtPeakHp < trackTopSpeed * 0.8) {
      recommendations.push(`Peak HP at ${speedAtPeakHp} mph — you're past peak power at the end of the straight. Could go taller.`)
    } else {
      recommendations.push(`Peak HP at ${speedAtPeakHp} mph — well matched to track top speed.`)
    }
  }

  return {
    rpmAtSpeed,
    speedAtPeakTorque,
    speedAtPeakHp,
    effectiveRatio,
    recommendations,
  }
}
