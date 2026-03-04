// ============================================================
// Engine Build Simulator types
// ============================================================

// --- Head Catalog ---

export interface HeadFlowData {
  lift: number
  intakeCfm: number
  exhaustCfm: number
}

/**
 * Cylinder head casting — pure data, no division coupling.
 * Legality is determined at runtime by DivisionEngineRules.
 */
export interface HeadCasting {
  id: string
  engineFamilyId: string
  name: string
  nicknames: string[]
  chamberVolume: number  // cc
  intakeRunner: number   // cc
  intakeValve: number    // inches
  exhaustValve: number   // inches
  isVortec: boolean
  isBowtiePart: boolean
  flowData: HeadFlowData[]
  notes: string
}

// --- Cam Catalog ---

/**
 * Cam profile — pure data, no division coupling.
 */
export interface CamProfile {
  id: string
  engineFamilyId: string
  name: string
  lift: number           // inches at valve
  duration: number       // degrees at .050"
  lsa: number            // lobe separation angle
  notes: string
}

// --- Engine Family ---

/**
 * A complete engine family — catalogs of heads, cams, and defaults.
 */
export interface EngineFamily {
  id: string
  name: string
  manufacturer: 'GM' | 'Ford' | 'Mopar'
  displacement: number   // nominal cubic inches
  cylinders: 4 | 6 | 8
  architecture: 'pushrod' | 'ohc'
  defaultBore: number
  defaultStroke: number
  heads: HeadCasting[]
  cams: CamProfile[]
  defaultConfig: Omit<EngineBuildConfig, 'engineFamilyId'>
}

// --- Build Config (user selections) ---

export interface EngineBuildConfig {
  engineFamilyId: string
  bore: number
  stroke: number
  headId: string
  camId: string
  pistonDish: number             // cc (positive = dish, negative = dome)
  headGasketThickness: number    // inches
  headGasketBore: number         // inches
}

// --- Simulation Output ---

export interface PowerCurvePoint {
  rpm: number
  hp: number
  torque: number
  ve: number             // volumetric efficiency 0-1
}

export interface ComplianceViolation {
  rule: string
  description: string
}

export interface ComplianceResult {
  isLegal: boolean
  violations: ComplianceViolation[]
  warnings: string[]
}

export interface EngineBuildResult {
  config: EngineBuildConfig
  displacement: number
  compressionRatio: number
  peakHp: number
  peakHpRpm: number
  peakTorque: number
  peakTorqueRpm: number
  curve: PowerCurvePoint[]
  compliance: ComplianceResult
}

// --- Saved Build (persisted to IndexedDB) ---

export interface SavedEngineBuild {
  id: string
  name: string
  createdAt: string
  config: EngineBuildConfig
  result: EngineBuildResult
}
