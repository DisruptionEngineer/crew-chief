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
        <Link href="/calculators" className="text-xs text-[#3A3A4A] hover:text-[#7A7A90] transition-colors inline-flex items-center gap-1 group">
          <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Calculators
        </Link>
        <h1 className="text-2xl font-bold tracking-tight uppercase mt-2">Transmission Advisor</h1>
        <p className="text-sm text-[#555570] mt-1">Find the best trans for your build</p>
      </div>

      {/* Inputs */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Your Build</p>

        {/* Engine Make */}
        <div className="mb-4">
          <label className="text-[10px] text-[#555570] uppercase block mb-2">Engine Make</label>
          <div className="flex gap-2">
            {(['GM', 'Ford', 'Mopar'] as const).map(make => (
              <button
                key={make}
                onClick={() => setInput(prev => ({ ...prev, engineMake: make }))}
                className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
                  input.engineMake === make
                    ? 'bg-[#00B4FF] text-[#0A0A0F]'
                    : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A]'
                }`}
              >
                {make}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] text-[#555570] uppercase block mb-1">Peak Torque (ft-lbs)</label>
            <input
              type="number"
              value={input.engineTorque}
              onChange={e => setInput(prev => ({ ...prev, engineTorque: parseFloat(e.target.value) || 250 }))}
              step={10}
              min={100}
              max={600}
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#555570] uppercase block mb-1">Rear Gear Ratio</label>
            <input
              type="number"
              value={input.rearGearRatio}
              onChange={e => setInput(prev => ({ ...prev, rearGearRatio: parseFloat(e.target.value) || 3.73 }))}
              step={0.01}
              min={2.5}
              max={5.0}
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
            />
          </div>
        </div>

        {/* Preference */}
        <div>
          <label className="text-[10px] text-[#555570] uppercase block mb-2">Preference</label>
          <div className="flex gap-2">
            <button
              onClick={() => setInput(prev => ({ ...prev, preferAutomatic: true }))}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
                input.preferAutomatic
                  ? 'bg-[#00B4FF] text-[#0A0A0F]'
                  : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A]'
              }`}
            >
              Automatic
            </button>
            <button
              onClick={() => setInput(prev => ({ ...prev, preferAutomatic: false }))}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
                !input.preferAutomatic
                  ? 'bg-[#00B4FF] text-[#0A0A0F]'
                  : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A]'
              }`}
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      <div className="checkered-divider" />

      {/* Recommended */}
      {result.options.length > 0 ? (
        <div className="bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg p-4">
          <p className="text-xs font-semibold text-[#00E676] uppercase tracking-wider mb-1">Recommended</p>
          <p className="text-lg font-bold">{result.recommended}</p>
        </div>
      ) : (
        <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-lg p-4">
          <p className="text-xs font-semibold text-[#FF1744] uppercase tracking-wider mb-1">No Match</p>
          <p className="text-sm text-[#7A7A90]">No transmissions found for this combination. Try changing make or preference.</p>
        </div>
      )}

      {/* Scored Options */}
      <div className="space-y-3">
        {result.options.map((opt, i) => {
          const isTop = i === 0
          return (
            <div
              key={opt.name}
              className={`bg-[#14141F] border rounded-lg p-4 ${
                isTop ? 'border-[#00E676]/30' : 'border-[#2A2A3A]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#D4D4E0]">{opt.name}</span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#1A1A28] text-[#7A7A90] rounded">
                    {opt.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-lg font-bold ${
                    opt.score >= 80 ? 'text-[#00E676]' :
                    opt.score >= 60 ? 'text-[#00B4FF]' : 'text-[#7A7A90]'
                  }`}>
                    {opt.score}
                  </span>
                  <span className="text-[10px] text-[#555570]">pts</span>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${opt.score}%`,
                    backgroundColor: opt.score >= 80 ? '#00E676' : opt.score >= 60 ? '#00B4FF' : '#7A7A90',
                  }}
                />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Gears</p>
                  <p className="font-mono text-sm font-semibold">{opt.gears}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Weight</p>
                  <p className="font-mono text-sm font-semibold">{opt.weight} lbs</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#555570] uppercase">1st Gear</p>
                  <p className="font-mono text-sm font-semibold">{opt.firstGearRatio}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Cost</p>
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
                <p className="text-[10px] text-[#555570] mt-2 leading-relaxed">{opt.notes}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
