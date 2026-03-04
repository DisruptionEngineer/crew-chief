// ============================================================
// Session & Tracking types
// ============================================================

import type { EventType, TrackCondition, HandlingFeel } from './common'

export interface SetupChange {
  parameter: string
  from: string
  to: string
  notes: string
}

export interface Weather {
  temp: number
  humidity: number
  wind: string
}

export interface Session {
  id: string
  carId: string
  trackId: string
  setupId: string
  date: string
  eventType: EventType
  weather: Weather
  trackCondition: TrackCondition
  handlingEntry: HandlingFeel
  handlingMid: HandlingFeel
  handlingExit: HandlingFeel
  lapTimes: number[]
  bestLap: number
  finishPosition?: number
  startPosition?: number
  changesMade: SetupChange[]
  notes: string
}

export interface Track {
  id: string
  name: string
  location: string
  length: string
  surface: import('./common').TrackSurface
  surfaceDetails: string
  banking: number
  shape: string
  elevation: number
  notes: string
}

export interface UserProfile {
  id: string
  clerkUserId: string
  displayName: string
  experienceLevel: import('./common').ExperienceLevel
  carId: string
  homeTrackId: string
  onboardingComplete: boolean
  createdAt: string
}
