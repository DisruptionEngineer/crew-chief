'use client'

import { useState } from 'react'
import { diagnosticSteps, getDiagnosticResult } from '@/data/troubleshoot/diagnostic-tree'
import type { DiagnosticResult } from '@/lib/types'

export default function TroubleshootPage() {
  const [history, setHistory] = useState<string[]>(['symptom'])
  const [result, setResult] = useState<DiagnosticResult | null>(null)

  const currentStepId = history[history.length - 1]
  const currentStep = diagnosticSteps.find(s => s.id === currentStepId)
  const stepNumber = history.length
  const totalSteps = 3

  function handleOption(option: { nextStepId?: string; resultId?: string }) {
    if (option.resultId) {
      const r = getDiagnosticResult(option.resultId)
      if (r) setResult(r)
    } else if (option.nextStepId) {
      setHistory(h => [...h, option.nextStepId!])
    }
  }

  function handleBack() {
    if (history.length > 1) {
      setHistory(h => h.slice(0, -1))
      setResult(null)
    }
  }

  function handleReset() {
    setHistory(['symptom'])
    setResult(null)
  }

  // Result view
  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="text-sm text-[#888] hover:text-[#F5F5F5] flex items-center gap-1 min-h-[48px]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
          <button onClick={handleReset} className="text-sm text-[#FF8A00] min-h-[48px]">Start Over</button>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">{result.title}</h1>
          <p className="text-sm text-[#FF8A00] mt-1">{result.subtitle}</p>
        </div>

        <div className="checkered-divider" />

        <div>
          <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-4">
            Try These Adjustments
            <span className="text-[#666] normal-case font-normal ml-2">(easiest → most involved)</span>
          </h2>

          <div className="space-y-3">
            {result.adjustments.map((adj, i) => (
              <div key={i} className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center text-sm font-bold">
                    {adj.priority}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#333] text-[#888] uppercase">{adj.category}</span>
                    </div>
                    <p className="font-semibold text-sm">{adj.action}</p>
                    <p className="text-xs text-[#FF8A00] font-mono mt-1">{adj.amount}</p>
                    <p className="text-xs text-[#888] mt-2 leading-relaxed">{adj.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Step view
  if (!currentStep) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {history.length > 1 ? (
          <button onClick={handleBack} className="text-sm text-[#888] hover:text-[#F5F5F5] flex items-center gap-1 min-h-[48px]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
        ) : (
          <h1 className="text-2xl font-bold tracking-tight uppercase">Troubleshooter</h1>
        )}
        <span className="text-sm text-[#666] font-mono">{stepNumber}/{totalSteps}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#333] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FF8A00] rounded-full transition-all duration-300"
          style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold tracking-tight uppercase">{currentStep.question}</h2>

      {/* Options */}
      <div className="space-y-3">
        {currentStep.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOption(option)}
            className="w-full text-left bg-[#1A1A1A] border border-[#333] rounded-lg p-4 hover:border-[#FF8A00]/30 transition-colors min-h-[72px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#252525] flex items-center justify-center flex-shrink-0">
                <OptionIcon name={option.icon} />
              </div>
              <div>
                <p className="font-semibold text-sm">{option.label}</p>
                <p className="text-xs text-[#888] mt-0.5">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function OptionIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    'arrow-up-right': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>,
    'rotate-ccw': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>,
    'zap-off': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="12.41 6.75 13 2 10.57 4.92" /><polyline points="18.57 12.91 21 10 15.66 10" /><polyline points="8 8 3 14 12 14 11 22 16 16" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
    'shuffle': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>,
    'corner-down-right': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 10 20 15 15 20" /><path d="M4 4v7a4 4 0 004 4h12" /></svg>,
    'corner-up-right': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 014-4h12" /></svg>,
    'circle': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg>,
    'alert-circle': <svg className="w-5 h-5 text-[#FF1744]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    'droplets': <svg className="w-5 h-5 text-[#448AFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 14.69c1.46 0 2.64-1.22 2.64-2.7 0-.78-.37-1.51-1.13-2.13-.75-.62-1.16-1.34-1.51-2.31-.22.97-.76 1.91-1.51 2.51-.75.6-1.13 1.27-1.13 2.13 0 1.48 1.18 2.5 2.64 2.5z" /></svg>,
    'sun': <svg className="w-5 h-5 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
    'wind': <svg className="w-5 h-5 text-[#888]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>,
  }
  return iconMap[name] || <div className="w-5 h-5 bg-[#333] rounded" />
}
