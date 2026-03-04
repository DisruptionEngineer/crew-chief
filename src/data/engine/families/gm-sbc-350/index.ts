import type { EngineFamily } from '@/lib/types'
import { headCatalog } from '../../heads'
import { camCatalog } from '../../cams'

// ============================================================
// GM Small Block Chevy 350 (5.7L) Engine Family
//
// The backbone of American short track racing. Found in everything
// from Monte Carlos to Camaros to Impalas. Production: 1967–2003.
//
// Architecture: 90° V8, pushrod OHV, 2-valve per cylinder
// Block material: Cast iron
// Bore centers: 4.400"
// ============================================================

export const gmSbc350: EngineFamily = {
  id: 'gm-sbc-350',
  name: 'GM Small Block 350',
  manufacturer: 'GM',
  displacement: 350,
  cylinders: 8,
  architecture: 'pushrod',
  defaultBore: 4.000,
  defaultStroke: 3.480,
  heads: headCatalog,
  cams: camCatalog,
  defaultConfig: {
    bore: 4.000,
    stroke: 3.480,
    headId: '906',
    camId: 'street-strip',
    pistonDish: 4,
    headGasketThickness: 0.039,
    headGasketBore: 4.100,
  },
}
