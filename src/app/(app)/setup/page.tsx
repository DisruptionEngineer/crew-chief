'use client'

import { useState, useCallback, useEffect } from 'react'
import { useCar } from '@/hooks/useCar'
import { useGarage } from '@/hooks/useGarage'
import { useMyTracks } from '@/hooks/useMyTracks'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import { getSetupRecommendations } from '@/data/setup/recommendations'
import { getTiresByBrand, getTireCompound, getDefaultTireForSurface, getEffectivePressureRange } from '@/data/setup/tires'
import type { TireCompound } from '@/data/setup/tires'
import type { TrackCondition, RaceType, Track } from '@/lib/types'
import type { WeatherData } from '@/app/api/weather/route'
import { getNextRaceEvent } from '@/data/tracks/schedules'

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

const tireBrands = getTiresByBrand()

export default function SetupCalculator() {
  const { currentCar, currentSetup } = useCar()
  const { saveSetup } = useGarage()
  const { myTracks } = useMyTracks()
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

  // Track selection — default to primary track
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  // Initialize selected track when myTracks loads
  const primaryTrack = myTracks.find(t => t.isPrimary)?.track ?? myTracks[0]?.track ?? null
  if (!selectedTrack && primaryTrack) {
    setSelectedTrack(primaryTrack)
  }

  // Tire compound selection — default based on saved value or track surface
  const trackSurface = selectedTrack?.surface
  const defaultTire = getTireCompound(currentSetup.tireModel)
    || getDefaultTireForSurface(trackSurface === 'asphalt' || trackSurface === 'concrete' ? trackSurface : 'dirt')
  const [selectedTire, setSelectedTire] = useState<TireCompound>(defaultTire)

  // Get effective pressure range for the selected tire + track surface
  const effectivePressureRange = getEffectivePressureRange(selectedTire, trackSurface)

  // Weather for the selected track
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  useEffect(() => {
    if (!selectedTrack?.latitude || !selectedTrack?.longitude) {
      setWeather(null)
      return
    }
    let cancelled = false
    setWeatherLoading(true)
    fetch(`/api/weather?lat=${selectedTrack.latitude}&lng=${selectedTrack.longitude}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (!cancelled) setWeather(data) })
      .catch(() => { if (!cancelled) setWeather(null) })
      .finally(() => { if (!cancelled) setWeatherLoading(false) })
    return () => { cancelled = true }
  }, [selectedTrack?.latitude, selectedTrack?.longitude])

  // Race-time forecast — find the next event and match to hourly forecast
  const nextRace = selectedTrack ? getNextRaceEvent(selectedTrack.id) : null
  const raceTimeForecast = (() => {
    if (!nextRace || !weather?.hourly?.length) return null
    const raceMs = nextRace.raceTime.getTime()
    // Find the hourly forecast entry closest to race time
    let closest = weather.hourly[0]
    let closestDiff = Math.abs(new Date(closest.time).getTime() - raceMs)
    for (const entry of weather.hourly) {
      const diff = Math.abs(new Date(entry.time).getTime() - raceMs)
      if (diff < closestDiff) {
        closest = entry
        closestDiff = diff
      }
    }
    // Only show if within 4 hours of a forecast point (i.e. the forecast covers race time)
    if (closestDiff > 4 * 60 * 60 * 1000) return null
    return closest
  })()

  // All adjustable values keyed by parameter name
  const [adjustments, setAdjustments] = useState<Record<string, number>>({})
  // Locked parameters — AI won't overwrite these
  const [locked, setLocked] = useState<Set<string>>(new Set())

  // Recommendations — recalculates when adjustments change (cross-parameter physics)
  const recs = getSetupRecommendations(currentCar, condition, raceType, selectedTire, trackSurface, adjustments)

  const getAdjusted = (param: string, baseValue: number) => {
    return adjustments[param] ?? baseValue
  }

  const setAdjusted = (param: string, value: number) => {
    setAdjustments(prev => ({ ...prev, [param]: value }))
    setSaved(false)
  }

  const toggleLock = (param: string) => {
    setLocked(prev => {
      const next = new Set(prev)
      if (next.has(param)) next.delete(param)
      else next.add(param)
      return next
    })
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

    // Get alignment values — use adjustments if user modified, otherwise recommendation
    const camberLF = getAdjusted('camberLF', recs.alignment.find(r => r.parameter === 'camberLF')?.value as number ?? -2)
    const camberRF = getAdjusted('camberRF', recs.alignment.find(r => r.parameter === 'camberRF')?.value as number ?? -2)
    const casterLF = getAdjusted('casterLF', recs.alignment.find(r => r.parameter === 'casterLF')?.value as number ?? 3.5)
    const casterRF = getAdjusted('casterRF', recs.alignment.find(r => r.parameter === 'casterRF')?.value as number ?? 3.5)
    const toeFront = getAdjusted('toeFront', recs.alignment.find(r => r.parameter === 'toeFront')?.value as number ?? -0.0625)

    // Weight values
    const totalWeight = getAdjusted('totalWeight', currentSetup.totalWeight)
    const crossWeightPct = getAdjusted('crossWeight', currentSetup.crossWeightPct) ?? currentSetup.crossWeightPct
    const leftPct = getAdjusted('leftPct', currentSetup.leftPct) ?? currentSetup.leftPct
    const rearPct = getAdjusted('rearPct', currentSetup.rearPct) ?? currentSetup.rearPct
    const cornerWeightLF = getAdjusted('cornerWeightLF', currentSetup.cornerWeightLF)
    const cornerWeightRF = getAdjusted('cornerWeightRF', currentSetup.cornerWeightRF)
    const cornerWeightLR = getAdjusted('cornerWeightLR', currentSetup.cornerWeightLR)
    const cornerWeightRR = getAdjusted('cornerWeightRR', currentSetup.cornerWeightRR)

    await saveSetup({
      carId: currentCar.id,
      trackId: selectedTrack?.id ?? null,
      name: `${selectedTrack ? selectedTrack.name + ' ' : ''}${condition} ${raceType} setup`,
      raceType,
      trackCondition: condition,
      springLF, springRF, springLR, springRR,
      rideHeightLF: currentSetup.rideHeightLF,
      rideHeightRF: currentSetup.rideHeightRF,
      rideHeightLR: currentSetup.rideHeightLR,
      rideHeightRR: currentSetup.rideHeightRR,
      camberLF, camberRF, casterLF, casterRF,
      toeFront,
      toeRear: currentSetup.toeRear,
      pressureLF, pressureRF, pressureLR, pressureRR,
      totalWeight, crossWeightPct, leftPct, rearPct,
      cornerWeightLF, cornerWeightRF, cornerWeightLR, cornerWeightRR,
      swayBarFront: currentSetup.swayBarFront,
      gearRatio: currentSetup.gearRatio,
      tireModel: selectedTire.id,
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
  }, [user, isPro, currentCar, currentSetup, recs, condition, raceType, adjustments, saveSetup, aiData, selectedTire, selectedTrack])

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
          track: selectedTrack ? {
            name: selectedTrack.name,
            length: selectedTrack.length,
            surface: selectedTrack.surface,
            banking: selectedTrack.banking,
          } : undefined,
          weather: weather ? {
            temp: weather.current.temp,
            humidity: weather.current.humidity,
            dewPoint: weather.current.dewPoint,
            pressure: weather.current.pressure,
            windSpeed: weather.current.windSpeed,
            windDirection: weather.current.windDirection,
            condition: weather.current.condition,
          } : undefined,
          raceTimeWeather: raceTimeForecast ? {
            temp: raceTimeForecast.temp,
            humidity: raceTimeForecast.humidity,
            dewPoint: raceTimeForecast.dewPoint,
            pressure: raceTimeForecast.pressure,
            windSpeed: raceTimeForecast.windSpeed,
            windDirection: raceTimeForecast.windDirection,
            precipProbability: raceTimeForecast.precipProbability,
            condition: raceTimeForecast.condition,
            raceTime: nextRace!.raceTime.toISOString(),
          } : undefined,
          condition,
          raceType,
          tireCompound: selectedTire.label,
          // Send locked values as constraints the AI must respect
          lockedValues: Object.fromEntries(
            Array.from(locked).map(param => [param, adjustments[param]])
              .filter(([, v]) => v !== undefined)
          ),
        }),
      })

      if (res.ok) {
        const data: AiResponse = await res.json()
        setAiData(data)

        // Apply AI values to adjustments — skip locked parameters
        const newAdj: Record<string, number> = {}
        for (const section of [data.springs, data.alignment, data.tirePressures, data.weight] as Record<string, AiRecommendation>[]) {
          if (!section) continue
          for (const [key, rec] of Object.entries(section)) {
            if (typeof rec.value === 'number' && !locked.has(key)) newAdj[key] = rec.value
          }
        }
        setAdjustments(prev => ({ ...prev, ...newAdj }))
      }
    } catch {
      // Silent fail
    } finally {
      setAiLoading(false)
    }
  }, [user, isPro, currentCar, condition, raceType, supabase, selectedTire, selectedTrack, locked, adjustments])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Setup Builder</h1>
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
          {user && (
            <button
              onClick={handleSave}
              disabled={saving || (!isPro && !user)}
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

      {/* Track Selector */}
      {myTracks.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Track</label>
          <select
            value={selectedTrack?.id ?? ''}
            onChange={(e) => {
              const track = myTracks.find(t => t.track.id === e.target.value)?.track ?? null
              setSelectedTrack(track)
              setAiData(null)
              // Auto-select tire compound for new track surface
              if (track) {
                const surface = track.surface
                const isHardSurface = surface === 'asphalt' || surface === 'concrete' || surface === 'mixed'
                if (isHardSurface) {
                  if (selectedTire.surface === 'dirt') {
                    const hardTire = getDefaultTireForSurface(surface)
                    setSelectedTire(hardTire)
                    setAdjustments(prev => {
                      const next = { ...prev }
                      delete next.pressureLF; delete next.pressureRF
                      delete next.pressureLR; delete next.pressureRR
                      return next
                    })
                  }
                } else if (surface === 'dirt') {
                  if (selectedTire.surface === 'asphalt') {
                    const dirtTire = getDefaultTireForSurface('dirt')
                    setSelectedTire(dirtTire)
                    setAdjustments(prev => {
                      const next = { ...prev }
                      delete next.pressureLF; delete next.pressureRF
                      delete next.pressureLR; delete next.pressureRR
                      return next
                    })
                  }
                }
                // For 'both' tires (like G60), clear pressure adjustments so they recalculate
                if (selectedTire.pressureByTrackSurface) {
                  setAdjustments(prev => {
                    const next = { ...prev }
                    delete next.pressureLF; delete next.pressureRF
                    delete next.pressureLR; delete next.pressureRR
                    return next
                  })
                }
              }
            }}
            className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-sm font-semibold text-[#F5F5F5] focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[48px] appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {myTracks.map(entry => (
              <option key={entry.track.id} value={entry.track.id}>
                {entry.track.name} — {entry.track.length} mi, {entry.track.surface}, {entry.track.banking}° banking
              </option>
            ))}
          </select>
          {selectedTrack && !weather && (
            <p className="text-[10px] text-[#555] mt-1.5">
              {selectedTrack.location} &bull; {selectedTrack.surface} &bull; {selectedTrack.banking}° banking
            </p>
          )}
        </div>
      )}

      {/* Weather at Track */}
      {selectedTrack && (weatherLoading || weather) && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#4FC3F7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <span className="text-xs font-bold text-[#4FC3F7] uppercase tracking-wider">Weather at Track</span>
            </div>
            <span className="text-[10px] text-[#555]">{selectedTrack.name}</span>
          </div>
          {weatherLoading ? (
            <div className="flex items-center gap-2 text-xs text-[#666]">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" opacity="0.25" /><path d="M4 12a8 8 0 018-8" /></svg>
              Loading conditions...
            </div>
          ) : weather ? (
            <>
              {/* Current Conditions */}
              <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Right Now</p>
              <div className="grid grid-cols-4 gap-3">
                <WeatherStat label="Temp" value={`${weather.current.temp}°`} sub={`Feels ${weather.current.feelsLike}°`} />
                <WeatherStat label="Humidity" value={`${weather.current.humidity}%`} sub={`DP ${weather.current.dewPoint}°`} />
                <WeatherStat label="Wind" value={`${weather.current.windSpeed}`} sub={`G${weather.current.windGusts} ${windDir(weather.current.windDirection)}`} unit="mph" />
                <WeatherStat label="Baro" value={`${weather.current.pressure}`} sub={weather.current.condition} unit="inHg" />
              </div>
              {/* Dew point warning */}
              {weather.current.temp - weather.current.dewPoint <= 5 && (
                <p className="text-[10px] text-[#FF8A00] mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  Dew point spread is tight ({weather.current.temp - weather.current.dewPoint}°) — track may be slippery
                </p>
              )}

              {/* Race-Time Forecast */}
              {nextRace && raceTimeForecast && (
                <>
                  <div className="border-t border-[#333] mt-3 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M3 3v18h18" /><path d="M18 9l-5 5-2-2-4 4" />
                        </svg>
                        <span className="text-[10px] text-[#FF8A00] uppercase tracking-wider font-bold">At Race Time</span>
                      </div>
                      <span className="text-[10px] text-[#555]">
                        {new Date(nextRace.raceTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {' '}
                        {new Date(nextRace.raceTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <WeatherStat label="Temp" value={`${raceTimeForecast.temp}°`} sub={`DP ${raceTimeForecast.dewPoint}°`} />
                      <WeatherStat label="Humidity" value={`${raceTimeForecast.humidity}%`} sub={raceTimeForecast.condition} />
                      <WeatherStat label="Wind" value={`${raceTimeForecast.windSpeed}`} sub={windDir(raceTimeForecast.windDirection)} unit="mph" />
                      <WeatherStat label="Rain" value={`${raceTimeForecast.precipProbability}`} sub={raceTimeForecast.precipProbability > 40 ? 'Pack up early?' : 'Looking good'} unit="%" />
                    </div>
                    {/* Race-time dew point warning */}
                    {raceTimeForecast.temp - raceTimeForecast.dewPoint <= 5 && (
                      <p className="text-[10px] text-[#FF8A00] mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        Dew point will be tight at race time — expect a slippery track
                      </p>
                    )}
                    {raceTimeForecast.precipProbability > 60 && (
                      <p className="text-[10px] text-[#FF1744] mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        High rain probability — check for cancellation
                      </p>
                    )}
                    <p className="text-[10px] text-[#444] mt-1.5">
                      {nextRace.event.event} &bull; {nextRace.event.classes.join(', ')}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      )}

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

      {/* Tire Compound Selector */}
      <div>
        <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Tire Compound</label>
        <select
          value={selectedTire.id}
          onChange={(e) => {
            const tire = getTireCompound(e.target.value)
            if (tire) {
              setSelectedTire(tire)
              // Clear pressure adjustments so they recalculate for new tire
              setAdjustments(prev => {
                const next = { ...prev }
                delete next.pressureLF
                delete next.pressureRF
                delete next.pressureLR
                delete next.pressureRR
                return next
              })
            }
          }}
          className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-sm font-semibold text-[#F5F5F5] focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[48px] appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          {tireBrands.map(group => (
            <optgroup key={group.brand} label={group.brand}>
              {group.compounds.map(t => {
                const range = getEffectivePressureRange(t, trackSurface)
                return (
                  <option key={t.id} value={t.id}>
                    {t.label} — {range.front[0]}-{range.front[1]} psi ({t.surface})
                  </option>
                )
              })}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Checkered Divider */}
      <div className="checkered-divider" />

      {/* Springs — fully adjustable */}
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
              step={25}
              explanation={aiData?.springs?.[rec.parameter]?.explanation || rec.explanation}
              expanded={expandedSection === 'springs'}
              onAdjust={(v) => setAdjusted(rec.parameter, v)}
              isLocked={locked.has(rec.parameter)}
              onToggleLock={() => toggleLock(rec.parameter)}
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

      {/* Alignment — fully adjustable */}
      <SetupSection
        title="Alignment"
        unit="degrees"
        expanded={expandedSection === 'alignment'}
        onToggle={() => setExpandedSection(expandedSection === 'alignment' ? null : 'alignment')}
        aiExplanation={aiData?.alignment ? Object.values(aiData.alignment).map(r => r.explanation).join(' ') : undefined}
      >
        <div className="grid grid-cols-2 gap-3">
          {recs.alignment.filter(r => r.parameter !== 'toeFront').map(rec => {
            const recValue = rec.value as number
            return (
              <SetupValueCard
                key={rec.parameter}
                label={rec.label.replace('Camber - ', '').replace('Caster - ', '')}
                value={getAdjusted(rec.parameter, recValue)}
                unit="deg"
                rangeLow={rec.rangeLow!}
                rangeHigh={rec.rangeHigh!}
                step={0.5}
                formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`}
                explanation={aiData?.alignment?.[rec.parameter]?.explanation || rec.explanation}
                expanded={expandedSection === 'alignment'}
                onAdjust={(v) => setAdjusted(rec.parameter, v)}
                isLocked={locked.has(rec.parameter)}
                onToggleLock={() => toggleLock(rec.parameter)}
              />
            )
          })}
        </div>
        {/* Toe — stepper in 1/16" increments */}
        {recs.alignment.filter(r => r.parameter === 'toeFront').map(rec => {
          const toeValue = getAdjusted('toeFront', -0.0625 * (raceType === 'oval' ? 3 : 1))
          const toeDisplay = `${Math.abs(toeValue * 16).toFixed(0)}/16" ${toeValue < 0 ? 'toe-out' : toeValue > 0 ? 'toe-in' : 'zero'}`
          return (
            <div key={rec.parameter} className="bg-[#252525] rounded-md p-3 mt-3">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-[#666] uppercase">{rec.label}</p>
                <p className="font-mono text-lg font-medium">{toeDisplay}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setAdjusted('toeFront', +(toeValue - 0.0625).toFixed(4))}
                  className="flex-1 py-1.5 bg-[#333] rounded text-xs font-mono hover:bg-[#444] transition-colors min-h-[36px]"
                >
                  - 1/16&quot;
                </button>
                <button
                  onClick={() => setAdjusted('toeFront', +(toeValue + 0.0625).toFixed(4))}
                  className="flex-1 py-1.5 bg-[#333] rounded text-xs font-mono hover:bg-[#444] transition-colors min-h-[36px]"
                >
                  + 1/16&quot;
                </button>
              </div>
              {expandedSection === 'alignment' && (
                <p className="text-xs text-[#888] mt-2">{aiData?.alignment?.toeFront?.explanation || rec.explanation}</p>
              )}
            </div>
          )
        })}
      </SetupSection>

      {/* Tire Pressures — adjustable with tire-specific ranges */}
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
              step={1}
              explanation={aiData?.tirePressures?.[rec.parameter]?.explanation || rec.explanation}
              expanded={expandedSection === 'tires'}
              onAdjust={(v) => setAdjusted(rec.parameter, v)}
              isLocked={locked.has(rec.parameter)}
              onToggleLock={() => toggleLock(rec.parameter)}
            />
          ))}
        </div>
        <p className="text-[10px] text-[#555] mt-2">
          Ranges based on {selectedTire.label} on {selectedTrack ? `${selectedTrack.surface} (${selectedTrack.name})` : selectedTire.surface} — {effectivePressureRange.front[0]}-{effectivePressureRange.front[1]} psi front
        </p>
      </SetupSection>

      {/* Weight Distribution — adjustable */}
      <SetupSection
        title="Weight"
        unit=""
        expanded={expandedSection === 'weight'}
        onToggle={() => setExpandedSection(expandedSection === 'weight' ? null : 'weight')}
        aiExplanation={aiData?.weight ? Object.values(aiData.weight).map(r => r.explanation).join(' ') : undefined}
      >
        {/* Corner weights — adjustable */}
        <div className="bg-[#252525] rounded-md p-4">
          <p className="text-[10px] text-[#666] uppercase mb-3 text-center">Corner Weights (lbs)</p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <CornerWeightStepper label="LF" value={getAdjusted('cornerWeightLF', currentSetup.cornerWeightLF)} onAdjust={(v) => setAdjusted('cornerWeightLF', v)} />
            <CornerWeightStepper label="RF" value={getAdjusted('cornerWeightRF', currentSetup.cornerWeightRF)} onAdjust={(v) => setAdjusted('cornerWeightRF', v)} />
            <CornerWeightStepper label="LR" value={getAdjusted('cornerWeightLR', currentSetup.cornerWeightLR)} onAdjust={(v) => setAdjusted('cornerWeightLR', v)} />
            <CornerWeightStepper label="RR" value={getAdjusted('cornerWeightRR', currentSetup.cornerWeightRR)} onAdjust={(v) => setAdjusted('cornerWeightRR', v)} />
          </div>
          {/* Computed totals */}
          {(() => {
            const lf = getAdjusted('cornerWeightLF', currentSetup.cornerWeightLF)
            const rf = getAdjusted('cornerWeightRF', currentSetup.cornerWeightRF)
            const lr = getAdjusted('cornerWeightLR', currentSetup.cornerWeightLR)
            const rr = getAdjusted('cornerWeightRR', currentSetup.cornerWeightRR)
            const total = lf + rf + lr + rr
            const cross = total > 0 ? ((rf + lr) / total * 100) : 0
            const left = total > 0 ? ((lf + lr) / total * 100) : 0
            const rear = total > 0 ? ((lr + rr) / total * 100) : 0
            return (
              <>
                <div className="grid grid-cols-2 gap-4 mt-4 text-center text-sm font-mono">
                  <div>
                    <span className="text-[#666]">Total</span>
                    <p className="font-semibold">{total.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[#666]">Cross-Wt</span>
                    <p className="font-semibold text-[#FF8A00]">{cross.toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-[#666]">Left %</span>
                    <StatusValue value={+left.toFixed(1)} target={raceType === 'figure-8' ? 50 : 55} tolerance={2} unit="%" />
                  </div>
                  <div>
                    <span className="text-[#666]">Rear %</span>
                    <StatusValue value={+rear.toFixed(1)} target={raceType === 'figure-8' ? 50 : 49} tolerance={2} unit="%" />
                  </div>
                </div>
                {/* Rules compliance — shown when expanded */}
                {expandedSection === 'weight' && (
                  <div className="flex gap-3 mt-4 justify-center text-[10px] text-[#555]">
                    <RuleCheck passed={total >= 3300} label="Min 3,300 lbs" />
                    {raceType === 'oval' && <RuleCheck passed={left >= 54} label="55% Left" />}
                    {raceType === 'oval' && <RuleCheck passed={rear >= 48} label="49% Rear" />}
                  </div>
                )}
              </>
            )
          })()}
        </div>
        {/* Weight targets — informational */}
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

function SetupValueCard({ label, value, unit, rangeLow, rangeHigh, step = 1, formatValue, explanation, expanded, onAdjust, isLocked, onToggleLock }: {
  label: string; value: number; unit: string; rangeLow: number; rangeHigh: number; step?: number; formatValue?: (v: number) => string; explanation: string; expanded: boolean; onAdjust: (v: number) => void; isLocked?: boolean; onToggleLock?: () => void
}) {
  const pct = Math.max(0, Math.min(100, ((value - rangeLow) / (rangeHigh - rangeLow)) * 100))
  const display = formatValue ? formatValue(value) : String(value)

  return (
    <div className={`bg-[#252525] rounded-md p-3 ${isLocked ? 'ring-1 ring-[#FF8A00]/40' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#666] uppercase">{label}</p>
        {onToggleLock && (
          <button
            onClick={onToggleLock}
            className={`p-1 rounded transition-colors ${isLocked ? 'text-[#FF8A00]' : 'text-[#444] hover:text-[#666]'}`}
            title={isLocked ? 'Locked — AI will keep this value' : 'Unlocked — AI can change this'}
          >
            {isLocked ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/></svg>
            )}
          </button>
        )}</div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-mono text-xl font-medium">{display}</span>
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
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onAdjust(+(Math.max(rangeLow - step * 2, value - step)).toFixed(4))}
          disabled={isLocked}
          className={`flex-1 py-1.5 rounded text-sm font-mono transition-colors min-h-[36px] ${
            isLocked
              ? 'bg-[#2A2A2A] text-[#444] cursor-not-allowed'
              : 'bg-[#333] hover:bg-[#444]'
          }`}
        >
          -
        </button>
        <button
          onClick={() => onAdjust(+(Math.min(rangeHigh + step * 2, value + step)).toFixed(4))}
          disabled={isLocked}
          className={`flex-1 py-1.5 rounded text-sm font-mono transition-colors min-h-[36px] ${
            isLocked
              ? 'bg-[#2A2A2A] text-[#444] cursor-not-allowed'
              : 'bg-[#333] hover:bg-[#444]'
          }`}
        >
          +
        </button>
      </div>
      {expanded && <p className="text-xs text-[#888] mt-2">{explanation}</p>}
    </div>
  )
}

function CornerWeightStepper({ label, value, onAdjust }: { label: string; value: number; onAdjust: (v: number) => void }) {
  return (
    <div className="bg-[#333] rounded-md p-3 text-center">
      <p className="font-mono text-lg font-semibold">{value}</p>
      <p className="text-[10px] text-[#666] uppercase">{label}</p>
      <div className="flex gap-1 mt-2">
        <button
          onClick={() => onAdjust(Math.max(0, value - 5))}
          className="flex-1 py-1 bg-[#252525] rounded text-xs font-mono hover:bg-[#444] transition-colors min-h-[32px]"
        >
          -5
        </button>
        <button
          onClick={() => onAdjust(value + 5)}
          className="flex-1 py-1 bg-[#252525] rounded text-xs font-mono hover:bg-[#444] transition-colors min-h-[32px]"
        >
          +5
        </button>
      </div>
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

function WeatherStat({ label, value, sub, unit }: { label: string; value: string; sub: string; unit?: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-[#666] uppercase">{label}</p>
      <p className="font-mono text-lg font-medium mt-0.5">
        {value}
        {unit && <span className="text-[10px] text-[#666] ml-0.5">{unit}</span>}
      </p>
      <p className="text-[10px] text-[#555] mt-0.5">{sub}</p>
    </div>
  )
}

function windDir(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(degrees / 22.5) % 16]
}
