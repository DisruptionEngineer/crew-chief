# Vehicle Dynamics Physics Engine — Design Document

**Date:** 2026-03-07
**Status:** Approved
**Scope:** Physics-based vehicle dynamics engine for setup recommendations, AI crew chief context, and future visualizations

## Goals

1. Replace lookup-table setup recommendations with physics-derived calculations
2. Feed the AI crew chief real dynamics data (load transfer, grip, balance) instead of reference ranges
3. Produce data shapes that map directly to future visualizations (grip circles, balance curves, weight diagrams)
4. Keep everything client-side — pure TypeScript functions alongside existing calculators

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tire model | Empirical with physics corrections | No Pacejka dyno data; real-world compound knowledge available |
| Track geometry | Single corner now, multi-segment later | 90% accuracy fast; figure-8 segments can be added without rewrite |
| Architecture | Layered calculator pipeline | Matches existing codebase pattern; independently testable and reusable |
| Runtime | Client-side (browser) | Pure math, no secrets, PWA offline-capable, consistent with existing calculators |
| Unknown params | Sensible defaults from car type | CG height, roll centers, track width estimated; user can override |

## Architecture

### Layer Pipeline

```
tire-model.ts        --> grip coefficients at load/pressure/surface
load-transfer.ts     --> lateral/longitudinal weight shifts at speed
roll-couple.ts       --> front/rear roll moment distribution
cornering-balance.ts --> understeer gradient, max corner speed
traction-limit.ts    --> rear grip vs engine torque on exit
vehicle-dynamics.ts  --> orchestrator that chains all layers
```

Each layer is a pure function module. The orchestrator composes them into a complete `VehicleDynamicsResult`. Setup recommendations and the AI crew chief both consume this result.

### File Layout

```
src/data/calculators/
  corner-weight.ts          (existing, unchanged)
  gear-ratio.ts             (existing, unchanged)
  rim-offset.ts             (existing, unchanged)
  transmission.ts           (existing, unchanged)
  tire-model.ts             (new)
  load-transfer.ts          (new)
  roll-couple.ts            (new)
  cornering-balance.ts      (new)
  traction-limit.ts         (new)
  vehicle-dynamics.ts        (new — orchestrator)
  vehicle-defaults.ts        (new — CG, roll center, track width estimates)

src/lib/types/
  vehicle-dynamics.ts        (new — all interfaces)
```

## Phase 1: Physics Engine

### Layer 1 — Tire Model (`tire-model.ts`)

Grip decreases as load increases (load sensitivity). This is why weight transfer hurts total grip.

**Functions:**

- `getTireGrip(load, baseMu, loadSensitivity)` — friction coefficient at a given vertical load
  - `mu = baseMu - (loadSensitivity * load)`
- `getPressureGripModifier(actualPsi, optimalPsi)` — 0-1 parabolic multiplier, peaks at optimal pressure
- `getSurfaceGripModifier(surface, condition)` — multiplier for surface type and track condition
- `getEffectiveGrip(load, tireParams, surface, condition)` — combines all three factors

**Tire compound data extension:**

Existing tire compound definitions get two new fields:

```ts
baseMu: { dirt: 1.1, asphalt: 0.95, concrete: 0.85, mixed: 0.90 }
loadSensitivity: 0.00015  // typical for bias-ply racing tire
```

### Layer 2 — Load Transfer (`load-transfer.ts`)

Calculates how weight shifts during cornering, braking, and acceleration.

**Core equations:**

```
Lateral:       dW = (W * ay * h_cg) / trackWidth
Longitudinal:  dW = (W * ax * h_cg) / wheelbase
Front split:   dW_front = dW_lateral * rollDistFront
```

**Functions:**

- `calcLateralLoadTransfer(vehicle, lateralG)` — total lateral weight shift in lbs
- `calcLongitudinalLoadTransfer(vehicle, longitudinalG)` — fore/aft weight shift in lbs
- `calcCornerWeightsAtSpeed(vehicle, lateralG, longitudinalG, rollDistFront)` — load on all four tires during cornering
- `calcWeightTransferRate(springRate, leverRatio)` — how quickly weight transfers (responsiveness)

**Output type:**

```ts
interface DynamicCornerWeights {
  lf: number
  rf: number
  lr: number
  rr: number
  totalLateralTransfer: number
  totalLongitudinalTransfer: number
  insideFrontLoad: number
}
```

