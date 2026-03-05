import type { Car, TrackCondition, RaceType, SetupRecommendations } from '@/lib/types'
import type { TireCompound } from './tires'

// Condition multipliers for spring rates
const conditionSpringMultiplier: Record<TrackCondition, number> = {
  heavy: 1.10,    // Stiffer for heavy/tacky - more roll resistance needed
  tacky: 1.05,
  moderate: 1.00, // Baseline
  dry: 0.95,      // Softer for dry - need more mechanical grip
  slick: 0.90,
}

// Base spring rates by car (front/rear in lbs/in)
const baseSpringRates: Record<string, { front: number; rear: number }> = {
  // GM A/G-body (SLA front, coil rear)
  'monte-carlo-75': { front: 900, rear: 200 },
  'cutlass-81': { front: 875, rear: 200 },
  'grand-prix-78': { front: 900, rear: 200 },
  'regal-84': { front: 875, rear: 200 },
  'malibu-79': { front: 875, rear: 200 },
  // GM B-body (full-size, heavier)
  'caprice-90': { front: 950, rear: 225 },
  'impala-96': { front: 925, rear: 225 },
  // GM F-body (leaf rear)
  'camaro-78': { front: 900, rear: 175 },
  // Ford Panther (Watts link rear)
  'crown-vic-06': { front: 850, rear: 250 },
  // Ford Fox-body (strut front, leaf rear)
  'mustang-89': { front: 800, rear: 175 },
  'thunderbird-87': { front: 825, rear: 200 },
  // GM W-body (strut front)
  'monte-carlo-95': { front: 850, rear: 200 },
  'lumina-92': { front: 850, rear: 200 },
  // Ford mid-size
  'taurus-97': { front: 825, rear: 200 },
  // Pontiac N-body
  'grand-am-88': { front: 800, rear: 175 },
  // Compacts (strut front, torsion beam rear)
  'civic-98': { front: 550, rear: 350 },
  'cavalier-02': { front: 575, rear: 350 },
  'neon-00': { front: 575, rear: 350 },
  'sentra-97': { front: 550, rear: 325 },
  'corolla-95': { front: 550, rear: 325 },
  'focus-02': { front: 575, rear: 350 },
  'escort-93': { front: 525, rear: 325 },
  // Trucks (SLA front, leaf rear)
  's10-98': { front: 850, rear: 200 },
  'ranger-95': { front: 825, rear: 200 },
  // Late Models (purpose-built, lighter)
  'crate-late-model': { front: 750, rear: 225 },
  'super-late-model': { front: 700, rear: 200 },
  // Modifieds (tube frame, wide track)
  'sk-modified': { front: 700, rear: 200 },
  'tour-modified': { front: 650, rear: 175 },
  // Legends / Bandolero (very light)
  'legends-car': { front: 350, rear: 200 },
  'bandolero': { front: 200, rear: 150 },
}

// Alignment presets
const figure8Alignment = {
  camberLF: -2.0,
  camberRF: -2.0,
  casterLF: 3.5,
  casterRF: 3.5,
  toeFront: -0.0625, // 1/16" toe-out
}

const ovalAlignment = {
  camberLF: 2.0,     // Positive for oval LF
  camberRF: -3.5,    // Negative for loaded RF
  casterLF: 1.5,     // Less caster LF
  casterRF: 4.5,     // More caster RF
  toeFront: -0.1875, // 3/16" toe-out
}

// Tire pressure ranges by condition
const tirePressureRanges: Record<TrackCondition, { front: [number, number]; rear: [number, number] }> = {
  heavy: { front: [15, 17], rear: [14, 16] },
  tacky: { front: [14, 16], rear: [13, 15] },
  moderate: { front: [13, 15], rear: [12, 14] },
  dry: { front: [11, 13], rear: [10, 12] },
  slick: { front: [10, 12], rear: [9, 11] },
}

