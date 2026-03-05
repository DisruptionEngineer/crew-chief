'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ProGate } from '@/components/subscription/ProGate'
import { BuildCompareTable } from '@/components/engine/BuildCompareTable'
import { db } from '@/data/db'
import type { SavedEngineBuild } from '@/lib/types'

const PowerCurveChart = dynamic(
  () => import('@/components/engine/PowerCurveChart').then(mod => ({ default: mod.PowerCurveChart })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-[#1A1A1A] border border-[#333] rounded-lg animate-pulse" />,
  }
)

function CompareContent() {
  const searchParams = useSearchParams()
  const idA = searchParams.get('a')
  const idB = searchParams.get('b')

  const [buildA, setBuildA] = useState<SavedEngineBuild | null>(null)
  const [buildB, setBuildB] = useState<SavedEngineBuild | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBuilds() {
      if (!idA || !idB) return
      const [a, b] = await Promise.all([
        db.engineBuilds.get(idA),
        db.engineBuilds.get(idB),
      ])
      setBuildA(a || null)
      setBuildB(b || null)
      setLoading(false)
    }
    loadBuilds()
  }, [idA, idB])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[#252525] rounded animate-pulse" />
        <div className="h-64 bg-[#1A1A1A] border border-[#333] rounded-lg animate-pulse" />
        <div className="h-80 bg-[#1A1A1A] border border-[#333] rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!buildA || !buildB) {
    return (
      <div className="text-center py-16">
        <p className="text-[#888]">Could not find one or both builds.</p>
        <Link href="/engine" className="text-[#FFD600] text-sm mt-2 block">
          ← Back to Engine Builder
        </Link>
      </div>
    )
  }

  const hpDiff = buildA.result.peakHp - buildB.result.peakHp
  const tqDiff = buildA.result.peakTorque - buildB.result.peakTorque

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/engine" className="text-xs text-[#666] hover:text-[#888] transition-colors">
          ← Back to Engine Builder
        </Link>
        <h1 className="text-2xl font-bold tracking-tight uppercase mt-2">Compare Builds</h1>
        <p className="text-sm text-[#888] mt-1">
          <span className="text-[#FFD600]">{buildA.name}</span>
          {' vs '}
          <span>{buildB.name}</span>
        </p>
      </div>

      {/* Quick diff badges */}
      <div className="flex gap-3">
        <div className={`px-3 py-2 rounded-md text-sm font-mono ${
          hpDiff > 0 ? 'bg-[#00E676]/10 text-[#00E676]' : hpDiff < 0 ? 'bg-[#FF1744]/10 text-[#FF1744]' : 'bg-[#333] text-[#888]'
        }`}>
          {hpDiff > 0 ? '+' : ''}{hpDiff} HP
        </div>
        <div className={`px-3 py-2 rounded-md text-sm font-mono ${
          tqDiff > 0 ? 'bg-[#00E676]/10 text-[#00E676]' : tqDiff < 0 ? 'bg-[#FF1744]/10 text-[#FF1744]' : 'bg-[#333] text-[#888]'
        }`}>
          {tqDiff > 0 ? '+' : ''}{tqDiff} lb-ft
        </div>
      </div>

      <div className="checkered-divider" />

      {/* Compare table */}
      <BuildCompareTable buildA={buildA} buildB={buildB} />

      {/* Overlaid power curves */}
      <PowerCurveChart
        curve={buildA.result.curve}
        peakHpRpm={buildA.result.peakHpRpm}
        peakTorqueRpm={buildA.result.peakTorqueRpm}
        peakHp={buildA.result.peakHp}
        peakTorque={buildA.result.peakTorque}
        compareCurve={buildB.result.curve}
        compareLabel={buildB.name}
      />
    </div>
  )
}

export default function ComparePage() {
  return (
    <ProGate variant="blur-overlay" feature="Engine Comparison">
      <Suspense fallback={
        <div className="space-y-4">
          <div className="h-8 bg-[#252525] rounded animate-pulse" />
          <div className="h-64 bg-[#1A1A1A] border border-[#333] rounded-lg animate-pulse" />
        </div>
      }>
        <CompareContent />
      </Suspense>
    </ProGate>
  )
}
