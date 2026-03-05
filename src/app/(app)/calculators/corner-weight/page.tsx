'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculateCornerWeights } from '@/data/calculators/corner-weight'
import type { CornerWeightInput } from '@/lib/types'

export default function CornerWeightPage() {
  const [input, setInput] = useState<CornerWeightInput>({
    weightLF: 825,
    weightRF: 825,
    weightLR: 825,
    weightRR: 825,
    targetCrossWeight: 50.0,
    targetLeftPct: 55,
    targetRearPct: 49,
    lbsPerTurn: 12,
  })

  const result = useMemo(() => calculateCornerWeights(input), [input])

  function update(key: keyof CornerWeightInput, value: number) {
    setInput(prev => ({ ...prev, [key]: value }))
  }

  // Status color
  function pctColor(value: number, target: number | undefined, tolerancePct: number = 1) {
    if (!target) return '#F5F5F5'
    const diff = Math.abs(value - target)
    if (diff < tolerancePct * 0.3) return '#00E676'
    if (diff < tolerancePct) return '#FF8A00'
    return '#FF1744'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <Link href="/calculators" className="text-xs text-[#555] hover:text-[#888] transition-colors inline-flex items-center gap-1 group">
          <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Calculators
        </Link>
        <h1 className="text-2xl font-bold tracking-tight uppercase mt-2">Corner Weight Calculator</h1>
        <p className="text-sm text-[#666] mt-1">Enter scale readings, get load bolt adjustments</p>
      </div>

      {/* Corner Weight Inputs — 2x2 grid */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Scale Readings (lbs)</p>
        <div className="grid grid-cols-2 gap-3">
          {(['LF', 'RF', 'LR', 'RR'] as const).map(corner => {
            const key = `weight${corner}` as keyof CornerWeightInput
            return (
              <div key={corner} className="bg-[#252525] rounded-md p-3">
                <label className="text-[10px] text-[#666] uppercase block mb-1">{corner}</label>
                <input
                  type="number"
                  value={input[key] as number}
                  onChange={e => update(key, parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2.5 font-mono text-lg text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[44px]"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Targets */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Targets</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Cross Weight %</label>
            <input
              type="number"
              value={input.targetCrossWeight ?? 50}
              onChange={e => update('targetCrossWeight', parseFloat(e.target.value) || 50)}
              step={0.5}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Left %</label>
            <input
              type="number"
              value={input.targetLeftPct ?? 55}
              onChange={e => update('targetLeftPct', parseFloat(e.target.value) || 55)}
              step={0.5}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Rear %</label>
            <input
              type="number"
              value={input.targetRearPct ?? 49}
              onChange={e => update('targetRearPct', parseFloat(e.target.value) || 49)}
              step={0.5}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="text-[10px] text-[#666] uppercase block mb-1">Lbs per Jack Bolt Turn</label>
          <input
            type="number"
            value={input.lbsPerTurn ?? 12}
            onChange={e => update('lbsPerTurn', parseFloat(e.target.value) || 12)}
            step={1}
            className="w-24 bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
          />
        </div>
      </div>

      <div className="checkered-divider" />

      {/* Results */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Results</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Total Weight</p>
            <p className="font-mono text-2xl font-bold mt-1">{result.totalWeight}</p>
            <p className="text-[10px] text-[#666]">lbs</p>
          </div>
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Cross Weight</p>
            <p className="font-mono text-2xl font-bold mt-1" style={{ color: pctColor(result.crossWeightPct, input.targetCrossWeight) }}>
              {result.crossWeightPct.toFixed(1)}%
            </p>
            <p className="text-[10px] text-[#666]">RF + LR = {result.crossWeight} lbs</p>
          </div>
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Left %</p>
            <p className="font-mono text-xl font-bold mt-1" style={{ color: pctColor(result.leftPct, input.targetLeftPct, 2) }}>
              {result.leftPct.toFixed(1)}%
            </p>
            <p className="text-[10px] text-[#666]">{result.leftWeight} lbs</p>
          </div>
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Rear %</p>
            <p className="font-mono text-xl font-bold mt-1" style={{ color: pctColor(result.rearPct, input.targetRearPct, 2) }}>
              {result.rearPct.toFixed(1)}%
            </p>
            <p className="text-[10px] text-[#666]">{result.rearWeight} lbs</p>
          </div>
        </div>

        {/* Diagonal bias */}
        <div className="mt-3 bg-[#252525] rounded-md p-3 text-center">
          <p className="text-[10px] text-[#666] uppercase">Diagonal Bias</p>
          <p className={`font-mono text-lg font-bold mt-1 ${
            Math.abs(result.diagonalBias) < 0.5 ? 'text-[#00E676]' :
            Math.abs(result.diagonalBias) < 1.5 ? 'text-[#FF8A00]' : 'text-[#FF1744]'
          }`}>
            {result.diagonalBias > 0 ? '+' : ''}{result.diagonalBias.toFixed(1)}%
          </p>
          <p className="text-[10px] text-[#666]">
            {Math.abs(result.diagonalBias) < 0.5 ? 'Balanced' :
             result.diagonalBias > 0 ? 'RF+LR heavy (typical oval bias)' : 'LF+RR heavy'}
          </p>
        </div>
      </div>

      {/* Load Bolt Adjustments */}
      {result.loadBoltAdjustments.length > 0 && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">
            Recommended Adjustments
          </p>
          <div className="space-y-3">
            {result.loadBoltAdjustments.map((adj, i) => (
              <div key={i} className="bg-[#252525] rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#F5F5F5]">{adj.corner} Load Bolt</span>
                  <span className="font-mono text-sm font-bold text-[#FF8A00]">
                    {Math.abs(adj.turns).toFixed(1)} turn{Math.abs(adj.turns) !== 1 ? 's' : ''} {adj.direction}
                  </span>
                </div>
                <p className="text-[11px] text-[#888] mt-1">{adj.explanation}</p>
                <p className="text-[10px] text-[#666] mt-0.5">
                  Weight change: {adj.weightChange > 0 ? '+' : ''}{adj.weightChange} lbs on {adj.corner}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
