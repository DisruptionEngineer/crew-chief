'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Car, SetupSheet } from '@/lib/types'
import { allCars, allBaselines } from '@/data/cars/registry'

interface CarContextType {
  cars: Car[]
  currentCar: Car
  currentSetup: SetupSheet
  setCurrentCarId: (id: string) => void
  getSetupForCar: (carId: string) => SetupSheet
}

const CarContext = createContext<CarContextType | undefined>(undefined)

const fallbackSetup: SetupSheet = allBaselines[allCars[0]?.id] || {} as SetupSheet

export function CarProvider({ children }: { children: ReactNode }) {
  const [currentCarId, setCurrentCarId] = useState(allCars[0]?.id || 'monte-carlo-75')
  const [cars] = useState<Car[]>(allCars)

  // Persist car selection
  useEffect(() => {
    const saved = localStorage.getItem('tenths-car-id')
    if (saved && allCars.find(c => c.id === saved)) {
      setCurrentCarId(saved)
    }
  }, [])

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
