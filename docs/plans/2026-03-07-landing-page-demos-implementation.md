# Landing Page Interactive Demos — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3 fully-functional interactive calculator demos (Gear Ratio, Corner Weight, Troubleshooter) as dedicated sections on the landing page to let visitors experience the app before signing up.

**Architecture:** Each demo is a self-contained `'use client'` component in `src/components/landing/`, imported into the marketing landing page (`src/app/(marketing)/page.tsx`). All demos reuse existing pure-function calculators and data — no new business logic needed. Each section has a CTA banner linking to `/sign-up`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 (utility classes only, no config file), existing calculator functions from `src/data/calculators/`.

---

### Task 1: Create the Gear Ratio Demo Component

**Files:**
- Create: `src/components/landing/GearRatioDemo.tsx`

**Step 1: Create the component file**

This component adapts the authenticated gear ratio page (`src/app/(app)/calculators/gear-ratio/page.tsx`) into a landing-page section. Key differences from the app version:
- Wrapped in a `<section>` with id="gear-ratio" for anchor nav
- Has section header with icon + title + description
- Two-column layout (inputs left, results right) on desktop
- CTA banner at the bottom
- No breadcrumb/back link
- Same transmission presets: TH350, TH400, Powerglide, Muncie M21, C4, C6, A727

```tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculateGearRatios } from '@/data/calculators/gear-ratio'
import type { GearRatioInput } from '@/lib/types'

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
    <section id="gear-ratio" className="py-12 md:py-20 border-t border-[#2A2A3A]/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold text-[#FF6B00] uppercase tracking-widest mb-2">Try It Now</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Gear Ratio Calculator</h2>
          <p className="text-[#7A7A90] max-w-md mx-auto">
            Pick your transmission, enter your rear gear and tire size, and see RPM at every speed — color-coded to your power band.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            {/* Transmission Preset */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Transmission</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handlePresetChange(key)}
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      transPreset === key
                        ? 'bg-[#00B4FF] text-[#0A0A0F]'
                        : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A] hover:border-[#3A3A4A]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-3">
                {gearNames.map(gear => (
                  <div key={gear} className="text-center">
                    <p className="text-[10px] text-[#555570] uppercase">{gear}</p>
                    <p className="font-mono text-sm font-semibold">{input.transmissionRatios[gear]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Drivetrain */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Drivetrain</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">Rear Gear</label>
                  <input
                    type="number"
                    value={input.rearGearRatio}
                    onChange={e => update('rearGearRatio', parseFloat(e.target.value) || 3.73)}
                    step={0.01}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">Tire Dia.</label>
                  <input
                    type="number"
                    value={input.tireDiameter}
                    onChange={e => update('tireDiameter', parseFloat(e.target.value) || 26)}
                    step={0.5}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">Top Speed</label>
                  <input
                    type="number"
                    value={input.trackTopSpeed ?? 65}
                    onChange={e => update('trackTopSpeed', parseFloat(e.target.value) || 65)}
                    step={5}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
              </div>
            </div>

            {/* Engine Reference Points */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Engine Reference</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">Peak Torque RPM</label>
                  <input
                    type="number"
                    value={input.peakTorqueRpm ?? 4200}
                    onChange={e => update('peakTorqueRpm', parseFloat(e.target.value) || 4200)}
                    step={100}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">Peak HP RPM</label>
                  <input
                    type="number"
                    value={input.peakHpRpm ?? 5400}
                    onChange={e => update('peakHpRpm', parseFloat(e.target.value) || 5400)}
                    step={100}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
              </div>
            </div>

            {/* Key Numbers */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-3 text-center">
                <p className="text-[10px] text-[#555570] uppercase">Effective Ratio</p>
                <p className="font-mono text-xl font-bold mt-1 text-[#FF6B00]">{result.effectiveRatio}</p>
              </div>
              {result.speedAtPeakTorque !== undefined && (
                <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">TQ Speed</p>
                  <p className="font-mono text-xl font-bold mt-1 text-[#00E676]">{result.speedAtPeakTorque} mph</p>
                </div>
              )}
              {result.speedAtPeakHp !== undefined && (
                <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">HP Speed</p>
                  <p className="font-mono text-xl font-bold mt-1 text-[#00B4FF]">{result.speedAtPeakHp} mph</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: RPM Table + Analysis */}
          <div className="space-y-4">
            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#00B4FF] uppercase tracking-wider mb-2">Analysis</p>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <p key={i} className="text-sm text-[#D4D4E0] leading-relaxed">{rec}</p>
                  ))}
                </div>
              </div>
            )}

            {/* RPM at Speed Table */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg overflow-hidden">
              <div className="p-4 pb-2">
                <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider">RPM at Speed</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2A3A]">
                      <th className="text-left text-[10px] text-[#555570] uppercase px-4 py-2 font-semibold">MPH</th>
                      {gearNames.map(gear => (
                        <th key={gear} className="text-right text-[10px] text-[#555570] uppercase px-4 py-2 font-semibold">{gear}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rpmAtSpeed.map(row => (
                      <tr key={row.mph} className="border-b border-[#1A1A28] hover:bg-[#1A1A28]/50">
                        <td className="px-4 py-2 font-mono font-semibold">{row.mph}</td>
                        {gearNames.map(gear => {
                          const rpm = row.gearRpms[gear]
                          const isTorqueZone = input.peakTorqueRpm && Math.abs(rpm - input.peakTorqueRpm) < 300
                          const isHpZone = input.peakHpRpm && Math.abs(rpm - input.peakHpRpm) < 300
                          const isOverRev = rpm > 6500
                          return (
                            <td
                              key={gear}
                              className={`px-4 py-2 font-mono text-right ${
                                isOverRev ? 'text-[#FF1744]' :
                                isHpZone ? 'text-[#00B4FF] font-semibold' :
                                isTorqueZone ? 'text-[#00E676] font-semibold' :
                                'text-[#8A8AA0]'
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
              <div className="px-4 py-2 border-t border-[#2A2A3A] flex gap-4 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00E676]" /> Peak Torque</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00B4FF]" /> Peak HP</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF1744]" /> Over-Rev</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-[#14141F] border border-[#2A2A3A] rounded-lg p-6 text-center">
          <p className="text-sm text-[#7A7A90] mb-3">Sign up free to save gear setups to your garage.</p>
          <Link href="/sign-up" className="inline-flex items-center justify-center bg-[#00B4FF] text-[#0A0A0F] font-semibold px-6 py-3 rounded-md hover:bg-[#33C4FF] transition-colors text-sm">
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to `GearRatioDemo.tsx`

**Step 3: Commit**

```bash
git add src/components/landing/GearRatioDemo.tsx
git commit -m "feat: add GearRatioDemo landing page component"
```

---

### Task 2: Create the Corner Weight Demo Component

**Files:**
- Create: `src/components/landing/CornerWeightDemo.tsx`

**Step 1: Create the component file**

Adapts the authenticated corner weight page (`src/app/(app)/calculators/corner-weight/page.tsx`) into a landing-page section. Same key differences as Task 1 (section wrapper, two-col layout, CTA). Uses `calculateCornerWeights()` from `src/data/calculators/corner-weight.ts`.

Default inputs: LF 825, RF 825, LR 575, RR 575 (2800 lb car, 53% front bias — realistic for a figure-8 car).

```tsx
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
    targetCrossWeight: 50.0,
    lbsPerTurn: 12,
  })

  const result = useMemo(() => calculateCornerWeights(input), [input])

  function update(key: keyof CornerWeightInput, value: number) {
    setInput(prev => ({ ...prev, [key]: value }))
  }

  function pctColor(value: number, target: number | undefined, tolerancePct: number = 1) {
    if (!target) return '#D4D4E0'
    const diff = Math.abs(value - target)
    if (diff < tolerancePct * 0.3) return '#00E676'
    if (diff < tolerancePct) return '#00B4FF'
    return '#FF1744'
  }

  return (
    <section id="corner-weight" className="py-12 md:py-20 border-t border-[#2A2A3A]/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold text-[#FF6B00] uppercase tracking-widest mb-2">Try It Now</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Corner Weight Calculator</h2>
          <p className="text-[#7A7A90] max-w-md mx-auto">
            Enter your scale readings, set a target cross-weight, and get exact jack bolt turn counts.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            {/* Corner Weight Inputs */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Scale Readings (lbs)</p>
              <div className="grid grid-cols-2 gap-3">
                {(['LF', 'RF', 'LR', 'RR'] as const).map(corner => {
                  const key = `weight${corner}` as keyof CornerWeightInput
                  return (
                    <div key={corner} className="bg-[#1A1A28] rounded-md p-3">
                      <label className="text-[10px] text-[#555570] uppercase block mb-1">{corner}</label>
                      <input
                        type="number"
                        value={input[key] as number}
                        onChange={e => update(key, parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#14141F] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-lg text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Targets */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Targets</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">Target Cross-Wt %</label>
                  <input
                    type="number"
                    value={input.targetCrossWeight ?? 50}
                    onChange={e => update('targetCrossWeight', parseFloat(e.target.value) || 50)}
                    step={0.5}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#555570] uppercase block mb-1">Lbs per Turn</label>
                  <input
                    type="number"
                    value={input.lbsPerTurn ?? 12}
                    onChange={e => update('lbsPerTurn', parseFloat(e.target.value) || 12)}
                    step={1}
                    className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2 font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#00B4FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {/* Weight Distribution */}
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Results</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Total Weight</p>
                  <p className="font-mono text-2xl font-bold mt-1">{result.totalWeight}</p>
                  <p className="text-[10px] text-[#555570]">lbs</p>
                </div>
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Cross Weight</p>
                  <p className="font-mono text-2xl font-bold mt-1" style={{ color: pctColor(result.crossWeightPct, input.targetCrossWeight) }}>
                    {result.crossWeightPct.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-[#555570]">RF + LR = {result.crossWeight} lbs</p>
                </div>
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Left %</p>
                  <p className="font-mono text-xl font-bold mt-1">{result.leftPct.toFixed(1)}%</p>
                  <p className="text-[10px] text-[#555570]">{result.leftWeight} lbs</p>
                </div>
                <div className="bg-[#1A1A28] rounded-md p-3 text-center">
                  <p className="text-[10px] text-[#555570] uppercase">Rear %</p>
                  <p className="font-mono text-xl font-bold mt-1">{result.rearPct.toFixed(1)}%</p>
                  <p className="text-[10px] text-[#555570]">{result.rearWeight} lbs</p>
                </div>
              </div>

              {/* Diagonal bias */}
              <div className="mt-3 bg-[#1A1A28] rounded-md p-3 text-center">
                <p className="text-[10px] text-[#555570] uppercase">Diagonal Bias</p>
                <p className={`font-mono text-lg font-bold mt-1 ${
                  Math.abs(result.diagonalBias) < 0.5 ? 'text-[#00E676]' :
                  Math.abs(result.diagonalBias) < 1.5 ? 'text-[#00B4FF]' : 'text-[#FF1744]'
                }`}>
                  {result.diagonalBias > 0 ? '+' : ''}{result.diagonalBias.toFixed(1)}%
                </p>
                <p className="text-[10px] text-[#555570]">
                  {Math.abs(result.diagonalBias) < 0.5 ? 'Balanced' :
                   result.diagonalBias > 0 ? 'RF+LR heavy (typical oval bias)' : 'LF+RR heavy'}
                </p>
              </div>
            </div>

            {/* Load Bolt Adjustments */}
            {result.loadBoltAdjustments.length > 0 && (
              <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#00B4FF] uppercase tracking-wider mb-3">Jack Bolt Adjustments</p>
                <div className="space-y-3">
                  {result.loadBoltAdjustments.map((adj, i) => (
                    <div key={i} className="bg-[#1A1A28] rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#D4D4E0]">{adj.corner} Load Bolt</span>
                        <span className="font-mono text-sm font-bold text-[#00B4FF]">
                          {Math.abs(adj.turns).toFixed(1)} turn{Math.abs(adj.turns) !== 1 ? 's' : ''} {adj.direction}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7A90] mt-1">{adj.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-[#14141F] border border-[#2A2A3A] rounded-lg p-6 text-center">
          <p className="text-sm text-[#7A7A90] mb-3">Sign up free to save corner weight sheets to your garage.</p>
          <Link href="/sign-up" className="inline-flex items-center justify-center bg-[#00B4FF] text-[#0A0A0F] font-semibold px-6 py-3 rounded-md hover:bg-[#33C4FF] transition-colors text-sm">
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to `CornerWeightDemo.tsx`

**Step 3: Commit**

```bash
git add src/components/landing/CornerWeightDemo.tsx
git commit -m "feat: add CornerWeightDemo landing page component"
```

---

### Task 3: Create the Troubleshooter Demo Component

**Files:**
- Create: `src/components/landing/TroubleshooterDemo.tsx`

**Step 1: Create the component file**

Adapts the authenticated troubleshooter page (`src/app/(app)/troubleshoot/page.tsx`) into a landing-page section. Uses the same `diagnosticSteps` and `getDiagnosticResult()` from `src/data/troubleshoot/diagnostic-tree.ts`. Same `OptionIcon` rendering logic. Key differences: section wrapper, CTA banner, no header/breadcrumb.

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { diagnosticSteps, getDiagnosticResult } from '@/data/troubleshoot/diagnostic-tree'
import type { DiagnosticResult } from '@/lib/types'

export function TroubleshooterDemo() {
  const [history, setHistory] = useState<string[]>(['symptom'])
  const [result, setResult] = useState<DiagnosticResult | null>(null)

  const currentStepId = history[history.length - 1]
  const currentStep = diagnosticSteps.find(s => s.id === currentStepId)
  const stepNumber = history.length
  const totalSteps = 3

  function handleOption(option: { nextStepId?: string; resultId?: string }) {
    if (option.resultId) {
      const r = getDiagnosticResult(option.resultId)
      if (r) setResult(r)
    } else if (option.nextStepId) {
      setHistory(h => [...h, option.nextStepId!])
    }
  }

  function handleBack() {
    if (history.length > 1) {
      setHistory(h => h.slice(0, -1))
      setResult(null)
    }
  }

  function handleReset() {
    setHistory(['symptom'])
    setResult(null)
  }

  return (
    <section id="troubleshooter" className="py-12 md:py-20 border-t border-[#2A2A3A]/30">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold text-[#FF6B00] uppercase tracking-widest mb-2">Try It Now</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Diagnostic Troubleshooter</h2>
          <p className="text-[#7A7A90] max-w-md mx-auto">
            Tell us what your car is doing and we&apos;ll give you a prioritized fix list — from easiest to most involved.
          </p>
        </div>

        {/* Troubleshooter Card */}
        <div className="bg-[#14141F] border border-[#2A2A3A] rounded-xl p-5 md:p-8">
          {result ? (
            /* Results View */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <button onClick={handleBack} className="text-sm text-[#7A7A90] hover:text-[#D4D4E0] flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
                  Back
                </button>
                <button onClick={handleReset} className="text-sm text-[#00B4FF]">Start Over</button>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight uppercase">{result.title}</h3>
                <p className="text-sm text-[#00B4FF] mt-1">{result.subtitle}</p>
              </div>

              <div className="checkered-divider" />

              <div>
                <h4 className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-4">
                  Try These Adjustments
                  <span className="text-[#555570] normal-case font-normal ml-2">(easiest first)</span>
                </h4>
                <div className="space-y-3">
                  {result.adjustments.map((adj, i) => (
                    <div key={i} className="bg-[#0A0A0F] border border-[#2A2A3A]/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00B4FF]/20 text-[#00B4FF] flex items-center justify-center text-sm font-bold">
                          {adj.priority}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A2A3A] text-[#7A7A90] uppercase">{adj.category}</span>
                          </div>
                          <p className="font-semibold text-sm">{adj.action}</p>
                          <p className="text-xs text-[#00B4FF] font-mono mt-1">{adj.amount}</p>
                          <p className="text-xs text-[#7A7A90] mt-2 leading-relaxed">{adj.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : currentStep ? (
            /* Step View */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                {history.length > 1 ? (
                  <button onClick={handleBack} className="text-sm text-[#7A7A90] hover:text-[#D4D4E0] flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <span className="text-sm text-[#555570] font-mono">{stepNumber}/{totalSteps}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-[#2A2A3A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00B4FF] rounded-full transition-all duration-300"
                  style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
                />
              </div>

              <h3 className="text-xl font-bold tracking-tight uppercase">{currentStep.question}</h3>

              <div className="space-y-3">
                {currentStep.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOption(option)}
                    className="w-full text-left bg-[#0A0A0F] border border-[#2A2A3A]/50 rounded-lg p-4 hover:border-[#00B4FF]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-[#1A1A28] flex items-center justify-center flex-shrink-0">
                        <OptionIcon name={option.icon} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{option.label}</p>
                        <p className="text-xs text-[#7A7A90] mt-0.5">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-[#14141F] border border-[#2A2A3A] rounded-lg p-6 text-center">
          <p className="text-sm text-[#7A7A90] mb-3">Sign up free to log fixes and track what works.</p>
          <Link href="/sign-up" className="inline-flex items-center justify-center bg-[#00B4FF] text-[#0A0A0F] font-semibold px-6 py-3 rounded-md hover:bg-[#33C4FF] transition-colors text-sm">
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  )
}

function OptionIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    'arrow-up-right': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>,
    'rotate-ccw': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>,
    'zap-off': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="12.41 6.75 13 2 10.57 4.92" /><polyline points="18.57 12.91 21 10 15.66 10" /><polyline points="8 8 3 14 12 14 11 22 16 16" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
    'shuffle': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>,
    'corner-down-right': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 10 20 15 15 20" /><path d="M4 4v7a4 4 0 004 4h12" /></svg>,
    'corner-up-right': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 014-4h12" /></svg>,
    'circle': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg>,
    'alert-circle': <svg className="w-5 h-5 text-[#FF1744]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    'droplets': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 14.69c1.46 0 2.64-1.22 2.64-2.7 0-.78-.37-1.51-1.13-2.13-.75-.62-1.16-1.34-1.51-2.31-.22.97-.76 1.91-1.51 2.51-.75.6-1.13 1.27-1.13 2.13 0 1.48 1.18 2.5 2.64 2.5z" /></svg>,
    'sun': <svg className="w-5 h-5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
    'wind': <svg className="w-5 h-5 text-[#7A7A90]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>,
  }
  return iconMap[name] || <div className="w-5 h-5 bg-[#2A2A3A] rounded" />
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to `TroubleshooterDemo.tsx`

**Step 3: Commit**

```bash
git add src/components/landing/TroubleshooterDemo.tsx
git commit -m "feat: add TroubleshooterDemo landing page component"
```

---

### Task 4: Update the Landing Page to Include All Three Demos

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

**Step 1: Add imports and insert demo sections**

Add imports for all three demo components at the top. Insert them between the existing Setup Demo section and the Tool Showcase section. The new page flow is:

1. LandingNav
2. Hero
3. Setup Demo (existing, id="demo")
4. **GearRatioDemo** (new, id="gear-ratio")
5. **CornerWeightDemo** (new, id="corner-weight")
6. **TroubleshooterDemo** (new, id="troubleshooter")
7. Tool Showcase (existing, id="features")
8. Pricing
9. Built for the Garage
10. Footer

Add these imports at the top of the file (after existing imports):
```tsx
import { GearRatioDemo } from '@/components/landing/GearRatioDemo'
import { CornerWeightDemo } from '@/components/landing/CornerWeightDemo'
import { TroubleshooterDemo } from '@/components/landing/TroubleshooterDemo'
```

Insert these components between the `{/* ===== INTERACTIVE DEMO ===== */}` section closing tag and the `{/* ===== TOOL SHOWCASE ===== */}` section:
```tsx
      {/* ===== GEAR RATIO CALCULATOR ===== */}
      <GearRatioDemo />

      {/* ===== CORNER WEIGHT CALCULATOR ===== */}
      <CornerWeightDemo />

      {/* ===== DIAGNOSTIC TROUBLESHOOTER ===== */}
      <TroubleshooterDemo />
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/app/(marketing)/page.tsx
git commit -m "feat: add interactive demos to landing page"
```

---

### Task 5: Update the Landing Nav with New Section Links

**Files:**
- Modify: `src/components/landing/LandingNav.tsx`

**Step 1: Add anchor links for the new calculator sections**

The existing nav has "Features" (#features) and "Pricing" (#pricing). Add a "Tools" dropdown or inline links for the calculator sections. The simplest approach: add a "Tools" link that scrolls to #gear-ratio (the first calculator section).

In `LandingNav.tsx`, add a new link before the existing "Features" link:

```tsx
<a
  href="#gear-ratio"
  className="hidden sm:block text-sm text-[#7A7A90] hover:text-[#D4D4E0] transition-colors"
>
  Tools
</a>
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/landing/LandingNav.tsx
git commit -m "feat: add Tools nav link for calculator demos"
```

---

### Task 6: Condense ToolShowcase to Remove Redundant Cards

**Files:**
- Modify: `src/components/landing/ToolShowcase.tsx`

**Step 1: Remove the Troubleshooter preview card**

Since the troubleshooter now has its own full interactive section above, the `TroubleshooterPreview` card in the ToolShowcase is redundant. Remove it from the primary tool previews grid and leave only `EngineSimPreview` and `SessionLogPreview`. Change the grid from `md:grid-cols-3` to `md:grid-cols-2`.

In `ToolShowcase()`, change:
```tsx
<div className="grid md:grid-cols-3 gap-4 md:gap-6">
  <TroubleshooterPreview />
  <EngineSimPreview />
  <SessionLogPreview />
</div>
```
to:
```tsx
<div className="grid md:grid-cols-2 gap-4 md:gap-6">
  <EngineSimPreview />
  <SessionLogPreview />
</div>
```

Also remove the Corner Weight and Gear Ratio mini cards from the secondary grid (since they now have full interactive sections). Keep only the Rulebook and Rim Offset mini cards. Change from `grid-cols-2 md:grid-cols-4` to `grid-cols-2`.

**Step 2: Clean up unused components**

Delete the `TroubleshooterPreview` function and its `FixItem` helper function since they're no longer used.

**Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/landing/ToolShowcase.tsx
git commit -m "refactor: condense ToolShowcase, remove redundant previews"
```

---

### Task 7: Visual Verification and Build Check

**Step 1: Run the production build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Run the linter**

Run: `npm run lint`
Expected: No errors (warnings OK).

**Step 3: Start dev server for visual check**

Run: `npm run dev`
Manual check: Visit http://localhost:3000 and verify:
- Page scrolls: Hero → Setup Demo → Gear Ratio → Corner Weight → Troubleshooter → Tool Showcase → Pricing → Footer
- Each calculator is fully interactive (change inputs, see results update)
- Troubleshooter decision tree flows through all steps and shows results
- CTA banners appear below each demo
- Nav "Tools" link scrolls to gear ratio section
- Mobile responsive: sections stack to single column

**Step 4: Commit any fixes if needed, then final commit**

```bash
git add -A
git commit -m "chore: landing page demos — build verified"
```
