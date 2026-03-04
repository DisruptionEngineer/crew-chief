import type {
  EngineBuildConfig,
  EngineBuildResult,
  PowerCurvePoint,
  HeadCasting,
  CamProfile,
  DivisionEngineRules,
} from '@/lib/types'
import { findHeadById, findCamById } from './families/registry'
import { checkCompliance } from './compliance'
import { ironmanF8EngineRules } from '@/data/divisions/ironman-f8'

// ============================================================
// Engine Build Simulation Engine
// Airflow-based VE model for any engine family
//
// Calculation flow:
//   1. Geometry: bore/stroke → displacement, chamber → CR
//   2. Head flow: interpolate CFM at cam lift from flow table
//   3. For each RPM step (800–6500):
//      a. Theoretical airflow demand = CID × RPM / 3456
//      b. VE from Gaussian model shaped by cam duration
//      c. Head flow limit, carb CFM cap, CR efficiency
//      d. Torque & HP from VE × displacement × constants
//   4. Compliance check against division rules
// ============================================================

// --- Constants ---
const MECH_EFF = 0.82           // mechanical efficiency (friction, accessories)
const DEFAULT_CARB_CFM = 500    // Holley 4412 500 CFM — fallback if no rules
const AIR_DENSITY = 0.0765      // lbs/ft³ at sea level, 60°F
const FUEL_BTU_PER_LB = 18500   // pump gas BTU per lb
const AFR_STOICH = 14.7         // stoichiometric air-fuel ratio

// --- Geometry Calculations ---

export function calcDisplacement(bore: number, stroke: number): number {
  return (Math.PI / 4) * Math.pow(bore, 2) * stroke * 8
}

export function calcCompressionRatio(
  bore: number,
  stroke: number,
  chamberVolume: number,
  pistonDish: number,
  headGasketThickness: number,
  headGasketBore: number,
): number {
  const IN3_TO_CC = 16.387
  const gasketVolumeCC = (Math.PI / 4) * Math.pow(headGasketBore, 2) * headGasketThickness * IN3_TO_CC
  const sweptCC = (Math.PI / 4) * Math.pow(bore, 2) * stroke * IN3_TO_CC
  const clearanceCC = chamberVolume + gasketVolumeCC + pistonDish
  return (sweptCC + clearanceCC) / clearanceCC
}

// --- Head Flow Interpolation ---

function interpolateFlowAtLift(head: HeadCasting, targetLift: number): number {
  const data = head.flowData
  if (targetLift <= data[0].lift) return data[0].intakeCfm
  if (targetLift >= data[data.length - 1].lift) return data[data.length - 1].intakeCfm

  for (let i = 0; i < data.length - 1; i++) {
    if (targetLift >= data[i].lift && targetLift <= data[i + 1].lift) {
      const t = (targetLift - data[i].lift) / (data[i + 1].lift - data[i].lift)
      return data[i].intakeCfm + t * (data[i + 1].intakeCfm - data[i].intakeCfm)
    }
  }
  return data[data.length - 1].intakeCfm
}

// --- VE Curve Model ---
// Models volumetric efficiency across RPM range
// Shaped by cam timing, head flow, carb limit, and compression

function calcVeAtRpm(
  rpm: number,
  cam: CamProfile,
  headCfmAtLift: number,
  displacement: number,
  compressionRatio: number,
  carbCfmLimit: number,
): number {
  // Theoretical airflow demand at this RPM
  const theoreticalCfm = (displacement * rpm) / 3456

  // Peak VE RPM — longer duration shifts peak higher
  // Stock (194°) → ~4,200 RPM peak | Max legal (224°) → ~5,500 RPM peak
  const peakRpm = 2800 + (cam.duration - 180) * 60

  // VE bandwidth — tighter LSA narrows the band but raises peak
  const bandwidth = 1400 + (cam.duration - 180) * 10
  const lsaBonus = (114 - cam.lsa) * 0.003 // tighter LSA = higher peak VE

  // Gaussian curve centered on peak RPM
  const normalizedRpm = (rpm - peakRpm) / bandwidth
  const bellCurve = Math.exp(-0.5 * normalizedRpm * normalizedRpm)

  // Head flow capacity ratio
  // How much of the theoretical demand the heads can actually supply
  const flowRatio = Math.min(headCfmAtLift * 8 / Math.max(theoreticalCfm * 2, 1), 1.0)

  // Carb CFM cap — physically can't flow more than the carb rating
  // This kills VE above a certain RPM and is the dominant limiter
  const carbLimit = Math.min(carbCfmLimit / Math.max(theoreticalCfm, 1), 1.0)

  // Compression efficiency — higher CR = more work extracted per cycle
  // Diminishing returns above ~9.5:1
  const crFactor = 0.95 + Math.min((compressionRatio - 8.0) / 10.0, 0.05)

  // Low RPM scavenging loss (poor exhaust scavenging at idle/low RPM)
  const lowRpmFactor = Math.min((rpm - 600) / 1500, 1.0)

  // Combine all factors
  const baseVe = 0.70 + lsaBonus
  const veRaw = (baseVe + bellCurve * 0.22) * flowRatio * carbLimit * crFactor * lowRpmFactor

  // Physical ceiling — even a perfect engine rarely exceeds ~95% VE without forced induction
  return Math.min(veRaw, 0.95)
}

