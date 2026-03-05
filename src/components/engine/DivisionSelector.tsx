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
      <p className="text-xs text-[#666] italic">No divisions support this engine family.</p>
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
                ? 'bg-[#FF8A00] text-[#0D0D0D]'
                : 'bg-[#252525] text-[#888] border border-[#333] hover:border-[#555] hover:text-[#F5F5F5]'
            }`}
          >
            {div.name}
          </button>
        )
      })}
    </div>
  )
}
