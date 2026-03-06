'use client'

import type { EngineFamily } from '@/lib/types'

interface EngineFamilySelectorProps {
  families: EngineFamily[]
  selectedId: string
  onChange: (id: string) => void
}

const MANUFACTURER_COLORS: Record<string, string> = {
  GM: '#00B4FF',
  Ford: '#00B4FF',
  Mopar: '#FF6B00',
}

export function EngineFamilySelector({ families, selectedId, onChange }: EngineFamilySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {families.map(family => {
        const isSelected = family.id === selectedId
        const color = MANUFACTURER_COLORS[family.manufacturer] || '#7A7A90'

        return (
          <button
            key={family.id}
            onClick={() => onChange(family.id)}
            className={`text-left p-3 rounded-lg border transition-all duration-200 min-h-[48px] ${
              isSelected
                ? 'border-[#00B4FF] bg-[#00B4FF]/8 glow-yellow'
                : 'bg-[#1A1A28] border-[#2A2A3A] hover:border-[#3A3A4A] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 transition-shadow"
                style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 8px ${color}40` : 'none' }}
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isSelected ? 'text-[#00B4FF]' : 'text-[#7A7A90]'
              }`}>
                {family.manufacturer}
              </span>
            </div>
            <p className={`text-sm font-semibold leading-tight ${
              isSelected ? 'text-[#D4D4E0]' : 'text-[#8A8AA0]'
            }`}>
              {family.name}
            </p>
            <p className="text-[10px] text-[#3A3A4A] mt-0.5">
              {family.displacement} ci &middot; {family.architecture === 'ohc' ? 'OHC' : 'Pushrod'}
            </p>
          </button>
        )
      })}
    </div>
  )
}
