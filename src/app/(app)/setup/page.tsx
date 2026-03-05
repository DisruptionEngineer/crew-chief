'use client'

import { useState, useCallback } from 'react'
import { useCar } from '@/hooks/useCar'
import { useGarage } from '@/hooks/useGarage'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import { getSetupRecommendations } from '@/data/setup/recommendations'
import type { TrackCondition, RaceType } from '@/lib/types'

const conditions: { value: TrackCondition; label: string }[] = [
  { value: 'heavy', label: 'Heavy' },
  { value: 'tacky', label: 'Tacky' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'dry', label: 'Dry' },
  { value: 'slick', label: 'Slick' },
]

interface AiRecommendation {
  value: number | string
  explanation: string
}

interface AiResponse {
  springs: Record<string, AiRecommendation>
  alignment: Record<string, AiRecommendation>
  tirePressures: Record<string, AiRecommendation>
  weight: Record<string, AiRecommendation>
  other: Record<string, AiRecommendation>
  summary: string
}

export default function SetupCalculator() {
  const { currentCar, currentSetup } = useCar()
  const { saveSetup } = useGarage()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const { isPro } = useSubscriptionContext()
  const [condition, setCondition] = useState<TrackCondition>('moderate')
  const [raceType, setRaceType] = useState<RaceType>('figure-8')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiData, setAiData] = useState<AiResponse | null>(null)

  const recs = getSetupRecommendations(currentCar, condition, raceType)

  // Lifted stepper state — keyed by parameter name
  const [adjustments, setAdjustments] = useState<Record<string, number>>({})

  const getAdjusted = (param: string, baseValue: number) => {
    return adjustments[param] ?? baseValue
  }

  const setAdjusted = (param: string, value: number) => {
    setAdjustments(prev => ({ ...prev, [param]: value }))
    setSaved(false)
  }

  const handleSave = useCallback(async () => {
    if (!user || !isPro) return
    setSaving(true)

    const springLF = getAdjusted('springLF', recs.springs[0].value as number)
    const springRF = getAdjusted('springRF', recs.springs[1].value as number)
    const springLR = getAdjusted('springLR', recs.springs[2].value as number)
    const springRR = getAdjusted('springRR', recs.springs[3].value as number)

    const pressureLF = getAdjusted('pressureLF', recs.tirePressures[0].value as number)
    const pressureRF = getAdjusted('pressureRF', recs.tirePressures[1].value as number)
    const pressureLR = getAdjusted('pressureLR', recs.tirePressures[2].value as number)
    const pressureRR = getAdjusted('pressureRR', recs.tirePressures[3].value as number)

    // Get alignment values
    const camberLF = recs.alignment.find(r => r.parameter === 'camberLF')?.value as number ?? -2
    const camberRF = recs.alignment.find(r => r.parameter === 'camberRF')?.value as number ?? -2
    const casterLF = recs.alignment.find(r => r.parameter === 'casterLF')?.value as number ?? 3.5
    const casterRF = recs.alignment.find(r => r.parameter === 'casterRF')?.value as number ?? 3.5

    await saveSetup({
      carId: currentCar.id,
      trackId: null,
      name: `${condition} ${raceType} setup`,
      raceType,
      trackCondition: condition,
      springLF, springRF, springLR, springRR,
      rideHeightLF: currentSetup.rideHeightLF,
      rideHeightRF: currentSetup.rideHeightRF,
      rideHeightLR: currentSetup.rideHeightLR,
      rideHeightRR: currentSetup.rideHeightRR,
      camberLF, camberRF, casterLF, casterRF,
      toeFront: currentSetup.toeFront,
      toeRear: currentSetup.toeRear,
      pressureLF, pressureRF, pressureLR, pressureRR,
      totalWeight: currentSetup.totalWeight,
      crossWeightPct: currentSetup.crossWeightPct,
      leftPct: currentSetup.leftPct,
      rearPct: currentSetup.rearPct,
      cornerWeightLF: currentSetup.cornerWeightLF,
      cornerWeightRF: currentSetup.cornerWeightRF,
      cornerWeightLR: currentSetup.cornerWeightLR,
      cornerWeightRR: currentSetup.cornerWeightRR,
      swayBarFront: currentSetup.swayBarFront,
      gearRatio: currentSetup.gearRatio,
      tireModel: currentSetup.tireModel,
      shockLF: currentSetup.shockLF,
      shockRF: currentSetup.shockRF,
      shockLR: currentSetup.shockLR,
      shockRR: currentSetup.shockRR,
      notes: aiData?.summary || null,
      isActive: true,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isPro, currentCar, currentSetup, recs, condition, raceType, adjustments, saveSetup, aiData])

  const handleAiOptimize = useCallback(async () => {
    if (!user || !isPro) return
    setAiLoading(true)
    setAiData(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch('/api/setup/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          car: {
            id: currentCar.id,
            name: currentCar.name,
            year: currentCar.year,
            make: currentCar.make,
            model: currentCar.model,
            weight: currentCar.weight,
            wheelbase: currentCar.wheelbase,
            frontSuspension: currentCar.frontSuspension,
            rearSuspension: currentCar.rearSuspension,
            engine: currentCar.engine,
          },
          condition,
          raceType,
        }),
      })

      if (res.ok) {
        const data: AiResponse = await res.json()
        setAiData(data)

        // Apply AI values to adjustments
        const newAdj: Record<string, number> = {}
        if (data.springs) {
          for (const [key, rec] of Object.entries(data.springs)) {
            if (typeof rec.value === 'number') newAdj[key] = rec.value
          }
        }
        if (data.tirePressures) {
          for (const [key, rec] of Object.entries(data.tirePressures)) {
            if (typeof rec.value === 'number') newAdj[key] = rec.value
          }
        }
        setAdjustments(prev => ({ ...prev, ...newAdj }))
      }
    } catch {
      // Silent fail
    } finally {
      setAiLoading(false)
    }
  }, [user, isPro, currentCar, condition, raceType, supabase])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Setup Calculator</h1>
          <p className="text-sm text-[#888] mt-1">{currentCar.year} {currentCar.model}</p>
        </div>
        {/* AI + Save Buttons */}
        <div className="flex gap-2">
          {isPro && (
            <button
              onClick={handleAiOptimize}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[40px]"
            >
              {aiLoading ? (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" opacity="0.25" /><path d="M4 12a8 8 0 018-8" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" /></svg>
              )}
              {aiLoading ? 'Analyzing...' : 'AI Crew Chief'}
            </button>
          )}
          {isPro && user && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all min-h-[40px] ${
                saved
                  ? 'bg-[#00E676] text-[#0D0D0D]'
                  : 'bg-[#FF8A00] text-[#0D0D0D] hover:bg-[#FFA640]'
              } disabled:opacity-50`}
            >
              {saved ? (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                  Saved
                </>
              ) : saving ? 'Saving...' : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                  Save Setup
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {aiData?.summary && (
        <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#6366F1]/10 border border-[#7C3AED]/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" /></svg>
            <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">AI Crew Chief Analysis</span>
          </div>
          <p className="text-sm text-[#CCC] leading-relaxed">{aiData.summary}</p>
        </div>
      )}

      {/* Pro Upsell for free users */}
      {!isPro && (
        <div className="bg-[#FF8A00]/5 border border-[#FF8A00]/20 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#FF8A00] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#FF8A00]">Upgrade to Pro</p>
            <p className="text-xs text-[#888] mt-0.5">Save setups to the cloud and get AI-powered crew chief recommendations</p>
          </div>
        </div>
      )}

      {/* Track Condition Picker */}
      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Track Condition</label>
        <div className="flex gap-2">
          {conditions.map(c => (
            <button
              key={c.value}
              onClick={() => { setCondition(c.value); setAiData(null) }}
              className={`flex-1 py-3 rounded-md text-sm font-semibold transition-colors min-h-[48px] ${
                condition === c.value
                  ? 'bg-[#FF8A00] text-[#0D0D0D]'
                  : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Race Type */}
      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Race Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => { setRaceType('figure-8'); setAiData(null) }}
            className={`flex-1 py-3 rounded-md text-sm font-semibold transition-colors min-h-[48px] ${
              raceType === 'figure-8'
                ? 'bg-[#FF8A00] text-[#0D0D0D]'
                : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
            }`}
          >
            Figure 8
          </button>
          <button
            onClick={() => { setRaceType('oval'); setAiData(null) }}
            className={`flex-1 py-3 rounded-md text-sm font-semibold transition-colors min-h-[48px] ${
              raceType === 'oval'
                ? 'bg-[#FF8A00] text-[#0D0D0D]'
                : 'bg-[#252525] text-[#888] hover:text-[#F5F5F5] border border-[#333]'
            }`}
          >
            Oval
          </button>
        </div>
      </div>

      {/* Checkered Divider */}
      <div className="checkered-divider" />

      {/* Springs */}
      <SetupSection
        title="Springs"
        unit="lbs/in"
        expanded={expandedSection === 'springs'}
        onToggle={() => setExpandedSection(expandedSection === 'springs' ? null : 'springs')}
        aiExplanation={aiData?.springs ? Object.values(aiData.springs).map(r => r.explanation).join(' ') : undefined}
      >
        <div className="grid grid-cols-2 gap-3">
          {recs.springs.map(rec => (
            <SetupValueCard
              key={rec.parameter}
              label={rec.label.replace('Spring', '').replace('Left ', 'L').replace('Right ', 'R').replace('Front', 'F').replace('Rear', 'R').trim()}
              value={getAdjusted(rec.parameter, rec.value as number)}
              unit={rec.unit}
              rangeLow={rec.rangeLow!}
              rangeHigh={rec.rangeHigh!}
              explanation={aiData?.springs?.[rec.parameter]?.explanation || rec.explanation}
              expanded={expandedSection === 'springs'}
              onAdjust={(v) => setAdjusted(rec.parameter, v)}
            />
          ))}
        </div>
        {raceType === 'figure-8' && (
          <p className="text-xs text-[#FF8A00] mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            Equal L/R for Figure 8 — symmetric turns both directions
          </p>
        )}
      </SetupSection>

      {/* Alignment */}
      <SetupSection
        title="Alignment"
        unit="degrees"
        expanded={expandedSection === 'alignment'}
        onToggle={() => setExpandedSection(expandedSection === 'alignment' ? null : 'alignment')}
        aiExplanation={aiData?.alignment ? Object.values(aiData.alignment).map(r => r.explanation).join(' ') : undefined}
      >
        <div className="grid grid-cols-2 gap-3">
          {recs.alignment.filter(r => r.parameter !== 'toeFront').map(rec => (
            <div key={rec.parameter} className="bg-[#252525] rounded-md p-3">
              <p className="text-[10px] text-[#666] uppercase">{rec.label}</p>
              <p className="font-mono text-lg font-medium mt-1">
                {typeof rec.value === 'number' ? `${rec.value > 0 ? '+' : ''}${rec.value}°` : rec.value}
              </p>
              {expandedSection === 'alignment' && (
                <p className="text-xs text-[#888] mt-2">{aiData?.alignment?.[rec.parameter]?.explanation || rec.explanation}</p>
              )}
            </div>
          ))}
        </div>
        {/* Toe */}
        {recs.alignment.filter(r => r.parameter === 'toeFront').map(rec => (
          <div key={rec.parameter} className="bg-[#252525] rounded-md p-3 mt-3">
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-[#666] uppercase">{rec.label}</p>
              <p className="font-mono text-lg font-medium">{rec.value}</p>
            </div>
            {expandedSection === 'alignment' && (
              <p className="text-xs text-[#888] mt-2">{aiData?.alignment?.toeFront?.explanation || rec.explanation}</p>
            )}
          </div>
        ))}
      </SetupSection>

      {/* Tire Pressures */}
      <SetupSection
        title="Tire Pressure"
        unit="psi"
        expanded={expandedSection === 'tires'}
        onToggle={() => setExpandedSection(expandedSection === 'tires' ? null : 'tires')}
        aiExplanation={aiData?.tirePressures ? Object.values(aiData.tirePressures).map(r => r.explanation).join(' ') : undefined}
      >
        <div className="grid grid-cols-2 gap-3">
          {recs.tirePressures.map(rec => (
            <SetupValueCard
              key={rec.parameter}
              label={rec.label}
              value={getAdjusted(rec.parameter, rec.value as number)}
              unit={rec.unit}
              rangeLow={rec.rangeLow!}
              rangeHigh={rec.rangeHigh!}
              explanation={aiData?.tirePressures?.[rec.parameter]?.explanation || rec.explanation}
              expanded={expandedSection === 'tires'}
              showStepper
              onAdjust={(v) => setAdjusted(rec.parameter, v)}
            />
          ))}
        </div>
      </SetupSection>

      {/* Weight Distribution */}
      <SetupSection
        title="Weight"
        unit=""
        expanded={expandedSection === 'weight'}
        onToggle={() => setExpandedSection(expandedSection === 'weight' ? null : 'weight')}
        aiExplanation={aiData?.weight ? Object.values(aiData.weight).map(r => r.explanation).join(' ') : undefined}
      >
        {/* Car diagram */}
        <div className="bg-[#252525] rounded-md p-4">
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <CornerWeight label="LF" value={currentSetup.cornerWeightLF} />
            <CornerWeight label="RF" value={currentSetup.cornerWeightRF} />
            <CornerWeight label="LR" value={currentSetup.cornerWeightLR} />
            <CornerWeight label="RR" value={currentSetup.cornerWeightRR} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center text-sm font-mono">
            <div>
              <span className="text-[#666]">Total</span>
              <p className="font-semibold">{currentSetup.totalWeight.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[#666]">Cross-Wt</span>
              <p className="font-semibold text-[#FF8A00]">{currentSetup.crossWeightPct}%</p>
            </div>
            <div>
              <span className="text-[#666]">Left %</span>
              <StatusValue value={currentSetup.leftPct} target={raceType === 'figure-8' ? 50 : 55} tolerance={2} unit="%" />
            </div>
            <div>
              <span className="text-[#666]">Rear %</span>
              <StatusValue value={currentSetup.rearPct} target={raceType === 'figure-8' ? 50 : 49} tolerance={2} unit="%" />
            </div>
          </div>
          {/* Rules compliance */}
          <div className="flex gap-3 mt-4 justify-center text-xs">
            <RuleCheck passed={currentSetup.totalWeight >= 3300} label="Min 3,300 lbs" />
            {raceType === 'oval' && <RuleCheck passed={currentSetup.leftPct >= 54} label="55% Left" />}
            {raceType === 'oval' && <RuleCheck passed={currentSetup.rearPct >= 48} label="49% Rear" />}
          </div>
        </div>
        {/* Weight targets */}
        {recs.weight.map(rec => (
          <div key={rec.parameter} className="bg-[#252525] rounded-md p-3 mt-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#666]">{rec.label}</p>
              <p className="font-mono font-medium">{rec.value}</p>
            </div>
            {expandedSection === 'weight' && (
              <p className="text-xs text-[#888] mt-2">{aiData?.weight?.[rec.parameter]?.explanation || rec.explanation}</p>
            )}
          </div>
        ))}
      </SetupSection>

      {/* Other Recommendations */}
      <SetupSection
        title="Other"
        unit=""
        expanded={expandedSection === 'other'}
        onToggle={() => setExpandedSection(expandedSection === 'other' ? null : 'other')}
        aiExplanation={aiData?.other ? Object.values(aiData.other).map(r => r.explanation).join(' ') : undefined}
      >
        {recs.other.map(rec => (
          <div key={rec.parameter} className="bg-[#252525] rounded-md p-3 mt-3 first:mt-0">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#666]">{rec.label}</p>
              <p className="font-mono text-sm font-medium">{rec.value}</p>
            </div>
            {expandedSection === 'other' && (
              <p className="text-xs text-[#888] mt-2">{aiData?.other?.[rec.parameter]?.explanation || rec.explanation}</p>
            )}
          </div>
        ))}
      </SetupSection>
    </div>
  )
}

function SetupSection({ title, unit, expanded, onToggle, children, aiExplanation }: {
  title: string; unit: string; expanded: boolean; onToggle: () => void; children: React.ReactNode; aiExplanation?: string
}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 min-h-[48px]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
          {unit && <span className="text-[10px] text-[#666]">({unit})</span>}
        </div>
        <svg className={`w-4 h-4 text-[#666] transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="px-4 pb-4">
        {children}
        {expanded && aiExplanation && (
          <div className="mt-3 p-3 bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-md">
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3 h-3 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" /></svg>
              <span className="text-[10px] font-bold text-[#7C3AED] uppercase">AI Insight</span>
            </div>
            <p className="text-xs text-[#AAA] leading-relaxed">{aiExplanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SetupValueCard({ label, value, unit, rangeLow, rangeHigh, explanation, expanded, showStepper, onAdjust }: {
  label: string; value: number; unit: string; rangeLow: number; rangeHigh: number; explanation: string; expanded: boolean; showStepper?: boolean; onAdjust: (v: number) => void
}) {
  const pct = Math.max(0, Math.min(100, ((value - rangeLow) / (rangeHigh - rangeLow)) * 100))

  return (
    <div className="bg-[#252525] rounded-md p-3">
      <p className="text-[10px] text-[#666] uppercase">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-mono text-xl font-medium">{value}</span>
        <span className="text-xs text-[#666]">{unit}</span>
      </div>
      {/* Range bar */}
      <div className="mt-2 h-1.5 bg-[#333] rounded-full overflow-hidden">
        <div className="h-full bg-[#FF8A00] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-[#555] mt-1">
        <span>{rangeLow}</span>
        <span>{rangeHigh}</span>
      </div>
      {/* Stepper buttons */}
      {showStepper && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onAdjust(Math.max(rangeLow - 2, value - 1))}
            className="flex-1 py-1.5 bg-[#333] rounded text-sm font-mono hover:bg-[#444] transition-colors min-h-[36px]"
          >
            -
          </button>
          <button
            onClick={() => onAdjust(Math.min(rangeHigh + 2, value + 1))}
            className="flex-1 py-1.5 bg-[#333] rounded text-sm font-mono hover:bg-[#444] transition-colors min-h-[36px]"
          >
            +
          </button>
        </div>
      )}
      {expanded && <p className="text-xs text-[#888] mt-2">{explanation}</p>}
    </div>
  )
}

function CornerWeight({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#333] rounded-md p-3 text-center">
      <p className="font-mono text-lg font-semibold">{value}</p>
      <p className="text-[10px] text-[#666] uppercase">{label}</p>
    </div>
  )
}

function StatusValue({ value, target, tolerance, unit }: { value: number; target: number; tolerance: number; unit: string }) {
  const diff = Math.abs(value - target)
  const color = diff <= tolerance * 0.5 ? '#00E676' : diff <= tolerance ? '#FF8A00' : '#FF1744'
  return <p className="font-semibold" style={{ color }}>{value}{unit}</p>
}

function RuleCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1 ${passed ? 'text-[#00E676]' : 'text-[#FF1744]'}`}>
      {passed ? '✓' : '✗'} {label}
    </span>
  )
}
