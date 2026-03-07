# Vehicle Dynamics Physics Engine — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a layered physics engine that calculates tire grip, load transfer, roll distribution, cornering balance, and traction limits — replacing lookup-table setup recommendations with first-principles calculations.

**Architecture:** Six pure-function calculator modules that compose into an orchestrator. Each layer builds on the previous. The orchestrator feeds both the deterministic setup recommendations and the AI crew chief prompt context. All client-side, offline-capable.

**Tech Stack:** TypeScript (strict), Vitest for testing, pure functions matching existing `src/data/calculators/` pattern. No external physics libraries.

**Design doc:** `docs/plans/2026-03-07-vehicle-dynamics-engine-design.md`

---

### Task 0: Set Up Vitest Test Framework

The project has no test framework. All subsequent tasks use TDD.

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add vitest devDep and test script)
- Create: `src/data/calculators/__tests__/smoke.test.ts`

**Step 1: Install vitest**

Run: `npm install -D vitest`

**Step 2: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Add test script to package.json**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Write smoke test**

Create `src/data/calculators/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { calculateCornerWeights } from '../corner-weight'

describe('smoke test — vitest is working', () => {
  it('calculates cross-weight percentage', () => {
    const result = calculateCornerWeights({
      weightLF: 825,
      weightRF: 825,
      weightLR: 825,
      weightRR: 825,
    })
    expect(result.crossWeightPct).toBe(50)
  })
})
```

**Step 5: Run test**

Run: `npm test`
Expected: PASS — 1 test passing

**Step 6: Commit**

```bash
git add vitest.config.ts package.json package-lock.json src/data/calculators/__tests__/smoke.test.ts
git commit -m "Add vitest test framework with smoke test"
```

---

### Task 1: Vehicle Dynamics Types

All interfaces for the physics engine in one file.

**Files:**
- Create: `src/lib/types/vehicle-dynamics.ts`
- Modify: `src/lib/types/index.ts` (add re-exports)

**Step 1: Create types file**

Create `src/lib/types/vehicle-dynamics.ts`:

```ts
import type { TrackCondition, TrackSurface } from './common'

// ============================================================
// Vehicle Dynamics Physics Engine types
// ============================================================

// --- Inputs ---

export interface TrackGeometry {
  cornerRadius: number        // feet
  banking: number             // degrees
  straightLength: number      // feet
  surface: TrackSurface
}

export interface VehicleParams {
  totalWeight: number         // lbs with driver
  wheelbase: number           // inches
  trackWidthFront: number     // inches
  trackWidthRear: number      // inches
  cgHeight: number            // inches — center of gravity height
  frontWeightPct: number      // 0-1
  leftWeightPct: number       // 0-1
  frontSpringRate: number     // lbs/in
  rearSpringRate: number      // lbs/in
  frontRollCenterHeight: number  // inches
  rearRollCenterHeight: number   // inches
  peakTorque?: number         // ft-lbs at wheels
  peakTorqueRpm?: number
}

export interface TireModelParams {
  compound: string
  baseMu: number              // base friction coefficient for this compound/surface
  loadSensitivity: number     // grip dropoff per lb of additional load
  pressureLF: number          // psi
  pressureRF: number
  pressureLR: number
  pressureRR: number
  optimalPressureFront: number // psi — center of pressure window
  optimalPressureRear: number
  diameter: number            // inches
}

// --- Tire Model outputs ---

export interface TireGripResult {
  mu: number                  // effective friction coefficient
  pressureModifier: number    // 0-1 multiplier from pressure
  surfaceModifier: number     // multiplier from surface/condition
  effectiveMu: number         // final combined grip
}

// --- Load Transfer outputs ---

export interface DynamicCornerWeights {
  lf: number
  rf: number
  lr: number
  rr: number
  totalLateralTransfer: number
  totalLongitudinalTransfer: number
  insideFrontLoad: number
}

export interface StaticCornerWeights {
  lf: number
  rf: number
  lr: number
  rr: number
}

// --- Roll Couple outputs ---

export interface RollCoupleResult {
  frontRollStiffness: number       // lb-in/deg
  rearRollStiffness: number        // lb-in/deg
  rollDistributionFront: number    // 0-1
  rollAngleDeg: number
}

export interface TargetSpringRates {
  frontSpringRate: number     // lbs/in
  rearSpringRate: number      // lbs/in
  rollDistributionFront: number
  rollAngleDeg: number
}

// --- Cornering Balance outputs ---

export interface CorneringResult {
  maxSpeedMph: number
  limitingAxle: 'front' | 'rear'
  lateralG: number
  gripMarginFront: number
  gripMarginRear: number
  understeerGradient: number
}

export interface BalancePoint {
  speedMph: number
  gradient: number
}

// --- Traction Limit outputs ---

export interface TractionResult {
  rearAxleLoad: number
  availableGrip: number       // lbs of force
  driveForce: number          // lbs of force from engine
  lateralForceRequired: number
  combinedDemand: number      // sqrt(drive^2 + lateral^2)
  tractionMargin: number      // available - combined
  tractionLimited: boolean
  maxUsableTorque: number     // ft-lbs before wheelspin
}

// --- Physics Insights ---

export interface PhysicsInsight {
  category: 'springs' | 'alignment' | 'weight' | 'tires' | 'gearing'
  finding: string
  suggestion: string
  severity: 'info' | 'warning' | 'critical'
}

// --- Orchestrator output ---

export interface VehicleDynamicsResult {
  staticWeights: StaticCornerWeights
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
  balanceCurve: BalancePoint[]
  traction?: TractionResult
  physicsInsights: PhysicsInsight[]
}
```

**Step 2: Add re-exports to barrel**

Add to `src/lib/types/index.ts`:

```ts
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
```

**Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/types/vehicle-dynamics.ts src/lib/types/index.ts
git commit -m "Add vehicle dynamics type definitions"
```

---

### Task 2: Vehicle Defaults

Estimates CG height, roll center heights, and track width from car type when user hasn't measured them.

**Files:**
- Create: `src/data/calculators/vehicle-defaults.ts`
- Create: `src/data/calculators/__tests__/vehicle-defaults.test.ts`

**Step 1: Write failing tests**

Create `src/data/calculators/__tests__/vehicle-defaults.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildVehicleParams } from '../vehicle-defaults'
import type { Car } from '@/lib/types'

const mockMonteCarlo: Car = {
  id: 'monte-carlo-75',
  name: '1975 Monte Carlo',
  year: 1975,
  make: 'Chevrolet',
  model: 'Monte Carlo',
  class: 'ironman-f8',
  eligibleDivisions: ['ironman-f8', 'street-stock'],
  engineFamilyId: 'gm-sbc-350',
  weight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  frontSuspension: 'sla-coil',
  rearSuspension: 'solid-axle-coil',
  engine: {
    displacement: 350,
    block: 'GM 350',
    heads: 'Cast iron straight plug',
    cam: 'Hydraulic, .450" max lift',
    carb: 'Holley 4412 500 CFM',
    compression: '10.5:1 max',
  },
  notes: '',
}

