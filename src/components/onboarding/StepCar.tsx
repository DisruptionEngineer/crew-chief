'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RaceClass, SuspensionType, EngineSpec } from '@/lib/types'

interface StepCarProps {
  carYear: string
  carMake: string
  carModel: string
  carWeight: string
  engineType: string
  raceClass: string
  onChange: (field: string, value: string) => void
}

interface DbCar {
  id: string
  name: string
  year: number
  make: string
  model: string
  eligible_divisions: string[]
  engine_family_id: string
  weight: { base: number }
  engine: { block: string }
}

export function StepCar({ carYear, carMake, carModel, carWeight, engineType, raceClass, onChange }: StepCarProps) {
  const [dbCars, setDbCars] = useState<DbCar[]>([])
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(true)
  const [selectedDbCarId, setSelectedDbCarId] = useState<string | null>(null)

  // Fetch cars from Supabase
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('cars')
      .select('id, name, year, make, model, eligible_divisions, engine_family_id, weight, engine')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setDbCars(data as DbCar[])
      })
  }, [])

  const filtered = search.length >= 2
    ? dbCars.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.make.toLowerCase().includes(search.toLowerCase()) ||
        c.model.toLowerCase().includes(search.toLowerCase())
      )
    : dbCars

  const selectCar = (car: DbCar) => {
    setSelectedDbCarId(car.id)
    onChange('carYear', String(car.year))
    onChange('carMake', car.make)
    onChange('carModel', car.model)
    onChange('carWeight', String(car.weight?.base || 3300))
    onChange('engineType', (car.engine as Record<string, unknown>)?.block as string || '')
    onChange('raceClass', car.eligible_divisions?.[0] || 'street-stock')
    // Store the DB car id for later reference
    onChange('selectedCarId', car.id)
    setShowSearch(false)
  }

  const useCustom = () => {
    setSelectedDbCarId(null)
    setShowSearch(false)
    onChange('selectedCarId', '')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Your Race Car</h2>
        <p className="text-sm text-[#888]">Search our database or enter manually.</p>
      </div>

      {showSearch ? (
        <>
          {/* Search box */}
          <div>
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">
              Search Cars ({dbCars.length} in database)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by make, model, or name..."
              className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.slice(0, 20).map((car) => (
              <button
                key={car.id}
                onClick={() => selectCar(car)}
                className="w-full p-3 rounded-lg border bg-[#1A1A1A] border-[#333] text-left transition-all hover:border-[#FF8A00] hover:bg-[#FF8A00]/5"
              >
                <span className="font-semibold text-[#F5F5F5]">{car.name}</span>
                <span className="text-xs text-[#666] ml-2">{car.eligible_divisions?.[0]?.replace(/-/g, ' ')}</span>
              </button>
            ))}
            {filtered.length === 0 && search.length >= 2 && (
              <p className="text-sm text-[#666] py-4 text-center">No matches found</p>
            )}
          </div>

          {/* Manual entry option */}
          <button
            onClick={useCustom}
            className="w-full py-2 text-sm text-[#888] hover:text-[#FF8A00] transition-colors"
          >
            My car isn&apos;t listed — enter manually
          </button>
        </>
      ) : (
        <>
          {/* Selected car or manual entry */}
          {selectedDbCarId && (
            <div className="p-3 rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#F5F5F5]">{carYear} {carMake} {carModel}</span>
                <button
                  onClick={() => { setShowSearch(true); setSelectedDbCarId(null) }}
                  className="text-xs text-[#888] hover:text-[#FF8A00]"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {!selectedDbCarId && (
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Manual Entry</label>
              <button
                onClick={() => setShowSearch(true)}
                className="text-xs text-[#888] hover:text-[#FF8A00]"
              >
                Search database instead
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Year" value={carYear} field="carYear" onChange={onChange} placeholder="1975" />
            <Field label="Make" value={carMake} field="carMake" onChange={onChange} placeholder="Chevrolet" />
            <Field label="Model" value={carModel} field="carModel" onChange={onChange} placeholder="Monte Carlo" />
            <Field label="Weight (lbs)" value={carWeight} field="carWeight" onChange={onChange} placeholder="3300" type="number" />
            <Field label="Engine" value={engineType} field="engineType" onChange={onChange} placeholder="GM 350" />
            <div>
              <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">Class</label>
              <select
                value={raceClass}
                onChange={(e) => onChange('raceClass', e.target.value)}
                className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              >
                <option value="">Select...</option>
                <option value="street-stock">Street Stock</option>
                <option value="ironman-f8">Ironman / Figure 8</option>
                <option value="compacts">Compacts</option>
                <option value="juicebox">Juicebox</option>
                <option value="old-school-f8">Old School F8</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Field({ label, value, field, onChange, placeholder, type = 'text' }: {
  label: string; value: string; field: string; onChange: (f: string, v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#252525] border border-[#333] rounded-md px-4 py-3 text-[#F5F5F5] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
      />
    </div>
  )
}
