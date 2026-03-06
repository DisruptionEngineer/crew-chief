'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { ProGate } from '@/components/subscription/ProGate'
import { db } from '@/data/db'
import type { Session, HandlingFeel } from '@/lib/types'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { supabase } = useSupabase()

  useEffect(() => {
    async function loadSessions() {
      const allSessions: Session[] = []
      const seenIds = new Set<string>()

      // Load from Supabase first (cloud source of truth)
      if (user) {
        try {
          const { data } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('session_date', { ascending: false })

          if (data) {
            for (const row of data) {
              seenIds.add(row.id)
              allSessions.push({
                id: row.id,
                carId: row.car_id,
                trackId: '',
                setupId: '',
                date: row.session_date,
                eventType: row.event_type,
                weather: row.weather ?? { temp: 72, humidity: 45, wind: '' },
                trackCondition: row.track_condition,
                handlingEntry: row.handling?.entry ?? 'neutral',
                handlingMid: row.handling?.mid ?? 'neutral',
                handlingExit: row.handling?.exit ?? 'neutral',
                lapTimes: row.lap_times ?? [],
                bestLap: row.best_lap ?? 0,
                startPosition: row.start_position,
                finishPosition: row.finish_position,
                changesMade: row.changes_made ?? [],
                notes: row.notes ?? '',
              })
            }
          }
        } catch {
          // Supabase unavailable — fall through to local
        }
      }

      // Also load from IndexedDB for any local-only sessions
      try {
        const local = await db.sessions.orderBy('date').reverse().toArray()
        for (const s of local) {
          if (!seenIds.has(s.id)) {
            allSessions.push(s)
          }
        }
      } catch {
        // IndexedDB unavailable
      }

      // Sort by date descending
      allSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setSessions(allSessions)
      setLoading(false)
    }

    loadSessions()
  }, [user, supabase])

  return (
    <ProGate variant="blur-overlay" feature="Session Logging">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Session Log</h1>
          <p className="text-sm text-[#7A7A90] mt-1">Track your practice and race sessions</p>
        </div>
        <Link
          href="/sessions/new"
          className="bg-[#00B4FF] text-[#0A0A0F] px-4 py-2.5 rounded-md text-sm font-bold min-h-[48px] flex items-center gap-2 hover:bg-[#33C4FF] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New
        </Link>
      </div>

      {loading ? (
        <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-8 text-center">
          <p className="text-sm text-[#7A7A90]">Loading sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-[#2A2A3A] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
          <p className="text-sm text-[#7A7A90] mb-4">
            Log your first practice or race session to start tracking your setup changes and handling notes.
          </p>
          <Link
            href="/sessions/new"
            className="inline-flex items-center gap-2 bg-[#00B4FF] text-[#0A0A0F] px-6 py-3 rounded-md text-sm font-bold hover:bg-[#33C4FF] transition-colors"
          >
            Log Your First Session
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
    </ProGate>
  )
}

function SessionCard({ session }: { session: Session }) {
  const handlingColor = (feel: HandlingFeel) => {
    if (feel === 'tight') return 'text-[#FF1744]'
    if (feel === 'loose') return 'text-[#00B4FF]'
    return 'text-[#00E676]'
  }

  return (
    <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#00B4FF]/20 text-[#00B4FF] uppercase font-semibold">
              {session.eventType}
            </span>
            <span className="text-xs text-[#555570]">{session.trackCondition}</span>
          </div>
          <p className="text-sm text-[#7A7A90] mt-1">
            {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {session.bestLap > 0 && (
          <div className="text-right">
            <p className="font-mono text-lg font-semibold">{session.bestLap.toFixed(2)}s</p>
            <p className="text-[10px] text-[#555570]">Best Lap</p>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-3 text-xs">
        <span>Entry: <span className={handlingColor(session.handlingEntry)}>{session.handlingEntry}</span></span>
        <span>Mid: <span className={handlingColor(session.handlingMid)}>{session.handlingMid}</span></span>
        <span>Exit: <span className={handlingColor(session.handlingExit)}>{session.handlingExit}</span></span>
      </div>
      {session.notes && <p className="text-xs text-[#7A7A90] mt-2 line-clamp-2">{session.notes}</p>}
    </div>
  )
}