### Layer 3 — Roll Couple Distribution (`roll-couple.ts`)

The master tuning knob: what percentage of roll resistance comes from the front axle?

More front roll resistance = more front load transfer = front loses grip first = understeer (push).

**Core equations:**

```
K_roll_front = 0.5 * frontSpringRate * (trackWidth/2)^2
K_roll_rear  = 0.5 * rearSpringRate  * (trackWidth/2)^2
rollDistFront = K_roll_front / (K_roll_front + K_roll_rear)
rollAngle = (W * ay * (h_cg - h_rollAxis)) / (K_roll_front + K_roll_rear)
```

**Functions:**

- `calcRollStiffness(springRate, trackWidth)` — roll stiffness in lb-in/deg for one axle
- `calcRollDistribution(vehicle)` — front roll couple percentage
- `calcRollAngle(vehicle, lateralG)` — body roll in degrees
- `calcTargetSpringRates(vehicle, targetRollDist, targetRollAngle)` — reverse calculation: given desired balance, solve for spring rates

**Target values:**

- Oval: 55-60% front (slight understeer bias for safety)
- Figure-8: 50-52% front (neutral, turns both ways)

### Layer 4 — Cornering Balance (`cornering-balance.ts`)

Answers: will this car push or be loose, and by how much?

**Functions:**

- `calcMaxCornerSpeed(vehicle, tires, track)` — fastest speed through the corner before grip limit
- `calcHandlingBalance(vehicle, tires, track, speedMph)` — balance at a specific speed
- `calcBalanceSensitivity(vehicle, tires, track)` — balance across a speed range (the balance curve)

**Output type:**

```ts
interface CorneringResult {
  maxSpeedMph: number
  limitingAxle: 'front' | 'rear'
  lateralG: number
  gripMarginFront: number
  gripMarginRear: number
  understeerGradient: number
}
```

### Layer 5 — Traction Limit (`traction-limit.ts`)

Connects engine output to rear tire grip using the friction circle concept.

**Functions:**

- `calcAvailableTraction(rearAxleLoad, tireParams, surface, condition)` — total rear grip force
- `calcRequiredDriveForce(engineTorque, gearRatio, rearGearRatio, tireDiameter)` — force at contact patch
- `calcTractionBalance(vehicle, tires, track, engineTorque, gearRatio, rearGearRatio, exitSpeedMph)` — combined lateral + longitudinal demand vs grip
- `calcOptimalExitGear(vehicle, tires, track, engineCurve, transmissionRatios, rearGearRatio)` — gear where traction limit kicks in

**Output type:**

```ts
interface TractionResult {
  rearAxleLoad: number
  availableGrip: number
  driveForce: number
  lateralForceRequired: number
  combinedDemand: number
  tractionMargin: number
  tractionLimited: boolean
  maxUsableTorque: number
}
```

### Layer 6 — Orchestrator (`vehicle-dynamics.ts`)

Chains all layers and produces the complete analysis.

**Function:**

`analyzeVehicleDynamics(vehicle, tires, track, condition, raceType, engineResult?)`

**Output type:**

```ts
interface VehicleDynamicsResult {
  staticWeights: CornerWeights
  dynamicWeights: DynamicCornerWeights
  gripPerTire: { lf: number; rf: number; lr: number; rr: number }
  totalFrontGrip: number
  totalRearGrip: number
  rollDistributionFront: number
  rollAngleDeg: number
  maxCornerSpeedMph: number
  lateralG: number
  limitingAxle: 'front' | 'rear'
  understeerGradient: number
  balanceCurve: { speedMph: number; gradient: number }[]
  traction?: TractionResult
  physicsInsights: PhysicsInsight[]
}

interface PhysicsInsight {
  category: 'springs' | 'alignment' | 'weight' | 'tires' | 'gearing'
  finding: string
  suggestion: string
  severity: 'info' | 'warning' | 'critical'
}
```

### Input Types

**TrackGeometry:**

```ts
interface TrackGeometry {
  cornerRadius: number      // feet
  banking: number           // degrees
  straightLength: number    // feet
  surface: 'dirt' | 'asphalt' | 'concrete' | 'mixed'
}
```

**VehicleParams:**

