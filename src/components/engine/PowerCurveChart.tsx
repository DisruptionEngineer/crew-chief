'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
} from 'recharts'
import type { PowerCurvePoint } from '@/lib/types'

interface PowerCurveChartProps {
  curve: PowerCurvePoint[]
  peakHpRpm: number
  peakTorqueRpm: number
  peakHp: number
  peakTorque: number
  // Optional second curve for comparison
  compareCurve?: PowerCurvePoint[]
  compareLabel?: string
}

export function PowerCurveChart({
  curve,
  peakHpRpm,
  peakTorqueRpm,
  peakHp,
  peakTorque,
  compareCurve,
  compareLabel,
}: PowerCurveChartProps) {
  // Merge data for comparison view
  const data = curve.map((pt, i) => ({
    rpm: pt.rpm,
    hp: pt.hp,
    torque: pt.torque,
    ve: Math.round(pt.ve * 100),
    ...(compareCurve ? {
      hp2: compareCurve[i]?.hp ?? 0,
      torque2: compareCurve[i]?.torque ?? 0,
    } : {}),
  }))

  const maxY = Math.max(
    ...curve.map(p => Math.max(p.hp, p.torque)),
    ...(compareCurve ? compareCurve.map(p => Math.max(p.hp, p.torque)) : []),
  )
  const yMax = Math.ceil(maxY / 50) * 50 + 50

  return (
    <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
      <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
        Power Curve
      </p>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" />
            <XAxis
              dataKey="rpm"
              stroke="#555570"
              tick={{ fill: '#7A7A90', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
            />
            <YAxis
              domain={[0, yMax]}
              stroke="#555570"
              tick={{ fill: '#7A7A90', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A28',
                border: '1px solid #2A2A3A',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
              labelStyle={{ color: '#D4D4E0', fontWeight: 600 }}
              labelFormatter={(v) => `${Number(v).toLocaleString()} RPM`}
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  hp: 'HP',
                  torque: 'Torque (lb-ft)',
                  ve: 'VE %',
                  hp2: `HP (${compareLabel || 'Compare'})`,
                  torque2: `Torque (${compareLabel || 'Compare'})`,
                }
                return [String(value), labels[String(name)] || String(name)]
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
            />

            {/* Primary curves */}
            <Line
              type="monotone"
              dataKey="hp"
              name="HP"
              stroke="#00B4FF"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#00B4FF' }}
            />
            <Line
              type="monotone"
              dataKey="torque"
              name="Torque"
              stroke="#7A7A90"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#7A7A90' }}
            />

            {/* Comparison curves */}
            {compareCurve && (
              <>
                <Line
                  type="monotone"
                  dataKey="hp2"
                  name={`HP (${compareLabel || 'B'})`}
                  stroke="#00B4FF"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="torque2"
                  name={`Torque (${compareLabel || 'B'})`}
                  stroke="#555570"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </>
            )}

            {/* Peak markers */}
            <ReferenceDot
              x={peakHpRpm}
              y={peakHp}
              r={5}
              fill="#00B4FF"
              stroke="#0A0A0F"
              strokeWidth={2}
            />
            <ReferenceDot
              x={peakTorqueRpm}
              y={peakTorque}
              r={5}
              fill="#7A7A90"
              stroke="#0A0A0F"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-[#3A3A4A] mt-2 text-center">
        Estimates based on published stock casting flow data at 28" H₂O. Actual results vary with valve job, casting variation, and assembly.
      </p>
    </div>
  )
}
