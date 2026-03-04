import type { EngineFamily, HeadCasting, CamProfile } from '@/lib/types'
import { gmSbc350 } from './gm-sbc-350'
import { ford351w } from './ford-351w'
import { mopar360 } from './mopar-360'
import { ford46Sohc } from './ford-46-sohc'

// ============================================================
// Engine Family Registry
//
// Central lookup for all engine families. Every engine simulator
// call, compliance check, and UI selector goes through here.
// ============================================================

export const engineFamilies: EngineFamily[] = [
  gmSbc350,
  ford351w,
  mopar360,
  ford46Sohc,
]

const familyMap = new Map(engineFamilies.map(f => [f.id, f]))

export function getEngineFamilyById(id: string): EngineFamily | undefined {
  return familyMap.get(id)
}

/**
 * Get all heads across all families, or for a specific family.
 */
export function getAllHeads(familyId?: string): HeadCasting[] {
  if (familyId) {
    return familyMap.get(familyId)?.heads ?? []
  }
  return engineFamilies.flatMap(f => f.heads)
}

/**
 * Get all cams across all families, or for a specific family.
 */
export function getAllCams(familyId?: string): CamProfile[] {
  if (familyId) {
    return familyMap.get(familyId)?.cams ?? []
  }
  return engineFamilies.flatMap(f => f.cams)
}

/**
 * Look up a specific head by ID across all families.
 */
export function findHeadById(headId: string): HeadCasting | undefined {
  for (const family of engineFamilies) {
    const head = family.heads.find(h => h.id === headId)
    if (head) return head
  }
  return undefined
}

/**
 * Look up a specific cam by ID across all families.
 */
export function findCamById(camId: string): CamProfile | undefined {
  for (const family of engineFamilies) {
    const cam = family.cams.find(c => c.id === camId)
    if (cam) return cam
  }
  return undefined
}
