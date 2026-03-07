'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculateGearRatios } from '@/data/calculators/gear-ratio'

const PRESETS: Record<string, { label: string; ratios: Record<string, number> }> = {
  'th350': { label: 'TH350', ratios: { '1st': 2.52, '2nd': 1.52, '3rd': 1.00 } },
  'th400': { label: 'TH400', ratios: { '1st': 2.48, '2nd': 1.48, '3rd': 1.00 } },
  'powerglide': { label: 'Powerglide', ratios: { 'Low': 1.76, 'High': 1.00 } },
  'muncie-m20': { label: 'Muncie M20', ratios: { '1st': 2.52, '2nd': 1.88, '3rd': 1.46, '4th': 1.00 } },
  'muncie-m21': { label: 'Muncie M21', ratios: { '1st': 2.20, '2nd': 1.64, '3rd': 1.28, '4th': 1.00 } },
  'muncie-m22': { label: 'Muncie M22', ratios: { '1st': 2.20, '2nd': 1.64, '3rd': 1.28, '4th': 1.00 } },
  'saginaw': { label: 'Saginaw 4-spd', ratios: { '1st': 2.54, '2nd': 1.80, '3rd': 1.44, '4th': 1.00 } },
}

export function GearRatioDemo() {
  const [selectedPreset, setSelectedPreset] = useState('th350')
  const [rearGearRatio, setRearGearRatio] = useState(3.73)
  const [tireDiameter, setTireDiameter] = useState(26.5)
  const [peakTorqueRpm, setPeakTorqueRpm] = useState(4200)
  const [peakHpRpm, setPeakHpRpm] = useState(5400)
  const [trackTopSpeed, setTrackTopSpeed] = useState(65)

  const result = useMemo(() => {
    return calculateGearRatios({
      rearGearRatio,
      tireDiameter,
      transmissionRatios: PRESETS[selectedPreset].ratios,
      peakTorqueRpm,
      peakHpRpm,
      trackTopSpeed,
    })
  }, [selectedPreset, rearGearRatio, tireDiameter, peakTorqueRpm, peakHpRpm, trackTopSpeed])

  const gearNames = Object.keys(PRESETS[selectedPreset].ratios)

  function getRpmCellColor(rpm: number): string | undefined {
    if (rpm > 6500) return '#FF1744'
    const torqueDelta = Math.abs(rpm - peakTorqueRpm)
    const hpDelta = Math.abs(rpm - peakHpRpm)
    if (torqueDelta <= 300) return '#00E676'
    if (hpDelta <= 300) return '#00B4FF'
    return undefined
  }

  return (
    <section id="gear-ratio" className="py-12 md:py-20 border-t border-[#2A2A3A]/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-xs font-semibold text-[#FF6B00] uppercase tracking-widest mb-2">
            Try It Now
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Gear Ratio Calculator</h2>
          <p className="text-sm text-[#7A7A90] max-w-2xl">
            Match your rear gear, transmission, and tire diameter to find the RPM sweet spot
            for any short track. See exactly where peak torque and peak HP land at every speed.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column — Inputs */}
          <div className="space-y-5">
            {/* Transmission Presets */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                Transmission
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPreset(key)}
                    className={`py-2.5 rounded-md text-xs font-semibold transition-all ${
                      selectedPreset === key
                        ? 'bg-[#00B4FF] text-[#0A0A0F]'
                        : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A] hover:border-[#3A3A4A]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              {/* Display selected gear ratios */}
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(PRESETS[selectedPreset].ratios).map(([gear, ratio]) => (
                  <span key={gear} className="text-[10px] text-[#555570] font-mono">
                    {gear}: {ratio.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>

            {/* Drivetrain Numbers */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                Drivetrain
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">
                    Rear Gear Ratio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={rearGearRatio}
                    onChange={(e) => setRearGearRatio(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">
                    Tire Diameter (in)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={tireDiameter}
                    onChange={(e) => setTireDiameter(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
              </div>
              <div className="mt-3 text-[10px] text-[#555570] font-mono text-center">
                Effective ratio: {result.effectiveRatio}
              </div>
            </div>

            {/* Engine Reference RPMs */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                Engine Reference RPMs
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">
                    Peak Torque
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={peakTorqueRpm}
                    onChange={(e) => setPeakTorqueRpm(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">
                    Peak HP
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={peakHpRpm}
                    onChange={(e) => setPeakHpRpm(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">
                    Track Top Speed
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={trackTopSpeed}
                    onChange={(e) => setTrackTopSpeed(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Results */}
          <div className="space-y-5">
            {/* Analysis / Recommendations */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                Analysis
              </p>
              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <p key={i} className="text-sm text-[#D4D4E0] leading-relaxed">
                    {rec}
                  </p>
                ))}
              </div>
              {result.speedAtPeakTorque !== undefined && result.speedAtPeakHp !== undefined && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-[#0A0A0F] border border-[#2A2A3A]/50 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-[#555570] uppercase mb-1">Peak Torque Speed</p>
                    <p className="font-mono font-semibold text-xl text-[#00E676]">
                      {result.speedAtPeakTorque} <span className="text-xs text-[#555570]">mph</span>
                    </p>
                  </div>
                  <div className="bg-[#0A0A0F] border border-[#2A2A3A]/50 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-[#555570] uppercase mb-1">Peak HP Speed</p>
                    <p className="font-mono font-semibold text-xl text-[#00B4FF]">
                      {result.speedAtPeakHp} <span className="text-xs text-[#555570]">mph</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RPM at Speed Table */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">
                RPM at Speed
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-[#2A2A3A]">
                      <th className="text-left text-[10px] text-[#555570] uppercase py-2 pr-3">
                        MPH
                      </th>
                      {gearNames.map((gear) => (
                        <th
                          key={gear}
                          className="text-center text-[10px] text-[#555570] uppercase py-2 px-2"
                        >
                          {gear}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rpmAtSpeed.map((row) => (
                      <tr key={row.mph} className="border-b border-[#2A2A3A]/30">
                        <td className="py-1.5 pr-3 text-[#7A7A90]">{row.mph}</td>
                        {gearNames.map((gear) => {
                          const rpm = row.gearRpms[gear]
                          const color = getRpmCellColor(rpm)
                          return (
                            <td
                              key={gear}
                              className="text-center py-1.5 px-2"
                              style={color ? { color } : { color: '#D4D4E0' }}
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
              <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-[#555570]">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#00E676' }}
                  />
                  Near peak torque
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#00B4FF' }}
                  />
                  Near peak HP
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#FF1744' }}
                  />
                  Over-rev (&gt;6500)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-[#14141F] border border-[#2A2A3A] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#7A7A90] text-center sm:text-left">
            Sign up free to save gear setups to your garage.
          </p>
          <Link
            href="/sign-up"
            className="bg-[#00B4FF] text-[#0A0A0F] font-semibold px-6 py-3 rounded-md hover:bg-[#33C4FF] transition-colors text-sm"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  )
}