```ts
interface VehicleParams {
  totalWeight: number
  wheelbase: number
  trackWidth: number
  cgHeight: number
  frontWeightPct: number
  leftWeightPct: number
  frontSpringRate: number
  rearSpringRate: number
  frontRollCenterHeight: number
  rearRollCenterHeight: number
  peakTorque?: number
  peakTorqueRpm?: number
}
```

**TireParams:**

```ts
interface TireParams {
  compound: string
  baseMu: number
  loadSensitivity: number
  pressureLF: number
  pressureRF: number
  pressureLR: number
  pressureRR: number
  diameter: number
}
```

### Default Estimates (`vehicle-defaults.ts`)

Physics parameters estimated from car type when user hasn't measured them.

**Progressive detail tiers:**

| Tier | User Input | Accuracy |
|------|-----------|----------|
| 1 (default) | Car, track, condition only | Good — all params estimated from car registry |
| 2 (measured basics) | Total weight, cross-weight %, left % | Better — real weight data |
| 3 (advanced) | CG height, track width, roll centers | Best — full physics inputs |

**`buildVehicleParams(car, userOverrides?)`** — takes a Car from the registry plus optional overrides, fills defaults for anything not specified.

**Default data tables:**

- CG height by body style (14-24 inches)
- Roll center height by suspension type (SLA: 4" front, strut: 2" front, leaf: 10" rear, etc.)
- Track width by body style (56-62 inches)

### Integration Points

**Setup recommendations (`recommendations.ts`):**

Refactored to call `analyzeVehicleDynamics()`. Uses `calcTargetSpringRates()` for physics-derived spring recommendations. Falls back to current lookup-table behavior if physics inputs are incomplete.

**AI crew chief (`route.ts`):**

`VehicleDynamicsResult` serialized into the prompt context. The AI receives actual numbers — lateral load transfer, roll distribution, traction margin — instead of reference ranges from lookup tables.

**Existing calculators:**

Unchanged. `corner-weight.ts`, `gear-ratio.ts`, `rim-offset.ts`, `transmission.ts` remain standalone tools.

## Phase 2: Session Logging Integration

### Physics Snapshot on Session Save

When a user logs a session, the app runs `analyzeVehicleDynamics()` with their current setup and stores a compact snapshot:

```ts
interface SessionPhysicsSnapshot {
  rollDistributionFront: number
  understeerGradient: number
  maxCornerSpeedMph: number
  lateralG: number
  limitingAxle: 'front' | 'rear'
  tractionMargin?: number
  dynamicWeights: { lf: number; rf: number; lr: number; rr: number }
}
```

Stored in the existing Dexie sessions table as a new field (~200 bytes per session).

### Structured Driver Feedback

Symptom tags selected at session logging time:

```ts
type HandlingSymptom =
  | 'push-entry'    | 'push-mid'    | 'push-exit'
  | 'loose-entry'   | 'loose-mid'   | 'loose-exit'
  | 'tight-center'  | 'free-on-exit'
  | 'no-forward-bite' | 'wheel-spin-exit'
  | 'balanced'      | 'fast-tonight'

interface SessionFeedback {
  symptoms: HandlingSymptom[]
  lapTimeSeconds?: number
  position?: number
  trackCondition: TrackCondition
  notes?: string
}
```

### Correlation Engine (`session-insights.ts`)

Reads session history from Dexie and finds patterns by grouping sessions by symptoms and averaging physics snapshots.

**Functions:**

- `calcSessionCorrelations(sessions)` — groups by symptom, surfaces patterns (e.g., "push-entry reported in 7/9 sessions where front roll dist > 60%")
- `calcSetupTrend(sessions)` — tracks how setup evolved and whether changes improved results

Requires 5+ sessions with physics snapshots to produce useful correlations.

## Future: Visualization Layer

Physics outputs map directly to visualizations:

| Visualization | Data Source | Library |
|--------------|------------|---------|
| Grip Circle | `tire-model.ts` | Recharts / SVG |
| Dynamic Weight Diagram | `load-transfer.ts` | SVG |
| Balance Curve | `cornering-balance.ts` | Recharts |
| Traction Budget | `traction-limit.ts` | Recharts |
| Roll Distribution Dial | `roll-couple.ts` | SVG |

All physics functions return plain objects with numeric fields — trivially serializable for Recharts, SVG, JSON (AI prompt), and IndexedDB (session logging).
