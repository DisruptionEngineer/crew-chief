// ============================================================
// Tenths - Core Type Definitions
// Re-exports from types/ barrel for backward compatibility
// ============================================================

export type {
  // Common
  RaceClass,
  SuspensionType,
  TrackCondition,
  RaceType,
  EventType,
  HandlingFeel,
  TrackSurface,
  ExperienceLevel,
  // Car
  EngineSpec,
  Car,
  SetupSheet,
  // Rules
  Rule,
  RuleCategory,
  TechCheckItem,
  // Division
  DivisionEngineRules,
  Division,
  // Engine
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
  // Session
  SetupChange,
  Weather,
  Session,
  Track,
  UserProfile,
  // Setup
  SetupRecommendation,
  SetupRecommendations,
  // Troubleshoot
  DiagnosticStep,
  DiagnosticOption,
  DiagnosticResult,
  Adjustment,
  // Calculators
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
} from './types/index'

// Legacy type kept for backward compat — the old HeadCastingId union
// New code should use string for headId
export type HeadCastingId =
  | '882'
  | '487'
  | '624'
  | '462'
  | '906'
  | '062'
  | '441'
