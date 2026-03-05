'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSupabase } from '@/components/shared/SupabaseProvider'
import { useSubscriptionContext } from '@/components/subscription/SubscriptionProvider'
import type { Car, RaceClass, SuspensionType, EngineSpec } from '@/lib/types'

export interface UserSetup {
  id: string
  userId: string
  carId: string
  trackId: string | null
  name: string
  raceType: string
  trackCondition: string
  springLF: number | null
  springRF: number | null
  springLR: number | null
  springRR: number | null
  rideHeightLF: number | null
  rideHeightRF: number | null
  rideHeightLR: number | null
  rideHeightRR: number | null
  camberLF: number | null
  camberRF: number | null
  casterLF: number | null
  casterRF: number | null
  toeFront: number | null
  toeRear: number | null
  pressureLF: number | null
  pressureRF: number | null
  pressureLR: number | null
  pressureRR: number | null
  totalWeight: number | null
  crossWeightPct: number | null
  leftPct: number | null
  rearPct: number | null
  cornerWeightLF: number | null
  cornerWeightRF: number | null
  cornerWeightLR: number | null
  cornerWeightRR: number | null
  swayBarFront: string | null
  gearRatio: string | null
  tireModel: string | null
  shockLF: string | null
  shockRF: string | null
  shockLR: string | null
  shockRR: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GarageEntry {
  id: string
  carId: string
  nickname: string | null
  isPrimary: boolean
  car: Car
}

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

function mapDbSetup(row: Record<string, unknown>): UserSetup {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    carId: row.car_id as string,
    trackId: (row.track_id as string) || null,
    name: (row.name as string) || 'Default Setup',
    raceType: (row.race_type as string) || 'figure-8',
    trackCondition: (row.track_condition as string) || 'moderate',
    springLF: row.spring_lf != null ? Number(row.spring_lf) : null,
    springRF: row.spring_rf != null ? Number(row.spring_rf) : null,
    springLR: row.spring_lr != null ? Number(row.spring_lr) : null,
    springRR: row.spring_rr != null ? Number(row.spring_rr) : null,
    rideHeightLF: row.ride_height_lf != null ? Number(row.ride_height_lf) : null,
    rideHeightRF: row.ride_height_rf != null ? Number(row.ride_height_rf) : null,
    rideHeightLR: row.ride_height_lr != null ? Number(row.ride_height_lr) : null,
    rideHeightRR: row.ride_height_rr != null ? Number(row.ride_height_rr) : null,
    camberLF: row.camber_lf != null ? Number(row.camber_lf) : null,
    camberRF: row.camber_rf != null ? Number(row.camber_rf) : null,
    casterLF: row.caster_lf != null ? Number(row.caster_lf) : null,
    casterRF: row.caster_rf != null ? Number(row.caster_rf) : null,
    toeFront: row.toe_front != null ? Number(row.toe_front) : null,
    toeRear: row.toe_rear != null ? Number(row.toe_rear) : null,
    pressureLF: row.pressure_lf != null ? Number(row.pressure_lf) : null,
    pressureRF: row.pressure_rf != null ? Number(row.pressure_rf) : null,
    pressureLR: row.pressure_lr != null ? Number(row.pressure_lr) : null,
    pressureRR: row.pressure_rr != null ? Number(row.pressure_rr) : null,
    totalWeight: row.total_weight != null ? Number(row.total_weight) : null,
    crossWeightPct: row.cross_weight_pct != null ? Number(row.cross_weight_pct) : null,
    leftPct: row.left_pct != null ? Number(row.left_pct) : null,
    rearPct: row.rear_pct != null ? Number(row.rear_pct) : null,
    cornerWeightLF: row.corner_weight_lf != null ? Number(row.corner_weight_lf) : null,
    cornerWeightRF: row.corner_weight_rf != null ? Number(row.corner_weight_rf) : null,
    cornerWeightLR: row.corner_weight_lr != null ? Number(row.corner_weight_lr) : null,
    cornerWeightRR: row.corner_weight_rr != null ? Number(row.corner_weight_rr) : null,
    swayBarFront: (row.sway_bar_front as string) || null,
    gearRatio: (row.gear_ratio as string) || null,
    tireModel: (row.tire_model as string) || null,
    shockLF: (row.shock_lf as string) || null,
    shockRF: (row.shock_rf as string) || null,
    shockLR: (row.shock_lr as string) || null,
    shockRR: (row.shock_rr as string) || null,
    notes: (row.notes as string) || null,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export function useGarage() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const { isPro } = useSubscriptionContext()
  const [garageCars, setGarageCars] = useState<GarageEntry[]>([])
  const [setups, setSetups] = useState<UserSetup[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGarage = useCallback(async () => {
    if (!user) {
      setGarageCars([])
      setSetups([])
      setLoading(false)
      return
    }

    try {
      // Fetch user's cars with joined car data
      const { data: userCarsData } = await supabase
        .from('user_cars')
        .select('id, car_id, nickname, is_primary, cars(*)')
        .eq('user_id', user.id)
        .order('added_at')

      if (userCarsData) {
        const entries: GarageEntry[] = userCarsData.map((uc: Record<string, unknown>) => ({
          id: uc.id as string,
          carId: uc.car_id as string,
          nickname: (uc.nickname as string) || null,
          isPrimary: uc.is_primary as boolean,
          car: mapDbCar(uc.cars as Record<string, unknown>),
        }))
        setGarageCars(entries)
      }

      // Fetch user's setups
      const { data: setupsData } = await supabase
        .from('user_setups')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })

      if (setupsData) {
        setSetups(setupsData.map((s: Record<string, unknown>) => mapDbSetup(s)))
      }
    } catch {
      // Silent fail — garage features degrade gracefully
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchGarage()
  }, [fetchGarage])

  const addCar = async (carId: string): Promise<boolean> => {
    if (!user) return false

    // Free user limit: 1 car
    if (!isPro && garageCars.length >= 1) return false

    const isPrimary = garageCars.length === 0

    const { error } = await supabase
      .from('user_cars')
      .insert({
        user_id: user.id,
        car_id: carId,
        is_primary: isPrimary,
      })

    if (!error) {
      await fetchGarage()
      return true
    }
    return false
  }

  const removeCar = async (carId: string): Promise<boolean> => {
    if (!user) return false

    const { error } = await supabase
      .from('user_cars')
      .delete()
      .eq('user_id', user.id)
      .eq('car_id', carId)

    if (!error) {
      await fetchGarage()
      return true
    }
    return false
  }

  const setPrimaryCar = async (carId: string): Promise<boolean> => {
    if (!user) return false

    // Unset all primary, then set the new one
    await supabase
      .from('user_cars')
      .update({ is_primary: false })
      .eq('user_id', user.id)

    const { error } = await supabase
      .from('user_cars')
      .update({ is_primary: true })
      .eq('user_id', user.id)
      .eq('car_id', carId)

    if (!error) {
      await fetchGarage()
      return true
    }
    return false
  }

  const saveSetup = async (setup: Omit<UserSetup, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!user) return false

    // Check if setup already exists for this car
    const existing = setups.find(s => s.carId === setup.carId && s.isActive)

    const row = {
      user_id: user.id,
      car_id: setup.carId,
      track_id: setup.trackId,
      name: setup.name,
      race_type: setup.raceType,
      track_condition: setup.trackCondition,
      spring_lf: setup.springLF,
      spring_rf: setup.springRF,
      spring_lr: setup.springLR,
      spring_rr: setup.springRR,
      ride_height_lf: setup.rideHeightLF,
      ride_height_rf: setup.rideHeightRF,
      ride_height_lr: setup.rideHeightLR,
      ride_height_rr: setup.rideHeightRR,
      camber_lf: setup.camberLF,
      camber_rf: setup.camberRF,
      caster_lf: setup.casterLF,
      caster_rf: setup.casterRF,
      toe_front: setup.toeFront,
      toe_rear: setup.toeRear,
      pressure_lf: setup.pressureLF,
      pressure_rf: setup.pressureRF,
      pressure_lr: setup.pressureLR,
      pressure_rr: setup.pressureRR,
      total_weight: setup.totalWeight,
      cross_weight_pct: setup.crossWeightPct,
      left_pct: setup.leftPct,
      rear_pct: setup.rearPct,
      corner_weight_lf: setup.cornerWeightLF,
      corner_weight_rf: setup.cornerWeightRF,
      corner_weight_lr: setup.cornerWeightLR,
      corner_weight_rr: setup.cornerWeightRR,
      sway_bar_front: setup.swayBarFront,
      gear_ratio: setup.gearRatio,
      tire_model: setup.tireModel,
      shock_lf: setup.shockLF,
      shock_rf: setup.shockRF,
      shock_lr: setup.shockLR,
      shock_rr: setup.shockRR,
      notes: setup.notes,
      is_active: true,
      updated_at: new Date().toISOString(),
    }

    let error
    if (existing) {
      ;({ error } = await supabase
        .from('user_setups')
        .update(row)
        .eq('id', existing.id))
    } else {
      ;({ error } = await supabase
        .from('user_setups')
        .insert(row))
    }

    if (!error) {
      await fetchGarage()
      return true
    }
    return false
  }

  const getSetupForCar = (carId: string): UserSetup | null => {
    return setups.find(s => s.carId === carId && s.isActive) || null
  }

  return {
    garageCars,
    setups,
    loading,
    addCar,
    removeCar,
    setPrimaryCar,
    saveSetup,
    getSetupForCar,
    refresh: fetchGarage,
    hasGarage: garageCars.length > 0,
  }
}
