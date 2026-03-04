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

const painesvillePreset = {
  name: 'Painesville Speedway',
  surface: 'mixed' as TrackSurface,
  length: '1/5 mile',
  banking: '5',
}

export function StepTrack({ trackName, trackSurface, trackLength, trackBanking, onChange }: StepTrackProps) {
  const fillPainesville = () => {
    onChange('trackName', painesvillePreset.name)
    onChange('trackSurface', painesvillePreset.surface)
    onChange('trackLength', painesvillePreset.length)
    onChange('trackBanking', painesvillePreset.banking)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Home Track</h2>
        <p className="text-sm text-[#888]">Where do you race?</p>
      </div>

      {/* Quick-select */}
      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Quick Select</label>
        <button
          onClick={fillPainesville}
          className={`w-full p-3 rounded-lg border text-left transition-all text-sm ${
            trackName === 'Painesville Speedway'
              ? 'bg-[#FFD600]/10 border-[#FFD600] text-[#F5F5F5]'
              : 'bg-[#1A1A1A] border-[#333] text-[#888] hover:border-[#555]'
          }`}
        >
          <span className="font-semibold">Painesville Speedway</span>
          <p className="text-[10px] text-[#666] mt-0.5">1/5 mile — Mixed (asphalt/concrete) — 5° banking</p>
        </button>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Track Name</label>
        <input
          type="text"
          value={trackName}
          onChange={(e) => onChange('trackName', e.target.value)}
          placeholder="e.g. Painesville Speedway"
          className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
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
                  ? 'bg-[#FFD600] text-[#0D0D0D]'
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
            className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Banking (degrees)</label>
          <input
            type="number"
            value={trackBanking}
            onChange={(e) => onChange('trackBanking', e.target.value)}
            placeholder="e.g. 5"
            className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
          />
        </div>
      </div>
    </div>
  )
}
