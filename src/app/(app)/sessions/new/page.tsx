'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCar } from '@/hooks/useCar'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { ProGate } from '@/components/subscription/ProGate'
import { db } from '@/data/db'
import type { Session, TrackCondition, EventType, HandlingFeel } from '@/lib/types'

const conditions: TrackCondition[] = ['heavy', 'tacky', 'moderate', 'dry', 'slick']
const eventTypes: EventType[] = ['practice', 'qualifying', 'heat', 'feature']

export default function NewSessionPage() {
  const router = useRouter()
  const { currentCar } = useCar()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const [eventType, setEventType] = useState<EventType>('practice')
  const [condition, setCondition] = useState<TrackCondition>('moderate')
  const [temp, setTemp] = useState('72')
  const [humidity, setHumidity] = useState('45')
  const [handlingEntry, setHandlingEntry] = useState<HandlingFeel>('neutral')
  const [handlingMid, setHandlingMid] = useState<HandlingFeel>('neutral')
  const [handlingExit, setHandlingExit] = useState<HandlingFeel>('neutral')
  const [lapTimes, setLapTimes] = useState<string[]>(['', '', '', '', ''])
  const [notes, setNotes] = useState('')
  const [changes, setChanges] = useState('')
  const [startPos, setStartPos] = useState('')
  const [finishPos, setFinishPos] = useState('')

  const validLaps = lapTimes.filter(t => t && !isNaN(parseFloat(t))).map(t => parseFloat(t))
  const bestLap = validLaps.length > 0 ? Math.min(...validLaps) : 0
  const avgLap = validLaps.length > 0 ? validLaps.reduce((a, b) => a + b, 0) / validLaps.length : 0

  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)

    const session: Session = {
      id: crypto.randomUUID(),
      carId: currentCar.id,
      trackId: '',
      setupId: '',
      date: new Date().toISOString(),
      eventType,
      weather: { temp: parseFloat(temp) || 72, humidity: parseFloat(humidity) || 45, wind: '' },
      trackCondition: condition,
      handlingEntry,
      handlingMid,
      handlingExit,
      lapTimes: validLaps,
      bestLap,
      startPosition: startPos ? parseInt(startPos) : undefined,
      finishPosition: finishPos ? parseInt(finishPos) : undefined,
      changesMade: changes ? [{ parameter: 'changes', from: '', to: changes, notes: '' }] : [],
      notes,
    }

    // Save to local IndexedDB
    try {
      await db.sessions.put(session)
    } catch {
      // IndexedDB may not be available — continue anyway
    }

    // Save to Supabase if authenticated
    if (user) {
      try {
        await supabase.from('sessions').insert({
          id: session.id,
          user_id: user.id,
          car_id: session.carId,
          event_type: session.eventType,
          track_condition: session.trackCondition,
          weather: session.weather,
          handling: {
            entry: session.handlingEntry,
            mid: session.handlingMid,
            exit: session.handlingExit,
          },
          lap_times: session.lapTimes,
          best_lap: session.bestLap,
          start_position: session.startPosition ?? null,
          finish_position: session.finishPosition ?? null,
          changes_made: session.changesMade,
          notes: session.notes,
          session_date: session.date,
        })
      } catch {
        // Supabase save failed — local copy still exists
      }
    }

    setSaving(false)
    router.push('/sessions')
  }

  return (
    <ProGate variant="full-page" feature="Session Logging">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-[#7A7A90] hover:text-[#D4D4E0] min-h-[48px] flex items-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 className="text-2xl font-bold tracking-tight uppercase">New Session</h1>
        </div>
      </div>

      {/* Car & Date */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
        <p className="text-xs text-[#555570]">{currentCar.year} {currentCar.model}</p>
        <p className="text-sm text-[#7A7A90] mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Event Type */}
      <div>
        <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Event Type</label>
        <div className="flex gap-2">
          {eventTypes.map(t => (
            <button
              key={t}
              onClick={() => setEventType(t)}
              className={`flex-1 py-3 rounded-md text-sm font-semibold capitalize transition-colors min-h-[48px] ${
                eventType === t
                  ? 'bg-[#00B4FF] text-[#0A0A0F]'
                  : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4 space-y-4">
        <h2 className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider">Conditions</h2>

        <div>
          <label className="text-xs text-[#555570] block mb-2">Track</label>
          <div className="flex gap-2">
            {conditions.map(c => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`flex-1 py-2.5 rounded-md text-xs font-semibold capitalize transition-colors min-h-[44px] ${
                  condition === c
                    ? 'bg-[#00B4FF] text-[#0A0A0F]'
                    : 'bg-[#1A1A28] text-[#7A7A90] border border-[#2A2A3A]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#555570] block mb-1">Temp (°F)</label>
            <input
              type="number"
              value={temp}
              onChange={e => setTemp(e.target.value)}
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
            />
          </div>
          <div>
            <label className="text-xs text-[#555570] block mb-1">Humidity (%)</label>
            <input
              type="number"
              value={humidity}
              onChange={e => setHumidity(e.target.value)}
              className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* Handling */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
        <h2 className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-4">Handling</h2>
        <div className="space-y-3">
          <HandlingRow label="Entry" value={handlingEntry} onChange={setHandlingEntry} />
          <HandlingRow label="Mid" value={handlingMid} onChange={setHandlingMid} />
          <HandlingRow label="Exit" value={handlingExit} onChange={setHandlingExit} />
        </div>
        <div className="mt-4">
          <label className="text-xs text-[#555570] block mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Tight on entry, comes free on exit..."
            className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[80px] resize-none"
          />
        </div>
      </div>

      {/* Lap Times */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
        <h2 className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-4">Lap Times</h2>
        <div className="grid grid-cols-2 gap-3">
          {lapTimes.map((t, i) => (
            <div key={i}>
              <label className="text-[10px] text-[#555570]">#{i + 1}</label>
              <input
                type="number"
                step="0.01"
                value={t}
                onChange={e => {
                  const newTimes = [...lapTimes]
                  newTimes[i] = e.target.value
                  setLapTimes(newTimes)
                }}
                placeholder="0.00"
                className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
              />
            </div>
          ))}
          <button
            onClick={() => setLapTimes([...lapTimes, ''])}
            className="flex items-center justify-center bg-[#1A1A28] border border-[#2A2A3A] rounded-md text-[#555570] hover:text-[#D4D4E0] transition-colors min-h-[44px] mt-4"
          >
            + Add
          </button>
        </div>
        {validLaps.length > 0 && (
          <div className="flex gap-6 mt-4 pt-3 border-t border-[#2A2A3A]">
            <div>
              <span className="text-[10px] text-[#555570] uppercase">Best</span>
              <p className="font-mono font-semibold text-[#00E676]">{bestLap.toFixed(2)}s</p>
            </div>
            <div>
              <span className="text-[10px] text-[#555570] uppercase">Average</span>
              <p className="font-mono font-semibold">{avgLap.toFixed(2)}s</p>
            </div>
          </div>
        )}
      </div>

      {/* Changes Made */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
        <h2 className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Changes Made</h2>
        <textarea
          value={changes}
          onChange={e => setChanges(e.target.value)}
          placeholder="• Lowered RR pressure 1 psi&#10;• Added 1/2 turn RF wedge"
          className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[80px] resize-none"
        />
      </div>

      {/* Result (for races) */}
      {(eventType === 'heat' || eventType === 'feature') && (
        <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
          <h2 className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">Result</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555570] block mb-1">Started</label>
              <input
                type="number"
                value={startPos}
                onChange={e => setStartPos(e.target.value)}
                placeholder="#"
                className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-xs text-[#555570] block mb-1">Finished</label>
              <input
                type="number"
                value={finishPos}
                onChange={e => setFinishPos(e.target.value)}
                placeholder="#"
                className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#00B4FF] text-[#0A0A0F] py-4 rounded-md text-sm font-bold hover:bg-[#33C4FF] transition-colors min-h-[56px] disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Session'}
      </button>
    </div>
    </ProGate>
  )
}

function HandlingRow({ label, value, onChange }: {
  label: string; value: HandlingFeel; onChange: (v: HandlingFeel) => void
}) {
  const options: HandlingFeel[] = ['tight', 'neutral', 'loose']
  const colors: Record<HandlingFeel, string> = {
    tight: 'bg-[#FF1744] text-white',
    neutral: 'bg-[#00E676] text-[#0A0A0F]',
    loose: 'bg-[#00B4FF] text-white',
  }
  const inactiveColors: Record<HandlingFeel, string> = {
    tight: 'text-[#FF1744] border-[#FF1744]/30',
    neutral: 'text-[#00E676] border-[#00E676]/30',
    loose: 'text-[#00B4FF] border-[#00B4FF]/30',
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#555570] w-10">{label}</span>
      <div className="flex gap-2 flex-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-md text-xs font-semibold capitalize transition-colors min-h-[44px] ${
              value === opt
                ? colors[opt]
                : `bg-transparent border ${inactiveColors[opt]}`
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
