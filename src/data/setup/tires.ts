export interface PressureRange {
  front: [number, number]
  rear: [number, number]
}

export interface TireCompound {
  id: string
  brand: string
  model: string
  label: string
  surface: 'dirt' | 'asphalt' | 'both'
  pressureRange: PressureRange
  /** Surface-specific ranges for 'both' tires (e.g. G60 runs 12-16 on dirt, 22-28 on asphalt) */
  pressureByTrackSurface?: {
    dirt: PressureRange
    asphalt: PressureRange
  }
  /** Base friction coefficient by surface type */
  gripProfile: {
    dirt: number
    asphalt: number
    concrete: number
    mixed: number
  }
  /** Grip dropoff per lb of additional vertical load */
  loadSensitivity: number
}

export const tireCompounds: TireCompound[] = [
  // --- Hoosier ---
  {
    id: 'hoosier-g60',
    brand: 'Hoosier',
    model: 'G60',
    label: 'Hoosier G60',
    surface: 'both',
    pressureRange: { front: [12, 16], rear: [11, 15] }, // default (dirt)
    pressureByTrackSurface: {
      dirt: { front: [12, 16], rear: [11, 15] },
      asphalt: { front: [22, 28], rear: [20, 26] },
    },
    gripProfile: { dirt: 1.10, asphalt: 0.95, concrete: 0.85, mixed: 0.90 },
    loadSensitivity: 0.00015,
  },
  {
    id: 'hoosier-d55',
    brand: 'Hoosier',
    model: 'D55 (Hard)',
    label: 'Hoosier D55',
    surface: 'dirt',
    pressureRange: { front: [10, 14], rear: [9, 13] },
    gripProfile: { dirt: 1.05, asphalt: 0.85, concrete: 0.80, mixed: 0.82 },
    loadSensitivity: 0.00014,
  },
  {
    id: 'hoosier-d40',
    brand: 'Hoosier',
    model: 'D40 (Medium)',
    label: 'Hoosier D40',
    surface: 'dirt',
    pressureRange: { front: [11, 15], rear: [10, 14] },
    gripProfile: { dirt: 1.10, asphalt: 0.82, concrete: 0.77, mixed: 0.80 },
    loadSensitivity: 0.00016,
  },
  {
    id: 'hoosier-d25',
    brand: 'Hoosier',
    model: 'D25 (Soft)',
    label: 'Hoosier D25',
    surface: 'dirt',
    pressureRange: { front: [12, 16], rear: [11, 15] },
    gripProfile: { dirt: 1.15, asphalt: 0.80, concrete: 0.75, mixed: 0.78 },
    loadSensitivity: 0.00018,
  },
  {
    id: 'hoosier-f45',
    brand: 'Hoosier',
    model: 'F45 (Asphalt)',
    label: 'Hoosier F45',
    surface: 'asphalt',
    pressureRange: { front: [22, 28], rear: [20, 26] },
    gripProfile: { dirt: 0.85, asphalt: 1.05, concrete: 0.95, mixed: 1.00 },
    loadSensitivity: 0.00013,
  },
  {
    id: 'hoosier-f35',
    brand: 'Hoosier',
    model: 'F35 (Asphalt Soft)',
    label: 'Hoosier F35',
    surface: 'asphalt',
    pressureRange: { front: [20, 26], rear: [18, 24] },
    gripProfile: { dirt: 0.80, asphalt: 1.10, concrete: 1.00, mixed: 1.05 },
    loadSensitivity: 0.00014,
  },
  // --- American Racer ---
  {
    id: 'american-racer-33',
    brand: 'American Racer',
    model: '33 (Hard)',
    label: 'American Racer 33',
    surface: 'dirt',
    pressureRange: { front: [11, 15], rear: [10, 14] },
    gripProfile: { dirt: 1.10, asphalt: 0.82, concrete: 0.77, mixed: 0.80 },
    loadSensitivity: 0.00016,
  },
  {
    id: 'american-racer-44',
    brand: 'American Racer',
    model: '44 (Medium)',
    label: 'American Racer 44',
    surface: 'dirt',
    pressureRange: { front: [12, 16], rear: [11, 15] },
    gripProfile: { dirt: 1.15, asphalt: 0.80, concrete: 0.75, mixed: 0.78 },
    loadSensitivity: 0.00018,
  },
  {
    id: 'american-racer-56',
    brand: 'American Racer',
    model: '56 (Asphalt)',
    label: 'American Racer 56',
    surface: 'asphalt',
    pressureRange: { front: [20, 26], rear: [18, 24] },
    gripProfile: { dirt: 0.80, asphalt: 1.10, concrete: 1.00, mixed: 1.05 },
    loadSensitivity: 0.00014,
  },
  // --- Towel City ---
  {
    id: 'tct-recap',
    brand: 'TCT',
    model: 'Recap',
    label: 'TCT Recap',
    surface: 'dirt',
    pressureRange: { front: [12, 16], rear: [11, 15] },
    gripProfile: { dirt: 1.00, asphalt: 0.80, concrete: 0.75, mixed: 0.78 },
    loadSensitivity: 0.00018,
  },
  // --- DOT Street ---
  {
    id: 'dot-street',
    brand: 'DOT',
    model: 'Street Tire',
    label: 'DOT Street',
    surface: 'both',
    pressureRange: { front: [28, 35], rear: [26, 33] }, // default
    pressureByTrackSurface: {
      dirt: { front: [26, 32], rear: [24, 30] },
      asphalt: { front: [30, 36], rear: [28, 34] },
    },
    gripProfile: { dirt: 0.70, asphalt: 0.80, concrete: 0.75, mixed: 0.78 },
    loadSensitivity: 0.00012,
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

/** Find a compound by its human-readable label (case-insensitive) */
export function getTireCompoundByLabel(label: string): TireCompound | undefined {
  return tireCompounds.find(t => t.label.toLowerCase() === label.toLowerCase())
}

/** Default tire for a given surface */
export function getDefaultTireForSurface(surface: 'dirt' | 'asphalt' | 'mixed' | 'concrete'): TireCompound {
  if (surface === 'asphalt' || surface === 'concrete' || surface === 'mixed') {
    return tireCompounds.find(t => t.id === 'hoosier-g60')! // G60 works on all hard surfaces
  }
  return tireCompounds.find(t => t.id === 'hoosier-g60')!
}

/** Get effective pressure range for a tire on a specific track surface.
 *  For 'both' tires (like G60), returns surface-specific range.
 *  For surface-specific tires, returns their standard range. */
export function getEffectivePressureRange(
  tire: TireCompound,
  trackSurface?: string,
): PressureRange {
  if (tire.pressureByTrackSurface && trackSurface) {
    // Map track surfaces: concrete & mixed (asphalt/concrete combos) → asphalt pressures
    const surface = (trackSurface === 'asphalt' || trackSurface === 'concrete' || trackSurface === 'mixed')
      ? 'asphalt'
      : trackSurface === 'dirt' ? 'dirt'
      : undefined
    if (surface && tire.pressureByTrackSurface[surface]) {
      return tire.pressureByTrackSurface[surface]
    }
  }
  return tire.pressureRange
}
