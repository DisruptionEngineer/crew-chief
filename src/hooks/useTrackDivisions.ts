'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import type { Rule, TechCheckItem, RuleCategory, RaceType } from '@/lib/types'

// ============================================================
// Supabase-backed division data for the Rules page.
// These types mirror what the DB returns, not the static Division type.
// ============================================================

export interface TrackSummary {
  id: string
  name: string
  location: string
}

export interface DivisionSummary {
  id: string
  name: string
  description: string
  trackId: string
  trackName: string
  formats: RaceType[]
  minWeightLbs: number
  maxWeightLbs: number
  minLeftPct: number | null
  minRearPct: number | null
  modificationLevel: 'stock' | 'limited' | 'open'
  eligibleMakes: string[]
  notes: string
}

interface DbDivisionRow {
  id: string
  name: string
  description: string
  track_id: string
  formats: string[]
  min_weight_lbs: number
  max_weight_lbs: number
  min_left_pct: number | null
  min_rear_pct: number | null
  modification_level: string
  eligible_makes: string[]
  notes: string
  tracks: { name: string; location: string }
}

interface DbRuleRow {
  rule_id: string
  section: string
  number: string
  text: string
  category: string
  sort_order: number
}

interface DbTechRow {
  item_id: string
  category: string
  label: string
  rule_ref: string
  sort_order: number
}

function mapDivision(row: DbDivisionRow): DivisionSummary {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    trackId: row.track_id,
    trackName: (row.tracks as { name: string })?.name || '',
    formats: (row.formats || []) as RaceType[],
    minWeightLbs: row.min_weight_lbs,
    maxWeightLbs: row.max_weight_lbs,
    minLeftPct: row.min_left_pct,
    minRearPct: row.min_rear_pct,
    modificationLevel: row.modification_level as DivisionSummary['modificationLevel'],
    eligibleMakes: row.eligible_makes || [],
    notes: row.notes || '',
  }
}

function mapRule(row: DbRuleRow): Rule {
  return {
    id: row.rule_id,
    section: row.section,
    number: row.number,
    text: row.text,
    category: row.category as RuleCategory,
  }
}

function mapTechItem(row: DbTechRow): TechCheckItem {
  return {
    id: row.item_id,
    category: row.category,
    label: row.label,
    rule: row.rule_ref,
    checked: false,
  }
}

export function useTrackDivisions() {
  const { supabase } = useSupabase()
  const [tracksWithDivisions, setTracksWithDivisions] = useState<TrackSummary[]>([])
  const [divisions, setDivisions] = useState<DivisionSummary[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [techChecklist, setTechChecklist] = useState<TechCheckItem[]>([])
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1) Fetch all tracks that have at least one division
  const fetchTracksWithDivisions = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('divisions')
      .select('track_id, tracks(id, name, location)')

    if (err) {
      setError(err.message)
      return
    }

    // Deduplicate tracks
    const trackMap = new Map<string, TrackSummary>()
    for (const row of data || []) {
      const t = row.tracks as unknown as { id: string; name: string; location: string }
      if (t && !trackMap.has(t.id)) {
        trackMap.set(t.id, { id: t.id, name: t.name, location: t.location })
      }
    }
    const tracks = Array.from(trackMap.values())
    setTracksWithDivisions(tracks)
    return tracks
  }, [supabase])

  // 2) Fetch divisions for a track
  const fetchDivisions = useCallback(async (trackId: string) => {
    const { data, error: err } = await supabase
      .from('divisions')
      .select('*, tracks(name, location)')
      .eq('track_id', trackId)
      .order('sort_order')

    if (err) {
      setError(err.message)
      return
    }

    const divs = (data || []).map((row: DbDivisionRow) => mapDivision(row))
    setDivisions(divs)
    return divs
  }, [supabase])

  // 3) Fetch rules for a division
  const fetchRules = useCallback(async (divisionId: string) => {
    const { data, error: err } = await supabase
      .from('division_rules')
      .select('rule_id, section, number, text, category, sort_order')
      .eq('division_id', divisionId)
      .eq('season', 2026)
      .order('sort_order')

    if (err) {
      setError(err.message)
      return []
    }

    const mapped = (data || []).map((row: DbRuleRow) => mapRule(row))
    setRules(mapped)
    return mapped
  }, [supabase])

  // 4) Fetch tech checklist for a division
  const fetchTechChecklist = useCallback(async (divisionId: string) => {
    const { data, error: err } = await supabase
      .from('division_tech_checklist')
      .select('item_id, category, label, rule_ref, sort_order')
      .eq('division_id', divisionId)
      .eq('season', 2026)
      .order('sort_order')

    if (err) {
      setError(err.message)
      return []
    }

    const mapped = (data || []).map((row: DbTechRow) => mapTechItem(row))
    setTechChecklist(mapped)
    return mapped
  }, [supabase])

  // Select a track (fetches its divisions, auto-selects first)
  const selectTrack = useCallback(async (trackId: string) => {
    setSelectedTrackId(trackId)
    setLoading(true)
    setError(null)

    try {
      const divs = await fetchDivisions(trackId)
      if (divs && divs.length > 0) {
        setSelectedDivisionId(divs[0].id)
        await Promise.all([
          fetchRules(divs[0].id),
          fetchTechChecklist(divs[0].id),
        ])
      } else {
        setSelectedDivisionId(null)
        setRules([])
        setTechChecklist([])
      }
    } catch {
      // Error state already set by individual fetch functions
    } finally {
      setLoading(false)
    }
  }, [fetchDivisions, fetchRules, fetchTechChecklist])

  // Select a division (fetches its rules + tech checklist)
  const selectDivision = useCallback(async (divisionId: string) => {
    setSelectedDivisionId(divisionId)
    setLoading(true)
    setError(null)

    try {
      await Promise.all([
        fetchRules(divisionId),
        fetchTechChecklist(divisionId),
      ])
    } catch {
      // Error state already set by individual fetch functions
    } finally {
      setLoading(false)
    }
  }, [fetchRules, fetchTechChecklist])

  // Initial load: fetch tracks, auto-select first track
  useEffect(() => {
    let cancelled = false

    async function init() {
      const tracks = await fetchTracksWithDivisions()
      if (cancelled || !tracks || tracks.length === 0) {
        setLoading(false)
        return
      }

      // Default to first track
      const firstTrack = tracks[0]
      setSelectedTrackId(firstTrack.id)

      const divs = await fetchDivisions(firstTrack.id)
      if (cancelled || !divs || divs.length === 0) {
        setLoading(false)
        return
      }

      setSelectedDivisionId(divs[0].id)
      await Promise.all([
        fetchRules(divs[0].id),
        fetchTechChecklist(divs[0].id),
      ])

      if (!cancelled) setLoading(false)
    }

    init()
    return () => { cancelled = true }
  }, [fetchTracksWithDivisions, fetchDivisions, fetchRules, fetchTechChecklist])

  const activeDivision = divisions.find(d => d.id === selectedDivisionId) || null

  return {
    // Data
    tracksWithDivisions,
    divisions,
    rules,
    techChecklist,
    activeDivision,
    selectedTrackId,
    selectedDivisionId,
    // Actions
    selectTrack,
    selectDivision,
    // State
    loading,
    error,
  }
}