export function getSetupRecommendations(
  car: Car,
  condition: TrackCondition,
  raceType: RaceType,
  tireCompound?: TireCompound,
): SetupRecommendations {
  const base = baseSpringRates[car.id] || baseSpringRates['monte-carlo-75']
  const mult = conditionSpringMultiplier[condition]
  const align = raceType === 'figure-8' ? figure8Alignment : ovalAlignment
  // Use tire compound pressure range if provided, otherwise fall back to condition-based
  const pressures = tireCompound
    ? tireCompound.pressureRange
    : tirePressureRanges[condition]
  const isF8 = raceType === 'figure-8'

  // Spring calculations
  const frontSpring = Math.round(base.front * mult / 25) * 25 // Round to nearest 25
  const rearSpring = Math.round(base.rear * mult / 25) * 25

  // For oval, bias springs L/R
  const ovalFrontBias = 50 // LF is 50 lbs stiffer than RF on oval
  const springLF = isF8 ? frontSpring : frontSpring + ovalFrontBias
  const springRF = isF8 ? frontSpring : frontSpring - ovalFrontBias
  const springLR = rearSpring
  const springRR = isF8 ? rearSpring : rearSpring + 25

  // Pressure calculations - figure 8 = equal, oval = biased
  const pFrontMid = (pressures.front[0] + pressures.front[1]) / 2
  const pRearMid = (pressures.rear[0] + pressures.rear[1]) / 2

  return {
    springs: [
      {
        parameter: 'springLF',
        label: 'Left Front Spring',
        value: springLF,
        unit: 'lbs/in',
        rangeLow: Math.round(base.front * 0.85 / 25) * 25,
        rangeHigh: Math.round(base.front * 1.15 / 25) * 25,
        explanation: isF8
          ? 'Equal to RF for balanced figure 8 handling in both turn directions.'
          : 'Stiffer than RF to resist body roll entering left turns on the oval.',
      },
      {
        parameter: 'springRF',
        label: 'Right Front Spring',
        value: springRF,
        unit: 'lbs/in',
        rangeLow: Math.round(base.front * 0.80 / 25) * 25,
        rangeHigh: Math.round(base.front * 1.10 / 25) * 25,
        explanation: isF8
          ? 'Equal to LF for balanced figure 8 handling.'
          : 'Softer than LF to allow weight transfer to the outside (right) on left turns.',
      },
      {
        parameter: 'springLR',
        label: 'Left Rear Spring',
        value: springLR,
        unit: 'lbs/in',
        rangeLow: Math.round(base.rear * 0.80 / 25) * 25,
        rangeHigh: Math.round(base.rear * 1.20 / 25) * 25,
        explanation: 'Softer rear springs allow more axle compliance over bumps and improve traction.',
      },
      {
        parameter: 'springRR',
        label: 'Right Rear Spring',
        value: springRR,
        unit: 'lbs/in',
        rangeLow: Math.round(base.rear * 0.80 / 25) * 25,
        rangeHigh: Math.round(base.rear * 1.25 / 25) * 25,
        explanation: isF8
          ? 'Equal to LR for balanced figure 8 handling.'
          : 'Slightly stiffer than LR to plant the RR on corner exit.',
      },
    ],
    alignment: [
      {
        parameter: 'camberLF',
        label: 'Camber - Left Front',
        value: align.camberLF,
        unit: 'degrees',
        rangeLow: isF8 ? -3.0 : 1.0,
        rangeHigh: isF8 ? -1.0 : 5.0,
        explanation: isF8
          ? 'Negative camber keeps the tire flat during cornering. Equal on both sides for figure 8.'
          : 'Positive camber on LF brings the top of the tire outward — during a left turn, the body rolls right, which loads the LF and brings the tire perpendicular to the track.',
      },
      {
        parameter: 'camberRF',
        label: 'Camber - Right Front',
        value: align.camberRF,
        unit: 'degrees',
        rangeLow: isF8 ? -3.0 : -5.0,
        rangeHigh: isF8 ? -1.0 : -2.0,
        explanation: isF8
          ? 'Matches LF for symmetric figure 8 handling.'
          : 'Negative camber on the heavily loaded RF maximizes contact patch during left turns.',
      },
      {
        parameter: 'casterLF',
        label: 'Caster - Left Front',
        value: align.casterLF,
        unit: 'degrees',
        rangeLow: isF8 ? 2.5 : 1.0,
        rangeHigh: isF8 ? 5.0 : 3.0,
        explanation: isF8
          ? 'Equal caster both sides gives neutral steering feel in either direction.'
          : 'Less caster on LF creates a "caster split" — the car naturally wants to turn left, reducing steering effort.',
      },
      {
        parameter: 'casterRF',
        label: 'Caster - Right Front',
        value: align.casterRF,
        unit: 'degrees',
        rangeLow: isF8 ? 2.5 : 3.5,
        rangeHigh: isF8 ? 5.0 : 6.0,
        explanation: isF8
          ? 'Matches LF for symmetric figure 8 handling.'
          : 'More caster on RF adds dynamic camber gain during left turns and helps the car turn in.',
      },
      {
        parameter: 'toeFront',
        label: 'Front Toe (total)',
        value: `${Math.abs(align.toeFront * 16)}/16" toe-out`,
        unit: '',
        explanation: isF8
          ? 'Minimal toe-out (1/16") for stability through the crossover intersection while still helping turn-in.'
          : 'More toe-out (3/16") helps aggressive turn-in for left turns. Too much creates tire drag on the straights.',
      },
    ],
    tirePressures: [
      {
        parameter: 'pressureLF',
        label: 'Left Front',
        value: isF8 ? Math.round(pFrontMid) : Math.round(pFrontMid - 1),
        unit: 'psi',
        rangeLow: pressures.front[0],
        rangeHigh: pressures.front[1],
        explanation: isF8
          ? `Equal pressure L/R for figure 8. Adjust based on tire temp: hot edges = too low, hot center = too high.`
          : `Lower than RF — lighter load on the inside tire during left turns. Range: ${pressures.front[0]}-${pressures.front[1]} psi for ${condition} conditions.`,
      },
      {
        parameter: 'pressureRF',
        label: 'Right Front',
        value: Math.round(pFrontMid),
        unit: 'psi',
        rangeLow: pressures.front[0],
        rangeHigh: pressures.front[1],
        explanation: `Heavily loaded outside front tire on left turns. Range: ${pressures.front[0]}-${pressures.front[1]} psi for ${condition} conditions.`,
      },
      {
        parameter: 'pressureLR',
        label: 'Left Rear',
        value: isF8 ? Math.round(pRearMid) : Math.round(pRearMid - 1),
        unit: 'psi',
        rangeLow: pressures.rear[0],
        rangeHigh: pressures.rear[1],
        explanation: `Rear pressures slightly lower than front for more rear grip. Range: ${pressures.rear[0]}-${pressures.rear[1]} psi for ${condition} conditions.`,
      },
      {
        parameter: 'pressureRR',
        label: 'Right Rear',
        value: Math.round(pRearMid),
        unit: 'psi',
        rangeLow: pressures.rear[0],
        rangeHigh: pressures.rear[1],
        explanation: `Drive tire on exit — key for forward bite. Lower pressure = more contact patch but risk of rollover. Range: ${pressures.rear[0]}-${pressures.rear[1]} psi for ${condition} conditions.`,
      },
    ],
    weight: [
      {
        parameter: 'totalWeight',
        label: 'Total Weight (with driver)',
        value: car.class === 'ironman-f8' ? '3,300 lbs min' : '3,300 lbs min',
        unit: '',
        rangeLow: 3300,
        rangeHigh: 3600,
        explanation: 'Minimum weight per rules. Lighter is generally faster but you must make minimum. Max 3,600 lbs in features.',
      },
      {
        parameter: 'crossWeight',
        label: 'Cross-Weight %',
        value: isF8 ? '50.0%' : '50.0-52.0%',
        unit: '',
        rangeLow: 48,
        rangeHigh: 54,
        explanation: isF8
          ? 'Target 50% cross-weight for neutral figure 8 handling. Cross-weight = (RF + LR) / Total × 100.'
          : 'Higher cross-weight (51-52%) loads the RF and LR, freeing the car on corner entry. Lower loads the RR for more bite.',
      },
      {
        parameter: 'leftPct',
        label: 'Left Side %',
        value: isF8 ? '50%' : '55%',
        unit: '',
        rangeLow: isF8 ? 49 : 54,
        rangeHigh: isF8 ? 51 : 56,
        explanation: isF8
          ? 'Near 50% for equal handling in both directions.'
          : '55% left per rules. More left-side weight helps the car rotate through left turns.',
      },
      {
        parameter: 'rearPct',
        label: 'Rear %',
        value: isF8 ? '50%' : '49%',
        unit: '',
        rangeLow: isF8 ? 48 : 48,
        rangeHigh: isF8 ? 52 : 50,
        explanation: isF8
          ? 'Near 50% for balanced braking and acceleration.'
          : '49% rear per rules. More rear weight improves drive off the corners.',
      },
    ],
    other: [
      {
        parameter: 'swayBar',
        label: 'Front Sway Bar',
        value: isF8 ? 'Remove or small symmetric' : 'Remove or small',
        unit: '',
        explanation: 'Most dirt/short track racers remove the sway bar to reduce understeer (pushing). If kept, use stock style per rules. Figure 8: keep arms symmetric.',
      },
      {
        parameter: 'shocks',
        label: 'Shocks',
        value: 'Economy non-adjustable (<$125 each)',
        unit: '',
        explanation: 'Rules require non-adjustable, non-rebuildable, steel body economy shocks under $125 each from Speedway Motors. One per wheel, stock locations.',
      },
      {
        parameter: 'rearEnd',
        label: 'Rear Differential',
        value: 'Limited slip (rules allow)',
        unit: '',
        explanation: 'Limited slip diff provides better traction than open diff. Ford 9" permitted per rules. Spool/mini-spool gives maximum traction but less turning ability.',
      },
    ],
  }
}
