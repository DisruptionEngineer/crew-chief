import type { TrackSurface } from '@/lib/types'

interface StepTrackProps {
  trackName: string
  trackSurface: TrackSurface | ''
  trackLength: string
  trackBanking: string
  onChange: (field: string, value: string) => void
}

const surfaces: { value: TrackSurface; label: string }[] = [
  { value: 'asphalt', label: 'Asphalt' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'dirt', label: 'Dirt' },
  { value: 'mixed', label: 'Mixed' },
]

export function StepTrack({ trackName, trackSurface, trackLength, trackBanking, onChange }: StepTrackProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Home Track</h2>
        <p className="text-sm text-[#888]">Where do you race?</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Track Name</label>
        <input
          type="text"
          value={trackName}
          onChange={(e) => onChange('trackName', e.target.value)}
          placeholder="e.g. Eldora Speedway"
          className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-3">Surface Type</label>
        <div className="grid grid-cols-4 gap-2">
          {surfaces.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange('trackSurface', s.value)}
              className={`py-3 rounded-md text-xs font-semibold uppercase transition-all ${
                trackSurface === s.value
                  ? 'bg-[#FF8A00] text-[#0D0D0D]'
                  : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Length</label>
          <input
            type="text"
            value={trackLength}
            onChange={(e) => onChange('trackLength', e.target.value)}
            placeholder="e.g. 1/5 mile"
            className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Banking (degrees)</label>
          <input
            type="number"
            value={trackBanking}
            onChange={(e) => onChange('trackBanking', e.target.value)}
            placeholder="e.g. 5"
            className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
          />
        </div>
      </div>
    </div>
  )
}
