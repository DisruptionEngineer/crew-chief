'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ProGate } from '@/components/subscription/ProGate'
import { EngineFamilySelector } from '@/components/engine/EngineFamilySelector'
import { DivisionSelector } from '@/components/engine/DivisionSelector'
import { HeadSelector } from '@/components/engine/HeadSelector'
import { CamSelector } from '@/components/engine/CamSelector'
import { CompressionInputs } from '@/components/engine/CompressionInputs'
import { BuildResultCard } from '@/components/engine/BuildResultCard'
import { ComplianceBadges } from '@/components/engine/ComplianceBadges'
import { SavedBuildsDrawer } from '@/components/engine/SavedBuildsDrawer'
import { simulateEngineBuild } from '@/data/engine/simulate'
import { engineFamilies, getEngineFamilyById } from '@/data/engine/families/registry'
import { divisions, getEngineRulesForDivision } from '@/data/divisions/registry'
import { ironmanF8EngineRules } from '@/data/divisions/ironman-f8'
import { db } from '@/data/db'
import type { EngineBuildConfig, SavedEngineBuild, EngineFamily, DivisionEngineRules, RaceClass } from '@/lib/types'

// Dynamic import Recharts component to avoid SSR issues
const PowerCurveChart = dynamic(
  () => import('@/components/engine/PowerCurveChart').then(mod => ({ default: mod.PowerCurveChart })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-[#14141F] border border-[#2A2A3A] rounded-lg animate-pulse" />,
  }
)

export default function EngineBuildPage() {
  const router = useRouter()

  // Engine family & division state
  const [selectedFamilyId, setSelectedFamilyId] = useState('gm-sbc-350')
  const [selectedDivisionId, setSelectedDivisionId] = useState<RaceClass>(divisions[0]?.id || 'ironman-f8' as RaceClass)

  // Derived: current engine family, division rules, and filtered divisions
  const engineFamily = useMemo(
    () => getEngineFamilyById(selectedFamilyId) || engineFamilies[0],
    [selectedFamilyId]
  )
  const divisionRules = useMemo(
    () => getEngineRulesForDivision(selectedDivisionId) || ironmanF8EngineRules,
    [selectedDivisionId]
  )
  // Only show divisions that allow this engine family
  const eligibleDivisions = useMemo(
    () => divisions.filter(d =>
      d.allowedEngineFamilyIds.length === 0 ||
      d.allowedEngineFamilyIds.includes(selectedFamilyId)
    ),
    [selectedFamilyId]
  )

  // Build config
  const [config, setConfig] = useState<EngineBuildConfig>({
    engineFamilyId: 'gm-sbc-350',
    ...engineFamilies[0].defaultConfig,
  })
  const [buildName, setBuildName] = useState('My Build')
  const [savedBuilds, setSavedBuilds] = useState<SavedEngineBuild[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>('engine-family')

  // Run simulation whenever config or rules change
  const result = useMemo(
    () => simulateEngineBuild(config, divisionRules),
    [config, divisionRules]
  )

  // Load saved builds from IndexedDB
  useEffect(() => {
    db.engineBuilds.orderBy('createdAt').reverse().toArray().then(setSavedBuilds)
  }, [])

  // When engine family changes, reset config to that family's defaults
  function handleFamilyChange(familyId: string) {
    const family = getEngineFamilyById(familyId)
    if (!family) return
    setSelectedFamilyId(familyId)
    setConfig({
      engineFamilyId: familyId,
      ...family.defaultConfig,
    })

    // Check if current division still supports the NEW family (use familyId directly to avoid stale closure)
    const divStillValid = divisions.some(
      d => d.id === selectedDivisionId &&
        (d.allowedEngineFamilyIds.length === 0 || d.allowedEngineFamilyIds.includes(familyId))
    )
    if (!divStillValid) {
      const firstEligible = divisions.find(d =>
        d.allowedEngineFamilyIds.length === 0 ||
        d.allowedEngineFamilyIds.includes(familyId)
      )
      if (firstEligible) {
        setSelectedDivisionId(firstEligible.id)
      }
    }

    // Auto-expand heads when switching families
    setExpandedSection('heads')
  }

  function handleDivisionChange(divId: string) {
    setSelectedDivisionId(divId as RaceClass)
  }

  function updateConfig(partial: Partial<EngineBuildConfig>) {
    setConfig(prev => ({ ...prev, ...partial }))
  }

  async function saveBuild() {
    const build: SavedEngineBuild = {
      id: crypto.randomUUID(),
      name: buildName,
      createdAt: new Date().toISOString(),
      config,
      result,
    }
    await db.engineBuilds.add(build)
    const updated = await db.engineBuilds.orderBy('createdAt').reverse().toArray()
    setSavedBuilds(updated)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  function loadBuild(build: SavedEngineBuild) {
    setConfig(build.config)
    setBuildName(build.name)
    // Sync family selector with loaded build
    setSelectedFamilyId(build.config.engineFamilyId)
    // Reset division to first eligible for this engine family
    const firstEligible = divisions.find(d =>
      d.allowedEngineFamilyIds.length === 0 ||
      d.allowedEngineFamilyIds.includes(build.config.engineFamilyId)
    )
    if (firstEligible) setSelectedDivisionId(firstEligible.id)
    setDrawerOpen(false)
  }

  async function deleteBuild(id: string) {
    await db.engineBuilds.delete(id)
    const updated = await db.engineBuilds.orderBy('createdAt').reverse().toArray()
    setSavedBuilds(updated)
  }

  function compareBuilds(a: string, b: string) {
    router.push(`/engine/compare?a=${a}&b=${b}`)
  }

  return (
    <ProGate variant="full-page" feature="Engine Build Simulator">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Engine Build Simulator</h1>
          <p className="text-sm text-[#555570] mt-1">
            {engineFamily.name} &mdash;{' '}
            <span className="text-[#00B4FF] font-medium">
              {eligibleDivisions.find(d => d.id === selectedDivisionId)?.name || 'Rules'}
            </span>
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A28] border border-[#2A2A3A] rounded-md text-xs text-[#7A7A90] hover:text-[#D4D4E0] hover:border-[#3A3A4A] transition-all duration-200 min-h-[40px] active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
          </svg>
          <span className="hidden sm:inline">Saved ({savedBuilds.length})</span>
        </button>
      </div>

      {/* Build name */}
      <div>
        <label className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider block mb-2">Build Name</label>
        <input
          type="text"
          value={buildName}
          onChange={e => setBuildName(e.target.value)}
          className="w-full bg-[#1A1A28] border border-[#2A2A3A] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00B4FF] min-h-[44px]"
          placeholder="e.g., Vortec Street Build"
        />
      </div>

      {/* Rules compliance — always visible at top */}
      <ComplianceBadges compliance={result.compliance} />

      <div className="checkered-divider" />

      {/* === ENGINE FAMILY === */}
      <EngineSection
        title="Engine Family"
        subtitle="Select your platform"
        expanded={expandedSection === 'engine-family'}
        onToggle={() => setExpandedSection(expandedSection === 'engine-family' ? null : 'engine-family')}
      >
        <EngineFamilySelector
          families={engineFamilies}
          selectedId={selectedFamilyId}
          onChange={handleFamilyChange}
        />
      </EngineSection>

      {/* === DIVISION / RULES === */}
      <EngineSection
        title="Division Rules"
        subtitle="Which class are you building for?"
        expanded={expandedSection === 'division'}
        onToggle={() => setExpandedSection(expandedSection === 'division' ? null : 'division')}
      >
        <DivisionSelector
          divisions={eligibleDivisions}
          selectedId={selectedDivisionId}
          onChange={handleDivisionChange}
        />
        {divisionRules.notes && (
          <p className="text-[11px] text-[#555570] mt-3 leading-relaxed">{divisionRules.notes}</p>
        )}
      </EngineSection>

      {/* === COMPONENT SELECTORS === */}

      {/* Cylinder Heads */}
      <EngineSection
        title="Cylinder Heads"
        subtitle={`${engineFamily.heads.length} castings available`}
        expanded={expandedSection === 'heads'}
        onToggle={() => setExpandedSection(expandedSection === 'heads' ? null : 'heads')}
      >
        <HeadSelector
          heads={engineFamily.heads}
          selectedId={config.headId}
          onChange={(id: string) => updateConfig({ headId: id })}
        />
      </EngineSection>

      {/* Camshaft */}
      <EngineSection
        title="Camshaft"
        subtitle={engineFamily.architecture === 'ohc' ? 'Overhead cam' : 'Hydraulic flat-tappet'}
        expanded={expandedSection === 'cam'}
        onToggle={() => setExpandedSection(expandedSection === 'cam' ? null : 'cam')}
      >
        <CamSelector
          cams={engineFamily.cams}
          selectedId={config.camId}
          onChange={(id: string) => updateConfig({ camId: id })}
        />
      </EngineSection>

      {/* Compression & Short Block */}
      <EngineSection
        title="Short Block"
        subtitle="Bore, pistons, compression"
        expanded={expandedSection === 'compression'}
        onToggle={() => setExpandedSection(expandedSection === 'compression' ? null : 'compression')}
      >
        <CompressionInputs
          config={config}
          engineFamily={engineFamily}
          divisionRules={divisionRules}
          onChange={updateConfig}
        />
      </EngineSection>

      {/* Division-aware fixed components */}
      <div className="bg-[#14141F] border border-[#2A2A3A] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-3.5 h-3.5 text-[#555570]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <p className="text-xs font-semibold text-[#7A7A90] uppercase tracking-wider">Fixed by Rules</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1A1A28] rounded-md p-3">
            <p className="text-[10px] text-[#3A3A4A] uppercase">Carburetor</p>
            <p className="text-sm font-mono font-semibold mt-0.5">{divisionRules.carbCfmLimit} <span className="text-[10px] text-[#555570] font-normal">CFM max</span></p>
          </div>
          <div className="bg-[#1A1A28] rounded-md p-3">
            <p className="text-[10px] text-[#3A3A4A] uppercase">Max Cam Lift</p>
            <p className="text-sm font-mono font-semibold mt-0.5">{divisionRules.maxCamLift}&quot;</p>
          </div>
          <div className="bg-[#1A1A28] rounded-md p-3">
            <p className="text-[10px] text-[#3A3A4A] uppercase">Max CR</p>
            <p className="text-sm font-mono font-semibold mt-0.5">{divisionRules.maxCompression}:1</p>
          </div>
          <div className="bg-[#1A1A28] rounded-md p-3">
            <p className="text-[10px] text-[#3A3A4A] uppercase">Head Material</p>
            <p className="text-sm font-mono font-semibold mt-0.5">{divisionRules.requiresCastIron ? 'Cast Iron' : 'Any'}</p>
          </div>
        </div>
      </div>

      <div className="checkered-divider" />

      {/* === RESULTS === */}

      <BuildResultCard result={result} />

      <PowerCurveChart
        curve={result.curve}
        peakHpRpm={result.peakHpRpm}
        peakTorqueRpm={result.peakTorqueRpm}
        peakHp={result.peakHp}
        peakTorque={result.peakTorque}
      />

      {/* Save button */}
      <button
        onClick={saveBuild}
        disabled={saveSuccess}
        className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 min-h-[48px] active:scale-[0.98] ${
          saveSuccess
            ? 'bg-[#00E676] text-[#0A0A0F] shadow-[0_0_20px_rgba(0,230,118,0.2)]'
            : 'bg-[#00B4FF] text-[#0A0A0F] hover:bg-[#33C4FF] shadow-[0_0_20px_rgba(0,180,255,0.15)] hover:shadow-[0_0_30px_rgba(0,180,255,0.25)]'
        }`}
      >
        {saveSuccess ? '\u2713 Build Saved!' : 'Save Build'}
      </button>

      {/* Saved builds drawer */}
      <SavedBuildsDrawer
        open={drawerOpen}
        builds={savedBuilds}
        onLoad={loadBuild}
        onDelete={deleteBuild}
        onCompare={compareBuilds}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
    </ProGate>
  )
}

// --- Section Component (mirrors SetupSection pattern) ---

function EngineSection({ title, subtitle, expanded, onToggle, children }: {
  title: string
  subtitle?: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`bg-[#14141F] border rounded-lg overflow-hidden transition-all duration-200 ${
      expanded ? 'border-[#00B4FF]/30 shadow-[0_0_20px_rgba(0,180,255,0.04)]' : 'border-[#2A2A3A]'
    }`}>
      <button onClick={onToggle} className="section-header">
        <div className="flex items-center gap-2.5">
          {expanded && <div className="w-1 h-5 rounded-full bg-[#00B4FF]" />}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
            {subtitle && <p className="text-[10px] text-[#555570] mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <svg className={`w-4 h-4 text-[#555570] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && <div className="px-4 pb-4 animate-fade-in">{children}</div>}
    </div>
  )
}
