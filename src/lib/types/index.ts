// ============================================================
// Tenths — Type barrel
// Re-exports all types from their domain modules
// ============================================================

// Common enums & unions
export type {
  RaceClass,
  SuspensionType,
  TrackCondition,
  RaceType,
  EventType,
  HandlingFeel,
  TrackSurface,
  ExperienceLevel,
} from './common'

// Car & Setup
export type {
  EngineSpec,
  Car,
  SetupSheet,
} from './car'

// Rules & Tech
export type {
  Rule,
  RuleCategory,
  TechCheckItem,
} from './rules'

// Divisions
export type {
  DivisionEngineRules,
  Division,
} from './division'

// Engine Simulator
export type {
  HeadFlowData,
  HeadCasting,
  CamProfile,
  EngineFamily,
  EngineBuildConfig,
  PowerCurvePoint,
  ComplianceViolation,
  ComplianceResult,
  EngineBuildResult,
  SavedEngineBuild,
} from './engine'

// Sessions & Tracking
export type {
  SetupChange,
  Weather,
  Session,
  Track,
  UserProfile,
} from './session'

// Calculators
export type {
  CornerWeightInput,
  LoadBoltAdjustment,
  CornerWeightResult,
  RimOffsetInput,
  RimOffsetResult,
  TransmissionType,
  TransmissionInput,
  TransmissionScore,
  TransmissionResult,
  GearRatioInput,
  RpmAtSpeedPoint,
  GearRatioResult,
} from './calculators'

// Setup Recommendations (kept here for existing imports)
export type {
  SetupRecommendation,
  SetupRecommendations,
} from './setup'

// Troubleshooting
export type {
  DiagnosticStep,
  DiagnosticOption,
  DiagnosticResult,
  Adjustment,
} from './troubleshoot'

// Vehicle Dynamics
export type {
  TrackGeometry,
  VehicleParams,
  TireModelParams,
  TireGripResult,
  DynamicCornerWeights,
  StaticCornerWeights,
  RollCoupleResult,
  TargetSpringRates,
  CorneringResult,
  BalancePoint,
  TractionResult,
  PhysicsInsight,
  VehicleDynamicsResult,
} from './vehicle-dynamics'
