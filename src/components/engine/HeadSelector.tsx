'use client'

import type { HeadCasting } from '@/lib/types'

interface HeadSelectorProps {
  heads: HeadCasting[]
  selectedId: string
  onChange: (id: string) => void
}

export function HeadSelector({ heads, selectedId, onChange }: HeadSelectorProps) {
  // Calculate max flow across all heads for the flow bar scale
  const maxFlow = Math.max(
    ...heads.filter(h => h.flowData.length > 0).map(h => h.flowData[h.flowData.length - 1].intakeCfm),
    210
  )

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {heads.map(head => {
          const isSelected = head.id === selectedId
          const peakFlow = head.flowData.length > 0 ? head.flowData[head.flowData.length - 1].intakeCfm : 0

          return (
            <button
              key={head.id}
              onClick={() => onChange(head.id)}
              className={`text-left p-3 rounded-lg border transition-all duration-200 min-h-[48px] ${
                isSelected
                  ? 'bg-[#FFD600]/8 border-[#FFD600] glow-yellow'
                  : 'bg-[#252525] border-[#333] hover:border-[#555] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isSelected ? 'text-[#FFD600]' : 'text-[#F5F5F5]'}`}>
                      {head.name}
                    </span>
                    {head.isVortec && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#448AFF]/20 text-[#448AFF] rounded">
                        Vortec
                      </span>
                    )}
                    {head.isBowtiePart && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#FF1744]/20 text-[#FF9100] rounded">
                        Bowtie
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#888]">
                    <span>{head.chamberVolume}cc chamber</span>
                    <span>{head.intakeValve}/{head.exhaustValve} valves</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-lg font-semibold leading-tight">
                    {peakFlow}
                  </p>
                  <p className="text-[9px] text-[#666] uppercase">CFM</p>
                </div>
              </div>
              {/* Mini flow bar */}
              <div className="mt-2 h-1 bg-[#333] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isSelected ? 'bg-[#FFD600]' : 'bg-[#666]'}`}
                  style={{ width: `${(peakFlow / maxFlow) * 100}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
