import type { EngineFamily } from '@/lib/types'
import { ford351wHeads } from './heads'
import { ford351wCams } from './cams'

// ============================================================
// Ford 351 Windsor (5.8L) Engine Family
//
// Ford's workhorse V8, found in trucks, Mustangs, and Broncos.
// Production: 1969–1997. Shares bellhousing with 302/5.0 but
// has a taller deck height (9.503" vs 8.206").
//
// Architecture: 90° V8, pushrod OHV, 2-valve per cylinder
// Block material: Cast iron
// Bore centers: 4.380"
// ============================================================

export const ford351w: EngineFamily = {
  id: 'ford-351w',
  name: 'Ford 351 Windsor',
  manufacturer: 'Ford',
  displacement: 351,
  cylinders: 8,
  architecture: 'pushrod',
  defaultBore: 4.000,
  defaultStroke: 3.500,
  heads: ford351wHeads,
  cams: ford351wCams,
  defaultConfig: {
    bore: 4.000,
    stroke: 3.500,
    headId: 'gt40',
    camId: 'ford-street',
    pistonDish: 6,
    headGasketThickness: 0.041,
    headGasketBore: 4.100,
  },
}
