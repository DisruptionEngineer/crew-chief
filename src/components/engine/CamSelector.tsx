'use client'

import type { CamProfile } from '@/lib/types'

interface CamSelectorProps {
  cams: CamProfile[]
  selectedId: string
  onChange: (id: string) => void
}

export function CamSelector({ cams, selectedId, onChange }: CamSelectorProps) {
  return (
    <div className="space-y-2">
      {cams.map(cam => {
        const isSelected = cam.id === selectedId

        return (
          <button
            key={cam.id}
            onClick={() => onChange(cam.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 min-h-[48px] ${
              isSelected
                ? 'bg-[#00B4FF]/8 border-[#00B4FF] glow-yellow'
                : 'bg-[#1A1A28] border-[#2A2A3A] hover:border-[#3A3A4A] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isSelected ? 'text-[#00B4FF]' : 'text-[#D4D4E0]'}`}>
                    {cam.name}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7A90] mt-0.5 line-clamp-1">{cam.notes}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0 text-right">
                <div>
                  <p className="font-mono text-base font-semibold">{cam.lift}&quot;</p>
                  <p className="text-[9px] text-[#555570] uppercase">Lift</p>
                </div>
                <div>
                  <p className="font-mono text-base font-semibold">{cam.duration}&deg;</p>
                  <p className="text-[9px] text-[#555570] uppercase">Dur</p>
                </div>
                <div>
                  <p className="font-mono text-base font-semibold">{cam.lsa}&deg;</p>
                  <p className="text-[9px] text-[#555570] uppercase">LSA</p>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
