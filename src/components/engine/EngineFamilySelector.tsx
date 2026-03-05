'use client'

import type { EngineFamily } from '@/lib/types'

interface EngineFamilySelectorProps {
  families: EngineFamily[]
  selectedId: string
  onChange: (id: string) => void
}

const MANUFACTURER_COLORS: Record<string, string> = {
  GM: '#FF8A00',
  Ford: '#448AFF',
  Mopar: '#FF9100',
}

export function EngineFamilySelector({ families, selectedId, onChange }: EngineFamilySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {families.map(family => {
        const isSelected = family.id === selectedId
        const color = MANUFACTURER_COLORS[family.manufacturer] || '#888'

        return (
          <button
            key={family.id}
            onClick={() => onChange(family.id)}
            className={`text-left p-3 rounded-lg border transition-all duration-200 min-h-[48px] ${
              isSelected
                ? 'border-[#FF8A00] bg-[#FF8A00]/8 glow-yellow'
                : 'bg-[#252525] border-[#333] hover:border-[#555] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 transition-shadow"
                style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 8px ${color}40` : 'none' }}
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isSelected ? 'text-[#FF8A00]' : 'text-[#888]'
              }`}>
                {family.manufacturer}
              </span>
            </div>
            <p className={`text-sm font-semibold leading-tight ${
              isSelected ? 'text-[#F5F5F5]' : 'text-[#B0B0B0]'
            }`}>
              {family.name}
            </p>
            <p className="text-[10px] text-[#555] mt-0.5">
              {family.displacement} ci &middot; {family.architecture === 'ohc' ? 'OHC' : 'Pushrod'}
            </p>
          </button>
        )
      })}
    </div>
  )
}
