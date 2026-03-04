'use client'

import { useState } from 'react'
import Link from 'next/link'
import { monteCarlo75 } from '@/data/cars/monte-carlo-75'
import { getSetupRecommendations } from '@/data/setup/recommendations'
import type { TrackCondition } from '@/lib/types'

const conditions: TrackCondition[] = ['heavy', 'tacky', 'moderate', 'dry', 'slick']

export function SetupDemo() {
  const [condition, setCondition] = useState<TrackCondition>('moderate')
  const recs = getSetupRecommendations(monteCarlo75, condition, 'figure-8')

  return (
    <div className="relative">
      {/* Interactive Demo */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold text-[#FFD600] uppercase tracking-widest mb-1">Live Demo</p>
            <h3 className="text-lg md:text-xl font-bold">Setup Calculator</h3>
          </div>
          <span className="text-xs text-[#666] font-mono">1975 Monte Carlo</span>
        </div>

        {/* Condition Picker */}
        <p className="text-[10px] text-[#888] uppercase tracking-wider mb-2 font-semibold">Track Condition</p>
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          {conditions.map((c) => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              className={`py-2.5 rounded-md text-xs font-semibold uppercase transition-all ${
                condition === c
                  ? 'bg-[#FFD600] text-[#0D0D0D]'
                  : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="checkered-divider mb-6" />

        {/* Spring Rates */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Springs (lbs/in)</h4>
          <div className="grid grid-cols-2 gap-3">
            {recs.springs.map((s) => (
              <DemoValue
                key={s.parameter}
                label={s.parameter.replace('spring', '').toUpperCase().replace('LF', 'LF').replace('RF', 'RF').replace('LR', 'LR').replace('RR', 'RR')}
                displayLabel={s.parameter.includes('LF') ? 'LF' : s.parameter.includes('RF') ? 'RF' : s.parameter.includes('LR') ? 'LR' : 'RR'}
                value={s.value as number}
                unit="lbs/in"
                low={s.rangeLow!}
                high={s.rangeHigh!}
              />
            ))}
          </div>
        </div>

        {/* Alignment Preview */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Alignment</h4>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Camber LF" value={`${recs.alignment[0].value}°`} />
            <MiniStat label="Camber RF" value={`${recs.alignment[1].value}°`} />
            <MiniStat label="Caster LF" value={`+${recs.alignment[2].value}°`} />
            <MiniStat label="Caster RF" value={`+${recs.alignment[3].value}°`} />
          </div>
        </div>

        {/* Tire Pressures */}
        <div>
          <h4 className="text-xs font-bold text-[#888] uppercase tracking-wider mb-3">Tire Pressure (psi)</h4>
          <div className="grid grid-cols-4 gap-2">
            {recs.tirePressures.map((tp) => (
              <div key={tp.parameter} className="text-center bg-[#252525] rounded-md py-2">
                <p className="text-[10px] text-[#666] uppercase">{tp.parameter.replace('pressure', '')}</p>
                <p className="font-mono font-semibold text-lg">{tp.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frosted CTA Overlay */}
      <div className="absolute inset-0 flex items-end justify-center rounded-xl overflow-hidden pointer-events-none">
        <div className="w-full bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent pt-32 pb-8 px-6 flex flex-col items-center pointer-events-auto">
          <p className="text-sm text-[#888] mb-3 text-center">Sign up to unlock the full calculator with all parameters</p>
          <Link
            href="/sign-up"
            className="bg-[#FFD600] text-[#0D0D0D] font-semibold px-8 py-3 rounded-md hover:bg-[#FFEA00] transition-colors text-sm"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  )
}

function DemoValue({ displayLabel, value, unit, low, high }: {
  label: string
  displayLabel: string
  value: number
  unit: string
  low: number
  high: number
}) {
  const pct = Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100))
  return (
    <div className="bg-[#0D0D0D] border border-[#333]/50 rounded-lg p-3">
      <p className="text-[10px] text-[#666] uppercase mb-1">{displayLabel}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono font-semibold text-xl text-[#F5F5F5]">{value}</span>
        <span className="text-[10px] text-[#666]">{unit}</span>
      </div>
      <div className="mt-2 h-1 bg-[#333] rounded-full overflow-hidden">
        <div className="h-full bg-[#FFD600] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-[#555]">{low}</span>
        <span className="text-[9px] text-[#555]">{high}</span>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0D0D0D] border border-[#333]/50 rounded-lg p-3 flex justify-between items-center">
      <span className="text-[10px] text-[#666] uppercase">{label}</span>
      <span className="font-mono font-semibold text-[#F5F5F5]">{value}</span>
    </div>
  )
}
