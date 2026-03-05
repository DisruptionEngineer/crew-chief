'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculateGearRatios } from '@/data/calculators/gear-ratio'
import type { GearRatioInput } from '@/lib/types'

// Preset transmission ratios
const PRESETS: Record<string, { label: string; ratios: Record<string, number> }> = {
  'th350': { label: 'TH350', ratios: { '1st': 2.52, '2nd': 1.52, '3rd': 1.00 } },
  'th400': { label: 'TH400', ratios: { '1st': 2.48, '2nd': 1.48, '3rd': 1.00 } },
  'powerglide': { label: 'Powerglide', ratios: { 'Low': 1.76, 'High': 1.00 } },
  'muncie': { label: 'Muncie M21', ratios: { '1st': 2.20, '2nd': 1.64, '3rd': 1.28, '4th': 1.00 } },
  'c4': { label: 'C4', ratios: { '1st': 2.46, '2nd': 1.46, '3rd': 1.00 } },
  'c6': { label: 'C6', ratios: { '1st': 2.46, '2nd': 1.46, '3rd': 1.00 } },
  'a727': { label: 'A727 Torqueflite', ratios: { '1st': 2.45, '2nd': 1.45, '3rd': 1.00 } },
}

export default function GearRatioPage() {
  const [transPreset, setTransPreset] = useState('th350')
  const [input, setInput] = useState<GearRatioInput>({
    rearGearRatio: 3.73,
    tireDiameter: 26.5,
    transmissionRatios: PRESETS['th350'].ratios,
    peakTorqueRpm: 4200,
    peakHpRpm: 5400,
    trackTopSpeed: 65,
  })

  const result = useMemo(() => calculateGearRatios(input), [input])

  function handlePresetChange(key: string) {
    setTransPreset(key)
    setInput(prev => ({ ...prev, transmissionRatios: PRESETS[key].ratios }))
  }

  function update(key: keyof GearRatioInput, value: number) {
    setInput(prev => ({ ...prev, [key]: value }))
  }

  const gearNames = Object.keys(input.transmissionRatios)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <Link href="/calculators" className="text-xs text-[#555] hover:text-[#888] transition-colors inline-flex items-center gap-1 group">
          <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Calculators
        </Link>
        <h1 className="text-2xl font-bold tracking-tight uppercase mt-2">Gear Ratio Calculator</h1>
        <p className="text-sm text-[#666] mt-1">RPM at speed for your drivetrain combo</p>
      </div>

      {/* Transmission Preset */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Transmission</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors min-h-[40px] ${
                transPreset === key
                  ? 'bg-[#FF8A00] text-[#0D0D0D]'
                  : 'bg-[#252525] text-[#888] border border-[#333] hover:border-[#555]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Show gear ratios */}
        <div className="flex gap-3 mt-3">
          {gearNames.map(gear => (
            <div key={gear} className="text-center">
              <p className="text-[10px] text-[#666] uppercase">{gear}</p>
              <p className="font-mono text-sm font-semibold">{input.transmissionRatios[gear]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drivetrain Inputs */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Drivetrain</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Rear Gear</label>
            <input
              type="number"
              value={input.rearGearRatio}
              onChange={e => update('rearGearRatio', parseFloat(e.target.value) || 3.73)}
              step={0.01}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[44px]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Tire Dia.</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={input.tireDiameter}
                onChange={e => update('tireDiameter', parseFloat(e.target.value) || 26)}
                step={0.5}
                className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[44px]"
              />
              <span className="text-[10px] text-[#666]">&quot;</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Track Top Speed</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={input.trackTopSpeed ?? 65}
                onChange={e => update('trackTopSpeed', parseFloat(e.target.value) || 65)}
                step={5}
                className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[44px]"
              />
              <span className="text-[10px] text-[#666]">mph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engine RPM points */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Engine Reference Points</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Peak Torque RPM</label>
            <input
              type="number"
              value={input.peakTorqueRpm ?? 4200}
              onChange={e => update('peakTorqueRpm', parseFloat(e.target.value) || 4200)}
              step={100}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#666] uppercase block mb-1">Peak HP RPM</label>
            <input
              type="number"
              value={input.peakHpRpm ?? 5400}
              onChange={e => update('peakHpRpm', parseFloat(e.target.value) || 5400)}
              step={100}
              className="w-full bg-[#252525] border border-[#333] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
            />
          </div>
        </div>
      </div>

      <div className="checkered-divider" />

      {/* Key Numbers */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-center">
          <p className="text-[10px] text-[#666] uppercase">Effective Ratio</p>
          <p className="font-mono text-xl font-bold mt-1 text-[#FF9100]">{result.effectiveRatio}</p>
          <p className="text-[10px] text-[#666]">rear &times; top gear</p>
        </div>
        {result.speedAtPeakTorque !== undefined && (
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Peak TQ Speed</p>
            <p className="font-mono text-xl font-bold mt-1 text-[#00E676]">{result.speedAtPeakTorque} mph</p>
            <p className="text-[10px] text-[#666]">in top gear</p>
          </div>
        )}
        {result.speedAtPeakHp !== undefined && (
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-center">
            <p className="text-[10px] text-[#666] uppercase">Peak HP Speed</p>
            <p className="font-mono text-xl font-bold mt-1 text-[#448AFF]">{result.speedAtPeakHp} mph</p>
            <p className="text-[10px] text-[#666]">in top gear</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-2">Analysis</p>
          <div className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <p key={i} className="text-sm text-[#F5F5F5] leading-relaxed">{rec}</p>
            ))}
          </div>
        </div>
      )}

      {/* RPM at Speed Table */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden">
        <div className="p-4 pb-2">
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wider">RPM at Speed</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="text-left text-[10px] text-[#666] uppercase px-4 py-2 font-semibold">MPH</th>
                {gearNames.map(gear => (
                  <th key={gear} className="text-right text-[10px] text-[#666] uppercase px-4 py-2 font-semibold">{gear}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rpmAtSpeed.map(row => (
                <tr key={row.mph} className="border-b border-[#252525] hover:bg-[#252525]/50">
                  <td className="px-4 py-2 font-mono font-semibold">{row.mph}</td>
                  {gearNames.map(gear => {
                    const rpm = row.gearRpms[gear]
                    // Highlight RPM zones
                    const isTorqueZone = input.peakTorqueRpm && Math.abs(rpm - input.peakTorqueRpm) < 300
                    const isHpZone = input.peakHpRpm && Math.abs(rpm - input.peakHpRpm) < 300
                    const isOverRev = rpm > 6500
                    return (
                      <td
                        key={gear}
                        className={`px-4 py-2 font-mono text-right ${
                          isOverRev ? 'text-[#FF1744]' :
                          isHpZone ? 'text-[#448AFF] font-semibold' :
                          isTorqueZone ? 'text-[#00E676] font-semibold' :
                          'text-[#B0B0B0]'
                        }`}
                      >
                        {rpm.toLocaleString()}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="px-4 py-2 border-t border-[#333] flex gap-4 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00E676]" /> Peak Torque Zone
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#448AFF]" /> Peak HP Zone
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF1744]" /> Over-Rev
          </span>
        </div>
      </div>
    </div>
  )
}
