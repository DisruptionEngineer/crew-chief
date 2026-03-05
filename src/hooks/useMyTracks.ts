'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import type { Track, TrackSurface } from '@/lib/types'

export interface TrackEntry {
  id: string
  trackId: string
  nickname: string | null
  isPrimary: boolean
  track: Track
}

function mapDbTrack(row: Record<string, unknown>): Track {
  return {
    id: row.id as string,
    name: row.name as string,
    location: (row.location as string) || '',
    length: String(row.length),
    surface: (row.surface as TrackSurface) || 'mixed',
    surfaceDetails: (row.surface_details as string) || '',
    banking: Number(row.banking) || 0,
    shape: (row.shape as string) || 'oval',
    elevation: Number(row.elevation) || 0,
    notes: (row.notes as string) || '',
  }
}

export function useMyTracks() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { isPro } = useSubscriptionContext()
  const [myTracks, setMyTracks] = useState<TrackEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTracks = useCallback(async () => {
    if (!user) {
      setMyTracks([])
      setLoading(false)
      return
    }

    try {
      const { data } = await supabase
        .from('user_tracks')
        .select('id, track_id, nickname, is_primary, tracks(*)')
        .eq('user_id', user.id)
        .order('added_at')

      if (data) {
        const entries: TrackEntry[] = data.map((ut: Record<string, unknown>) => ({
          id: ut.id as string,
          trackId: ut.track_id as string,
          nickname: (ut.nickname as string) || null,
          isPrimary: ut.is_primary as boolean,
          track: mapDbTrack(ut.tracks as Record<string, unknown>),
        }))
        setMyTracks(entries)
      }
    } catch {
      // Silent fail — track features degrade gracefully
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchTracks()
  }, [fetchTracks])

  const addTrack = async (trackId: string): Promise<boolean> => {
    if (!user) return false

    // Free user limit: 1 track
    if (!isPro && myTracks.length >= 1) return false

    const isPrimary = myTracks.length === 0

    const { error } = await supabase
      .from('user_tracks')
      .insert({
        user_id: user.id,
        track_id: trackId,
        is_primary: isPrimary,
      })

    if (!error) {
      await fetchTracks()
      return true
    }
    return false
  }

  const removeTrack = async (trackId: string): Promise<boolean> => {
    if (!user) return false

    const { error } = await supabase
      .from('user_tracks')
      .delete()
      .eq('user_id', user.id)
      .eq('track_id', trackId)

    if (!error) {
      await fetchTracks()
      return true
    }
    return false
  }

  const setPrimaryTrack = async (trackId: string): Promise<boolean> => {
    if (!user) return false

    await supabase
      .from('user_tracks')
      .update({ is_primary: false })
      .eq('user_id', user.id)

    const { error } = await supabase
      .from('user_tracks')
      .update({ is_primary: true })
      .eq('user_id', user.id)
      .eq('track_id', trackId)

    if (!error) {
      await fetchTracks()
      return true
    }
    return false
  }

  return {
    myTracks,
    loading,
    addTrack,
    removeTrack,
    setPrimaryTrack,
    refresh: fetchTracks,
    hasMyTracks: myTracks.length > 0,
  }
}
