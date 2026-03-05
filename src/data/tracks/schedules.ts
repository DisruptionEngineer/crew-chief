import { painesvilleSchedule2026, painesvilleGateTimes } from './painesville'
import { mansfieldSchedule2026, mansfieldGateTimes } from './mansfield'

export interface ScheduleEvent {
  date: string        // YYYY-MM-DD
  event: string
  classes: string[]
}

export interface GateTimes {
  pitGates: string    // e.g. "1:00 PM"
  hotLaps: string
  mainGate: string
  racing: string
}

export interface TrackSchedule {
  events: ScheduleEvent[]
  gateTimes: GateTimes
}

// Registry of known track schedules — keyed by track ID
const scheduleRegistry: Record<string, TrackSchedule> = {
  'painesville-oh': {
    events: painesvilleSchedule2026,
    gateTimes: painesvilleGateTimes,
  },
  'mansfield-oh': {
    events: mansfieldSchedule2026,
    gateTimes: mansfieldGateTimes,
  },
}

export function getTrackSchedule(trackId: string): TrackSchedule | null {
  return scheduleRegistry[trackId] ?? null
}

/** Parse "6:00 PM" into { hours: 18, minutes: 0 } */
function parseTimeString(time: string): { hours: number; minutes: number } {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return { hours: 18, minutes: 0 } // default to 6 PM
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

/** Find the next upcoming event for a track, plus its race-time datetime */
export function getNextRaceEvent(trackId: string): {
  event: ScheduleEvent
  raceTime: Date
  hotLapsTime: Date
} | null {
  const schedule = getTrackSchedule(trackId)
  if (!schedule) return null

  const now = new Date()
  const today = now.toISOString().slice(0, 10) // YYYY-MM-DD

  // Find the next event on or after today
  const upcoming = schedule.events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))

  if (upcoming.length === 0) return null

  const event = upcoming[0]
  const racingTime = parseTimeString(schedule.gateTimes.racing)
  const hotLapsTimeParsed = parseTimeString(schedule.gateTimes.hotLaps)

  // Build Date objects from event date + time
  const raceTime = new Date(`${event.date}T00:00:00`)
  raceTime.setHours(racingTime.hours, racingTime.minutes, 0, 0)

  const hotLapsTime = new Date(`${event.date}T00:00:00`)
  hotLapsTime.setHours(hotLapsTimeParsed.hours, hotLapsTimeParsed.minutes, 0, 0)

  return { event, raceTime, hotLapsTime }
}
