'use client'

import Link from 'next/link'
import { useCar } from '@/hooks/useCar'
import { painesvilleSchedule2026, painesvilleGateTimes } from '@/data/tracks/painesville'

export default function Dashboard() {
  const { currentCar, currentSetup } = useCar()

  const nextEvent = painesvilleSchedule2026.find(e => new Date(e.date) >= new Date())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Crew Chief</h1>
          <p className="text-sm text-[#666] mt-1">Your pit crew in your pocket</p>
        </div>
        <div className="md:hidden bg-[#252525] border border-[#333] rounded-lg px-3 py-2">
          <p className="text-xs font-semibold">{currentCar.year} {currentCar.model}</p>
          <p className="text-[10px] text-[#FFD600] capitalize font-medium">{currentCar.class.replace(/-/g, ' ')}</p>
        </div>
      </div>

      {/* Next Event Card */}
      {nextEvent && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 animate-fade-up stagger-1 card-accent-yellow">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[#FFD600]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            <span className="text-xs font-semibold text-[#FFD600] uppercase tracking-wider">Next Event</span>
          </div>
          <h3 className="text-lg font-bold">{nextEvent.event}</h3>
          <p className="text-sm text-[#888] mt-0.5">
            {new Date(nextEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-sm text-[#666]">Painesville Speedway</p>
          <div className="flex gap-4 mt-3 text-xs text-[#666]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]/50" />
              Pit Gates: {painesvilleGateTimes.pitGates}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]/50" />
              Racing: {painesvilleGateTimes.racing}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {nextEvent.classes.map(cls => (
              <span key={cls} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                cls.includes('Ironmen') || cls.includes('Ironman')
                  ? 'bg-[#FFD600]/15 text-[#FFD600] ring-1 ring-[#FFD600]/20'
                  : 'bg-[#252525] text-[#888]'
              }`}>
                {cls}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Current Setup + Last Session */}
      <div className="grid grid-cols-2 gap-3 animate-fade-up stagger-2">
        <Link href="/setup" className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 card-hover group">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Current Setup</h3>
          <div className="space-y-1.5 font-mono text-sm">
            <Row label="LF" value={currentSetup.springLF} />
            <Row label="RF" value={currentSetup.springRF} />
            <Row label="LR" value={currentSetup.springLR} />
            <Row label="RR" value={currentSetup.springRR} />
            <div className="pt-2 mt-1 border-t border-[#333]/60">
              <div className="flex justify-between">
                <span className="text-[#666]">XW</span>
                <span className="text-[#FFD600] font-bold text-base">{currentSetup.crossWeightPct}%</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-[#FFD600] mt-3 uppercase font-semibold group-hover:translate-x-0.5 transition-transform">View Setup →</p>
        </Link>

        <Link href="/sessions" className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 card-hover group">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Last Session</h3>
          <div className="flex flex-col items-center justify-center h-24 text-[#555]">
            <svg className="w-8 h-8 mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            <span className="text-xs text-[#555]">No sessions yet</span>
            <span className="text-[10px] text-[#FFD600] mt-1 font-semibold group-hover:translate-x-0.5 transition-transform">Log your first →</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 animate-fade-up stagger-3">
        <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <QuickAction href="/sessions/new" icon="plus" label="New Session" />
          <QuickAction href="/setup" icon="wrench" label="Setup Calculator" />
          <QuickAction href="/troubleshoot" icon="alert" label="My Car is Pushing..." />
        </div>
      </div>

      {/* Car Info */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 animate-fade-up stagger-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#FFD600] shadow-[0_0_6px_rgba(255,214,0,0.4)]" />
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider">Active Car</h3>
        </div>
        <h2 className="text-xl font-bold">{currentCar.year} {currentCar.make} {currentCar.model}</h2>
        <p className="text-sm text-[#FFD600] capitalize mt-0.5 font-medium">
          {currentCar.class.replace(/-/g, ' ').replace('f8', 'Figure 8')}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <InfoCell label="Weight" value={`${currentCar.weight.toLocaleString()} lbs`} />
          <InfoCell label="Wheelbase" value={`${currentCar.wheelbase}"`} />
          <InfoCell label="Engine" value={currentCar.engine.block} />
          <InfoCell label="Carb" value={currentCar.engine.carb} small />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#666]">{label}</span>
      <span className="text-[#F5F5F5]">{value}</span>
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    plus: <svg className="w-4 h-4 text-[#FFD600]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    wrench: <svg className="w-4 h-4 text-[#FFD600]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
    alert: <svg className="w-4 h-4 text-[#FFD600]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  }
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-md bg-[#252525] hover:bg-[#333] transition-all duration-200 group active:scale-[0.98]">
      <div className="w-8 h-8 rounded-md bg-[#FFD600]/10 flex items-center justify-center group-hover:bg-[#FFD600]/15 transition-colors">{icons[icon]}</div>
      <span className="text-sm font-medium group-hover:text-[#F5F5F5] transition-colors">{label}</span>
      <svg className="w-3.5 h-3.5 text-[#555] ml-auto group-hover:text-[#888] group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  )
}

function InfoCell({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <span className="text-[#666]">{label}</span>
      <p className={`font-mono font-medium ${small ? 'text-xs' : ''}`}>{value}</p>
    </div>
  )
}
