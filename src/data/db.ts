import Dexie, { type Table } from 'dexie'
import type { Car, SetupSheet, Session, Track, UserProfile, SavedEngineBuild } from '@/lib/types'

export class CrewChiefDB extends Dexie {
  cars!: Table<Car>
  setups!: Table<SetupSheet>
  sessions!: Table<Session>
  tracks!: Table<Track>
  techChecks!: Table<{ id: string; carId: string; items: Record<string, boolean> }>
  userProfiles!: Table<UserProfile>
  engineBuilds!: Table<SavedEngineBuild>

  constructor() {
    super('CrewChiefDB')
    this.version(1).stores({
      cars: 'id, class',
      setups: 'id, carId, date',
      sessions: 'id, carId, trackId, date',
      tracks: 'id',
      techChecks: 'id, carId',
    })
    this.version(2).stores({
      cars: 'id, class',
      setups: 'id, carId, date',
      sessions: 'id, carId, trackId, date',
      tracks: 'id',
      techChecks: 'id, carId',
      userProfiles: 'id, clerkUserId',
    })
    this.version(3).stores({
      cars: 'id, class',
      setups: 'id, carId, date',
      sessions: 'id, carId, trackId, date',
      tracks: 'id',
      techChecks: 'id, carId',
      userProfiles: 'id, clerkUserId',
      engineBuilds: 'id, createdAt',
    })
  }
}

export const db = new CrewChiefDB()
