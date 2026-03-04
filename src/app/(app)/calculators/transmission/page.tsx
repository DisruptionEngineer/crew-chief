'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { evaluateTransmissions } from '@/data/calculators/transmission'
import type { TransmissionInput } from '@/lib/types'

export default function TransmissionPage() {
  const [input, setInput] = useState<TransmissionInput>({
    engineMake: 'GM',
    engineTorque: 280,
    rearGearRatio: 3.73,
    preferAutomatic: true,
  })

  const result = useMemo(() => evaluateTransmissions(input), [input])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <Link href="/calculators" className="text-xs text-[#555] hover:text-[#888] transition-colors inline-flex items-center gap-1 group">
          <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Calculators
        </Link>
        <h1 className="text-2xl font-bold tracking-tight uppercase mt-2">Transmission Advisor</h1>
        <p className="text-sm text-[#666] mt-1">Find the best trans for your build</p>
      </div>

      {/* Inputs */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Your Build</p>

        {/* Engine Make */}
        <div className="mb-4">
          <label className="text-[10px] text-[#666] uppercase block mb-2">Engine Make</label>
          <div className="flex gap-2">
            {(['GM', 'Ford', 'Mopar'] as const).map(make => (
              <button
                key={make}
                onClick={() => setInput(prev => ({ ...prev, engineMake: make }))}
                className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
                  input.engineMake === make
                    ? 'bg-[#FFD600] text-[#0D0D0D]'
                    : 'bg-[#252525] text-[#888] border border-[#333]'
                }`}
              >
                {make}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Peak Torque (ft-lbs)</label>
            <input
              type="number"
              value={input.engineTorque}
              onChange={e => setInput(prev => ({ ...prev, engineTorque: parseFloat(e.target.value) || 250 }))}
              step={10}
              min={100}
              max={600}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600] min-h-[44px]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Rear Gear Ratio</label>
            <input
              type="number"
              value={input.rearGearRatio}
              onChange={e => setInput(prev => ({ ...prev, rearGearRatio: parseFloat(e.target.value) || 3.73 }))}
              step={0.01}
              min={2.5}
              max={5.0}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600] min-h-[44px]"
            />
          </div>
        </div>

        {/* Preference */}
        <div>
          <label className="text-[10px] text-[#666] uppercase block mb-2">Preference</label>
          <div className="flex gap-2">
            <button
              onClick={() => setInput(prev => ({ ...prev, preferAutomatic: true }))}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
                input.preferAutomatic
                  ? 'bg-[#FFD600] text-[#0D0D0D]'
                  : 'bg-[#252525] text-[#888] border border-[#333]'
              }`}
            >
              Automatic
            </button>
            <button
              onClick={() => setInput(prev => ({ ...prev, preferAutomatic: false }))}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
                !input.preferAutomatic
                  ? 'bg-[#FFD600] text-[#0D0D0D]'
                  : 'bg-[#252525] text-[#888] border border-[#333]'
              }`}
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      <div className="checkered-divider" />

      {/* Recommended */}
      <div className="bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg p-4">
        <p className="text-xs font-semibold text-[#00E676] uppercase tracking-wider mb-1">Recommended</p>
        <p className="text-lg font-bold">{result.recommended}</p>
      </div>

      {/* Scored Options */}
      <div className="space-y-3">
        {result.options.map((opt, i) => {
          const isTop = i === 0
          return (
            <div
              key={opt.name}
              className={`bg-[#1A1A1A] border rounded-lg p-4 ${
                isTop ? 'border-[#00E676]/30' : 'border-[#333]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#F5F5F5]">{opt.name}</span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#252525] text-[#888] rounded">
                    {opt.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-lg font-bold ${
                    opt.score >= 80 ? 'text-[#00E676]' :
                    opt.score >= 60 ? 'text-[#FFD600]' : 'text-[#888]'
                  }`}>
                    {opt.score}
                  </span>
                  <span className="text-[10px] text-[#666]">pts</span>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-1.5 bg-[#333] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${opt.score}%`,
                    backgroundColor: opt.score >= 80 ? '#00E676' : opt.score >= 60 ? '#FFD600' : '#888',
                  }}
                />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-[10px] text-[#666] uppercase">Gears</p>
                  <p className="font-mono text-sm font-semibold">{opt.gears}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#666] uppercase">Weight</p>
                  <p className="font-mono text-sm font-semibold">{opt.weight} lbs</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#666] uppercase">1st Gear</p>
                  <p className="font-mono text-sm font-semibold">{opt.firstGearRatio}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#666] uppercase">Cost</p>
                  <p className="font-mono text-sm font-semibold">${opt.typicalCost}</p>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  {opt.pros.map((pro, j) => (
                    <p key={j} className="text-[#00E676] flex items-start gap-1 mb-0.5">
                      <span className="flex-shrink-0">+</span> {pro}
                    </p>
                  ))}
                </div>
                <div>
                  {opt.cons.map((con, j) => (
                    <p key={j} className="text-[#FF1744] flex items-start gap-1 mb-0.5">
                      <span className="flex-shrink-0">&minus;</span> {con}
                    </p>
                  ))}
                </div>
              </div>

              {opt.notes && (
                <p className="text-[10px] text-[#666] mt-2 leading-relaxed">{opt.notes}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