describe('buildVehicleParams', () => {
  it('builds params from car with default estimates', () => {
    const params = buildVehicleParams(mockMonteCarlo)
    expect(params.totalWeight).toBe(3300)
    expect(params.wheelbase).toBe(116)
    expect(params.trackWidthFront).toBe(61.5)
    expect(params.trackWidthRear).toBe(59.5)
    expect(params.cgHeight).toBeGreaterThan(0)
    expect(params.frontRollCenterHeight).toBeGreaterThan(0)
    expect(params.rearRollCenterHeight).toBeGreaterThan(0)
    expect(params.frontWeightPct).toBeGreaterThan(0)
    expect(params.frontWeightPct).toBeLessThan(1)
  })

  it('uses SLA front roll center for sla-coil suspension', () => {
    const params = buildVehicleParams(mockMonteCarlo)
    expect(params.frontRollCenterHeight).toBe(4)
  })

  it('allows user overrides', () => {
    const params = buildVehicleParams(mockMonteCarlo, {
      cgHeight: 18,
      totalWeight: 3400,
      frontWeightPct: 0.52,
    })
    expect(params.cgHeight).toBe(18)
    expect(params.totalWeight).toBe(3400)
    expect(params.frontWeightPct).toBe(0.52)
    // Non-overridden values still use defaults/car data
    expect(params.wheelbase).toBe(116)
  })

  it('uses macpherson-strut front roll center for strut cars', () => {
    const compact: Car = {
      ...mockMonteCarlo,
      id: 'civic-98',
      frontSuspension: 'macpherson-strut',
      rearSuspension: 'torsion-beam',
    }
    const params = buildVehicleParams(compact)
    expect(params.frontRollCenterHeight).toBe(2)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/calculators/__tests__/vehicle-defaults.test.ts`
Expected: FAIL — cannot find module `../vehicle-defaults`

**Step 3: Implement vehicle-defaults.ts**

Create `src/data/calculators/vehicle-defaults.ts`:

```ts
import type { Car, SuspensionType, VehicleParams } from '@/lib/types'

// ============================================================
// Vehicle Defaults
//
// Estimates physics parameters from car registry data.
// CG height, roll center heights, and weight distribution
// are derived from suspension type and body style.
//
// Users can override any value with measured data.
// ============================================================

const frontRollCenterByType: Record<SuspensionType, number> = {
  'sla-coil': 4,
  'macpherson-strut': 2,
  'solid-axle-coil': 5,
  'solid-axle-leaf': 5,
  'watts-link': 3,
  'torsion-beam': 2,
}

const rearRollCenterByType: Record<SuspensionType, number> = {
  'sla-coil': 6,
  'macpherson-strut': 6,
  'solid-axle-coil': 8,
  'solid-axle-leaf': 10,
  'watts-link': 6,
  'torsion-beam': 8,
}

// CG height estimated from body style via weight and wheelbase heuristic
// Heavier, taller cars have higher CG
function estimateCgHeight(car: Car): number {
  // Compacts and purpose-built cars: lower CG
  if (car.weight < 2800) return 16
  if (car.frontSuspension === 'macpherson-strut' && car.weight < 3200) return 18
  // Full-size sedans and trucks: higher CG
  if (car.weight > 3500) return 22
  // Mid-size sedans (A/G-body, Fox, etc.): typical
  return 20
}

// Default front weight % by suspension layout
function estimateFrontWeightPct(car: Car): number {
  // Front-engine, RWD stock cars typically 52-55% front
  if (car.frontSuspension === 'macpherson-strut' && car.rearSuspension === 'torsion-beam') {
    return 0.60 // FWD compacts are front-heavy
  }
  return 0.53 // typical RWD V8 stock car
}

export function buildVehicleParams(
  car: Car,
  overrides?: Partial<VehicleParams>,
): VehicleParams {
  const defaults: VehicleParams = {
    totalWeight: car.weight,
    wheelbase: car.wheelbase,
    trackWidthFront: car.trackWidthFront,
    trackWidthRear: car.trackWidthRear,
    cgHeight: estimateCgHeight(car),
    frontWeightPct: estimateFrontWeightPct(car),
    leftWeightPct: 0.50, // assume balanced unless overridden
    frontSpringRate: 900, // placeholder — will be set by setup or recommendation
    rearSpringRate: 200,
    frontRollCenterHeight: frontRollCenterByType[car.frontSuspension] ?? 4,
    rearRollCenterHeight: rearRollCenterByType[car.rearSuspension] ?? 8,
  }

  return { ...defaults, ...overrides }
}
```

**Step 4: Run tests**

Run: `npm test -- src/data/calculators/__tests__/vehicle-defaults.test.ts`
Expected: PASS — 4 tests passing

**Step 5: Commit**

```bash
git add src/data/calculators/vehicle-defaults.ts src/data/calculators/__tests__/vehicle-defaults.test.ts
git commit -m "Add vehicle defaults — estimate CG, roll centers from car type"
```

---

### Task 3: Tire Model

Calculates grip coefficient at a given load, pressure, and surface condition.

**Files:**
- Create: `src/data/calculators/tire-model.ts`
- Create: `src/data/calculators/__tests__/tire-model.test.ts`

**Step 1: Write failing tests**

Create `src/data/calculators/__tests__/tire-model.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  getTireGrip,
  getPressureGripModifier,
  getSurfaceGripModifier,
  getEffectiveGrip,
} from '../tire-model'

describe('getTireGrip', () => {
  it('returns baseMu at zero additional load', () => {
    expect(getTireGrip(0, 1.0, 0.00015)).toBe(1.0)
  })

  it('decreases grip with more load (load sensitivity)', () => {
    const gripAt500 = getTireGrip(500, 1.0, 0.00015)
    const gripAt1000 = getTireGrip(1000, 1.0, 0.00015)
    expect(gripAt500).toBeGreaterThan(gripAt1000)
  })

  it('calculates correctly: mu = baseMu - loadSens * load', () => {
    // 1.0 - 0.00015 * 800 = 1.0 - 0.12 = 0.88
    expect(getTireGrip(800, 1.0, 0.00015)).toBeCloseTo(0.88)
  })

  it('floors at a minimum grip of 0.1', () => {
    // Extreme load: 1.0 - 0.00015 * 10000 = -0.5 → floor at 0.1
    expect(getTireGrip(10000, 1.0, 0.00015)).toBe(0.1)
  })
})

describe('getPressureGripModifier', () => {
  it('returns 1.0 at optimal pressure', () => {
    expect(getPressureGripModifier(14, 14)).toBe(1.0)
  })

  it('returns less than 1.0 above optimal', () => {
    expect(getPressureGripModifier(18, 14)).toBeLessThan(1.0)
  })

  it('returns less than 1.0 below optimal', () => {
    expect(getPressureGripModifier(10, 14)).toBeLessThan(1.0)
  })

  it('is symmetric around optimal', () => {
    const above = getPressureGripModifier(16, 14)
    const below = getPressureGripModifier(12, 14)
    expect(above).toBeCloseTo(below)
  })

  it('floors at 0.7 for extreme deviation', () => {
    expect(getPressureGripModifier(5, 14)).toBeGreaterThanOrEqual(0.7)
  })
})

describe('getSurfaceGripModifier', () => {
  it('returns 1.0 for asphalt/moderate baseline', () => {
    expect(getSurfaceGripModifier('asphalt', 'moderate')).toBe(1.0)
  })

  it('returns less grip for concrete than asphalt', () => {
    const concrete = getSurfaceGripModifier('concrete', 'moderate')
    const asphalt = getSurfaceGripModifier('asphalt', 'moderate')
    expect(concrete).toBeLessThan(asphalt)
  })

  it('returns more grip for heavy than slick conditions', () => {
    const heavy = getSurfaceGripModifier('asphalt', 'heavy')
    const slick = getSurfaceGripModifier('asphalt', 'slick')
    expect(heavy).toBeGreaterThan(slick)
  })
})

describe('getEffectiveGrip', () => {
  it('combines all factors into a single effective mu', () => {
    const mu = getEffectiveGrip(800, 1.0, 0.00015, 14, 14, 'asphalt', 'moderate')
    // baseMu adjusted for load: 0.88
    // pressure modifier: 1.0 (at optimal)
    // surface modifier: 1.0 (asphalt/moderate baseline)
    expect(mu).toBeCloseTo(0.88)
  })

  it('reduces grip when pressure is off-optimal', () => {
    const optimal = getEffectiveGrip(800, 1.0, 0.00015, 14, 14, 'asphalt', 'moderate')
    const offPressure = getEffectiveGrip(800, 1.0, 0.00015, 20, 14, 'asphalt', 'moderate')
    expect(offPressure).toBeLessThan(optimal)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/calculators/__tests__/tire-model.test.ts`
Expected: FAIL — cannot find module `../tire-model`

**Step 3: Implement tire-model.ts**

Create `src/data/calculators/tire-model.ts`:

```ts
import type { TrackCondition, TrackSurface } from '@/lib/types'

// ============================================================
// Tire Grip Model
//
// Empirical model with physics corrections. Calculates effective
// friction coefficient from load, pressure, surface, and condition.
//
// Key behavior: grip DECREASES as load increases (load sensitivity).
// This is why weight transfer hurts total grip — the heavily loaded
// tire gains less grip than the lightly loaded tire loses.
// ============================================================

const MIN_GRIP = 0.1

/**
 * Friction coefficient at a given vertical load.
 * mu = baseMu - (loadSensitivity * load), floored at MIN_GRIP.
 */
export function getTireGrip(
  load: number,
  baseMu: number,
  loadSensitivity: number,
): number {
  return Math.max(baseMu - loadSensitivity * load, MIN_GRIP)
}

/**
 * Grip modifier from tire pressure deviation.
 * Parabolic dropoff from optimal — too high or too low hurts grip.
 * Returns 0.7–1.0.
 */
export function getPressureGripModifier(
  actualPsi: number,
  optimalPsi: number,
): number {
  const deviation = actualPsi - optimalPsi
  // Parabolic: 1.0 at center, drops toward 0.7 at ±10 psi
  const modifier = 1.0 - 0.003 * deviation * deviation
  return Math.max(modifier, 0.7)
}

const surfaceMultiplier: Record<TrackSurface, number> = {
  asphalt: 1.0,
  mixed: 0.95,
  concrete: 0.90,
  dirt: 1.05,
}

const conditionMultiplier: Record<TrackCondition, number> = {
  heavy: 1.10,
  tacky: 1.05,
  moderate: 1.00,
  dry: 0.92,
  slick: 0.85,
}

/**
 * Grip modifier from track surface and condition.
 * Asphalt/moderate = 1.0 baseline.
 */
export function getSurfaceGripModifier(
  surface: TrackSurface,
  condition: TrackCondition,
): number {
  return (surfaceMultiplier[surface] ?? 1.0) * (conditionMultiplier[condition] ?? 1.0)
}

/**
 * Combined effective friction coefficient.
 * Applies load sensitivity, pressure correction, and surface/condition.
 */
export function getEffectiveGrip(
  load: number,
  baseMu: number,
  loadSensitivity: number,
  actualPsi: number,
  optimalPsi: number,
  surface: TrackSurface,
  condition: TrackCondition,
): number {
  const mu = getTireGrip(load, baseMu, loadSensitivity)
  const pressureMod = getPressureGripModifier(actualPsi, optimalPsi)
  const surfaceMod = getSurfaceGripModifier(surface, condition)
  return mu * pressureMod * surfaceMod
}
```

**Step 4: Run tests**

Run: `npm test -- src/data/calculators/__tests__/tire-model.test.ts`
Expected: PASS — all tests passing

**Step 5: Commit**

```bash
git add src/data/calculators/tire-model.ts src/data/calculators/__tests__/tire-model.test.ts
git commit -m "Add tire grip model — load sensitivity, pressure, surface modifiers"
```

---

### Task 4: Load Transfer

Calculates weight shift to each tire during cornering, braking, and acceleration.

**Files:**
- Create: `src/data/calculators/load-transfer.ts`
- Create: `src/data/calculators/__tests__/load-transfer.test.ts`

**Step 1: Write failing tests**

Create `src/data/calculators/__tests__/load-transfer.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  calcLateralLoadTransfer,
  calcLongitudinalLoadTransfer,
  calcCornerWeightsAtSpeed,
} from '../load-transfer'
import type { VehicleParams } from '@/lib/types'

const vehicle: VehicleParams = {
  totalWeight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  cgHeight: 20,
  frontWeightPct: 0.53,
  leftWeightPct: 0.50,
  frontSpringRate: 900,
  rearSpringRate: 200,
  frontRollCenterHeight: 4,
  rearRollCenterHeight: 8,
}

describe('calcLateralLoadTransfer', () => {
  it('returns 0 at 0 lateral g', () => {
    expect(calcLateralLoadTransfer(vehicle, 0)).toBe(0)
  })

  it('returns positive value for positive lateral g', () => {
    const transfer = calcLateralLoadTransfer(vehicle, 0.5)
    expect(transfer).toBeGreaterThan(0)
  })

  it('calculates dW = (W * ay * cgH) / avgTrackWidth', () => {
    // avgTrackWidth = (61.5 + 59.5) / 2 = 60.5
    // dW = (3300 * 0.75 * 20) / 60.5 = 49500 / 60.5 ≈ 818.2
    const transfer = calcLateralLoadTransfer(vehicle, 0.75)
    expect(transfer).toBeCloseTo(818.2, 0)
  })

  it('scales linearly with lateral g', () => {
    const half = calcLateralLoadTransfer(vehicle, 0.5)
    const full = calcLateralLoadTransfer(vehicle, 1.0)
    expect(full).toBeCloseTo(half * 2, 0)
  })
})

describe('calcLongitudinalLoadTransfer', () => {
  it('returns 0 at 0 longitudinal g', () => {
    expect(calcLongitudinalLoadTransfer(vehicle, 0)).toBe(0)
  })

  it('calculates dW = (W * ax * cgH) / wheelbase', () => {
    // dW = (3300 * 0.3 * 20) / 116 ≈ 170.7
    const transfer = calcLongitudinalLoadTransfer(vehicle, 0.3)
    expect(transfer).toBeCloseTo(170.7, 0)
  })
})

describe('calcCornerWeightsAtSpeed', () => {
  it('returns static weights at 0 lateral g', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0, 0, 0.55)
    // 50% left, 53% front → LF=874.5, RF=874.5, LR=775.5, RR=775.5
    const frontWeight = vehicle.totalWeight * vehicle.frontWeightPct
    const rearWeight = vehicle.totalWeight * (1 - vehicle.frontWeightPct)
    expect(weights.lf).toBeCloseTo(frontWeight * vehicle.leftWeightPct)
    expect(weights.rf).toBeCloseTo(frontWeight * (1 - vehicle.leftWeightPct))
    expect(weights.lr).toBeCloseTo(rearWeight * vehicle.leftWeightPct)
    expect(weights.rr).toBeCloseTo(rearWeight * (1 - vehicle.leftWeightPct))
  })

  it('total weight is preserved during cornering', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0.75, 0, 0.55)
    expect(weights.lf + weights.rf + weights.lr + weights.rr).toBeCloseTo(3300, 0)
  })

  it('shifts weight to the right in a left turn (positive lateral g)', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0.75, 0, 0.55)
    const staticWeights = calcCornerWeightsAtSpeed(vehicle, 0, 0, 0.55)
    expect(weights.rf).toBeGreaterThan(staticWeights.rf)
    expect(weights.lf).toBeLessThan(staticWeights.lf)
  })

  it('reports inside front load', () => {
    const weights = calcCornerWeightsAtSpeed(vehicle, 0.75, 0, 0.55)
    expect(weights.insideFrontLoad).toBe(weights.lf)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/calculators/__tests__/load-transfer.test.ts`
Expected: FAIL

**Step 3: Implement load-transfer.ts**

Create `src/data/calculators/load-transfer.ts`:

```ts
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
```

**Step 4: Run tests**

Run: `npm test -- src/data/calculators/__tests__/load-transfer.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/calculators/load-transfer.ts src/data/calculators/__tests__/load-transfer.test.ts
git commit -m "Add load transfer calculator — lateral and longitudinal weight shift"
```

---

### Task 5: Roll Couple Distribution

Calculates front/rear roll stiffness ratio and derives target spring rates.

**Files:**
- Create: `src/data/calculators/roll-couple.ts`
- Create: `src/data/calculators/__tests__/roll-couple.test.ts`

**Step 1: Write failing tests**

Create `src/data/calculators/__tests__/roll-couple.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  calcRollStiffness,
  calcRollDistribution,
  calcRollAngle,
  calcTargetSpringRates,
} from '../roll-couple'
import type { VehicleParams } from '@/lib/types'

const vehicle: VehicleParams = {
  totalWeight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  cgHeight: 20,
  frontWeightPct: 0.53,
  leftWeightPct: 0.50,
  frontSpringRate: 900,
  rearSpringRate: 200,
  frontRollCenterHeight: 4,
  rearRollCenterHeight: 8,
}

describe('calcRollStiffness', () => {
  it('increases with spring rate', () => {
    const soft = calcRollStiffness(200, 60)
    const stiff = calcRollStiffness(900, 60)
    expect(stiff).toBeGreaterThan(soft)
  })

  it('increases with track width', () => {
    const narrow = calcRollStiffness(900, 50)
    const wide = calcRollStiffness(900, 60)
    expect(wide).toBeGreaterThan(narrow)
  })

  it('calculates K = 0.5 * springRate * (trackWidth/2)^2', () => {
    // 0.5 * 900 * (30)^2 = 0.5 * 900 * 900 = 405000
    expect(calcRollStiffness(900, 60)).toBe(405000)
  })
})

describe('calcRollDistribution', () => {
  it('returns higher front % when front springs are stiffer', () => {
    const dist = calcRollDistribution(vehicle)
    expect(dist).toBeGreaterThan(0.5)
  })

  it('returns ~50% when front and rear springs are equal', () => {
    const balanced: VehicleParams = {
      ...vehicle,
      frontSpringRate: 500,
      rearSpringRate: 500,
      trackWidthFront: 60,
      trackWidthRear: 60,
    }
    const dist = calcRollDistribution(balanced)
    expect(dist).toBeCloseTo(0.5, 1)
  })
})

describe('calcRollAngle', () => {
  it('returns 0 at 0 lateral g', () => {
    expect(calcRollAngle(vehicle, 0)).toBe(0)
  })

  it('increases with lateral g', () => {
    const low = calcRollAngle(vehicle, 0.3)
    const high = calcRollAngle(vehicle, 0.75)
    expect(high).toBeGreaterThan(low)
  })

  it('returns a reasonable value (1-5 deg at 0.75g)', () => {
    const angle = calcRollAngle(vehicle, 0.75)
    expect(angle).toBeGreaterThan(0.5)
    expect(angle).toBeLessThan(10)
  })
})

describe('calcTargetSpringRates', () => {
  it('returns spring rates that achieve the target roll distribution', () => {
    const target = 0.57
    const result = calcTargetSpringRates(vehicle, target)
    // Verify the result achieves the target
    const checkVehicle: VehicleParams = {
      ...vehicle,
      frontSpringRate: result.frontSpringRate,
      rearSpringRate: result.rearSpringRate,
    }
    const achieved = calcRollDistribution(checkVehicle)
    expect(achieved).toBeCloseTo(target, 2)
  })

  it('returns stiffer front for higher front roll distribution target', () => {
    const low = calcTargetSpringRates(vehicle, 0.50)
    const high = calcTargetSpringRates(vehicle, 0.60)
    expect(high.frontSpringRate).toBeGreaterThan(low.frontSpringRate)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/calculators/__tests__/roll-couple.test.ts`
Expected: FAIL

**Step 3: Implement roll-couple.ts**

Create `src/data/calculators/roll-couple.ts`:

```ts
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
```

**Step 4: Run tests**

Run: `npm test -- src/data/calculators/__tests__/roll-couple.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/calculators/roll-couple.ts src/data/calculators/__tests__/roll-couple.test.ts
git commit -m "Add roll couple distribution — roll stiffness, distribution, target springs"
```

---

### Task 6: Cornering Balance

Calculates max corner speed, understeer gradient, and balance curve across speed range.

**Files:**
- Create: `src/data/calculators/cornering-balance.ts`
- Create: `src/data/calculators/__tests__/cornering-balance.test.ts`

**Step 1: Write failing tests**

Create `src/data/calculators/__tests__/cornering-balance.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  calcHandlingBalance,
  calcMaxCornerSpeed,
  calcBalanceSensitivity,
} from '../cornering-balance'
import type { VehicleParams, TireModelParams, TrackGeometry } from '@/lib/types'

const vehicle: VehicleParams = {
  totalWeight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  cgHeight: 20,
  frontWeightPct: 0.53,
  leftWeightPct: 0.50,
  frontSpringRate: 900,
  rearSpringRate: 200,
  frontRollCenterHeight: 4,
  rearRollCenterHeight: 8,
}

const tires: TireModelParams = {
  compound: 'hoosier-g60',
  baseMu: 0.90,
  loadSensitivity: 0.00015,
  pressureLF: 14,
  pressureRF: 14,
  pressureLR: 13,
  pressureRR: 13,
  optimalPressureFront: 14,
  optimalPressureRear: 13,
  diameter: 27,
}

// Painesville: ~1/5 mile oval, 85ft corner radius, 5° banking
const track: TrackGeometry = {
  cornerRadius: 85,
  banking: 5,
  straightLength: 200,
  surface: 'mixed',
}

describe('calcHandlingBalance', () => {
  it('returns grip margins for front and rear', () => {
    const result = calcHandlingBalance(vehicle, tires, track, 40, 'moderate')
    expect(result.gripMarginFront).toBeDefined()
    expect(result.gripMarginRear).toBeDefined()
  })

  it('identifies limiting axle', () => {
    const result = calcHandlingBalance(vehicle, tires, track, 40, 'moderate')
    expect(['front', 'rear']).toContain(result.limitingAxle)
  })

  it('returns positive understeer gradient when front-limited (push)', () => {
    // 900 front / 200 rear = very front-biased roll distribution → should push
    const result = calcHandlingBalance(vehicle, tires, track, 40, 'moderate')
    expect(result.understeerGradient).toBeGreaterThan(0)
    expect(result.limitingAxle).toBe('front')
  })

  it('returns negative understeer gradient when rear-limited (loose)', () => {
    const looseVehicle: VehicleParams = {
      ...vehicle,
      frontSpringRate: 300,
      rearSpringRate: 500,
    }
    const result = calcHandlingBalance(looseVehicle, tires, track, 40, 'moderate')
    expect(result.understeerGradient).toBeLessThan(0)
    expect(result.limitingAxle).toBe('rear')
  })
})

describe('calcMaxCornerSpeed', () => {
  it('returns a reasonable speed for a 1/5 mile track', () => {
    const result = calcMaxCornerSpeed(vehicle, tires, track, 'moderate')
    expect(result.maxSpeedMph).toBeGreaterThan(20)
    expect(result.maxSpeedMph).toBeLessThan(80)
  })

  it('returns higher speed with more banking', () => {
    const banked: TrackGeometry = { ...track, banking: 15 }
    const flat = calcMaxCornerSpeed(vehicle, tires, track, 'moderate')
    const high = calcMaxCornerSpeed(vehicle, tires, banked, 'moderate')
    expect(high.maxSpeedMph).toBeGreaterThan(flat.maxSpeedMph)
  })

  it('returns higher speed with bigger radius', () => {
    const big: TrackGeometry = { ...track, cornerRadius: 200 }
    const small = calcMaxCornerSpeed(vehicle, tires, track, 'moderate')
    const large = calcMaxCornerSpeed(vehicle, tires, big, 'moderate')
    expect(large.maxSpeedMph).toBeGreaterThan(small.maxSpeedMph)
  })
})

describe('calcBalanceSensitivity', () => {
  it('returns a curve across the speed range', () => {
    const curve = calcBalanceSensitivity(vehicle, tires, track, 'moderate')
    expect(curve.length).toBeGreaterThan(3)
    expect(curve[0].speedMph).toBeLessThan(curve[curve.length - 1].speedMph)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/calculators/__tests__/cornering-balance.test.ts`
Expected: FAIL

**Step 3: Implement cornering-balance.ts**

Create `src/data/calculators/cornering-balance.ts`:

```ts
import type {
  VehicleParams,
  TireModelParams,
  TrackGeometry,
  TrackCondition,
  CorneringResult,
  BalancePoint,
} from '@/lib/types'
import { getEffectiveGrip } from './tire-model'
import { calcCornerWeightsAtSpeed } from './load-transfer'
import { calcRollDistribution } from './roll-couple'

// ============================================================
// Cornering Balance Calculator
//
// Ties tire model, load transfer, and roll distribution
// together to answer: will this car push or be loose?
//
// At any corner speed, each axle has grip available (from
// tire loads * friction). If front runs out first = push.
// If rear runs out first = loose.
// ============================================================

const G = 32.174 // ft/s^2

/**
 * Lateral g required to maintain a given speed around a corner.
 * Accounts for banking which reduces the required lateral grip.
 */
function requiredLateralG(speedMph: number, radiusFt: number, bankingDeg: number): number {
  const speedFps = speedMph * 5280 / 3600
  const bankingRad = bankingDeg * Math.PI / 180
  // ay = v^2 / (r * g) - tan(banking)
  const rawG = (speedFps * speedFps) / (radiusFt * G)
  const bankingAssist = Math.tan(bankingRad)
  return Math.max(rawG - bankingAssist, 0)
}

/**
 * Calculate grip available at front and rear axles for given dynamic weights.
 */
function calcAxleGrip(
  weights: { lf: number; rf: number; lr: number; rr: number },
  tires: TireModelParams,
  surface: TrackGeometry['surface'],
  condition: TrackCondition,
): { frontGrip: number; rearGrip: number } {
  const gripLF = getEffectiveGrip(
    weights.lf, tires.baseMu, tires.loadSensitivity,
    tires.pressureLF, tires.optimalPressureFront, surface, condition,
  ) * weights.lf

  const gripRF = getEffectiveGrip(
    weights.rf, tires.baseMu, tires.loadSensitivity,
    tires.pressureRF, tires.optimalPressureFront, surface, condition,
  ) * weights.rf

  const gripLR = getEffectiveGrip(
    weights.lr, tires.baseMu, tires.loadSensitivity,
    tires.pressureLR, tires.optimalPressureRear, surface, condition,
  ) * weights.lr

  const gripRR = getEffectiveGrip(
    weights.rr, tires.baseMu, tires.loadSensitivity,
    tires.pressureRR, tires.optimalPressureRear, surface, condition,
  ) * weights.rr

  return {
    frontGrip: gripLF + gripRF,
    rearGrip: gripLR + gripRR,
  }
}

/**
 * Handling balance at a specific speed.
 * Returns grip margins and understeer gradient.
 */
export function calcHandlingBalance(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  speedMph: number,
  condition: TrackCondition,
): CorneringResult {
  const lateralG = requiredLateralG(speedMph, track.cornerRadius, track.banking)
  const rollDist = calcRollDistribution(vehicle)
  const weights = calcCornerWeightsAtSpeed(vehicle, lateralG, 0, rollDist)
  const { frontGrip, rearGrip } = calcAxleGrip(weights, tires, track.surface, condition)

  // Required lateral force per axle (proportional to weight on that axle)
  const frontWeight = weights.lf + weights.rf
  const rearWeight = weights.lr + weights.rr
  const totalWeight = frontWeight + rearWeight
  const requiredForce = totalWeight * lateralG
  const requiredFront = requiredForce * (frontWeight / totalWeight)
  const requiredRear = requiredForce * (rearWeight / totalWeight)

  const gripMarginFront = frontGrip - requiredFront
  const gripMarginRear = rearGrip - requiredRear

  // Understeer gradient: positive = push, negative = loose
  // Normalized difference in grip margin as fraction of required force
  const understeerGradient = totalWeight > 0
    ? (gripMarginRear - gripMarginFront) / totalWeight
    : 0

  const limitingAxle: 'front' | 'rear' = gripMarginFront < gripMarginRear ? 'front' : 'rear'

  return {
    maxSpeedMph: speedMph,
    limitingAxle,
    lateralG,
    gripMarginFront,
    gripMarginRear,
    understeerGradient,
  }
}

/**
 * Find the maximum cornering speed before the limiting axle loses grip.
 * Binary search between 10 and 100 mph.
 */
export function calcMaxCornerSpeed(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  condition: TrackCondition,
): CorneringResult {
  let low = 5
  let high = 100
  let bestResult = calcHandlingBalance(vehicle, tires, track, low, condition)

  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2
    const result = calcHandlingBalance(vehicle, tires, track, mid, condition)
    const minMargin = Math.min(result.gripMarginFront, result.gripMarginRear)

    if (minMargin > 0) {
      low = mid
      bestResult = result
    } else {
      high = mid
    }
  }

  return {
    ...bestResult,
    maxSpeedMph: Math.round((low + high) / 2 * 10) / 10,
  }
}

/**
 * Balance curve: understeer gradient across a speed range.
 * Shows how handling changes with speed.
 */
export function calcBalanceSensitivity(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  condition: TrackCondition,
): BalancePoint[] {
  const maxResult = calcMaxCornerSpeed(vehicle, tires, track, condition)
  const maxSpeed = Math.min(maxResult.maxSpeedMph, 80)
  const minSpeed = 15
  const step = Math.max((maxSpeed - minSpeed) / 10, 2)

  const points: BalancePoint[] = []
  for (let speed = minSpeed; speed <= maxSpeed; speed += step) {
    const result = calcHandlingBalance(vehicle, tires, track, speed, condition)
    points.push({
      speedMph: Math.round(speed * 10) / 10,
      gradient: Math.round(result.understeerGradient * 10000) / 10000,
    })
  }

  return points
}
```

**Step 4: Run tests**

Run: `npm test -- src/data/calculators/__tests__/cornering-balance.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/calculators/cornering-balance.ts src/data/calculators/__tests__/cornering-balance.test.ts
git commit -m "Add cornering balance — max speed, understeer gradient, balance curve"
```

---

### Task 7: Traction Limit

Connects engine torque to rear tire grip using the friction circle.

**Files:**
- Create: `src/data/calculators/traction-limit.ts`
- Create: `src/data/calculators/__tests__/traction-limit.test.ts`

**Step 1: Write failing tests**

Create `src/data/calculators/__tests__/traction-limit.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  calcAvailableTraction,
  calcRequiredDriveForce,
  calcTractionBalance,
} from '../traction-limit'
import type { VehicleParams, TireModelParams, TrackGeometry } from '@/lib/types'

const vehicle: VehicleParams = {
  totalWeight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  cgHeight: 20,
  frontWeightPct: 0.53,
  leftWeightPct: 0.50,
  frontSpringRate: 900,
  rearSpringRate: 200,
  frontRollCenterHeight: 4,
  rearRollCenterHeight: 8,
}

const tires: TireModelParams = {
  compound: 'hoosier-g60',
  baseMu: 0.90,
  loadSensitivity: 0.00015,
  pressureLF: 14,
  pressureRF: 14,
  pressureLR: 13,
  pressureRR: 13,
  optimalPressureFront: 14,
  optimalPressureRear: 13,
  diameter: 27,
}

const track: TrackGeometry = {
  cornerRadius: 85,
  banking: 5,
  straightLength: 200,
  surface: 'mixed',
}

describe('calcAvailableTraction', () => {
  it('returns a positive grip force', () => {
    const grip = calcAvailableTraction(800, tires, 'mixed', 'moderate')
    expect(grip).toBeGreaterThan(0)
  })

  it('increases with more rear axle load', () => {
    const light = calcAvailableTraction(600, tires, 'mixed', 'moderate')
    const heavy = calcAvailableTraction(1000, tires, 'mixed', 'moderate')
    expect(heavy).toBeGreaterThan(light)
  })
})

describe('calcRequiredDriveForce', () => {
  it('calculates force at the contact patch', () => {
    // 300 ft-lbs * 3.73 * 1.0 / (27/2/12) = 1119 / 1.125 ≈ 994.7 lbs
    const force = calcRequiredDriveForce(300, 1.0, 3.73, 27)
    expect(force).toBeCloseTo(994.7, 0)
  })

  it('scales with gear ratio', () => {
    const low = calcRequiredDriveForce(300, 1.0, 3.73, 27)
    const high = calcRequiredDriveForce(300, 2.5, 3.73, 27)
    expect(high).toBeGreaterThan(low)
  })
})

describe('calcTractionBalance', () => {
  it('detects traction-limited condition with high torque', () => {
    const result = calcTractionBalance(
      vehicle, tires, track,
      400, // high torque
      1.0, 3.73,
      30, // corner exit speed
      'moderate',
    )
    expect(result.tractionLimited).toBeDefined()
    expect(result.maxUsableTorque).toBeGreaterThan(0)
  })

  it('is not traction-limited with low torque', () => {
    const result = calcTractionBalance(
      vehicle, tires, track,
      100, // very low torque
      1.0, 3.73,
      30,
      'moderate',
    )
    expect(result.tractionLimited).toBe(false)
    expect(result.tractionMargin).toBeGreaterThan(0)
  })

  it('reports combined demand from friction circle', () => {
    const result = calcTractionBalance(
      vehicle, tires, track,
      300, 1.0, 3.73, 35, 'moderate',
    )
    // Combined should be sqrt(drive^2 + lateral^2)
    const expected = Math.sqrt(
      result.driveForce * result.driveForce +
      result.lateralForceRequired * result.lateralForceRequired,
    )
    expect(result.combinedDemand).toBeCloseTo(expected, 0)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/calculators/__tests__/traction-limit.test.ts`
Expected: FAIL

**Step 3: Implement traction-limit.ts**

Create `src/data/calculators/traction-limit.ts`:

```ts
import type {
  VehicleParams,
  TireModelParams,
  TrackGeometry,
  TrackCondition,
  TractionResult,
} from '@/lib/types'
import { getEffectiveGrip } from './tire-model'
import { calcCornerWeightsAtSpeed } from './load-transfer'
import { calcRollDistribution } from './roll-couple'

// ============================================================
// Traction Limit Calculator
//
// Connects engine output to rear tire grip using the friction
// circle. On corner exit, the rear tires must simultaneously
// provide lateral grip (still turning) AND longitudinal grip
// (accelerating). The combined demand can't exceed total grip.
//
// driveForce = (torque * gearRatio * rearGearRatio) / tireRadius
// combined = sqrt(driveForce^2 + lateralForce^2)
// tractionLimited = combined > availableGrip
// ============================================================

const G = 32.174

/**
 * Total grip force available at the rear axle.
 * Sum of left rear + right rear grip (force = mu * load).
 */
export function calcAvailableTraction(
  rearAxleLoad: number,
  tires: TireModelParams,
  surface: TrackGeometry['surface'],
  condition: TrackCondition,
): number {
  // Split rear load evenly (simplified — in reality dynamic weights differ L/R)
  const perTire = rearAxleLoad / 2

  const gripL = getEffectiveGrip(
    perTire, tires.baseMu, tires.loadSensitivity,
    tires.pressureLR, tires.optimalPressureRear, surface, condition,
  ) * perTire

  const gripR = getEffectiveGrip(
    perTire, tires.baseMu, tires.loadSensitivity,
    tires.pressureRR, tires.optimalPressureRear, surface, condition,
  ) * perTire

  return gripL + gripR
}

/**
 * Drive force at the contact patch in lbs.
 * Converts engine torque through the drivetrain to force at the tire.
 */
export function calcRequiredDriveForce(
  engineTorque: number,    // ft-lbs
  gearRatio: number,       // transmission gear
  rearGearRatio: number,   // rear axle ratio
  tireDiameter: number,    // inches
): number {
  const tireRadiusFt = tireDiameter / 2 / 12
  return (engineTorque * gearRatio * rearGearRatio) / tireRadiusFt
}

/**
 * Traction balance at corner exit.
 * Combines lateral demand (still turning) with longitudinal demand (accelerating)
 * using the friction circle.
 */
export function calcTractionBalance(
  vehicle: VehicleParams,
  tires: TireModelParams,
  track: TrackGeometry,
  engineTorque: number,
  gearRatio: number,
  rearGearRatio: number,
  exitSpeedMph: number,
  condition: TrackCondition,
): TractionResult {
  // Lateral g at exit speed
  const speedFps = exitSpeedMph * 5280 / 3600
  const bankingRad = track.banking * Math.PI / 180
  const lateralG = Math.max(
    (speedFps * speedFps) / (track.cornerRadius * G) - Math.tan(bankingRad),
    0,
  )

  // Dynamic corner weights at exit (slight acceleration = negative longitudinal g)
  const rollDist = calcRollDistribution(vehicle)
  const weights = calcCornerWeightsAtSpeed(vehicle, lateralG, -0.15, rollDist)

  // Rear axle load
  const rearAxleLoad = weights.lr + weights.rr

  // Available grip
  const availableGrip = calcAvailableTraction(rearAxleLoad, tires, track.surface, condition)

  // Drive force
  const driveForce = calcRequiredDriveForce(engineTorque, gearRatio, rearGearRatio, tires.diameter)

  // Lateral force required at rear axle
  const rearWeightFraction = rearAxleLoad / vehicle.totalWeight
  const lateralForceRequired = vehicle.totalWeight * lateralG * rearWeightFraction

  // Friction circle: combined demand
  const combinedDemand = Math.sqrt(
    driveForce * driveForce + lateralForceRequired * lateralForceRequired,
  )

  const tractionMargin = availableGrip - combinedDemand
  const tractionLimited = tractionMargin < 0

  // Max usable torque: solve for torque where combined = available
  // available^2 = drive^2 + lateral^2
  // drive^2 = available^2 - lateral^2
  const maxDriveForce = Math.sqrt(
    Math.max(availableGrip * availableGrip - lateralForceRequired * lateralForceRequired, 0),
  )
  const tireRadiusFt = tires.diameter / 2 / 12
  const overallRatio = gearRatio * rearGearRatio
  const maxUsableTorque = overallRatio > 0
    ? (maxDriveForce * tireRadiusFt) / overallRatio
    : 0

  return {
    rearAxleLoad,
    availableGrip,
    driveForce,
    lateralForceRequired,
    combinedDemand,
    tractionMargin,
    tractionLimited,
    maxUsableTorque: Math.round(maxUsableTorque),
  }
}
```

**Step 4: Run tests**

Run: `npm test -- src/data/calculators/__tests__/traction-limit.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/calculators/traction-limit.ts src/data/calculators/__tests__/traction-limit.test.ts
git commit -m "Add traction limit — friction circle, max usable torque"
```

---

### Task 8: Vehicle Dynamics Orchestrator

Chains all layers and produces the complete analysis with physics insights.

**Files:**
- Create: `src/data/calculators/vehicle-dynamics.ts`
- Create: `src/data/calculators/__tests__/vehicle-dynamics.test.ts`

**Step 1: Write failing tests**

Create `src/data/calculators/__tests__/vehicle-dynamics.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { analyzeVehicleDynamics } from '../vehicle-dynamics'
import type { VehicleParams, TireModelParams, TrackGeometry } from '@/lib/types'

const vehicle: VehicleParams = {
  totalWeight: 3300,
  wheelbase: 116,
  trackWidthFront: 61.5,
  trackWidthRear: 59.5,
  cgHeight: 20,
  frontWeightPct: 0.53,
  leftWeightPct: 0.50,
  frontSpringRate: 900,
  rearSpringRate: 200,
  frontRollCenterHeight: 4,
  rearRollCenterHeight: 8,
}

const tires: TireModelParams = {
  compound: 'hoosier-g60',
  baseMu: 0.90,
  loadSensitivity: 0.00015,
  pressureLF: 14,
  pressureRF: 14,
  pressureLR: 13,
  pressureRR: 13,
  optimalPressureFront: 14,
  optimalPressureRear: 13,
  diameter: 27,
}

const track: TrackGeometry = {
  cornerRadius: 85,
  banking: 5,
  straightLength: 200,
  surface: 'mixed',
}

describe('analyzeVehicleDynamics', () => {
  it('returns a complete result with all fields', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    expect(result.staticWeights).toBeDefined()
    expect(result.dynamicWeights).toBeDefined()
    expect(result.gripPerTire).toBeDefined()
    expect(result.rollDistributionFront).toBeGreaterThan(0)
    expect(result.rollAngleDeg).toBeGreaterThan(0)
    expect(result.maxCornerSpeedMph).toBeGreaterThan(0)
    expect(result.lateralG).toBeGreaterThan(0)
    expect(result.understeerGradient).toBeDefined()
    expect(result.balanceCurve.length).toBeGreaterThan(0)
    expect(result.physicsInsights.length).toBeGreaterThan(0)
  })

  it('preserves total weight in static weights', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    const total = result.staticWeights.lf + result.staticWeights.rf +
                  result.staticWeights.lr + result.staticWeights.rr
    expect(total).toBeCloseTo(3300, 0)
  })

  it('preserves total weight in dynamic weights', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    const total = result.dynamicWeights.lf + result.dynamicWeights.rf +
                  result.dynamicWeights.lr + result.dynamicWeights.rr
    expect(total).toBeCloseTo(3300, 0)
  })

  it('generates insights about roll distribution', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    const rollInsight = result.physicsInsights.find(i => i.category === 'springs')
    expect(rollInsight).toBeDefined()
  })

  it('includes traction data when engine params are provided', () => {
    const withEngine: VehicleParams = {
      ...vehicle,
      peakTorque: 300,
      peakTorqueRpm: 3800,
    }
    const result = analyzeVehicleDynamics(withEngine, tires, track, 'moderate', 'oval')
    expect(result.traction).toBeDefined()
    expect(result.traction!.maxUsableTorque).toBeGreaterThan(0)
  })

  it('omits traction data when no engine params', () => {
    const result = analyzeVehicleDynamics(vehicle, tires, track, 'moderate', 'figure-8')
    expect(result.traction).toBeUndefined()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/calculators/__tests__/vehicle-dynamics.test.ts`
Expected: FAIL

**Step 3: Implement vehicle-dynamics.ts**

Create `src/data/calculators/vehicle-dynamics.ts`:

```ts
import type {
  VehicleParams,
  TireModelParams,
  TrackGeometry,
  TrackCondition,
  RaceType,
  StaticCornerWeights,
  VehicleDynamicsResult,
  PhysicsInsight,
} from '@/lib/types'
import { getEffectiveGrip } from './tire-model'
import { calcCornerWeightsAtSpeed } from './load-transfer'
import { calcRollDistribution, calcRollAngle } from './roll-couple'
import { calcMaxCornerSpeed, calcBalanceSensitivity, calcHandlingBalance } from './cornering-balance'
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
```

**Step 4: Run tests**

Run: `npm test -- src/data/calculators/__tests__/vehicle-dynamics.test.ts`
Expected: PASS

**Step 5: Run all tests**

Run: `npm test`
Expected: ALL PASS

**Step 6: Commit**

```bash
git add src/data/calculators/vehicle-dynamics.ts src/data/calculators/__tests__/vehicle-dynamics.test.ts
git commit -m "Add vehicle dynamics orchestrator — complete physics analysis pipeline"
```

---

### Task 9: Tire Compound Physics Data

Extend existing tire compound definitions with `baseMu` and `loadSensitivity` for the tire model.

**Files:**
- Modify: `src/data/setup/tires.ts` (add physics fields to TireCompound interface and data)
- Create: `src/data/calculators/__tests__/tire-compound-physics.test.ts`
- Modify: `src/data/calculators/tire-model.ts` (add helper to build TireModelParams from TireCompound)

**Step 1: Write failing test**

Create `src/data/calculators/__tests__/tire-compound-physics.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildTireModelParams } from '../tire-model'
import { getTireCompound } from '@/data/setup/tires'

describe('buildTireModelParams', () => {
  it('builds params for Hoosier G60 on mixed surface', () => {
    const compound = getTireCompound('hoosier-g60')!
    const params = buildTireModelParams(compound, 'mixed', {
      pressureLF: 14, pressureRF: 14, pressureLR: 13, pressureRR: 13,
      diameter: 27,
    })
    expect(params.baseMu).toBeGreaterThan(0)
    expect(params.loadSensitivity).toBeGreaterThan(0)
    expect(params.optimalPressureFront).toBeGreaterThan(0)
  })

  it('uses dirt baseMu on dirt surface', () => {
    const compound = getTireCompound('hoosier-g60')!
    const dirt = buildTireModelParams(compound, 'dirt', {
      pressureLF: 14, pressureRF: 14, pressureLR: 13, pressureRR: 13,
      diameter: 27,
    })
    const asphalt = buildTireModelParams(compound, 'asphalt', {
      pressureLF: 24, pressureRF: 24, pressureLR: 22, pressureRR: 22,
      diameter: 27,
    })
    expect(dirt.baseMu).not.toBe(asphalt.baseMu)
  })

  it('sets optimal pressure from midpoint of effective range', () => {
    const compound = getTireCompound('hoosier-g60')!
    const params = buildTireModelParams(compound, 'dirt', {
      pressureLF: 14, pressureRF: 14, pressureLR: 13, pressureRR: 13,
      diameter: 27,
    })
    // G60 dirt front range: 12-16, midpoint = 14
    expect(params.optimalPressureFront).toBe(14)
  })

  it('works for all tire compounds', () => {
    const ids = [
      'hoosier-g60', 'hoosier-d55', 'hoosier-d40', 'hoosier-d25',
      'hoosier-f45', 'hoosier-f35', 'american-racer-33', 'american-racer-44',
      'american-racer-56', 'tct-recap', 'dot-street',
    ]
    for (const id of ids) {
      const compound = getTireCompound(id)!
      const params = buildTireModelParams(compound, 'mixed', {
        pressureLF: 20, pressureRF: 20, pressureLR: 18, pressureRR: 18,
        diameter: 27,
      })
      expect(params.baseMu).toBeGreaterThan(0.5)
      expect(params.loadSensitivity).toBeGreaterThan(0)
    }
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/data/calculators/__tests__/tire-compound-physics.test.ts`
Expected: FAIL

**Step 3: Add physics data to tire compounds**

Add to `TireCompound` interface in `src/data/setup/tires.ts`:

```ts
export interface TireCompound {
  // ... existing fields ...
  /** Base friction coefficient by surface type */
  gripProfile: {
    dirt: number
    asphalt: number
    concrete: number
    mixed: number
  }
  /** Grip dropoff per lb of additional vertical load */
  loadSensitivity: number
}
```

Update each compound in the `tireCompounds` array with physics data. Example for Hoosier G60:

```ts
{
  id: 'hoosier-g60',
  // ... existing fields ...
  gripProfile: { dirt: 1.10, asphalt: 0.95, concrete: 0.85, mixed: 0.90 },
  loadSensitivity: 0.00015,
},
```

Physics values by compound type:
- Soft dirt (D25, AR 44): `{ dirt: 1.15, asphalt: 0.80, concrete: 0.75, mixed: 0.78 }`, loadSens: `0.00018`
- Medium dirt (D40, AR 33): `{ dirt: 1.10, asphalt: 0.82, concrete: 0.77, mixed: 0.80 }`, loadSens: `0.00016`
- Hard dirt (D55): `{ dirt: 1.05, asphalt: 0.85, concrete: 0.80, mixed: 0.82 }`, loadSens: `0.00014`
- Dual surface (G60): `{ dirt: 1.10, asphalt: 0.95, concrete: 0.85, mixed: 0.90 }`, loadSens: `0.00015`
- Asphalt (F45): `{ dirt: 0.85, asphalt: 1.05, concrete: 0.95, mixed: 1.00 }`, loadSens: `0.00013`
- Asphalt soft (F35, AR 56): `{ dirt: 0.80, asphalt: 1.10, concrete: 1.00, mixed: 1.05 }`, loadSens: `0.00014`
- Recap (TCT): `{ dirt: 1.00, asphalt: 0.80, concrete: 0.75, mixed: 0.78 }`, loadSens: `0.00018`
- DOT Street: `{ dirt: 0.70, asphalt: 0.80, concrete: 0.75, mixed: 0.78 }`, loadSens: `0.00012`

**Step 4: Add buildTireModelParams to tire-model.ts**

Add to `src/data/calculators/tire-model.ts`:

```ts
import type { TireModelParams, TrackSurface } from '@/lib/types'
import type { TireCompound } from '@/data/setup/tires'
import { getEffectivePressureRange } from '@/data/setup/tires'

interface TireModelOverrides {
  pressureLF: number
  pressureRF: number
  pressureLR: number
  pressureRR: number
  diameter: number
}

/**
 * Build TireModelParams from a tire compound and surface.
 * Bridges the existing tire compound data to the physics engine.
 */
export function buildTireModelParams(
  compound: TireCompound,
  surface: TrackSurface,
  overrides: TireModelOverrides,
): TireModelParams {
  const effectiveSurface = (surface === 'concrete' || surface === 'mixed') ? 'asphalt' : surface
  const surfaceKey = effectiveSurface === 'asphalt' ? 'asphalt' : 'dirt'
  const effRange = getEffectivePressureRange(compound, surface)

  return {
    compound: compound.id,
    baseMu: compound.gripProfile[surface] ?? compound.gripProfile.mixed,
    loadSensitivity: compound.loadSensitivity,
    pressureLF: overrides.pressureLF,
    pressureRF: overrides.pressureRF,
    pressureLR: overrides.pressureLR,
    pressureRR: overrides.pressureRR,
    optimalPressureFront: (effRange.front[0] + effRange.front[1]) / 2,
    optimalPressureRear: (effRange.rear[0] + effRange.rear[1]) / 2,
    diameter: overrides.diameter,
  }
}
```

**Step 5: Run tests**

Run: `npm test -- src/data/calculators/__tests__/tire-compound-physics.test.ts`
Expected: PASS

**Step 6: Run all tests**

Run: `npm test`
Expected: ALL PASS

**Step 7: Commit**

```bash
git add src/data/setup/tires.ts src/data/calculators/tire-model.ts src/data/calculators/__tests__/tire-compound-physics.test.ts
git commit -m "Add physics grip profiles to tire compounds, bridge to tire model"
```

---

### Task 10: Integration — AI Crew Chief Physics Context

Feed `VehicleDynamicsResult` into the AI crew chief prompt.

**Files:**
- Modify: `src/app/api/setup/recommend/route.ts`

**Step 1: Read the current route.ts** (already read — `src/app/api/setup/recommend/route.ts`)

**Step 2: Add physics context to the prompt**

At the top of `route.ts`, add imports:

```ts
import { analyzeVehicleDynamics } from '@/data/calculators/vehicle-dynamics'
import { buildVehicleParams } from '@/data/calculators/vehicle-defaults'
import { buildTireModelParams } from '@/data/calculators/tire-model'
```

After the `detRecs` calculation (around line 231), add:

```ts
// Run physics analysis for AI context
let physicsContext = ''
try {
  const vehicleParams = buildVehicleParams(carForRecs, {
    frontSpringRate: detRecs.springs[0]?.value as number ?? 900,
    rearSpringRate: detRecs.springs[2]?.value as number ?? 200,
  })

  const tireModelParams = tireCompound
    ? buildTireModelParams(tireCompound, (trackSurface ?? 'mixed') as TrackSurface, {
        pressureLF: detRecs.tirePressures[0]?.value as number ?? 14,
        pressureRF: detRecs.tirePressures[1]?.value as number ?? 14,
        pressureLR: detRecs.tirePressures[2]?.value as number ?? 13,
        pressureRR: detRecs.tirePressures[3]?.value as number ?? 13,
        diameter: 27,
      })
    : undefined

  if (tireModelParams) {
    // Estimate track geometry from track data
    const trackLengthMiles = body.track?.length ? parseFloat(body.track.length) : 0.2
    const trackLengthFt = trackLengthMiles * 5280
    // Rough estimate: corners are ~40% of track length, 2 corners
    const cornerArcLength = trackLengthFt * 0.4 / 2
    const cornerRadius = cornerArcLength / (Math.PI / 2) // ~90° corners
    const trackGeo: TrackGeometry = {
      cornerRadius,
      banking: body.track?.banking ?? 5,
      straightLength: trackLengthFt * 0.3,
      surface: (trackSurface ?? 'mixed') as TrackSurface,
    }

    const dynamics = analyzeVehicleDynamics(
      vehicleParams, tireModelParams, trackGeo, condition, raceType,
    )

    physicsContext = `
**Vehicle Dynamics Analysis (calculated):**
- Roll distribution: ${(dynamics.rollDistributionFront * 100).toFixed(1)}% front
- Roll angle at 0.75g: ${dynamics.rollAngleDeg.toFixed(1)}°
- Max corner speed: ${dynamics.maxCornerSpeedMph.toFixed(1)} mph
- Lateral g at limit: ${dynamics.lateralG.toFixed(2)}g
- Limiting axle: ${dynamics.limitingAxle}
- Understeer gradient: ${dynamics.understeerGradient > 0 ? 'push' : 'loose'} (${dynamics.understeerGradient.toFixed(4)})
${dynamics.traction ? `- Traction margin on exit: ${dynamics.traction.tractionMargin.toFixed(0)} lbs (${dynamics.traction.tractionLimited ? 'TRACTION LIMITED' : 'within grip'})
- Max usable torque: ${dynamics.traction.maxUsableTorque} ft-lbs` : ''}

**Physics insights:**
${dynamics.physicsInsights.map(i => `- [${i.severity.toUpperCase()}] ${i.finding} → ${i.suggestion}`).join('\n')}`
  }
} catch {
  // Physics analysis is supplementary — don't fail the request
}
```

Insert `${physicsContext}` into the `userPrompt` template string, after the reference ranges section.

**Step 3: Add TrackGeometry import**

Add to the imports at the top of route.ts:

```ts
import type { TrackSurface, TrackGeometry } from '@/lib/types'
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/app/api/setup/recommend/route.ts
git commit -m "Feed vehicle dynamics analysis into AI crew chief prompt"
```

---

### Task 11: Verify Full Integration

End-to-end verification that everything works together.

**Step 1: Run all tests**

Run: `npm test`
Expected: ALL PASS

**Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Run lint**

Run: `npm run lint`
Expected: No errors (or only pre-existing warnings)

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit any fixes**

If any of the above required fixes, commit them:

```bash
git add -A
git commit -m "Fix integration issues from vehicle dynamics engine"
```
