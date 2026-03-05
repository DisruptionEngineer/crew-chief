import type { TransmissionInput, TransmissionResult, TransmissionScore } from '@/lib/types'

// ============================================================
// Transmission Advisor
//
// Evaluates common automatic and manual transmissions for
// short track racing. Scores durability, cost, weight, and
// ease of installation.
//
// Most short track classes allow either automatic or manual.
// The right choice depends on budget, chassis, and division.
// ============================================================

interface TransmissionData {
  name: string
  type: 'automatic' | 'manual'
  make: 'GM' | 'Ford' | 'Mopar' | 'universal'
  gears: number
  weight: number          // lbs
  maxTorque: number       // ft-lbs capacity
  firstGearRatio: number
  topGearRatio: number
  typicalCost: number     // $ used/rebuilt
  durability: number      // 1-10
  notes: string
}

const transmissions: TransmissionData[] = [
  {
    name: 'TH350',
    type: 'automatic',
    make: 'GM',
    gears: 3,
    weight: 120,
    maxTorque: 350,
    firstGearRatio: 2.52,
    topGearRatio: 1.00,
    typicalCost: 300,
    durability: 8,
    notes: 'The workhorse of GM short track racing. Light, compact, cheap, bulletproof. No overdrive but that doesn\'t matter on a short track. Easy to find, easy to rebuild.',
  },
  {
    name: 'TH400',
    type: 'automatic',
    make: 'GM',
    gears: 3,
    weight: 135,
    maxTorque: 450,
    firstGearRatio: 2.48,
    topGearRatio: 1.00,
    typicalCost: 350,
    durability: 10,
    notes: 'Essentially unbreakable. Heavier than TH350 but handles more torque. Common in higher-HP builds. Slightly lower first gear ratio than TH350.',
  },
  {
    name: 'Powerglide',
    type: 'automatic',
    make: 'GM',
    gears: 2,
    weight: 95,
    maxTorque: 400,
    firstGearRatio: 1.76,
    topGearRatio: 1.00,
    typicalCost: 400,
    durability: 9,
    notes: 'Two speeds — low and drive. Lightest automatic option. Fastest shifts (less parasitic loss). Popular in dirt track. Check rules — some classes require "at least two forward gears" meaning 3-speed min.',
  },
  {
    name: 'Muncie M21',
    type: 'manual',
    make: 'GM',
    gears: 4,
    weight: 75,
    maxTorque: 350,
    firstGearRatio: 2.52,
    topGearRatio: 1.00,
    typicalCost: 500,
    durability: 6,
    notes: 'Close-ratio 4-speed. Light and precise. Harder to drive but potentially faster (no torque converter loss). Getting rare — consider a Saginaw 4-speed as a cheaper alternative.',
  },
  {
    name: 'C4',
    type: 'automatic',
    make: 'Ford',
    gears: 3,
    weight: 105,
    maxTorque: 350,
    firstGearRatio: 2.46,
    topGearRatio: 1.00,
    typicalCost: 250,
    durability: 7,
    notes: 'Ford\'s equivalent to the TH350. Light, simple, cheap. Good for 351W and smaller Ford builds. Easy to find, lots of aftermarket support.',
  },
  {
    name: 'C6',
    type: 'automatic',
    make: 'Ford',
    gears: 3,
    weight: 145,
    maxTorque: 475,
    firstGearRatio: 2.46,
    topGearRatio: 1.00,
    typicalCost: 350,
    durability: 9,
    notes: 'Ford\'s heavy-duty automatic. Very tough. Heavier but handles big torque. Good for 351W builds with aggressive cams.',
  },
  {
    name: 'A727 Torqueflite',
    type: 'automatic',
    make: 'Mopar',
    gears: 3,
    weight: 130,
    maxTorque: 450,
    firstGearRatio: 2.45,
    topGearRatio: 1.00,
    typicalCost: 300,
    durability: 9,
    notes: 'The Mopar standard. Strong, reliable, good aftermarket support. Used behind 360s and 440s from the factory. The TH400 of the Mopar world.',
  },
  {
    name: '4R70W',
    type: 'automatic',
    make: 'Ford',
    gears: 4,
    weight: 128,
    maxTorque: 340,
    firstGearRatio: 2.84,
    topGearRatio: 0.70,
    typicalCost: 400,
    durability: 6,
    notes: 'Ford 4.6L SOHC factory transmission (Crown Vic). Electronic overdrive — some classes require it to stay stock. Can be valve-body modified for firmer shifts if rules allow.',
  },
  {
    name: 'Ford Top Loader',
    type: 'manual',
    make: 'Ford',
    gears: 4,
    weight: 80,
    maxTorque: 400,
    firstGearRatio: 2.32,
    topGearRatio: 1.00,
    typicalCost: 600,
    durability: 8,
    notes: 'Ford\'s legendary manual trans. Wide-ratio version is better for short track. Tough and compact. Getting harder to find — aftermarket rebuilds available but pricey.',
  },
  {
    name: 'T5 World Class',
    type: 'manual',
    make: 'Ford',
    gears: 5,
    weight: 60,
    maxTorque: 300,
    firstGearRatio: 2.95,
    topGearRatio: 0.63,
    typicalCost: 350,
    durability: 5,
    notes: 'Light 5-speed from late Mustangs and some trucks. Very light but limited torque capacity. Best for mild-build 302s. Not recommended for high-torque 351W builds.',
  },
  {
    name: 'A833 4-Speed',
    type: 'manual',
    make: 'Mopar',
    gears: 4,
    weight: 85,
    maxTorque: 400,
    firstGearRatio: 2.66,
    topGearRatio: 1.00,
    typicalCost: 450,
    durability: 7,
    notes: 'Mopar\'s OEM 4-speed behind 340s and 360s. Solid unit with good gear spacing for short tracks. New Process build — parts still available but getting scarce.',
  },
]

