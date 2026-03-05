'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Car, SetupSheet, RaceClass, SuspensionType, EngineSpec } from '@/lib/types'
import { allCars, allBaselines } from '@/data/cars/registry'
import { createClient } from '@/lib/supabase/client'

interface CarContextType {
  cars: Car[]
  currentCar: Car
  currentSetup: SetupSheet
  setCurrentCarId: (id: string) => void
  getSetupForCar: (carId: string) => SetupSheet
}

const CarContext = createContext<CarContextType | undefined>(undefined)

const fallbackSetup: SetupSheet = allBaselines[allCars[0]?.id] || {} as SetupSheet

/** Map a Supabase cars row to the Car interface */
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

export function CarProvider({ children }: { children: ReactNode }) {
  const [currentCarId, setCurrentCarId] = useState(allCars[0]?.id || 'monte-carlo-75')
  const [cars, setCars] = useState<Car[]>(allCars)

  // Fetch cars from Supabase, fall back to hardcoded
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('cars')
      .select('*')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setCars(data.map(mapDbCar))
        }
      })
  }, [])

  // Persist car selection
  useEffect(() => {
    const saved = localStorage.getItem('tenths-car-id')
    if (saved && cars.find(c => c.id === saved)) {
      setCurrentCarId(saved)
    }
  }, [cars])

  useEffect(() => {
    localStorage.setItem('tenths-car-id', currentCarId)
  }, [currentCarId])

  const currentCar = cars.find(c => c.id === currentCarId) || cars[0]
  const currentSetup = allBaselines[currentCarId] || fallbackSetup

  const getSetupForCar = (carId: string) => allBaselines[carId] || fallbackSetup

  return (
    <CarContext.Provider value={{ cars, currentCar, currentSetup, setCurrentCarId, getSetupForCar }}>
      {children}
    </CarContext.Provider>
  )
}

export function useCar() {
  const context = useContext(CarContext)
  if (!context) throw new Error('useCar must be used within CarProvider')
  return context
}
