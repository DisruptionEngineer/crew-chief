'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculateRimOffset } from '@/data/calculators/rim-offset'
import type { RimOffsetInput } from '@/lib/types'

export default function RimOffsetPage() {
  const [input, setInput] = useState<RimOffsetInput>({
    rimWidth: 8,
    backspacing: 4.5,
    tireWidth: 225,
    stockBackspacing: 4.25,
    stockRimWidth: 7,
    kingpinOffset: 1.5,
  })

  const result = useMemo(() => calculateRimOffset(input), [input])

  function update(key: keyof RimOffsetInput, value: number) {
    setInput(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <Link href="/calculators" className="text-xs text-[#555] hover:text-[#888] transition-colors inline-flex items-center gap-1 group">
          <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Calculators
        </Link>
        <h1 className="text-2xl font-bold tracking-tight uppercase mt-2">Rim Offset Calculator</h1>
        <p className="text-sm text-[#666] mt-1">Backspacing to offset, scrub radius, track width change</p>
      </div>

      {/* New Wheel */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#448AFF] uppercase tracking-wider mb-3">New Wheel</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Rim Width</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={input.rimWidth}
                onChange={e => update('rimWidth', parseFloat(e.target.value) || 7)}
                step={0.5}
                min={5}
                max={12}
                className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600] min-h-[44px]"
              />
              <span className="text-[10px] text-[#666]">&quot;</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Backspacing</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={input.backspacing}
                onChange={e => update('backspacing', parseFloat(e.target.value) || 4)}
                step={0.125}
                min={2}
                max={7}
                className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600] min-h-[44px]"
              />
              <span className="text-[10px] text-[#666]">&quot;</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Tire Width</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={input.tireWidth}
                onChange={e => update('tireWidth', parseFloat(e.target.value) || 225)}
                step={5}
                min={145}
                max={325}
                className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600] min-h-[44px]"
              />
              <span className="text-[10px] text-[#666]">mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Reference */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Stock Reference</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Stock Backspacing</label>
            <input
              type="number"
              value={input.stockBackspacing}
              onChange={e => update('stockBackspacing', parseFloat(e.target.value) || 4.25)}
              step={0.125}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Stock Rim Width</label>
            <input
              type="number"
              value={input.stockRimWidth ?? 7}
              onChange={e => update('stockRimWidth', parseFloat(e.target.value) || 7)}
              step={0.5}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Kingpin Offset</label>
            <input
              type="number"
              value={input.kingpinOffset ?? 1.5}
              onChange={e => update('kingpinOffset', parseFloat(e.target.value) || 1.5)}
              step={0.25}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FFD600]"
            />
          </div>
        </div>
      </div>

      <div className="checkered-divider" />

      {/* Results */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Results</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Offset</p>
            <p className="font-mono text-2xl font-bold mt-1 text-[#448AFF]">
              {result.offsetMm > 0 ? '+' : ''}{result.offsetMm.toFixed(0)} mm
            </p>
            <p className="text-[10px] text-[#666]">{result.offsetInches.toFixed(3)}&quot;</p>
          </div>
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Stock Offset</p>
            <p className="font-mono text-2xl font-bold mt-1">
              {result.stockOffsetMm > 0 ? '+' : ''}{result.stockOffsetMm.toFixed(0)} mm
            </p>
          </div>
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Centerline Shift</p>
            <p className={`font-mono text-xl font-bold mt-1 ${
              Math.abs(result.centerlineShift) < 0.25 ? 'text-[#00E676]' :
              Math.abs(result.centerlineShift) < 0.75 ? 'text-[#FFD600]' : 'text-[#FF1744]'
            }`}>
              {result.centerlineShift > 0 ? '+' : ''}{result.centerlineShift.toFixed(3)}&quot;
            </p>
            <p className="text-[10px] text-[#666]">{result.centerlineShift > 0 ? 'Outward' : result.centerlineShift < 0 ? 'Inward' : 'No change'}</p>
          </div>
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Track Width Change</p>
            <p className="font-mono text-xl font-bold mt-1">
              {result.trackWidthChange > 0 ? '+' : ''}{result.trackWidthChange.toFixed(2)}&quot;
            </p>
            <p className="text-[10px] text-[#666]">Both sides combined</p>
          </div>
        </div>

        {/* Scrub Radius */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Scrub Radius Change</p>
            <p className={`font-mono text-lg font-bold mt-1 ${
              Math.abs(result.scrubRadiusChange) < 0.5 ? 'text-[#00E676]' : 'text-[#FFD600]'
            }`}>
              {result.scrubRadiusChange > 0 ? '+' : ''}{result.scrubRadiusChange.toFixed(2)}&quot;
            </p>
          </div>
          <div className="bg-[#252525] rounded-md p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Est. Scrub Radius</p>
            <p className="font-mono text-lg font-bold mt-1">{result.estimatedScrubRadius.toFixed(2)}&quot;</p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-lg p-4">
          <p className="text-xs font-semibold text-[#FF1744] uppercase tracking-wider mb-2">Warnings</p>
          <ul className="space-y-1.5">
            {result.warnings.map((w, i) => (
              <li key={i} className="text-sm text-[#F5F5F5] flex items-start gap-2">
                <span className="text-[#FF1744] flex-shrink-0 mt-0.5">&#x26A0;</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