// --- Torque & HP Calculation ---

function calcTorqueHp(
  rpm: number,
  ve: number,
  displacement: number,
): { hp: number; torque: number } {
  // Air consumed per minute (ft³/min)
  const airVolume = (displacement / 1728) * (rpm / 2) * ve

  // Air mass per minute (lbs/min)
  const airMassPerMin = airVolume * AIR_DENSITY

  // Fuel mass per minute (lbs/min)
  const fuelPerMin = airMassPerMin / AFR_STOICH

  // Energy per minute (BTU/min)
  const energyPerMin = fuelPerMin * FUEL_BTU_PER_LB

  // Thermal efficiency (~30% for a carbureted pushrod V8)
  const thermalEff = 0.30

  // Convert to HP: 1 HP = 42.41 BTU/min
  const hpGross = (energyPerMin * thermalEff * MECH_EFF) / 42.41

  // Torque from HP
  const torque = rpm > 0 ? (hpGross * 5252) / rpm : 0

  return {
    hp: Math.max(0, Math.round(hpGross)),
    torque: Math.max(0, Math.round(torque)),
  }
}

// --- Main Simulation Entry Point ---

export function simulateEngineBuild(
  config: EngineBuildConfig,
  divisionRules?: DivisionEngineRules,
): EngineBuildResult {
  const rules = divisionRules ?? ironmanF8EngineRules

  // Look up head & cam from the engine family registry (all families)
  const head = findHeadById(config.headId)
  const cam = findCamById(config.camId)

  if (!head || !cam) {
    throw new Error(`Unknown head "${config.headId}" or cam "${config.camId}"`)
  }

  const displacement = calcDisplacement(config.bore, config.stroke)
  const compressionRatio = calcCompressionRatio(
    config.bore,
    config.stroke,
    head.chamberVolume,
    config.pistonDish,
    config.headGasketThickness,
    config.headGasketBore,
  )

  // Get head flow at this cam's max lift
  const headCfmAtCamLift = interpolateFlowAtLift(head, cam.lift)

  // Use carb CFM from division rules (500 for Ironman, 650 for Street Stock, etc.)
  const carbCfm = rules.carbCfmLimit || DEFAULT_CARB_CFM

  // Build power curve from 800 to 6500 RPM in 200 RPM increments
  const curve: PowerCurvePoint[] = []
  for (let rpm = 800; rpm <= 6500; rpm += 200) {
    const ve = calcVeAtRpm(rpm, cam, headCfmAtCamLift, displacement, compressionRatio, carbCfm)
    const { hp, torque } = calcTorqueHp(rpm, ve, displacement)
    curve.push({
      rpm,
      hp,
      torque,
      ve: Math.round(ve * 1000) / 1000,
    })
  }

  // Find peaks
  const peakHpPoint = curve.reduce((best, pt) => pt.hp > best.hp ? pt : best)
  const peakTqPoint = curve.reduce((best, pt) => pt.torque > best.torque ? pt : best)

  // Rules compliance — uses the same division rules for consistency
  const compliance = checkCompliance(config, head, cam, compressionRatio, rules)

  return {
    config,
    displacement: Math.round(displacement * 10) / 10,
    compressionRatio: Math.round(compressionRatio * 100) / 100,
    peakHp: peakHpPoint.hp,
    peakHpRpm: peakHpPoint.rpm,
    peakTorque: peakTqPoint.torque,
    peakTorqueRpm: peakTqPoint.rpm,
    curve,
    compliance,
  }
}

// --- Default Configuration ---

export const DEFAULT_CONFIG: EngineBuildConfig = {
  engineFamilyId: 'gm-sbc-350',
  bore: 4.000,
  stroke: 3.480,
  headId: '906',
  camId: 'street-strip',
  pistonDish: 4,                  // cc — typical flat-top with valve reliefs
  headGasketThickness: 0.039,    // standard Fel-Pro composite
  headGasketBore: 4.100,         // slightly larger than bore
}