export function evaluateTransmissions(input: TransmissionInput): TransmissionResult {
  const { engineMake, engineTorque, rearGearRatio, divisionId, preferAutomatic } = input

  const eligible = transmissions.filter(t => {
    // Filter by make compatibility (universal or matching make)
    if (t.make !== 'universal' && t.make !== engineMake) return false
    // Filter by type preference
    if (preferAutomatic !== undefined) {
      if (preferAutomatic && t.type !== 'automatic') return false
      if (!preferAutomatic && t.type !== 'manual') return false
    }
    return true
  })

  const scored: TransmissionScore[] = eligible.map(t => {
    let score = 0

    // Durability (25% weight)
    score += (t.durability / 10) * 25

    // Cost (25% weight — lower is better)
    score += Math.max(0, (1 - t.typicalCost / 600)) * 25

    // Weight (20% weight — lighter is better)
    score += Math.max(0, (1 - t.weight / 150)) * 20

    // Torque capacity (15% weight)
    const torqueMargin = t.maxTorque / Math.max(engineTorque, 200)
    score += Math.min(torqueMargin * 10, 15)

    // Gear spread (15% weight — more gears = better for street stock)
    if (divisionId === 'street-stock') {
      score += Math.min(t.gears * 3, 15)
    } else {
      score += (t.gears >= 3 ? 10 : 5)
    }

    const pros: string[] = []
    const cons: string[] = []

    if (t.durability >= 9) pros.push('Extremely durable')
    if (t.weight < 100) pros.push('Very light')
    if (t.typicalCost < 300) pros.push('Budget friendly')
    if (t.maxTorque > engineTorque * 1.3) pros.push('Plenty of torque capacity')

    if (t.durability < 7) cons.push('May need rebuilds')
    if (t.weight > 130) cons.push('Heavy')
    if (t.typicalCost > 450) cons.push('Pricey')
    if (t.maxTorque < engineTorque) cons.push('Torque capacity may be marginal')
    if (t.gears < 3) cons.push('Check rules — may require 3+ forward gears')

    return {
      name: t.name,
      type: t.type,
      score: Math.round(score),
      gears: t.gears,
      weight: t.weight,
      typicalCost: t.typicalCost,
      firstGearRatio: t.firstGearRatio,
      topGearRatio: t.topGearRatio,
      pros,
      cons,
      notes: t.notes,
    }
  })

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  return {
    recommended: scored[0]?.name ?? '',
    options: scored,
  }
}
