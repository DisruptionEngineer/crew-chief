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
        <h2 className="text-2xl font-bold mb-1">Welcome to Tenths</h2>
        <p className="text-sm text-[#7A7A90]">Let&apos;s set up your driver profile.</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Your Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => onChange('displayName', e.target.value)}
          placeholder="e.g. Fast Eddie"
          className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-4 py-3 text-[#D4D4E0] placeholder:text-[#3A3A4A] focus:outline-none focus:ring-2 focus:ring-[#00B4FF] focus:border-transparent"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-3">Experience Level</label>
        <div className="space-y-2">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => onChange('experienceLevel', lvl.value)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                experienceLevel === lvl.value
                  ? 'bg-[#00B4FF]/10 border-[#00B4FF] text-[#D4D4E0]'
                  : 'bg-[#14141F] border-[#2A2A3A] text-[#7A7A90] hover:border-[#3A3A4A]'
              }`}
            >
              <span className="font-semibold text-sm">{lvl.label}</span>
              <p className="text-xs text-[#555570] mt-0.5">{lvl.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
