'use client'

import { useState } from 'react'
import { useCar } from '@/hooks/useCar'
import { useGarage } from '@/hooks/useGarage'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import Link from 'next/link'
import type { Car, RaceClass, SuspensionType, EngineSpec } from '@/lib/types'

function mapDbCar(row: Record<string, unknown>): Car {
  const engine = row.engine as Record<string, unknown>
  const weight = row.weight as Record<string, unknown>
  const suspFront = row.suspension_front as Record<string, unknown>
  const suspRear = row.suspension_rear as Record<string, unknown>
  return {
    id: row.id as string,
    name: row.name as string,
    year: Number(row.year),
    make: row.make as string,
    model: row.model as string,
    class: ((row.eligible_divisions as string[])?.[0] || 'street-stock') as RaceClass,
    eligibleDivisions: (row.eligible_divisions as RaceClass[]) || [],
    engineFamilyId: (row.engine_family_id as string) || '',
    weight: Number(weight?.base || weight?.totalTarget || 3300),
    wheelbase: Number(row.wheelbase),
    trackWidthFront: Number(row.track_width_front),
    trackWidthRear: Number(row.track_width_rear),
    frontSuspension: (suspFront?.type as SuspensionType) || 'sla-coil',
    rearSuspension: (suspRear?.type as SuspensionType) || 'solid-axle-coil',
    engine: {
      displacement: Number(engine?.displacement || 350),
      block: (engine?.block as string) || '',
      heads: (engine?.heads as string) || '',
      cam: (engine?.cam as string) || '',
      carb: (engine?.carb as string) || '',
      compression: (engine?.compression as string) || '',
    } satisfies EngineSpec,
    notes: (row.notes as string) || '',
  }
}

export default function GaragePage() {
  const { setCurrentCarId } = useCar()
  const { garageCars, addCar, removeCar, setPrimaryCar, loading, hasGarage } = useGarage()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const { isPro } = useSubscriptionContext()
  const [showAddModal, setShowAddModal] = useState(false)
  const [allCars, setAllCars] = useState<Car[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [adding, setAdding] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const handleOpenAdd = async () => {
    setShowAddModal(true)
    setSearchQuery('')
    // Fetch all available cars from Supabase
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('active', true)
      .order('name')
    if (data) {
      setAllCars(data.map((r: Record<string, unknown>) => mapDbCar(r)))
    }
  }

  const handleAddCar = async (carId: string) => {
    setAdding(carId)
    const success = await addCar(carId)
    if (success) {
      setCurrentCarId(carId)
    }
    setAdding(null)
    if (!isPro) setShowAddModal(false)
  }

  const handleRemoveCar = async (carId: string) => {
    setRemoving(carId)
    await removeCar(carId)
    setRemoving(null)
  }

  const garageCarIds = new Set(garageCars.map(gc => gc.carId))
  const filteredCars = allCars.filter(c =>
    !garageCarIds.has(c.id) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.model.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight uppercase">My Garage</h1>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-8 text-center">
          <p className="text-[#888]">Sign in to manage your garage</p>
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
        <h1 className="text-2xl font-bold tracking-tight uppercase">My Garage</h1>
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
          <h1 className="text-2xl font-bold tracking-tight uppercase">My Garage</h1>
          <p className="text-sm text-[#888] mt-1">
            {garageCars.length} car{garageCars.length !== 1 ? 's' : ''}
            {!isPro && ' (1 max on Free plan)'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={!isPro && garageCars.length >= 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-semibold bg-[#FF8A00] text-[#0D0D0D] hover:bg-[#FFA640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Car
        </button>
      </div>

      {/* Pro Upsell */}
      {!isPro && garageCars.length >= 1 && (
        <Link
          href="/account"
          className="block bg-[#FF8A00]/5 border border-[#FF8A00]/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#FF8A00] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-[#FF8A00]">Upgrade to Pro for unlimited cars</p>
              <p className="text-xs text-[#888] mt-0.5">Add all your race cars and save setups for each one</p>
            </div>
          </div>
        </Link>
      )}

      {/* Empty State */}
      {!hasGarage && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-12 text-center">
          <svg className="w-12 h-12 text-[#333] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="1" y="6" width="22" height="12" rx="2" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <h2 className="text-lg font-semibold text-[#888]">No cars in your garage yet</h2>
          <p className="text-sm text-[#666] mt-2">Add your first car to get personalized setup recommendations</p>
          <button
            onClick={handleOpenAdd}
            className="mt-6 px-6 py-3 bg-[#FF8A00] text-[#0D0D0D] rounded-md font-semibold text-sm hover:bg-[#FFA640] transition-colors min-h-[48px]"
          >
            Add Your First Car
          </button>
        </div>
      )}

      {/* Car Grid */}
      {hasGarage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {garageCars.map((entry) => (
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
                      {entry.car.year} {entry.car.model}
                    </h3>
                    {entry.isPrimary && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF8A00]/10 text-[#FF8A00] font-bold uppercase">Primary</span>
                    )}
                  </div>
                  <p className="text-xs text-[#666] mt-1">{entry.car.make}</p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-[#555]">
                    <span>{entry.car.weight.toLocaleString()} lbs</span>
                    <span>{entry.car.engine.displacement}ci</span>
                    <span className="text-[#FF8A00] capitalize">{entry.car.class.replace(/-/g, ' ')}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1">
                  {!entry.isPrimary && (
                    <button
                      onClick={() => { setPrimaryCar(entry.carId); setCurrentCarId(entry.carId) }}
                      className="p-2 text-[#666] hover:text-[#FF8A00] transition-colors min-h-[36px] min-w-[36px]"
                      title="Set as primary"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveCar(entry.carId)}
                    disabled={removing === entry.carId}
                    className="p-2 text-[#666] hover:text-[#FF1744] transition-colors min-h-[36px] min-w-[36px] disabled:opacity-50"
                    title="Remove from garage"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                  </button>
                </div>
              </div>
              {/* Quick link to setup */}
              <Link
                href="/setup"
                onClick={() => setCurrentCarId(entry.carId)}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-[#252525] border border-[#333] rounded-md text-xs font-semibold text-[#888] hover:text-[#F5F5F5] hover:border-[#555] transition-colors min-h-[44px]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
                View Setup
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-[#1A1A1A] border border-[#333] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h2 className="text-lg font-bold uppercase tracking-wider">Add Car</h2>
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
                placeholder="Search cars..."
                autoFocus
                className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF8A00] min-h-[48px]"
              />
            </div>

            {/* Car List */}
            <div className="overflow-y-auto max-h-[50vh] p-2">
              {filteredCars.length === 0 ? (
                <p className="text-center text-[#666] py-8 text-sm">
                  {searchQuery ? 'No cars found' : 'Loading cars...'}
                </p>
              ) : (
                filteredCars.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => handleAddCar(car.id)}
                    disabled={adding === car.id}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#252525] transition-colors text-left min-h-[56px] disabled:opacity-50"
                  >
                    <div>
                      <p className="font-semibold text-sm">{car.year} {car.model}</p>
                      <p className="text-xs text-[#666] mt-0.5">{car.make} — {car.weight.toLocaleString()} lbs</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-[#252525] text-[#888] capitalize">{car.class.replace(/-/g, ' ')}</span>
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
