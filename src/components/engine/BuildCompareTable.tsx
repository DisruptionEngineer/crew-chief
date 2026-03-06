'use client'

import type { SavedEngineBuild } from '@/lib/types'
import { findHeadById as getHeadById, findCamById as getCamById } from '@/data/engine/families/registry'

interface BuildCompareTableProps {
  buildA: SavedEngineBuild
  buildB: SavedEngineBuild
}

export function BuildCompareTable({ buildA, buildB }: BuildCompareTableProps) {
  const headA = getHeadById(buildA.config.headId)
  const headB = getHeadById(buildB.config.headId)
  const camA = getCamById(buildA.config.camId)
  const camB = getCamById(buildB.config.camId)

  const rows: CompareRow[] = [
    {
      label: 'Peak HP',
      a: `${buildA.result.peakHp}`,
      b: `${buildB.result.peakHp}`,
      winner: buildA.result.peakHp > buildB.result.peakHp ? 'a' : buildB.result.peakHp > buildA.result.peakHp ? 'b' : 'tie',
    },
    {
      label: 'Peak HP RPM',
      a: `${buildA.result.peakHpRpm.toLocaleString()}`,
      b: `${buildB.result.peakHpRpm.toLocaleString()}`,
      winner: 'tie', // RPM isn't strictly better/worse
    },
    {
      label: 'Peak Torque',
      a: `${buildA.result.peakTorque} lb-ft`,
      b: `${buildB.result.peakTorque} lb-ft`,
      winner: buildA.result.peakTorque > buildB.result.peakTorque ? 'a' : buildB.result.peakTorque > buildA.result.peakTorque ? 'b' : 'tie',
    },
    {
      label: 'Peak TQ RPM',
      a: `${buildA.result.peakTorqueRpm.toLocaleString()}`,
      b: `${buildB.result.peakTorqueRpm.toLocaleString()}`,
      winner: 'tie',
    },
    {
      label: 'Displacement',
      a: `${buildA.result.displacement} CID`,
      b: `${buildB.result.displacement} CID`,
      winner: 'tie',
    },
    {
      label: 'Compression',
      a: `${buildA.result.compressionRatio}:1`,
      b: `${buildB.result.compressionRatio}:1`,
      winner: 'tie',
    },
    {
      label: 'Heads',
      a: headA?.name || buildA.config.headId,
      b: headB?.name || buildB.config.headId,
      winner: 'tie',
    },
    {
      label: 'Cam Lift',
      a: camA?.lift != null ? `${camA.lift}"` : '—',
      b: camB?.lift != null ? `${camB.lift}"` : '—',
      winner: 'tie',
    },
    {
      label: 'Cam Duration',
      a: camA?.duration != null ? `${camA.duration}°` : '—',
      b: camB?.duration != null ? `${camB.duration}°` : '—',
      winner: 'tie',
    },
    {
      label: 'Bore',
      a: `${buildA.config.bore.toFixed(3)}"`,
      b: `${buildB.config.bore.toFixed(3)}"`,
      winner: 'tie',
    },
    {
      label: 'Compliance',
      a: buildA.result.compliance.isLegal ? '✓ Legal' : '✗ Illegal',
      b: buildB.result.compliance.isLegal ? '✓ Legal' : '✗ Illegal',
      winner: 'tie',
      aColor: buildA.result.compliance.isLegal ? '#00E676' : '#FF1744',
      bColor: buildB.result.compliance.isLegal ? '#00E676' : '#FF1744',
    },
  ]

  return (
    <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 gap-0 border-b border-[#2A2A3A]">
        <div className="p-3" />
        <div className="p-3 text-center border-l border-[#2A2A3A]">
          <p className="text-xs font-semibold text-[#00B4FF] truncate">{buildA.name}</p>
        </div>
        <div className="p-3 text-center border-l border-[#2A2A3A]">
          <p className="text-xs font-semibold text-[#7A7A90] truncate">{buildB.name}</p>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={row.label} className={`grid grid-cols-3 gap-0 ${i < rows.length - 1 ? 'border-b border-[#2A2A3A]/50' : ''}`}>
          <div className="p-3 flex items-center">
            <span className="text-xs text-[#7A7A90]">{row.label}</span>
          </div>
          <div className={`p-3 text-center border-l border-[#2A2A3A]/50 ${row.winner === 'a' ? 'bg-[#00B4FF]/5' : ''}`}>
            <span
              className={`font-mono text-sm ${row.winner === 'a' ? 'text-[#00B4FF] font-semibold' : 'text-[#D4D4E0]'}`}
              style={row.aColor ? { color: row.aColor } : undefined}
            >
              {row.a}
            </span>
          </div>
          <div className={`p-3 text-center border-l border-[#2A2A3A]/50 ${row.winner === 'b' ? 'bg-[#00B4FF]/5' : ''}`}>
            <span
              className={`font-mono text-sm ${row.winner === 'b' ? 'text-[#00B4FF] font-semibold' : 'text-[#D4D4E0]'}`}
              style={row.bColor ? { color: row.bColor } : undefined}
            >
              {row.b}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface CompareRow {
  label: string
  a: string
  b: string
  winner: 'a' | 'b' | 'tie'
  aColor?: string
  bColor?: string
}
