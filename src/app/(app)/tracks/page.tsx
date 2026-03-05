'use client'

import { useState } from 'react'
import { useMyTracks } from '@/hooks/useMyTracks'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import Link from 'next/link'
import type { Track, TrackSurface } from '@/lib/types'

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
    latitude: row.latitude != null ? Number(row.latitude) : null,
    longitude: row.longitude != null ? Number(row.longitude) : null,
    notes: (row.notes as string) || '',
  }
}

const surfaceColors: Record<string, string> = {
  dirt: 'bg-amber-900/20 text-amber-500',
  asphalt: 'bg-gray-700/30 text-gray-400',
  concrete: 'bg-slate-600/20 text-slate-400',
  mixed: 'bg-purple-900/20 text-purple-400',
}

export default function TracksPage() {
  const { myTracks, addTrack, removeTrack, setPrimaryTrack, loading, hasMyTracks } = useMyTracks()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const { isPro } = useSubscriptionContext()
  const [showAddModal, setShowAddModal] = useState(false)
  const [allTracks, setAllTracks] = useState<Track[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [adding, setAdding] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const handleOpenAdd = async () => {
    setShowAddModal(true)
    setSearchQuery('')
    const { data } = await supabase
      .from('tracks')
      .select('*')
      .eq('active', true)
      .order('name')
    if (data) {
      setAllTracks(data.map((r: Record<string, unknown>) => mapDbTrack(r)))
    }
  }

  const handleAddTrack = async (trackId: string) => {
    setAdding(trackId)
    await addTrack(trackId)
    setAdding(null)
    if (!isPro) setShowAddModal(false)
  }

  const handleRemoveTrack = async (trackId: string) => {
    setRemoving(trackId)
    await removeTrack(trackId)
    setRemoving(null)
  }

  const myTrackIds = new Set(myTracks.map(t => t.trackId))
  const filteredTracks = allTracks.filter(t =>
    !myTrackIds.has(t.id) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight uppercase">My Tracks</h1>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-8 text-center">
          <p className="text-[#888]">Sign in to manage your tracks</p>
          <Link href="/auth/login" className="inline-block mt-4 px-6 py-3 bg-[#FF8A00] text-[#0D0D0D] rounded-md font-semibold text-sm hover:bg-[#FFA640] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight uppercase">My Tracks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-[#333] rounded w-2/3 mb-3" />
              <div className="h-3 bg-[#333] rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">My Tracks</h1>
          <p className="text-sm text-[#888] mt-1">
            {myTracks.length} track{myTracks.length !== 1 ? 's' : ''}
            {!isPro && ' (1 max on Free plan)'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={!isPro && myTracks.length >= 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-semibold bg-[#FF8A00] text-[#0D0D0D] hover:bg-[#FFA640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Track
        </button>
      </div>

      {/* Pro Upsell */}
      {!isPro && myTracks.length >= 1 && (
        <Link
          href="/account"
          className="block bg-[#FF8A00]/5 border border-[#FF8A00]/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#FF8A00] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-[#FF8A00]">Upgrade to Pro for unlimited tracks</p>
              <p className="text-xs text-[#888] mt-0.5">Save all your tracks and get setups tailored to each one</p>
            </div>
          </div>
        </Link>
      )}

      {/* Empty State */}
      {!hasMyTracks && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-12 text-center">
          <svg className="w-12 h-12 text-[#333] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 6l3-3h12l3 3" />
            <path d="M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6" />
            <ellipse cx="12" cy="13" rx="7" ry="5" />
            <ellipse cx="12" cy="13" rx="3" ry="2" />
          </svg>
          <h2 className="text-lg font-semibold text-[#888]">No tracks added yet</h2>
          <p className="text-sm text-[#666] mt-2">Add your home track and tracks you travel to race at</p>
          <button
            onClick={handleOpenAdd}
            className="mt-6 px-6 py-3 bg-[#FF8A00] text-[#0D0D0D] rounded-md font-semibold text-sm hover:bg-[#FFA640] transition-colors min-h-[48px]"
          >
            Add Your First Track
          </button>
        </div>
      )}

      {/* Track Grid */}
      {hasMyTracks && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myTracks.map((entry) => (
            <div
              key={entry.id}
              className={`bg-[#1A1A1A] border rounded-lg p-5 transition-colors ${
                entry.isPrimary ? 'border-[#FF8A00]/50' : 'border-[#333]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#F5F5F5]">
                      {entry.track.name}
                    </h3>
                    {entry.isPrimary && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF8A00]/10 text-[#FF8A00] font-bold uppercase">Home</span>
                    )}
                  </div>
                  <p className="text-xs text-[#666] mt-1">{entry.track.location}</p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-[#555]">
                    <span>{entry.track.length} mi</span>
                    <span>{entry.track.banking}&deg; banking</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize ${surfaceColors[entry.track.surface] || surfaceColors.mixed}`}>
                      {entry.track.surface}
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1">
                  {!entry.isPrimary && (
                    <button
                      onClick={() => setPrimaryTrack(entry.trackId)}
                      className="p-2 text-[#666] hover:text-[#FF8A00] transition-colors min-h-[36px] min-w-[36px]"
                      title="Set as home track"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveTrack(entry.trackId)}
                    disabled={removing === entry.trackId}
                    className="p-2 text-[#666] hover:text-[#FF1744] transition-colors min-h-[36px] min-w-[36px] disabled:opacity-50"
                    title="Remove from my tracks"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                  </button>
                </div>
              </div>
              {/* Quick link to setup */}
              <Link
                href="/setup"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-[#252525] border border-[#333] rounded-md text-xs font-semibold text-[#888] hover:text-[#F5F5F5] hover:border-[#555] transition-colors min-h-[44px]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
                View Setup
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Track Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-[#1A1A1A] border border-[#333] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h2 className="text-lg font-bold uppercase tracking-wider">Add Track</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-[#666] hover:text-[#F5F5F5] min-h-[40px] min-w-[40px]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#333]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks..."
                autoFocus
                className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[48px]"
              />
            </div>

            {/* Track List */}
            <div className="overflow-y-auto max-h-[50vh] p-2">
              {filteredTracks.length === 0 ? (
                <p className="text-center text-[#666] py-8 text-sm">
                  {searchQuery ? 'No tracks found' : 'Loading tracks...'}
                </p>
              ) : (
                filteredTracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handleAddTrack(track.id)}
                    disabled={adding === track.id}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#252525] transition-colors text-left min-h-[56px] disabled:opacity-50"
                  >
                    <div>
                      <p className="font-semibold text-sm">{track.name}</p>
                      <p className="text-xs text-[#666] mt-0.5">{track.location} — {track.length} mi, {track.banking}&deg;</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded font-semibold capitalize ${surfaceColors[track.surface] || surfaceColors.mixed}`}>
                      {track.surface}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
