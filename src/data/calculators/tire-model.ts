import type { TrackCondition, TrackSurface } from '@/lib/types'
import type { TireModelParams } from '@/lib/types/vehicle-dynamics'
import type { TireCompound } from '@/data/setup/tires'
import { getEffectivePressureRange } from '@/data/setup/tires'

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
