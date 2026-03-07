'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculateCornerWeights } from '@/data/calculators/corner-weight'
import type { CornerWeightInput } from '@/lib/types'

export function CornerWeightDemo() {
  const [input, setInput] = useState<CornerWeightInput>({
    weightLF: 825,
    weightRF: 825,
    weightLR: 575,
    weightRR: 575,
    targetCrossWeight: 50,
    lbsPerTurn: 12,
  })

  const result = useMemo(() => calculateCornerWeights(input), [input])

  function update(key: keyof CornerWeightInput, value: number) {
    setInput(prev => ({ ...prev, [key]: value }))
  }

  function pctColor(value: number, target: number | undefined, tolerancePct: number = 1): string {
    if (target === undefined) return '#D4D4E0'
    const diff = Math.abs(value - target)
    if (diff < tolerancePct * 0.3) return '#00E676'
    if (diff < tolerancePct) return '#00B4FF'
    return '#FF1744'
  }

  return (
    <section id="corner-weight" className="py-12 md:py-20 border-t border-[#2A2A3A]/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#FF6B00] uppercase tracking-wider mb-2">
            Try It Now
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
            Corner Weight Calculator
          </h2>
          <p className="text-sm text-[#555570] mt-2 max-w-xl">
            Enter your scale readings to calculate cross-weight percentage, weight distribution,
            and get jack bolt adjustment recommendations — no account required.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column — Inputs */}
          <div className="space-y-4">
            {/* Corner weight inputs */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                Scale Readings (lbs)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(['LF', 'RF', 'LR', 'RR'] as const).map(corner => {
                  const key = `weight${corner}` as keyof CornerWeightInput
                  return (
                    <div key={corner} className="bg-[#1A1A28] rounded-md p-3">
                      <label className="text-[10px] text-[#555570] uppercase block mb-1">
                        {corner}
                      </label>
                      <input
                        type="number"
                        value={input[key] as number}
                        onChange={e => update(key, parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#14141F] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Target & lbs-per-turn */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                Targets
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">
                    Target Cross Weight %
                  </label>
                  <input
                    type="number"
                    value={input.targetCrossWeight ?? 50}
                    onChange={e => update('targetCrossWeight', parseFloat(e.target.value) || 50)}
                    step={0.5}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">
                    Lbs per Turn
                  </label>
                  <input
                    type="number"
                    value={input.lbsPerTurn ?? 12}
                    onChange={e => update('lbsPerTurn', parseFloat(e.target.value) || 12)}
                    step={1}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Results */}
          <div className="space-y-4">
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                Results
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Total Weight</p>
                  <p className="font-mono text-2xl font-bold mt-1">{result.totalWeight}</p>
                  <p className="text-[10px] text-[#555570]">lbs</p>
                </div>
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Cross Weight</p>
                  <p
                    className="font-mono text-2xl font-bold mt-1"
                    style={{ color: pctColor(result.crossWeightPct, input.targetCrossWeight) }}
                  >
                    {result.crossWeightPct.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[#555570]">RF + LR = {result.crossWeight} lbs</p>
                </div>
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Left %</p>
                  <p
                    className="font-mono text-2xl font-bold mt-1"
                    style={{ color: pctColor(result.leftPct, 50, 2) }}
                  >
                    {result.leftPct.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[#555570]">{result.leftWeight} lbs</p>
                </div>
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Rear %</p>
                  <p
                    className="font-mono text-2xl font-bold mt-1"
                    style={{ color: pctColor(result.rearPct, 50, 2) }}
                  >
                    {result.rearPct.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[#555570]">{result.rearWeight} lbs</p>
                </div>
              </div>

              {/* Diagonal bias */}
              <div className="mt-3 bg-[#1A1A28] rounded-md p-3 text-center">
                <p className="text-[10px] text-[#555570] uppercase">Diagonal Bias</p>
                <p
                  className="font-mono text-2xl font-bold mt-1"
                  style={{
                    color:
                      Math.abs(result.diagonalBias) < 0.5
                        ? '#00E676'
                        : Math.abs(result.diagonalBias) < 1.5
                          ? '#00B4FF'
                          : '#FF1744',
                  }}
                >
                  {result.diagonalBias > 0 ? '+' : ''}
                  {result.diagonalBias.toFixed(1)}%
                </p>
                <p className="text-[10px] text-[#555570]">
                  {Math.abs(result.diagonalBias) < 0.5
                    ? 'Balanced'
                    : result.diagonalBias > 0
                      ? 'RF+LR heavy (typical oval bias)'
                      : 'LF+RR heavy'}
                </p>
              </div>
            </div>

            {/* Load Bolt Adjustments */}
            {result.loadBoltAdjustments.length > 0 && (
              <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#00B4FF] uppercase tracking-wider mb-3">
                  Recommended Adjustments
                </p>
                <div className="space-y-3">
                  {result.loadBoltAdjustments.map((adj, i) => (
                    <div key={i} className="bg-[#1A1A28] rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#D4D4E0]">
                          {adj.corner} Load Bolt
                        </span>
                        <span className="font-mono text-sm font-bold text-[#00B4FF]">
                          {Math.abs(adj.turns).toFixed(1)} turn
                          {Math.abs(adj.turns) !== 1 ? 's' : ''} {adj.direction}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7A90] mt-1">{adj.explanation}</p>
                      <p className="text-[10px] text-[#555570] mt-0.5">
                        Weight change: {adj.weightChange > 0 ? '+' : ''}
                        {adj.weightChange} lbs on {adj.corner}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-[#14141F] border border-[#2A2A3A] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#7A7A90]">
            Sign up free to save corner weight sheets to your garage.
          </p>
          <Link
            href="/sign-up"
            className="bg-[#00B4FF] text-[#0A0A0F] font-semibold px-6 py-3 rounded-md hover:bg-[#33C4FF] transition-colors text-sm whitespace-nowrap"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </section>
  )
}
