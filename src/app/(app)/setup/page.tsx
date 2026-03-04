'use client'

import { useState } from 'react'
import { useCar } from '@/hooks/useCar'
import { getSetupRecommendations } from '@/data/setup/recommendations'
import type { TrackCondition, RaceType } from '@/lib/types'

const conditions: { value: TrackCondition; label: string }[] = [
  { value: 'heavy', label: 'Heavy' },
  { value: 'tacky', label: 'Tacky' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'dry', label: 'Dry' },
  { value: 'slick', label: 'Slick' },
]

export default function SetupCalculator() {
  const { currentCar, currentSetup } = useCar()
  const [condition, setCondition] = useState<TrackCondition>('moderate')
  const [raceType, setRaceType] = useState<RaceType>('figure-8')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const recs = getSetupRecommendations(currentCar, condition, raceType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight uppercase">Setup Calculator</h1>
        <p className="text-sm text-[#888] mt-1">{currentCar.year} {currentCar.model} at Painesville Speedway</p>
      </div>

      {/* Track Condition Picker */}
      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Track Condition</label>
        <div className="flex gap-2">
          {conditions.map(c => (
            <button
              key={c.value}
              onClick={() => setCondition(c.value)}
              className={`flex-1 py-3 rounded-md text-sm font-semibold transition-colors min-h-[48px] ${
                condition === c.value
                  ? 'bg-[#FFD600] text-[#0D0D0D]'
                  : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Race Type */}
      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Race Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => setRaceType('figure-8')}
            className={`flex-1 py-3 rounded-md text-sm font-semibold transition-colors min-h-[48px] ${
              raceType === 'figure-8'
                ? 'bg-[#FFD600] text-[#0D0D0D]'
                : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
            }`}
          >
            Figure 8
          </button>
          <button
            onClick={() => setRaceType('oval')}
            className={`flex-1 py-3 rounded-md text-sm font-semibold transition-colors min-h-[48px] ${
              raceType === 'oval'
                ? 'bg-[#FFD600] text-[#0D0D0D]'
                : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
            }`}
          >
            Oval
          </button>
        </div>
      </div>

      {/* Checkered Divider */}
      <div className="checkered-divider" />

      {/* Springs */}
      <SetupSection
        title="Springs"
        unit="lbs/in"
        expanded={expandedSection === 'springs'}
        onToggle={() => setExpandedSection(expandedSection === 'springs' ? null : 'springs')}
      >
        <div className="grid grid-cols-2 gap-3">
          {recs.springs.map(rec => (
            <SetupValueCard
              key={rec.parameter}
              label={rec.label.replace('Spring', '').replace('Left ', 'L').replace('Right ', 'R').replace('Front', 'F').replace('Rear', 'R').trim()}
              value={rec.value as number}
              unit={rec.unit}
              rangeLow={rec.rangeLow!}
              rangeHigh={rec.rangeHigh!}
              explanation={rec.explanation}
              expanded={expandedSection === 'springs'}
            />
          ))}
        </div>
        {raceType === 'figure-8' && (
          <p className="text-xs text-[#FFD600] mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            Equal L/R for Figure 8 — symmetric turns both directions
          </p>
        )}
      </SetupSection>

      {/* Alignment */}
      <SetupSection
        title="Alignment"
        unit="degrees"
        expanded={expandedSection === 'alignment'}
        onToggle={() => setExpandedSection(expandedSection === 'alignment' ? null : 'alignment')}
      >
        <div className="grid grid-cols-2 gap-3">
          {recs.alignment.filter(r => r.parameter !== 'toeFront').map(rec => (
            <div key={rec.parameter} className="bg-[#252525] rounded-md p-3">
              <p className="text-[10px] text-[#666] uppercase">{rec.label}</p>
              <p className="font-mono text-lg font-medium mt-1">
                {typeof rec.value === 'number' ? `${rec.value > 0 ? '+' : ''}${rec.value}°` : rec.value}
              </p>
              {expandedSection === 'alignment' && (
                <p className="text-xs text-[#888] mt-2">{rec.explanation}</p>
              )}
            </div>
          ))}
        </div>
        {/* Toe */}
        {recs.alignment.filter(r => r.parameter === 'toeFront').map(rec => (
          <div key={rec.parameter} className="bg-[#252525] rounded-md p-3 mt-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-[#666] uppercase">{rec.label}</p>
              <p className="font-mono text-lg font-medium">{rec.value}</p>
            </div>
            {expandedSection === 'alignment' && (
              <p className="text-xs text-[#888] mt-2">{rec.explanation}</p>
            )}
          </div>
        ))}
      </SetupSection>

      {/* Tire Pressures */}
      <SetupSection
        title="Tire Pressure"
        unit="psi"
        expanded={expandedSection === 'tires'}
        onToggle={() => setExpandedSection(expandedSection === 'tires' ? null : 'tires')}
      >
        <div className="grid grid-cols-2 gap-3">
          {recs.tirePressures.map(rec => (
            <SetupValueCard
              key={rec.parameter}
              label={rec.label}
              value={rec.value as number}
              unit={rec.unit}
              rangeLow={rec.rangeLow!}
              rangeHigh={rec.rangeHigh!}
              explanation={rec.explanation}
              expanded={expandedSection === 'tires'}
              showStepper
            />
          ))}
        </div>
      </SetupSection>

      {/* Weight Distribution */}
      <SetupSection
        title="Weight"
        unit=""
        expanded={expandedSection === 'weight'}
        onToggle={() => setExpandedSection(expandedSection === 'weight' ? null : 'weight')}
      >
        {/* Car diagram */}
        <div className="bg-[#252525] rounded-md p-4">
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <CornerWeight label="LF" value={currentSetup.cornerWeightLF} />
            <CornerWeight label="RF" value={currentSetup.cornerWeightRF} />
            <CornerWeight label="LR" value={currentSetup.cornerWeightLR} />
            <CornerWeight label="RR" value={currentSetup.cornerWeightRR} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center text-sm font-mono">
            <div>
              <span className="text-[#666]">Total</span>
              <p className="font-semibold">{currentSetup.totalWeight.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[#666]">Cross-Wt</span>
              <p className="font-semibold text-[#FFD600]">{currentSetup.crossWeightPct}%</p>
            </div>
            <div>
              <span className="text-[#666]">Left %</span>
              <StatusValue value={currentSetup.leftPct} target={raceType === 'figure-8' ? 50 : 55} tolerance={2} unit="%" />
            </div>
            <div>
              <span className="text-[#666]">Rear %</span>
              <StatusValue value={currentSetup.rearPct} target={raceType === 'figure-8' ? 50 : 49} tolerance={2} unit="%" />
            </div>
          </div>
          {/* Rules compliance */}
          <div className="flex gap-3 mt-4 justify-center text-xs">
            <RuleCheck passed={currentSetup.totalWeight >= 3300} label="Min 3,300 lbs" />
            {raceType === 'oval' && <RuleCheck passed={currentSetup.leftPct >= 54} label="55% Left" />}
            {raceType === 'oval' && <RuleCheck passed={currentSetup.rearPct >= 48} label="49% Rear" />}
          </div>
        </div>
        {/* Weight targets */}
        {recs.weight.map(rec => (
          <div key={rec.parameter} className="bg-[#252525] rounded-md p-3 mt-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#666]">{rec.label}</p>
              <p className="font-mono font-medium">{rec.value}</p>
            </div>
            {expandedSection === 'weight' && (
              <p className="text-xs text-[#888] mt-2">{rec.explanation}</p>
            )}
          </div>
        ))}
      </SetupSection>

      {/* Other Recommendations */}
      <SetupSection
        title="Other"
        unit=""
        expanded={expandedSection === 'other'}
        onToggle={() => setExpandedSection(expandedSection === 'other' ? null : 'other')}
      >
        {recs.other.map(rec => (
          <div key={rec.parameter} className="bg-[#252525] rounded-md p-3 mt-3 first:mt-0">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#666]">{rec.label}</p>
              <p className="font-mono text-sm font-medium">{rec.value}</p>
            </div>
            {expandedSection === 'other' && (
              <p className="text-xs text-[#888] mt-2">{rec.explanation}</p>
            )}
          </div>
        ))}
      </SetupSection>
    </div>
  )
}

function SetupSection({ title, unit, expanded, onToggle, children }: {
  title: string; unit: string; expanded: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 min-h-[48px]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
          {unit && <span className="text-[10px] text-[#666]">({unit})</span>}
        </div>
        <svg className={`w-4 h-4 text-[#666] transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="px-4 pb-4">{children}</div>
    </div>
  )
}

function SetupValueCard({ label, value, unit, rangeLow, rangeHigh, explanation, expanded, showStepper }: {
  label: string; value: number; unit: string; rangeLow: number; rangeHigh: number; explanation: string; expanded: boolean; showStepper?: boolean
}) {
  const [adjusted, setAdjusted] = useState(value)
  const pct = Math.max(0, Math.min(100, ((adjusted - rangeLow) / (rangeHigh - rangeLow)) * 100))

  return (
    <div className="bg-[#252525] rounded-md p-3">
      <p className="text-[10px] text-[#666] uppercase">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-mono text-xl font-medium">{adjusted}</span>
        <span className="text-xs text-[#666]">{unit}</span>
      </div>
      {/* Range bar */}
      <div className="mt-2 h-1.5 bg-[#333] rounded-full overflow-hidden">
        <div className="h-full bg-[#FFD600] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-[#555] mt-1">
        <span>{rangeLow}</span>
        <span>{rangeHigh}</span>
      </div>
      {/* Stepper buttons */}
      {showStepper && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setAdjusted(a => Math.max(rangeLow - 2, a - 1))}
            className="flex-1 py-1.5 bg-[#333] rounded text-sm font-mono hover:bg-[#444] transition-colors min-h-[36px]"
          >
            -
          </button>
          <button
            onClick={() => setAdjusted(a => Math.min(rangeHigh + 2, a + 1))}
            className="flex-1 py-1.5 bg-[#333] rounded text-sm font-mono hover:bg-[#444] transition-colors min-h-[36px]"
          >
            +
          </button>
        </div>
      )}
      {expanded && <p className="text-xs text-[#888] mt-2">{explanation}</p>}
    </div>
  )
}

function CornerWeight({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#333] rounded-md p-3 text-center">
      <p className="font-mono text-lg font-semibold">{value}</p>
      <p className="text-[10px] text-[#666] uppercase">{label}</p>
    </div>
  )
}

function StatusValue({ value, target, tolerance, unit }: { value: number; target: number; tolerance: number; unit: string }) {
  const diff = Math.abs(value - target)
  const color = diff <= tolerance * 0.5 ? '#00E676' : diff <= tolerance ? '#FFD600' : '#FF1744'
  return <p className="font-semibold" style={{ color }}>{value}{unit}</p>
}

function RuleCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1 ${passed ? 'text-[#00E676]' : 'text-[#FF1744]'}`}>
      {passed ? '✓' : '✗'} {label}
    </span>
  )
}
