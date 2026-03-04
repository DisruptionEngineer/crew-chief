// ============================================================
// Common enums and union types shared across the app
// ============================================================

export type RaceClass =
  | 'ironman-f8'
  | 'old-school-f8'
  | 'street-stock'
  | 'compacts'
  | 'juicebox'

export type SuspensionType = 'sla-coil' | 'solid-axle-coil' | 'solid-axle-leaf' | 'watts-link' | 'macpherson-strut' | 'torsion-beam'
export type TrackCondition = 'heavy' | 'tacky' | 'moderate' | 'dry' | 'slick'
export type RaceType = 'figure-8' | 'oval'
export type EventType = 'practice' | 'qualifying' | 'heat' | 'feature'
export type HandlingFeel = 'tight' | 'neutral' | 'loose'
export type TrackSurface = 'asphalt' | 'concrete' | 'dirt' | 'mixed'
export type ExperienceLevel = 'rookie' | 'intermediate' | 'experienced'
