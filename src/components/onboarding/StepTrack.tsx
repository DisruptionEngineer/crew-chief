'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TrackSurface } from '@/lib/types'

interface StepTrackProps {
  trackName: string
  trackSurface: TrackSurface | ''
  trackLength: string
  trackBanking: string
  onChange: (field: string, value: string) => void
}

interface DbTrack {
  id: string
  name: string
  location: string
  length: number
  surface: TrackSurface
  banking: number
  state: string
}

const surfaces: { value: TrackSurface; label: string }[] = [
  { value: 'asphalt', label: 'Asphalt' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'dirt', label: 'Dirt' },
  { value: 'mixed', label: 'Mixed' },
]

export function StepTrack({ trackName, trackSurface, trackLength, trackBanking, onChange }: StepTrackProps) {
  const [dbTracks, setDbTracks] = useState<DbTrack[]>([])
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(true)
  const [selectedDbTrackId, setSelectedDbTrackId] = useState<string | null>(null)

  // Fetch tracks from Supabase
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('tracks')
      .select('id, name, location, length, surface, banking, state')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setDbTracks(data as DbTrack[])
      })
  }, [])

  const filtered = search.length >= 2
    ? dbTracks.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase()) ||
        t.state.toLowerCase().includes(search.toLowerCase())
      )
    : dbTracks

  const selectTrack = (track: DbTrack) => {
    setSelectedDbTrackId(track.id)
    onChange('trackName', track.name)
    onChange('trackSurface', track.surface)
    onChange('trackLength', String(track.length))
    onChange('trackBanking', String(track.banking))
    onChange('selectedTrackId', track.id)
    setShowSearch(false)
  }

  const useCustom = () => {
    setSelectedDbTrackId(null)
    setShowSearch(false)
    onChange('selectedTrackId', '')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Home Track</h2>
        <p className="text-sm text-[#7A7A90]">Search our database or enter manually.</p>
      </div>

      {showSearch ? (
        <>
          {/* Search box */}
          <div>
            <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">
              Search Tracks ({dbTracks.length} in database)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by track name, city, or state..."
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.slice(0, 20).map((track) => (
              <button
                key={track.id}
                onClick={() => selectTrack(track)}
                className="w-full p-3 rounded-lg border bg-[#14141F] border-[#2A2A3A] text-left transition-all hover:border-[#00B4FF] hover:bg-[#00B4FF]/5"
              >
                <span className="font-semibold text-[#D4D4E0]">{track.name}</span>
                <span className="text-xs text-[#555570] ml-2">{track.location}</span>
                <div className="flex gap-3 mt-1 text-[10px] text-[#3A3A4A]">
                  <span>{track.length} mi</span>
                  <span>{track.surface}</span>
                  <span>{track.banking}&deg; banking</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && search.length >= 2 && (
              <p className="text-sm text-[#555570] py-4 text-center">No matches found</p>
            )}
          </div>

          {/* Manual entry option */}
          <button
            onClick={useCustom}
            className="w-full py-2 text-sm text-[#7A7A90] hover:text-[#00B4FF] transition-colors"
          >
            My track isn&apos;t listed — enter manually
          </button>
        </>
      ) : (
        <>
          {/* Selected track or manual entry */}
          {selectedDbTrackId && (
            <div className="p-3 rounded-lg border border-[#00B4FF]/30 bg-[#00B4FF]/5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#D4D4E0]">{trackName}</span>
                <button
                  onClick={() => { setShowSearch(true); setSelectedDbTrackId(null) }}
                  className="text-xs text-[#7A7A90] hover:text-[#00B4FF]"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {!selectedDbTrackId && (
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider">Manual Entry</label>
              <button
                onClick={() => setShowSearch(true)}
                className="text-xs text-[#7A7A90] hover:text-[#00B4FF]"
              >
                Search database instead
              </button>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Track Name</label>
            <input
              type="text"
              value={trackName}
              onChange={(e) => onChange('trackName', e.target.value)}
              placeholder="e.g. Eldora Speedway"
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-3">Surface Type</label>
            <div className="grid grid-cols-4 gap-2">
              {surfaces.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onChange('trackSurface', s.value)}
                  className={`py-3 rounded-md text-xs font-semibold uppercase transition-all ${
                    trackSurface === s.value
                      ? 'bg-[#00B4FF] text-[#0A0A0F]'
                      : 'bg-[#1A1A28] text-[#7A7A90] hover:text-[#D4D4E0] border border-[#2A2A3A]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Length</label>
              <input
                type="text"
                value={trackLength}
                onChange={(e) => onChange('trackLength', e.target.value)}
                placeholder="e.g. 0.375"
                className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Banking (degrees)</label>
              <input
                type="number"
                value={trackBanking}
                onChange={(e) => onChange('trackBanking', e.target.value)}
                placeholder="e.g. 5"
                className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
