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
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <EngineSimPreview />
        <SessionLogPreview />
      </div>

      {/* Additional tools */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
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

/* ─── Engine Simulator Preview ─── */
function EngineSimPreview() {
  const bars = [35, 48, 62, 75, 88, 96, 100, 97, 90, 80]
  return (
    <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-5 hover:border-[#00B4FF]/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00B4FF]/10 flex items-center justify-center text-[#00B4FF]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm">Engine Simulator</h3>
        </div>
        <span className="text-[9px] bg-[#00B4FF]/10 text-[#00B4FF] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Pro</span>
      </div>

      {/* Power output stats */}
      <div className="bg-[#0A0A0F] rounded-lg p-3 border border-[#2A2A3A]/50 mb-3">
        <p className="text-[9px] text-[#555570] uppercase tracking-wider mb-2">355 SBC Build</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] text-[#555570] uppercase">Peak HP</p>
            <p className="font-bold text-xl text-[#00B4FF]" style={{ fontFamily: 'var(--font-mono)' }}>387</p>
            <p className="text-[9px] text-[#3A3A4A]">@ 5,800 RPM</p>
          </div>
          <div>
            <p className="text-[9px] text-[#555570] uppercase">Peak TQ</p>
            <p className="font-bold text-xl text-[#D4D4E0]" style={{ fontFamily: 'var(--font-mono)' }}>452</p>
            <p className="text-[9px] text-[#3A3A4A]">@ 4,200 RPM</p>
          </div>
        </div>
      </div>

      {/* Power curve bar chart */}
      <div className="bg-[#0A0A0F] rounded-lg p-3 border border-[#2A2A3A]/50">
        <p className="text-[9px] text-[#555570] uppercase tracking-wider mb-2">Power Curve</p>
        <div className="flex items-end gap-1 h-14">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-[#00B4FF]"
              style={{ height: `${h}%`, opacity: 0.3 + (h / 100) * 0.7 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[8px] text-[#3A3A4A]">3,000</span>
          <span className="text-[8px] text-[#3A3A4A]">RPM</span>
          <span className="text-[8px] text-[#3A3A4A]">7,000</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Session Logger Preview ─── */
function SessionLogPreview() {
  return (
    <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-5 hover:border-[#00B4FF]/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00B4FF]/10 flex items-center justify-center text-[#00B4FF]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm">Session Logger</h3>
        </div>
        <span className="text-[9px] bg-[#00B4FF]/10 text-[#00B4FF] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Pro</span>
      </div>

      {/* Session card */}
      <div className="bg-[#0A0A0F] rounded-lg p-3 border border-[#2A2A3A]/50 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] bg-[#00B4FF]/10 text-[#00B4FF] font-semibold uppercase px-1.5 py-0.5 rounded">Feature</span>
          <span className="text-[9px] text-[#555570]">Mar 1, 2026</span>
        </div>
        <p className="text-xs font-medium text-[#D4D4E0] mb-0.5">Springfield Raceway</p>
        <p className="text-[10px] text-[#3A3A4A]">Tacky conditions</p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-[#1A1A28] rounded-md py-1.5 px-2 text-center">
            <p className="text-[8px] text-[#555570] uppercase">Best Lap</p>
            <p className="font-semibold text-sm text-[#00E676]" style={{ fontFamily: 'var(--font-mono)' }}>14.832</p>
          </div>
          <div className="bg-[#1A1A28] rounded-md py-1.5 px-2 text-center">
            <p className="text-[8px] text-[#555570] uppercase">Finish</p>
            <p className="font-semibold text-sm text-[#D4D4E0]" style={{ fontFamily: 'var(--font-mono)' }}>P3</p>
          </div>
        </div>
      </div>

      {/* Handling feel */}
      <div className="bg-[#0A0A0F] rounded-lg p-3 border border-[#2A2A3A]/50">
        <p className="text-[9px] text-[#555570] uppercase tracking-wider mb-2">Handling Feel</p>
        <div className="grid grid-cols-3 gap-1.5">
          <HandleChip label="Entry" value="Tight" color="#FF1744" />
          <HandleChip label="Mid" value="Neutral" color="#00E676" />
          <HandleChip label="Exit" value="Loose" color="#00B4FF" />
        </div>
      </div>
    </div>
  )
}

function HandleChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center bg-[#1A1A28] rounded-md py-1.5">
      <p className="text-[8px] text-[#555570] uppercase">{label}</p>
      <p className="text-[10px] font-semibold" style={{ color }}>{value}</p>
    </div>
  )
}

/* ─── Mini Tool Card ─── */
function MiniToolCard({ icon, title, description }: MiniToolCardProps) {
  return (
    <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4 hover:border-[#FF6B00]/30 transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center mb-3 text-[#FF6B00] group-hover:bg-[#FF6B00]/20 transition-colors">
        {icon}
      </div>
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <p className="text-[11px] text-[#7A7A90] leading-relaxed">{description}</p>
    </div>
  )
}
