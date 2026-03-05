import type { Track } from '@/lib/types'

// ============================================================
// Mansfield Motor Speedway
// "The Speedway" — Mansfield, OH
// 0.440-mile semi-banked dirt oval
// Reopening 2026 under new management
// https://thespeedway.com/
// ============================================================

export const mansfieldSpeedway: Track = {
  id: 'mansfield',
  name: 'Mansfield Motor Speedway',
  location: '1478 OH-97 W, Mansfield, OH 44906',
  length: '0.440 mile',
  surface: 'dirt',
  surfaceDetails: 'Clay dirt oval. Track conditions change dramatically throughout the night — starts heavy/tacky and transitions to dry/slick. Setup adaptability is key. Heavy watering before events.',
  banking: 16,
  shape: 'Semi-banked oval',
  elevation: 1240,
  latitude: 40.7989,
  longitude: -82.5393,
  notes: 'One of Ohio\'s premier dirt ovals. Reopening in 2026 with major facility upgrades. High banking (16°) rewards cars that can get through the middle and carry speed off the corners. Track elevation ~1,240 ft — slightly thinner air than lake-level Painesville.',
}

export const mansfieldSchedule2026 = [
  { date: '2026-04-25', event: 'Season Opener', classes: ['Late Models', 'Street Stocks', 'Compacts'] },
  { date: '2026-05-09', event: 'Weekly Racing', classes: ['Late Models', 'Street Stocks', 'Compacts'] },
  { date: '2026-05-23', event: 'Weekly Racing', classes: ['Late Models', 'Street Stocks', 'Compacts'] },
]

export const mansfieldGateTimes = {
  pitGates: '3:00 PM',
  hotLaps: '5:00 PM',
  mainGate: '4:00 PM',
  racing: '7:00 PM',
}

export const mansfieldGatePrices = {
  pits: 30,
  adults: 15,
  seniors: 10,
  kids6to12: 5,
  kids5under: 0,
}
