'use client'

import type { Division } from '@/lib/types'

interface DivisionSelectorProps {
  divisions: Division[]
  selectedId: string
  onChange: (id: string) => void
}

export function DivisionSelector({ divisions, selectedId, onChange }: DivisionSelectorProps) {
  if (divisions.length === 0) {
    return (
      <p className="text-xs text-[#555570] italic">No divisions support this engine family.</p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {divisions.map(div => {
        const isSelected = div.id === selectedId

        return (
          <button
            key={div.id}
            onClick={() => onChange(div.id)}
            className={`px-3 py-2 rounded-md text-xs font-semibold transition-all min-h-[40px] ${
              isSelected
                ? 'bg-[#00B4FF] text-[#0A0A0F]'
                : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A] hover:border-[#3A3A4A] hover:text-[#D4D4E0]'
            }`}
          >
            {div.name}
          </button>
        )
      })}
    </div>
  )
}
