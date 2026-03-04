import type { ExperienceLevel } from '@/lib/types'

interface StepDriverProps {
  displayName: string
  experienceLevel: ExperienceLevel | ''
  onChange: (field: string, value: string) => void
}

const levels: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'rookie', label: 'Rookie', desc: 'First few seasons, still learning' },
  { value: 'intermediate', label: 'Intermediate', desc: 'A few seasons under my belt' },
  { value: 'experienced', label: 'Experienced', desc: 'Multiple seasons, know my way around' },
]

export function StepDriver({ displayName, experienceLevel, onChange }: StepDriverProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Welcome to Crew Chief</h2>
        <p className="text-sm text-[#888]">Let&apos;s set up your driver profile.</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Your Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => onChange('displayName', e.target.value)}
          placeholder="e.g. Flyin Finn"
          className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-transparent"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-3">Experience Level</label>
        <div className="space-y-2">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => onChange('experienceLevel', lvl.value)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                experienceLevel === lvl.value
                  ? 'bg-[#FFD600]/10 border-[#FFD600] text-[#F5F5F5]'
                  : 'bg-[#1A1A1A] border-[#333] text-[#888] hover:border-[#555]'
              }`}
            >
              <span className="font-semibold text-sm">{lvl.label}</span>
              <p className="text-xs text-[#666] mt-0.5">{lvl.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
