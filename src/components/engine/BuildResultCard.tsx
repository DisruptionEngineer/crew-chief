'use client'

import type { EngineBuildResult } from '@/lib/types'
import { getHeadById } from '@/data/engine/heads'
import { getCamById } from '@/data/engine/cams'

interface BuildResultCardProps {
  result: EngineBuildResult
}

export function BuildResultCard({ result }: BuildResultCardProps) {
  const head = getHeadById(result.config.headId)
  const cam = getCamById(result.config.camId)

  return (
    <div className="space-y-3">
      {/* Peak numbers */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Peak Horsepower"
          value={result.peakHp}
          subValue={`@ ${result.peakHpRpm.toLocaleString()} RPM`}
          accent
        />
        <StatCard
          label="Peak Torque"
          value={result.peakTorque}
          unit="lb-ft"
          subValue={`@ ${result.peakTorqueRpm.toLocaleString()} RPM`}
        />
        <StatCard
          label="Displacement"
          value={result.displacement}
          unit="CID"
        />
        <StatCard
          label="Compression"
          value={`${result.compressionRatio}:1`}
          color={result.compressionRatio > 10.5 ? '#FF1744' : result.compressionRatio > 10.2 ? '#00B4FF' : '#00E676'}
        />
      </div>

      {/* Build summary */}
      <div className="bg-[#1A1A28] rounded-md p-3">
        <p className="text-[10px] text-[#555570] uppercase mb-2">Build Summary</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#7A7A90]">Heads</span>
            <span className="font-mono">{head?.name || result.config.headId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A7A90]">Cam</span>
            <span className="font-mono">{cam?.lift}" / {cam?.duration}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A7A90]">Bore</span>
            <span className="font-mono">{result.config.bore.toFixed(3)}"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A7A90]">Piston</span>
            <span className="font-mono">{result.config.pistonDish}cc dish</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, unit, subValue, accent, color }: {
  label: string
  value: number | string
  unit?: string
  subValue?: string
  accent?: boolean
  color?: string
}) {
  const valueColor = color || (accent ? '#00B4FF' : '#D4D4E0')
  return (
    <div className={`bg-[#1A1A28] rounded-md p-3 ${accent ? 'ring-1 ring-[#00B4FF]/15' : ''}`}>
      <p className="text-[10px] text-[#3A3A4A] uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className="font-mono text-2xl font-bold"
          style={{ color: valueColor }}
        >
          {value}
        </span>
        {unit && <span className="text-[10px] text-[#555570]">{unit}</span>}
      </div>
      {subValue && <p className="text-[10px] text-[#555570] mt-0.5">{subValue}</p>}
    </div>
  )
}
