'use client'

import type { SavedEngineBuild } from '@/lib/types'

interface SavedBuildsDrawerProps {
  open: boolean
  builds: SavedEngineBuild[]
  onLoad: (build: SavedEngineBuild) => void
  onDelete: (id: string) => void
  onCompare: (a: string, b: string) => void
  onClose: () => void
}

export function SavedBuildsDrawer({ open, builds, onLoad, onDelete, onCompare, onClose }: SavedBuildsDrawerProps) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#1A1A1A] border-l border-[#333] z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-sm font-bold uppercase tracking-wider">Saved Builds</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#252525] transition-colors"
          >
            <svg className="w-4 h-4 text-[#888]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Build list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {builds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-[#666]">No saved builds yet.</p>
              <p className="text-xs text-[#555] mt-1">Build an engine and save it to see it here.</p>
            </div>
          ) : (
            builds.map(build => (
              <div
                key={build.id}
                className="bg-[#252525] border border-[#333] rounded-lg p-3 group"
              >
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => onLoad(build)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FF8A00] transition-colors">
                      {build.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#888]">
                      <span className="font-mono">{build.result.peakHp} HP</span>
                      <span className="font-mono">{build.result.peakTorque} lb-ft</span>
                      <span className={`font-semibold ${build.result.compliance.isLegal ? 'text-[#00E676]' : 'text-[#FF1744]'}`}>
                        {build.result.compliance.isLegal ? '✓ Legal' : '✗ Illegal'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#555] mt-1">
                      {new Date(build.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    onClick={() => onDelete(build.id)}
                    className="p-1.5 rounded hover:bg-[#333] transition-colors flex-shrink-0"
                    title="Delete build"
                  >
                    <svg className="w-3.5 h-3.5 text-[#666] hover:text-[#FF1744]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Compare footer */}
        {builds.length >= 2 && (
          <div className="p-4 border-t border-[#333]">
            <p className="text-[10px] text-[#666] uppercase mb-2">Quick Compare</p>
            <div className="flex gap-2">
              <select
                id="compare-a"
                className="flex-1 bg-[#252525] border border-[#333] rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
                defaultValue=""
              >
                <option value="" disabled>Build A</option>
                {builds.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <select
                id="compare-b"
                className="flex-1 bg-[#252525] border border-[#333] rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
                defaultValue=""
              >
                <option value="" disabled>Build B</option>
                {builds.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const a = (document.getElementById('compare-a') as HTMLSelectElement)?.value
                  const b = (document.getElementById('compare-b') as HTMLSelectElement)?.value
                  if (a && b && a !== b) onCompare(a, b)
                }}
                className="px-3 py-2 bg-[#FF8A00] text-[#0D0D0D] text-xs font-semibold rounded-md hover:bg-[#FFA640] transition-colors"
              >
                Compare
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
