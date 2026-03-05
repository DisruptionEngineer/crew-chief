import { createAdminSupabaseClient } from '@/lib/supabase/server'
import type { Track, TrackSurface } from '@/lib/types'

// DB row → Track interface mapper
function mapRow(row: Record<string, unknown>): Track {
  return {
    id: row.id as string,
    name: row.name as string,
    location: row.location as string,
    length: String(row.length),
    surface: row.surface as TrackSurface,
    surfaceDetails: (row.surface_details as string) || '',
    banking: Number(row.banking) || 0,
    shape: (row.shape as string) || 'oval',
    elevation: Number(row.elevation) || 0,
    notes: (row.notes as string) || '',
  }
}

export async function getAllTracks(filters?: {
  state?: string
  surface?: TrackSurface
}): Promise<Track[]> {
  const supabase = createAdminSupabaseClient()
  let query = supabase.from('tracks').select('*').eq('active', true).order('name')

  if (filters?.state) query = query.eq('state', filters.state)
  if (filters?.surface) query = query.eq('surface', filters.surface)

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapRow)
}

export async function getTrackById(id: string): Promise<Track | null> {
  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapRow(data)
}

export async function searchTracks(query: string): Promise<Track[]> {
  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('active', true)
    .or(`name.ilike.%${query}%,location.ilike.%${query}%,state.ilike.%${query}%`)
    .order('name')
    .limit(20)

  if (error) throw error
  return (data || []).map(mapRow)
}

export async function getTracksByState(state: string): Promise<Track[]> {
  return getAllTracks({ state })
}
