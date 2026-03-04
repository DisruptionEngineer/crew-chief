import type { EngineFamily } from '@/lib/types'
import { mopar360Heads } from './heads'
import { mopar360Cams } from './cams'

// ============================================================
// Mopar 360 (5.9L LA-Series) Engine Family
//
// Chrysler's small block workhorse. Found in Dodge and Plymouth
// trucks, vans, and passenger cars 1971–2003. Shares architecture
// with 273/318/340. Great torque, underrated performer.
//
// Architecture: 90° V8, pushrod OHV, 2-valve per cylinder
// Block material: Cast iron
// Bore centers: 4.460"
// ============================================================

export const mopar360: EngineFamily = {
  id: 'mopar-360',
  name: 'Mopar 360 LA',
  manufacturer: 'Mopar',
  displacement: 360,
  cylinders: 8,
  architecture: 'pushrod',
  defaultBore: 4.000,
  defaultStroke: 3.580,
  heads: mopar360Heads,
  cams: mopar360Cams,
  defaultConfig: {
    bore: 4.000,
    stroke: 3.580,
    headId: '915',
    camId: 'mopar-street',
    pistonDish: 8,
    headGasketThickness: 0.040,
    headGasketBore: 4.100,
  },
}
