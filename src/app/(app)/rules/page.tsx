'use client'

import { useState, useMemo } from 'react'
import { useTrackDivisions } from '@/hooks/useTrackDivisions'
import type { RuleCategory, TechCheckItem } from '@/lib/types'

const categoryLabels: Record<RuleCategory, { label: string; icon: string }> = {
  weight: { label: 'Weight & Dimensions', icon: 'scale' },
  engine: { label: 'Engine', icon: 'engine' },
  suspension: { label: 'Suspension & Chassis', icon: 'suspension' },
  tires: { label: 'Tires & Wheels', icon: 'tire' },
  safety: { label: 'Safety', icon: 'shield' },
  drivetrain: { label: 'Drivetrain', icon: 'gear' },
  fuel: { label: 'Fuel & Cooling', icon: 'fuel' },
  electrical: { label: 'Electrical', icon: 'zap' },
  body: { label: 'Body', icon: 'car' },
  general: { label: 'General', icon: 'info' },
}

const categoryOrder: RuleCategory[] = ['weight', 'engine', 'suspension', 'tires', 'drivetrain', 'safety', 'fuel', 'electrical', 'body', 'general']

export default function RulesPage() {
  const {
    tracksWithDivisions,
    divisions,
    rules,
    techChecklist,
    activeDivision,
    selectedTrackId,
    selectTrack,
    selectDivision,
    loading,
    error,
  } = useTrackDivisions()

  const [search, setSearch] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<RuleCategory | null>(null)
  const [showTechChecklist, setShowTechChecklist] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const filteredRules = useMemo(() => {
    if (!search) return rules
    const q = search.toLowerCase()
    return rules.filter(r => r.text.toLowerCase().includes(q) || r.number.toLowerCase().includes(q))
  }, [rules, search])

  const rulesByCategory = useMemo(() => {
    const grouped: Partial<Record<RuleCategory, typeof rules>> = {}
    for (const rule of filteredRules) {
      if (!grouped[rule.category]) grouped[rule.category] = []
      grouped[rule.category]!.push(rule)
    }
    return grouped
  }, [filteredRules])

  const techCheckCategories = useMemo(() => {
    const grouped: Record<string, TechCheckItem[]> = {}
    for (const item of techChecklist) {
      if (!grouped[item.category]) grouped[item.category] = []
      grouped[item.category].push(item)
    }
    return grouped
  }, [techChecklist])

  const checkedCount = Object.values(checkedItems).filter(Boolean).length
  const totalChecks = techChecklist.length

  function handleDivisionChange(id: string) {
    selectDivision(id)
    setCheckedItems({})
    setExpandedCategory(null)
    setShowTechChecklist(false)
    setSearch('')
  }

  function handleTrackChange(trackId: string) {
    selectTrack(trackId)
    setCheckedItems({})
    setExpandedCategory(null)
    setShowTechChecklist(false)
    setSearch('')
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#1A1A28] rounded w-32" />
        <div className="h-10 bg-[#1A1A28] rounded w-full" />
        <div className="h-24 bg-[#14141F] rounded" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[#14141F] rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Rules</h1>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-400">Failed to load rules: {error}</p>
        </div>
      </div>
    )
  }

  if (!activeDivision) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Rules</h1>
        <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-8 text-center">
          <p className="text-sm text-[#7A7A90]">No divisions found. Rules will appear here once a track has published its rulebook.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Rules</h1>
        <div className="flex items-center gap-2 mt-1">
          <svg className="w-3.5 h-3.5 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-sm text-[#7A7A90]">{activeDivision.trackName}</p>
          <span className="text-[10px] text-[#3A3A4A]">2026 Season</span>
        </div>
      </div>

      {/* Track Switcher (only if multiple tracks have rules) */}
      {tracksWithDivisions.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 animate-fade-up">
          {tracksWithDivisions.map(track => (
            <button
              key={track.id}
              onClick={() => handleTrackChange(track.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedTrackId === track.id
                  ? 'bg-[#00B4FF]/15 text-[#00B4FF] border border-[#00B4FF]/30'
                  : 'bg-[#14141F] text-[#555570] border border-[#2A2A3A] hover:border-[#3A3A4A] hover:text-[#D4D4E0]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {track.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Division Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 animate-fade-up stagger-1">
        {divisions.map(div => (
          <button
            key={div.id}
            onClick={() => handleDivisionChange(div.id)}
            className={`flex-shrink-0 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all duration-200 min-h-[44px] whitespace-nowrap ${
              activeDivision.id === div.id
                ? 'bg-[#00B4FF] text-[#0A0A0F] shadow-[0_0_16px_rgba(0,180,255,0.2)]'
                : 'bg-[#1A1A28] text-[#555570] border border-[#2A2A3A] hover:border-[#3A3A4A] hover:text-[#D4D4E0]'
            }`}
          >
            {div.name}
          </button>
        ))}
      </div>

      {/* Division summary card */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
        <p className="text-sm text-[#D4D4E0] leading-relaxed">{activeDivision.description}</p>
        <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-[#7A7A90]">
          <span>Min weight: <span className="text-[#D4D4E0] font-mono">{activeDivision.minWeightLbs} lbs</span></span>
          {activeDivision.minLeftPct && (
            <span>Min left: <span className="text-[#D4D4E0] font-mono">{activeDivision.minLeftPct}%</span></span>
          )}
          <span>Formats: <span className="text-[#D4D4E0]">{activeDivision.formats.join(', ')}</span></span>
          <span>Mod level: <span className={`font-semibold ${
            activeDivision.modificationLevel === 'open' ? 'text-[#00E676]' :
            activeDivision.modificationLevel === 'limited' ? 'text-[#00B4FF]' :
            'text-[#7A7A90]'
          }`}>{activeDivision.modificationLevel}</span></span>
        </div>
        {activeDivision.notes && (
          <p className="text-[10px] text-[#555570] mt-2 leading-relaxed">{activeDivision.notes}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555570]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${activeDivision.name} rules...`}
          className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[48px]"
        />
      </div>

      {/* Tech Inspection Checklist Toggle */}
      {totalChecks > 0 && (
        <button
          onClick={() => setShowTechChecklist(!showTechChecklist)}
          className={`w-full text-left p-4 rounded-lg border transition-colors ${
            showTechChecklist
              ? 'bg-[#00B4FF]/10 border-[#00B4FF]/30'
              : 'bg-[#14141F] border-[#2A2A3A] hover:border-[#00B4FF]/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              <span className="text-sm font-semibold uppercase">Tech Inspection Checklist</span>
            </div>
            <span className="text-xs font-mono text-[#7A7A90]">{checkedCount}/{totalChecks}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-[#2A2A3A] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${totalChecks > 0 ? (checkedCount / totalChecks) * 100 : 0}%`,
                backgroundColor: checkedCount === totalChecks ? '#00E676' : '#00B4FF',
              }}
            />
          </div>
        </button>
      )}

      {/* Tech Checklist */}
      {showTechChecklist && (
        <div className="space-y-4">
          {Object.entries(techCheckCategories).map(([category, items]) => (
            <div key={category} className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
              <h3 className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider mb-3">{category}</h3>
              <div className="space-y-2">
                {items.map(item => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
                    <input
                      type="checkbox"
                      checked={checkedItems[item.id] || false}
                      onChange={e => setCheckedItems({ ...checkedItems, [item.id]: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-[#3A3A4A] bg-[#1A1A28] text-[#00B4FF] focus:ring-[#00B4FF] focus:ring-offset-0 cursor-pointer accent-[#00B4FF]"
                    />
                    <div>
                      <p className={`text-sm ${checkedItems[item.id] ? 'text-[#555570] line-through' : 'text-[#D4D4E0]'}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-[#3A3A4A] mt-0.5">Rule {item.rule}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rules by Category */}
      {!showTechChecklist && (
        <div className="space-y-3">
          {categoryOrder.filter(cat => rulesByCategory[cat]).length === 0 && search ? (
            <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-8 text-center">
              <p className="text-sm text-[#7A7A90]">No rules match &ldquo;{search}&rdquo;</p>
            </div>
          ) : categoryOrder.filter(cat => rulesByCategory[cat]).map(cat => {
            const catRules = rulesByCategory[cat]!
            const isExpanded = expandedCategory === cat
            const { label } = categoryLabels[cat]

            return (
              <div key={cat} className={`bg-[#14141F] border rounded-lg overflow-hidden transition-all duration-200 ${
                isExpanded ? 'border-[#00B4FF]/25 shadow-[0_0_16px_rgba(0,180,255,0.03)]' : 'border-[#2A2A3A]'
              }`}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                  className="section-header"
                >
                  <div className="flex items-center gap-2.5">
                    {isExpanded && <div className="w-1 h-5 rounded-full bg-[#00B4FF]" />}
                    <CategoryIcon category={cat} />
                    <h2 className="text-sm font-bold uppercase tracking-wider">{label}</h2>
                    <span className="text-[10px] text-[#3A3A4A] bg-[#1A1A28] px-2 py-0.5 rounded-full font-mono">{catRules.length}</span>
                  </div>
                  <svg className={`w-4 h-4 text-[#555570] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Summary (always visible) */}
                {!isExpanded && (
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-2">
                      {catRules.slice(0, 3).map(rule => (
                        <span key={rule.id} className="text-[10px] text-[#7A7A90] bg-[#1A1A28] px-2 py-1 rounded">
                          {rule.text.length > 50 ? rule.text.slice(0, 50) + '...' : rule.text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded rules */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 animate-fade-in">
                    {catRules.map(rule => (
                      <div key={rule.id} className="bg-[#1A1A28] rounded-md p-3">
                        <div className="flex items-start gap-2.5">
                          <span className="text-[10px] text-[#00B4FF] font-mono flex-shrink-0 mt-0.5 opacity-70">{rule.number}</span>
                          <p className="text-sm text-[#D4D4E0] leading-relaxed">{rule.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CategoryIcon({ category }: { category: RuleCategory }) {
  const icons: Record<string, React.ReactNode> = {
    weight: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>,
    engine: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
    suspension: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
    tires: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>,
    safety: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    drivetrain: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><circle cx="19" cy="12" r="2" /><circle cx="5" cy="12" r="2" /></svg>,
    fuel: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 22h12V2H3v20z" /><path d="M15 12h3a2 2 0 012 2v4a2 2 0 002 2h0a2 2 0 002-2V8l-4-4" /></svg>,
    electrical: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    body: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
    general: <svg className="w-4 h-4 text-[#00B4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
  }
  return <>{icons[category] || icons.general}</>
}
