import { createAdminSupabaseClient } from '@/lib/supabase/server'
import type { Car, EngineSpec, RaceClass, SuspensionType } from '@/lib/types'

// DB row → Car interface mapper
function mapRow(row: Record<string, unknown>): Car {
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

export async function getAllCars(filters?: {
  make?: string
  division?: RaceClass
}): Promise<Car[]> {
  const supabase = createAdminSupabaseClient()
  let query = supabase.from('cars').select('*').eq('active', true).order('name')

  if (filters?.make) query = query.eq('make', filters.make)
  if (filters?.division) query = query.contains('eligible_divisions', [filters.division])

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapRow)
}

export async function getCarById(id: string): Promise<Car | null> {
  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapRow(data)
}

export async function searchCars(query: string): Promise<Car[]> {
  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('active', true)
    .or(`name.ilike.%${query}%,make.ilike.%${query}%,model.ilike.%${query}%`)
    .order('name')
    .limit(20)

  if (error) throw error
  return (data || []).map(mapRow)
}

export async function getCarsByDivision(division: RaceClass): Promise<Car[]> {
  return getAllCars({ division })
}
