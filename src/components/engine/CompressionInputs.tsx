'use client'

import { useState } from 'react'
import { calcCompressionRatio, calcDisplacement } from '@/data/engine/simulate'
import { findHeadById } from '@/data/engine/families/registry'
import type { EngineBuildConfig, EngineFamily, DivisionEngineRules } from '@/lib/types'

interface CompressionInputsProps {
  config: EngineBuildConfig
  engineFamily: EngineFamily
  divisionRules: DivisionEngineRules
  onChange: (partial: Partial<EngineBuildConfig>) => void
}

export function CompressionInputs({ config, engineFamily, divisionRules, onChange }: CompressionInputsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const head = findHeadById(config.headId)
  const chamberVol = head?.chamberVolume ?? 64

  const cr = calcCompressionRatio(
    config.bore,
    config.stroke,
    chamberVol,
    config.pistonDish,
    config.headGasketThickness,
    config.headGasketBore,
  )

  const displacement = calcDisplacement(config.bore, config.stroke)

  // CR limits from division rules
  const maxCR = divisionRules.maxCompression
  const crColor = cr > maxCR ? '#FF1744' : cr > maxCR - 0.3 ? '#00B4FF' : '#00E676'

  // Build bore steps from engine family defaults + overbore options
  const stockBore = engineFamily.defaultBore
  const boreLimits = divisionRules.boreLimits[engineFamily.id]
  const maxBore = boreLimits?.maxBore ?? stockBore + 0.060
  const boreSteps = [stockBore]
  for (let b = stockBore + 0.010; b <= maxBore + 0.001; b += 0.010) {
    boreSteps.push(Math.round(b * 1000) / 1000)
  }

  return (
    <div className="space-y-4">
      {/* Live CR + Displacement display */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1A1A28] rounded-md p-3 text-center">
          <p className="text-[10px] text-[#555570] uppercase">Compression Ratio</p>
          <p className="font-mono text-2xl font-bold mt-1" style={{ color: crColor }}>
            {cr.toFixed(2)}:1
          </p>
          {cr > maxCR && (
            <p className="text-[10px] text-[#FF1744] mt-1">EXCEEDS {maxCR}:1 LIMIT</p>
          )}
        </div>
        <div className="bg-[#1A1A28] rounded-md p-3 text-center">
          <p className="text-[10px] text-[#555570] uppercase">Displacement</p>
          <p className="font-mono text-2xl font-bold mt-1">
            {displacement.toFixed(1)}
          </p>
          <p className="text-[10px] text-[#555570]">cubic inches</p>
        </div>
      </div>

      {/* Bore selector */}
      <div>
        <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">
          Bore Size
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {boreSteps.map(bore => (
            <button
              key={bore}
              onClick={() => onChange({ bore })}
              className={`px-3 py-2 rounded-md text-sm font-mono transition-colors min-h-[40px] ${
                Math.round(config.bore * 1000) / 1000 === bore
                  ? 'bg-[#00B4FF] text-[#0A0A0F] font-semibold'
                  : 'bg-[#1A1A28] text-[#7A7A90] hover:text-[#D4D4E0] border border-[#2A2A3A]'
              }`}
            >
              {bore.toFixed(3)}&quot;
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[#555570] mt-1">
          Stock: {stockBore.toFixed(3)}&quot; &mdash; Max legal: {maxBore.toFixed(3)}&quot;
        </p>
      </div>

      {/* Stroke — locked */}
      <div>
        <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">
          Stroke
        </label>
        <div className="bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 flex items-center justify-between">
          <span className="font-mono text-sm">{config.stroke}&quot; (stock &mdash; locked)</span>
          <span className="text-[10px] text-[#555570]">No strokers allowed</span>
        </div>
      </div>

      {/* Piston dish volume */}
      <div>
        <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">
          Piston Dish Volume
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange({ pistonDish: Math.max(-12, config.pistonDish - 2) })}
            className="stepper-btn"
          >
            &minus;
          </button>
          <div className="flex-1 text-center">
            <p className="font-mono text-lg font-semibold">{config.pistonDish} cc</p>
            <p className="text-[10px] text-[#555570]">
              {config.pistonDish > 0 ? 'Dished (lowers CR)' : config.pistonDish < 0 ? 'Domed (raises CR)' : 'Flat-top'}
            </p>
          </div>
          <button
            onClick={() => onChange({ pistonDish: Math.min(16, config.pistonDish + 2) })}
            className="stepper-btn"
          >
            +
          </button>
        </div>
      </div>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-[#555570] hover:text-[#7A7A90] transition-colors flex items-center gap-1"
      >
        <svg className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Advanced: Head gasket specs
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-[#2A2A3A]">
          <div>
            <label className="text-[10px] text-[#555570] uppercase block mb-1">Gasket Thickness</label>
            <input
              type="number"
              value={config.headGasketThickness}
              onChange={e => onChange({ headGasketThickness: parseFloat(e.target.value) || 0.039 })}
              step={0.005}
              min={0.015}
              max={0.060}
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
            />
            <p className="text-[9px] text-[#3A3A4A] mt-0.5">Standard: .039&quot;</p>
          </div>
          <div>
            <label className="text-[10px] text-[#555570] uppercase block mb-1">Gasket Bore</label>
            <input
              type="number"
              value={config.headGasketBore}
              onChange={e => onChange({ headGasketBore: parseFloat(e.target.value) || 4.100 })}
              step={0.010}
              min={3.000}
              max={4.500}
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
            />
            <p className="text-[9px] text-[#3A3A4A] mt-0.5">Typically bore + .100&quot;</p>
          </div>
        </div>
      )}
    </div>
  )
}
