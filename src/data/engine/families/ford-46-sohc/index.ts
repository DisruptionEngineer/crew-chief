import type { EngineFamily } from '@/lib/types'
import { ford46Heads } from './heads'
import { ford46Cams } from './cams'

// ============================================================
// Ford 4.6L SOHC (Modular) Engine Family
//
// Ford's overhead-cam V8 that powered Crown Victorias, Mustang GTs,
// and Lincoln Town Cars. Production: 1991–2011.
//
// Very different from pushrod engines — the cams are chain-driven
// and sit on top of the heads. Most "stock" divisions run these
// as-is since cam swaps are complex and expensive.
//
// Architecture: 90° V8, SOHC, 2-valve per cylinder
// Block material: Cast iron (truck/Crown Vic) or aluminum (Mustang)
// ============================================================

export const ford46Sohc: EngineFamily = {
  id: 'ford-46-sohc',
  name: 'Ford 4.6L SOHC',
  manufacturer: 'Ford',
  displacement: 281,
  cylinders: 8,
  architecture: 'ohc',
  defaultBore: 3.552,
  defaultStroke: 3.543,
  heads: ford46Heads,
  cams: ford46Cams,
  defaultConfig: {
    bore: 3.552,
    stroke: 3.543,
    headId: 'pi-head',
    camId: 'ford46-pi-stock',
    pistonDish: 6,
    headGasketThickness: 0.040,
    headGasketBore: 3.630,
  },
}
