export interface TireCompound {
  id: string
  brand: string
  model: string
  label: string
  surface: 'dirt' | 'asphalt' | 'both'
  pressureRange: { front: [number, number]; rear: [number, number] }
}

export const tireCompounds: TireCompound[] = [
  // --- Hoosier ---
  {
    id: 'hoosier-g60',
    brand: 'Hoosier',
    model: 'G60',
    label: 'Hoosier G60',
    surface: 'both',
    pressureRange: { front: [12, 16], rear: [11, 15] },
  },
  {
    id: 'hoosier-d55',
    brand: 'Hoosier',
    model: 'D55 (Hard)',
    label: 'Hoosier D55',
    surface: 'dirt',
    pressureRange: { front: [10, 14], rear: [9, 13] },
  },
  {
    id: 'hoosier-d40',
    brand: 'Hoosier',
    model: 'D40 (Medium)',
    label: 'Hoosier D40',
    surface: 'dirt',
    pressureRange: { front: [11, 15], rear: [10, 14] },
  },
  {
    id: 'hoosier-d25',
    brand: 'Hoosier',
    model: 'D25 (Soft)',
    label: 'Hoosier D25',
    surface: 'dirt',
    pressureRange: { front: [12, 16], rear: [11, 15] },
  },
  {
    id: 'hoosier-f45',
    brand: 'Hoosier',
    model: 'F45 (Asphalt)',
    label: 'Hoosier F45',
    surface: 'asphalt',
    pressureRange: { front: [22, 28], rear: [20, 26] },
  },
  {
    id: 'hoosier-f35',
    brand: 'Hoosier',
    model: 'F35 (Asphalt Soft)',
    label: 'Hoosier F35',
    surface: 'asphalt',
    pressureRange: { front: [20, 26], rear: [18, 24] },
  },
  // --- American Racer ---
  {
    id: 'american-racer-33',
    brand: 'American Racer',
    model: '33 (Hard)',
    label: 'American Racer 33',
    surface: 'dirt',
    pressureRange: { front: [11, 15], rear: [10, 14] },
  },
  {
    id: 'american-racer-44',
    brand: 'American Racer',
    model: '44 (Medium)',
    label: 'American Racer 44',
    surface: 'dirt',
    pressureRange: { front: [12, 16], rear: [11, 15] },
  },
  {
    id: 'american-racer-56',
    brand: 'American Racer',
    model: '56 (Asphalt)',
    label: 'American Racer 56',
    surface: 'asphalt',
    pressureRange: { front: [20, 26], rear: [18, 24] },
  },
  // --- Towel City ---
  {
    id: 'tct-recap',
    brand: 'TCT',
    model: 'Recap',
    label: 'TCT Recap',
    surface: 'dirt',
    pressureRange: { front: [12, 16], rear: [11, 15] },
  },
  // --- DOT Street ---
  {
    id: 'dot-street',
    brand: 'DOT',
    model: 'Street Tire',
    label: 'DOT Street',
    surface: 'both',
    pressureRange: { front: [28, 35], rear: [26, 33] },
  },
]

/** Group compounds by brand for dropdown rendering */
export function getTiresByBrand(): { brand: string; compounds: TireCompound[] }[] {
  const map = new Map<string, TireCompound[]>()
  for (const t of tireCompounds) {
    const list = map.get(t.brand) || []
    list.push(t)
    map.set(t.brand, list)
  }
  return Array.from(map.entries()).map(([brand, compounds]) => ({ brand, compounds }))
}

/** Find a compound by ID */
export function getTireCompound(id: string): TireCompound | undefined {
  return tireCompounds.find(t => t.id === id)
}

/** Default tire for a given surface */
export function getDefaultTireForSurface(surface: 'dirt' | 'asphalt' | 'mixed' | 'concrete'): TireCompound {
  if (surface === 'asphalt' || surface === 'concrete') {
    return tireCompounds.find(t => t.id === 'hoosier-f45')!
  }
  return tireCompounds.find(t => t.id === 'hoosier-g60')!
}
