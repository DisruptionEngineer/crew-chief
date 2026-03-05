'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Car, SetupSheet, RaceClass, SuspensionType, EngineSpec } from '@/lib/types'
import { allCars, allBaselines } from '@/data/cars/registry'
import { createClient } from '@/lib/supabase/client'
import { useGarage, type UserSetup } from '@/hooks/useGarage'

interface CarContextType {
  cars: Car[]
  currentCar: Car
  currentSetup: SetupSheet
  setCurrentCarId: (id: string) => void
  getSetupForCar: (carId: string) => SetupSheet
  userSetup: UserSetup | null
  hasGarage: boolean
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

/** Convert a UserSetup to a SetupSheet for backward compatibility */
function userSetupToSetupSheet(us: UserSetup, carId: string): SetupSheet {
  const baseline = allBaselines[carId] || fallbackSetup
  return {
    id: us.id,
    carId: us.carId,
    name: us.name,
    date: us.updatedAt,
    springLF: us.springLF ?? baseline.springLF,
    springRF: us.springRF ?? baseline.springRF,
    springLR: us.springLR ?? baseline.springLR,
    springRR: us.springRR ?? baseline.springRR,
    rideHeightLF: us.rideHeightLF ?? baseline.rideHeightLF,
    rideHeightRF: us.rideHeightRF ?? baseline.rideHeightRF,
    rideHeightLR: us.rideHeightLR ?? baseline.rideHeightLR,
    rideHeightRR: us.rideHeightRR ?? baseline.rideHeightRR,
    camberLF: us.camberLF ?? baseline.camberLF,
    camberRF: us.camberRF ?? baseline.camberRF,
    casterLF: us.casterLF ?? baseline.casterLF,
    casterRF: us.casterRF ?? baseline.casterRF,
    toeFront: us.toeFront ?? baseline.toeFront,
    toeRear: us.toeRear ?? baseline.toeRear,
    pressureLF: us.pressureLF ?? baseline.pressureLF,
    pressureRF: us.pressureRF ?? baseline.pressureRF,
    pressureLR: us.pressureLR ?? baseline.pressureLR,
    pressureRR: us.pressureRR ?? baseline.pressureRR,
    totalWeight: us.totalWeight ?? baseline.totalWeight,
    crossWeightPct: us.crossWeightPct ?? baseline.crossWeightPct,
    leftPct: us.leftPct ?? baseline.leftPct,
    rearPct: us.rearPct ?? baseline.rearPct,
    cornerWeightLF: us.cornerWeightLF ?? baseline.cornerWeightLF,
    cornerWeightRF: us.cornerWeightRF ?? baseline.cornerWeightRF,
    cornerWeightLR: us.cornerWeightLR ?? baseline.cornerWeightLR,
    cornerWeightRR: us.cornerWeightRR ?? baseline.cornerWeightRR,
    swayBarFront: us.swayBarFront ?? baseline.swayBarFront,
    shockLF: us.shockLF ?? baseline.shockLF,
    shockRF: us.shockRF ?? baseline.shockRF,
    shockLR: us.shockLR ?? baseline.shockLR,
    shockRR: us.shockRR ?? baseline.shockRR,
    gearRatio: us.gearRatio ?? baseline.gearRatio,
    tireModel: us.tireModel ?? baseline.tireModel,
    notes: us.notes ?? baseline.notes,
  }
}

export function CarProvider({ children }: { children: ReactNode }) {
  const [currentCarId, setCurrentCarId] = useState(allCars[0]?.id || 'monte-carlo-75')
  const [cars, setCars] = useState<Car[]>(allCars)
  const garage = useGarage()

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

  // Use garage cars if available, otherwise all DB cars
  const displayCars = garage.hasGarage
    ? garage.garageCars.map(gc => gc.car)
    : cars

  const currentCar = displayCars.find(c => c.id === currentCarId) || displayCars[0] || cars[0]

  // Use user's saved setup if available, otherwise hardcoded baseline
  const userSetup = garage.getSetupForCar(currentCarId)
  const currentSetup = userSetup
    ? userSetupToSetupSheet(userSetup, currentCarId)
    : allBaselines[currentCarId] || fallbackSetup

  const getSetupForCar = (carId: string) => {
    const us = garage.getSetupForCar(carId)
    if (us) return userSetupToSetupSheet(us, carId)
    return allBaselines[carId] || fallbackSetup
  }

  return (
    <CarContext.Provider value={{
      cars: displayCars,
      currentCar,
      currentSetup,
      setCurrentCarId,
      getSetupForCar,
      userSetup,
      hasGarage: garage.hasGarage,
    }}>
      {children}
    </CarContext.Provider>
  )
}

export function useCar() {
  const context = useContext(CarContext)
  if (!context) throw new Error('useCar must be used within CarProvider')
  return context
}
