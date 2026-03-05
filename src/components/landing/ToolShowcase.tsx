import type { ReactNode } from 'react'

interface MiniToolCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function ToolShowcase() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Primary tool previews with visual mockups */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <TroubleshooterPreview />
        <EngineSimPreview />
        <SessionLogPreview />
      </div>

      {/* Additional tools */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <MiniToolCard
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          }
          title="Corner Weight"
          description="Cross-weight percentage with bolt-turn recommendations"
        />
        <MiniToolCard
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 12 15 2 8.5" />
              <polyline points="2 15.5 12 22 22 15.5" />
            </svg>
          }
          title="Gear Ratios"
          description="RPM-at-speed for every gear and tire combo"
        />
        <MiniToolCard
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          }
          title="Rulebook"
          description="Searchable class rules with tech inspection checklist"
        />
        <MiniToolCard
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          }
          title="Rim Offset"
          description="Backspacing and offset calculator for any wheel"
        />
      </div>
    </div>
  )
}

/* ─── Troubleshooter Preview ─── */
function TroubleshooterPreview() {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 hover:border-[#FF8A00]/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm">Troubleshooter</h3>
        </div>
        <span className="text-[9px] text-[#00E676] font-semibold uppercase tracking-wider">Free</span>
      </div>

      {/* Symptom */}
      <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#333]/50 mb-3">
        <p className="text-[9px] text-[#666] uppercase tracking-wider mb-1">Symptom</p>
        <p className="text-xs font-medium text-[#F5F5F5]">Tight on entry</p>
        <p className="text-[10px] text-[#555] mt-0.5">Heavy / Tacky conditions</p>
      </div>

      {/* Prioritized fixes */}
      <div>
        <p className="text-[9px] text-[#666] uppercase tracking-wider mb-2">Prioritized Fixes</p>
        <div className="space-y-1.5">
          <FixItem priority={1} text="Lower RF tire pressure" amount="-2 psi" difficulty="Easy" />
          <FixItem priority={2} text="Reduce cross-weight" amount="-10 lbs" difficulty="Easy" />
          <FixItem priority={3} text="Add toe-out" amount="+1/16&quot;" difficulty="Med" />
        </div>
      </div>
    </div>
  )
}

function FixItem({ priority, text, amount, difficulty }: {
  priority: number
  text: string
  amount: string
  difficulty: string
}) {
  const diffColor = difficulty === 'Easy' ? '#00E676' : '#FF8A00'
  return (
    <div className="flex items-center gap-2 bg-[#0D0D0D] rounded-md px-3 py-2 border border-[#333]/30">
      <span className="text-[10px] font-bold text-[#FF8A00] w-3 shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>{priority}</span>
      <span className="text-[11px] text-[#CCC] flex-1 min-w-0 truncate">{text}</span>
      <span className="text-[10px] text-[#888] shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>{amount}</span>
      <span className="text-[8px] font-semibold uppercase tracking-wider shrink-0" style={{ color: diffColor }}>{difficulty}</span>
    </div>
  )
}

/* ─── Engine Simulator Preview ─── */
function EngineSimPreview() {
  const bars = [35, 48, 62, 75, 88, 96, 100, 97, 90, 80]
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 hover:border-[#FF8A00]/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm">Engine Simulator</h3>
        </div>
        <span className="text-[9px] bg-[#FF8A00]/10 text-[#FF8A00] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Pro</span>
      </div>

      {/* Power output stats */}
      <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#333]/50 mb-3">
        <p className="text-[9px] text-[#666] uppercase tracking-wider mb-2">355 SBC Build</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] text-[#666] uppercase">Peak HP</p>
            <p className="font-bold text-xl text-[#FF8A00]" style={{ fontFamily: 'var(--font-mono)' }}>387</p>
            <p className="text-[9px] text-[#555]">@ 5,800 RPM</p>
          </div>
          <div>
            <p className="text-[9px] text-[#666] uppercase">Peak TQ</p>
            <p className="font-bold text-xl text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>452</p>
            <p className="text-[9px] text-[#555]">@ 4,200 RPM</p>
          </div>
        </div>
      </div>

      {/* Power curve bar chart */}
      <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#333]/50">
        <p className="text-[9px] text-[#666] uppercase tracking-wider mb-2">Power Curve</p>
        <div className="flex items-end gap-1 h-14">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-[#FF8A00]"
              style={{ height: `${h}%`, opacity: 0.3 + (h / 100) * 0.7 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[8px] text-[#555]">3,000</span>
          <span className="text-[8px] text-[#555]">RPM</span>
          <span className="text-[8px] text-[#555]">7,000</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Session Logger Preview ─── */
function SessionLogPreview() {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 hover:border-[#FF8A00]/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm">Session Logger</h3>
        </div>
        <span className="text-[9px] bg-[#FF8A00]/10 text-[#FF8A00] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Pro</span>
      </div>

      {/* Session card */}
      <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#333]/50 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] bg-[#FF8A00]/10 text-[#FF8A00] font-semibold uppercase px-1.5 py-0.5 rounded">Feature</span>
          <span className="text-[9px] text-[#666]">Mar 1, 2026</span>
        </div>
        <p className="text-xs font-medium text-[#F5F5F5] mb-0.5">Springfield Raceway</p>
        <p className="text-[10px] text-[#555]">Tacky conditions</p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-[#252525] rounded-md py-1.5 px-2 text-center">
            <p className="text-[8px] text-[#666] uppercase">Best Lap</p>
            <p className="font-semibold text-sm text-[#00E676]" style={{ fontFamily: 'var(--font-mono)' }}>14.832</p>
          </div>
          <div className="bg-[#252525] rounded-md py-1.5 px-2 text-center">
            <p className="text-[8px] text-[#666] uppercase">Finish</p>
            <p className="font-semibold text-sm text-[#F5F5F5]" style={{ fontFamily: 'var(--font-mono)' }}>P3</p>
          </div>
        </div>
      </div>

      {/* Handling feel */}
      <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#333]/50">
        <p className="text-[9px] text-[#666] uppercase tracking-wider mb-2">Handling Feel</p>
        <div className="grid grid-cols-3 gap-1.5">
          <HandleChip label="Entry" value="Tight" color="#FF1744" />
          <HandleChip label="Mid" value="Neutral" color="#00E676" />
          <HandleChip label="Exit" value="Loose" color="#448AFF" />
        </div>
      </div>
    </div>
  )
}

function HandleChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center bg-[#252525] rounded-md py-1.5">
      <p className="text-[8px] text-[#666] uppercase">{label}</p>
      <p className="text-[10px] font-semibold" style={{ color }}>{value}</p>
    </div>
  )
}

/* ─── Mini Tool Card ─── */
function MiniToolCard({ icon, title, description }: MiniToolCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 hover:border-[#FF8A00]/30 transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/10 flex items-center justify-center mb-3 text-[#FF8A00] group-hover:bg-[#FF8A00]/20 transition-colors">
        {icon}
      </div>
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <p className="text-[11px] text-[#888] leading-relaxed">{description}</p>
    </div>
  )
}
