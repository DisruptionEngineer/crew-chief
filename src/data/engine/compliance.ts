import type {
  EngineBuildConfig,
  HeadCasting,
  CamProfile,
  ComplianceResult,
  ComplianceViolation,
  DivisionEngineRules,
} from '@/lib/types'
import { ironmanF8EngineRules } from '@/data/divisions/ironman-f8'

// ============================================================
// Division-Aware Engine Rules Compliance Checker
//
// Now takes DivisionEngineRules as a parameter instead of
// hardcoded Ironman F8 values. Falls back to Ironman F8
// rules for backward compatibility.
// ============================================================

export function checkCompliance(
  config: EngineBuildConfig,
  head: HeadCasting,
  cam: CamProfile,
  compressionRatio: number,
  divisionRules?: DivisionEngineRules,
): ComplianceResult {
  const rules = divisionRules ?? ironmanF8EngineRules
  const violations: ComplianceViolation[] = []
  const warnings: string[] = []

  // --- Cam Lift ---
  if (cam.lift > rules.maxCamLift) {
    violations.push({
      rule: 'cam-lift',
      description: `Cam lift ${cam.lift}" exceeds ${rules.maxCamLift}" maximum`,
    })
  } else if (cam.lift >= rules.maxCamLift - 0.005) {
    warnings.push(`Cam lift ${cam.lift}" is at the limit — expect close scrutiny at tech`)
  }

  // --- Compression Ratio ---
  if (compressionRatio > rules.maxCompression) {
    violations.push({
      rule: 'compression',
      description: `Compression ratio ${compressionRatio.toFixed(2)}:1 exceeds ${rules.maxCompression}:1 maximum`,
    })
  } else if (compressionRatio > rules.maxCompression - 0.3) {
    warnings.push(`CR ${compressionRatio.toFixed(2)}:1 — within 0.3 of ${rules.maxCompression}:1 limit. Verify with actual chamber CC measurements.`)
  }

  // --- Valve Sizes ---
  if (head.intakeValve > rules.maxIntakeValve) {
    violations.push({
      rule: 'intake-valve',
      description: `Intake valve ${head.intakeValve}" exceeds ${rules.maxIntakeValve}" maximum`,
    })
  }
  if (head.exhaustValve > rules.maxExhaustValve) {
    violations.push({
      rule: 'exhaust-valve',
      description: `Exhaust valve ${head.exhaustValve}" exceeds ${rules.maxExhaustValve}" maximum`,
    })
  }

  // --- Intake Runner Volume ---
  if (head.intakeRunner > rules.maxIntakeRunner) {
    violations.push({
      rule: 'intake-runner',
      description: `Intake runner volume ${head.intakeRunner}cc exceeds ${rules.maxIntakeRunner}cc maximum`,
    })
  } else if (head.intakeRunner > rules.maxIntakeRunner - 5) {
    warnings.push(`Intake runner ${head.intakeRunner}cc — close to ${rules.maxIntakeRunner}cc limit`)
  }

  // --- Bore & Stroke Limits ---
  const familyLimits = rules.boreLimits[config.engineFamilyId]
  if (familyLimits) {
    if (config.bore > familyLimits.maxBore) {
      violations.push({
        rule: 'bore',
        description: `Bore ${config.bore}" exceeds ${familyLimits.maxBore}" maximum`,
      })
    }
    if (config.stroke > familyLimits.maxStroke) {
      violations.push({
        rule: 'stroke',
        description: `Stroke ${config.stroke}" exceeds stock stroke of ${familyLimits.maxStroke}" — no stroker cranks allowed`,
      })
    }
  }

  // --- Cast Iron Requirement ---
  if (rules.requiresCastIron) {
    // Currently we don't track block/head material explicitly
    // but we flag if Bowtie parts are used when not allowed
    if (!rules.allowsBowtieParts && head.isBowtiePart) {
      violations.push({
        rule: 'bowtie',
        description: 'Bowtie performance parts are not allowed in this division',
      })
    }
  }

  // --- Vortec Check ---
  if (!rules.allowsVortec && head.isVortec) {
    violations.push({
      rule: 'vortec',
      description: 'Vortec heads are not allowed in this division',
    })
  }

  // --- Illegal Head/Cam Lists ---
  if (rules.illegalHeadIds.includes(head.id)) {
    violations.push({
      rule: 'illegal-head',
      description: `Head casting #${head.id} is specifically banned in this division`,
    })
  }
  if (rules.illegalCamIds.includes(cam.id)) {
    violations.push({
      rule: 'illegal-cam',
      description: `Cam "${cam.name}" is specifically banned in this division`,
    })
  }

  // --- Engine Family Allowed Check ---
  if (rules.allowedEngineFamilyIds.length > 0 &&
      !rules.allowedEngineFamilyIds.includes(config.engineFamilyId)) {
    violations.push({
      rule: 'engine-family',
      description: `Engine family "${config.engineFamilyId}" is not allowed in this division`,
    })
  }

  return {
    isLegal: violations.length === 0,
    violations,
    warnings,
  }
}
