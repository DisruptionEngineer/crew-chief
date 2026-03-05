'use client'

import { useState } from 'react'
import type { ComplianceResult } from '@/lib/types'

interface ComplianceBadgesProps {
  compliance: ComplianceResult
}

export function ComplianceBadges({ compliance }: ComplianceBadgesProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`rounded-lg border p-3 ${
      compliance.isLegal
        ? 'bg-[#00E676]/5 border-[#00E676]/30'
        : 'bg-[#FF1744]/5 border-[#FF1744]/30'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between min-h-[36px]"
      >
        <div className="flex items-center gap-2">
          {compliance.isLegal ? (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#00E676]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              LEGAL
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#FF1744]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              ILLEGAL — {compliance.violations.length} violation{compliance.violations.length !== 1 ? 's' : ''}
            </span>
          )}
          {compliance.warnings.length > 0 && (
            <span className="text-[10px] font-semibold text-[#FF8A00] bg-[#FF8A00]/10 px-2 py-0.5 rounded">
              {compliance.warnings.length} warning{compliance.warnings.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <svg className={`w-4 h-4 text-[#666] transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-[#333]/50 pt-3">
          {compliance.violations.map((v, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-[#FF1744] font-mono font-semibold flex-shrink-0">Rule {v.rule}</span>
              <span className="text-[#F5F5F5]">{v.description}</span>
            </div>
          ))}
          {compliance.warnings.map((w, i) => (
            <div key={`w-${i}`} className="flex items-start gap-2 text-xs">
              <span className="text-[#FF8A00] flex-shrink-0">⚠</span>
              <span className="text-[#888]">{w}</span>
            </div>
          ))}
          {compliance.violations.length === 0 && compliance.warnings.length === 0 && (
            <p className="text-xs text-[#888]">All engine rules pass. This build is legal for your division.</p>
          )}
        </div>
      )}
    </div>
  )
}
