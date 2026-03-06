import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { getSetupRecommendations } from '@/data/setup/recommendations'
import { getTireCompoundByLabel, getEffectivePressureRange } from '@/data/setup/tires'
import { getDivisionById } from '@/data/divisions/registry'
import type { Car, TrackCondition, RaceType, RaceClass } from '@/lib/types'

export const maxDuration = 60

const anthropic = new Anthropic()

// ---------------------------------------------------------------------------
// System prompt — full crew chief knowledge base
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are a world-class short track racing crew chief with 30+ years of hands-on experience setting up stock cars for figure-8 and oval racing at 1/5 to 1/2 mile tracks on dirt, asphalt, concrete, and mixed surfaces.

You don't guess. You reason from first principles of vehicle dynamics and decades of seat-of-the-pants experience. When you give a number, it's the number you'd put on the car before rolling it off the trailer.

## TIRE PRESSURE — your most important call

Tire pressure is the single biggest setup lever. Get this wrong and nothing else matters.

**Surface type determines the pressure window:**
- DIRT tires (Hoosier D-series, American Racer, TCT Recap): 9–16 psi. Low pressure maximizes the contact patch on a loose surface. The dirt cushions lateral loads so bead unseating risk is lower.
- ASPHALT / MIXED / CONCRETE tires (Hoosier F-series, G60 on hard surfaces, DOT Street): 18–36 psi. Hard surfaces transmit lateral and longitudinal forces directly into the tire. Below ~18 psi the sidewall flexes excessively, generating destructive heat, killing lap times, and risking bead unseating under torque from a V8.
- The Hoosier G60 is a DUAL-SURFACE tire. On dirt it runs 12–16 psi. On asphalt/mixed/concrete it runs 22–28 psi. These are completely different operating windows. The track surface — not the tire name — determines which window to use.
- DOT street tires run higher pressures than racing slicks on any surface (24–36 psi) because the stiffer sidewall construction requires it.

**Physics of pressure selection within the window:**
- Lower pressure = more contact patch = more mechanical grip, but more sidewall flex = more heat = faster wear.
- Higher pressure = less contact patch = less grip, but sharper steering response and less rolling resistance.
- Temperature effect: ~1 psi per 10°F ambient change. Hot day = start lower, the tire will build pressure with heat. Cold night = start higher.
- Humidity/dew point: tight dew point spread (<15°F) = moisture on the surface = less grip = err toward lower pressures for more contact patch.
- Rain on hard surfaces: drop 1–2 psi from dry baseline. More contact patch helps with water displacement. But don't go below the surface minimum.

**Unsafe pressure limits (physics-based):**
- Below 8 psi on any tire: risk of bead unseating under any significant torque or lateral load. Never recommend this.
- Below 18 psi on asphalt/mixed/concrete with a racing tire under V8 torque: the sidewall cannot support the lateral loads. The tire overheats, the bead can unseat mid-corner. This is a safety issue.
- DOT street tires below 22 psi: the stiff sidewall construction requires higher minimum pressures.
- Above 40 psi on any racing tire: risk of blow-out, especially on rough surfaces with curbing.

## SPRINGS

Spring rates are determined by car weight, suspension geometry, and track conditions.

**Selection principles:**
- The spring's job is to control body roll and weight transfer rate. Stiffer = faster weight transfer = more responsive but less forgiving.
- Front springs: primarily control turn-in response. Stiffer front = more initial turn-in but potential for push (understeer) mid-corner.
- Rear springs: control rear traction and forward bite on exit. Softer rear = more rear grip but potential for loose (oversteer) condition.
- Heavy/tacky track conditions (more grip): stiffen springs 5–10% to resist the extra body roll forces.
- Dry/slick conditions (less grip): soften springs 5–10% to increase mechanical grip and let the suspension work.

**Cross-parameter interaction with tire pressure:**
- The tire acts as a spring in series with the coil spring. Higher tire pressure = stiffer effective suspension = can soften the coil spring slightly. Rule of thumb: ±2 psi change → ∓25 lbs/in spring adjustment.

## ALIGNMENT

**Figure-8 (symmetric — the car turns BOTH directions):**
- Camber: Equal negative camber both sides, typically -1.5° to -2.5°. This keeps the outside tire's contact patch flat during cornering in either direction.
- Caster: Equal both sides, typically 3.0° to 4.0°. Equal caster gives neutral steering feel turning left or right.
- Toe: Slight toe-out (1/16") for turn-in response. Too much creates drag on the straights.
- ALL values must be symmetric L/R. If you recommend different L/R values for a figure-8, you're wrong.

**Oval (asymmetric — left turns only):**
- Camber LF: Positive (+1.5° to +3.0°). Body roll during left turns loads the LF and brings the tire perpendicular to the track.
- Camber RF: Negative (-2.5° to -4.0°). The heavily loaded outside tire needs static negative camber to stay flat under load.
- Caster split: Less caster LF (1.0°–2.5°), more caster RF (3.5°–5.5°). This creates a natural pull to the left, reducing steering effort.
- Toe: More toe-out (1/8" to 3/16") for aggressive turn-in.

## WEIGHT DISTRIBUTION

- Figure-8: Target 50% cross-weight, 50% left, 50% rear. Symmetric handling requires symmetric weight.
- Oval: Cross-weight 50–52% (RF+LR diagonal). Left side 54–56%. Rear 48–50%. More left weight helps rotate through left turns. Higher cross-weight frees the car on entry.

## WEATHER REASONING

When weather data is provided, use it to fine-tune within the setup window:
- Temperature drives tire pressure starting point (hotter = start lower, tires build pressure)
- Dew point spread drives grip expectation (tight spread = slick surface)
- Barometric pressure affects engine power (higher = more power = can run slightly stiffer springs)
- Wind affects straightaway stability (strong crosswind = consider slightly more caster for directional stability)
- If race-time forecast differs from current conditions, optimize for race time. The car needs to be fast when the green flag drops.

Always respond with valid JSON matching the exact schema requested. Be specific with numbers, not ranges. Every recommendation should have a concise explanation (1-2 sentences max) that shows your reasoning.`

interface SetupRequest {
  car: {
    id: string
    name: string
    year: number
    make: string
    model: string
    class?: string
    weight: number
    wheelbase: number
    frontSuspension: string
    rearSuspension: string
    engine: {
      displacement: number
      block: string
    }
  }
  track?: {
    name: string
    length: string
    surface: string
    banking: number
  }
  condition: string
  raceType: string
  currentSetup?: Record<string, unknown>
  tireCompound?: string
  lockedValues?: Record<string, number>
  weather?: {
    temp: number
    humidity: number
    dewPoint: number
    pressure: number
    windSpeed: number
    windDirection: number
    condition: string
  }
  raceTimeWeather?: {
    temp: number
    humidity: number
    dewPoint: number
    pressure: number
    windSpeed: number
    windDirection: number
    precipProbability: number
    condition: string
    raceTime: string
  }
}

// ---------------------------------------------------------------------------
// Physics-based safety limits — these are real-world danger thresholds,
// not artificial clamps. Below these values, equipment fails.
// ---------------------------------------------------------------------------
const SAFETY_LIMITS = {
  tire: {
    // Absolute minimum psi before bead unseating risk under torque/lateral load
    absoluteMinPsi: 8,
    // Surface-aware minimums — hard surfaces transmit more force into the sidewall
    minPsiByTrackSurface: {
      dirt: 8,
      asphalt: 18,
      concrete: 18,
      mixed: 18,
    } as Record<string, number>,
    // DOT street tires have stiffer sidewalls that need higher minimums
    minPsiDotStreet: 22,
    // Blow-out risk ceiling
    absoluteMaxPsi: 40,
  },
}

export async function POST(request: NextRequest) {
  // Verify the user is authenticated and Pro
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Get auth token from request
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Verify the JWT and get the user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check Pro subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .limit(1)
    .maybeSingle()

  if (!subscription) {
    return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 })
  }

  // Rate limit: 10 requests per hour per user
  const RATE_LIMIT = 10
  const WINDOW_MS = 60 * 60 * 1000 // 1 hour
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString()

  const { count } = await supabase
    .from('ai_usage_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', windowStart)

  if ((count ?? 0) >= RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. You can make 10 AI requests per hour.' },
      { status: 429 }
    )
  }

  // Log this request
  await supabase
    .from('ai_usage_log')
    .insert({ user_id: user.id, endpoint: 'setup/recommend' })

  const body: SetupRequest = await request.json()

  // --- Resolve context for the prompt ---
  const condition = (body.condition || 'moderate') as TrackCondition
  const raceType = (body.raceType || 'figure-8') as RaceType
  const trackSurface = body.track?.surface
  const tireCompound = body.tireCompound
    ? getTireCompoundByLabel(body.tireCompound)
    : undefined

  if (body.tireCompound && !tireCompound) {
    console.warn(`[setup/recommend] Unknown tire compound label: "${body.tireCompound}"`)
  }

  // Get the deterministic engine's recommendations for reference ranges
  const carForRecs = { ...body.car, class: body.car.class || 'ironman-f8' } as unknown as Car
  const detRecs = getSetupRecommendations(carForRecs, condition, raceType, tireCompound, trackSurface)

  // Build reference ranges string — educational context, not hard constraints
  const refRanges = [
    ...detRecs.springs,
    ...detRecs.alignment.filter(p => typeof p.rangeLow === 'number'),
    ...detRecs.tirePressures,
  ].filter(p => typeof p.rangeLow === 'number' && typeof p.rangeHigh === 'number')
    .map(p => `- ${p.label}: ${p.rangeLow}–${p.rangeHigh} ${p.unit}`)
    .join('\n')

  // Build tire compound context with physics reasoning
  let tireContext = ''
  if (tireCompound && trackSurface) {
    const effRange = getEffectivePressureRange(tireCompound, trackSurface)
    const isHardSurface = trackSurface === 'asphalt' || trackSurface === 'concrete' || trackSurface === 'mixed'
    const isDotStreet = tireCompound.id === 'dot-street'
    const isG60 = tireCompound.id === 'hoosier-g60'

    let compoundNotes = ''
    if (isG60 && isHardSurface) {
      compoundNotes = `The G60 is a dual-surface bias-ply tire. On this ${trackSurface} surface it operates in its ASPHALT pressure window (${effRange.front[0]}–${effRange.front[1]} psi front, ${effRange.rear[0]}–${effRange.rear[1]} psi rear). The compound hardens below ~20 psi and loses grip on hard surfaces. Do NOT use dirt pressures (12–16 psi) — at those pressures on ${trackSurface}, the sidewall flexes destructively under V8 torque and lateral load.`
    } else if (isG60 && !isHardSurface) {
      compoundNotes = `The G60 on dirt runs in its low-pressure window (${effRange.front[0]}–${effRange.front[1]} psi front, ${effRange.rear[0]}–${effRange.rear[1]} psi rear). The soft compound conforms to the dirt surface best at low pressure. The dirt cushions lateral loads so the lower pressures are safe.`
    } else if (isDotStreet) {
      compoundNotes = `DOT street tires have stiff radial sidewall construction requiring higher pressures (${effRange.front[0]}–${effRange.front[1]} psi front, ${effRange.rear[0]}–${effRange.rear[1]} psi rear). Below 22 psi the sidewall cannot support the carcass properly.`
    } else if (isHardSurface) {
      compoundNotes = `${body.tireCompound} on ${trackSurface} surface: operating range ${effRange.front[0]}–${effRange.front[1]} psi front, ${effRange.rear[0]}–${effRange.rear[1]} psi rear. Hard surfaces require higher pressures to prevent excessive sidewall flex and heat buildup.`
    } else {
      compoundNotes = `${body.tireCompound} on dirt: operating range ${effRange.front[0]}–${effRange.front[1]} psi front, ${effRange.rear[0]}–${effRange.rear[1]} psi rear. Lower pressures maximize contact patch on the loose surface.`
    }

    tireContext = `
**Tire Compound Details:**
${compoundNotes}`
  }

  // Build wet weather context
  let wetContext = ''
  const isHardSurface = trackSurface === 'asphalt' || trackSurface === 'concrete' || trackSurface === 'mixed'
  const precipProb = body.raceTimeWeather?.precipProbability ?? 0
  const weatherCond = (body.raceTimeWeather?.condition ?? body.weather?.condition ?? '').toLowerCase()
  const isWet = precipProb > 30 || weatherCond.includes('rain') || weatherCond.includes('drizzle') || weatherCond.includes('shower')

  if (isHardSurface && isWet) {
    wetContext = `
**Wet Weather Alert:** Rain probability ${precipProb}%. On wet ${trackSurface}, increase contact patch by dropping pressures 1–2 psi from dry baseline. Soften front springs ~5% for mechanical grip. Consider 0.5° more negative camber to compensate for reduced lateral grip. The surface will be slick — prioritize stability over outright speed.`
  }

  // Build class rules context
  let rulesContext = ''
  const carClass = body.car.class as RaceClass | undefined
  if (carClass) {
    const division = getDivisionById(carClass)
    if (division) {
      const setupCategories = ['weight', 'suspension', 'tires']
      const relevantRules = division.rules.filter(r => setupCategories.includes(r.category))
      if (relevantRules.length > 0) {
        const ruleLines = relevantRules.map(r => `  [${r.number}] ${r.text}`).join('\n')
        rulesContext = `
**Class Rules (${division.name}):**
${ruleLines}
Weight: min ${division.minWeightLbs} lbs, max ${division.maxWeightLbs} lbs${division.minLeftPct ? `. Min left %: ${division.minLeftPct}%` : ''}${division.minRearPct ? `. Min rear %: ${division.minRearPct}%` : ''}`
      }
    }
  }

  // Build the user prompt
  const userPrompt = `Set up this car for tonight:

**Car:** ${body.car.year} ${body.car.make} ${body.car.model}
- Weight: ${body.car.weight} lbs
- Wheelbase: ${body.car.wheelbase}"
- Front suspension: ${body.car.frontSuspension}
- Rear suspension: ${body.car.rearSuspension}
- Engine: ${body.car.engine.displacement}ci ${body.car.engine.block}

**Track:** ${body.track ? `${body.track.name} (${body.track.length} mi, ${body.track.surface} surface, ${body.track.banking}° banking)` : 'Generic short track (3/8 mi, mixed surface, 6° banking)'}
${body.track?.surface ? `Surface type: ${body.track.surface}${body.track.surface === 'mixed' ? ' (asphalt straightaways with concrete corners — treat as a hard surface for tire pressure purposes)' : ''}` : ''}

**Conditions:** ${body.condition}
**Race Type:** ${body.raceType}${body.raceType === 'figure-8' ? ' — symmetric setup required (equal L/R on camber, caster, springs, pressures). The car turns both directions through the crossover.' : ' — asymmetric setup (biased for left turns).'}
${body.tireCompound ? `**Tire:** ${body.tireCompound}` : ''}${tireContext}${wetContext}${rulesContext}
${refRanges ? `
**Reference ranges from our data (typical operating windows for this car/tire/surface combo):**
${refRanges}
Use these as a guide — your expertise may lead you slightly outside these windows with good reason, but they represent the normal operating envelope.` : ''}
${body.weather ? `
**Current Weather at Track:**
- Temperature: ${body.weather.temp}°F
- Humidity: ${body.weather.humidity}%
- Dew Point: ${body.weather.dewPoint}°F (spread: ${body.weather.temp - body.weather.dewPoint}°F)
- Barometric Pressure: ${body.weather.pressure} inHg
- Wind: ${body.weather.windSpeed} mph from ${body.weather.windDirection}°
- Conditions: ${body.weather.condition}` : ''}
${body.raceTimeWeather ? `
**Forecast at Race Time (${new Date(body.raceTimeWeather.raceTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}):**
- Temperature: ${body.raceTimeWeather.temp}°F
- Humidity: ${body.raceTimeWeather.humidity}%
- Dew Point: ${body.raceTimeWeather.dewPoint}°F (spread: ${body.raceTimeWeather.temp - body.raceTimeWeather.dewPoint}°F)
- Barometric Pressure: ${body.raceTimeWeather.pressure} inHg
- Wind: ${body.raceTimeWeather.windSpeed} mph from ${body.raceTimeWeather.windDirection}°
- Precipitation: ${body.raceTimeWeather.precipProbability}%
- Conditions: ${body.raceTimeWeather.condition}
Set up for race-time conditions, not current. The car needs to be fast when the green flag drops.` : ''}

${body.currentSetup ? `**Current Setup (reference):** ${JSON.stringify(body.currentSetup)}` : ''}
${body.lockedValues && Object.keys(body.lockedValues).length > 0 ? `
**LOCKED VALUES (use these exact values, do not change them):**
${Object.entries(body.lockedValues).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
Optimize all other parameters around these locked values.` : ''}

Respond with JSON in this exact format:
{
  "springs": {
    "springLF": { "value": <number>, "explanation": "<string>" },
    "springRF": { "value": <number>, "explanation": "<string>" },
    "springLR": { "value": <number>, "explanation": "<string>" },
    "springRR": { "value": <number>, "explanation": "<string>" }
  },
  "alignment": {
    "camberLF": { "value": <number>, "explanation": "<string>" },
    "camberRF": { "value": <number>, "explanation": "<string>" },
    "casterLF": { "value": <number>, "explanation": "<string>" },
    "casterRF": { "value": <number>, "explanation": "<string>" },
    "toeFront": { "value": <number in inches>, "explanation": "<string>" }
  },
  "tirePressures": {
    "pressureLF": { "value": <number>, "explanation": "<string>" },
    "pressureRF": { "value": <number>, "explanation": "<string>" },
    "pressureLR": { "value": <number>, "explanation": "<string>" },
    "pressureRR": { "value": <number>, "explanation": "<string>" }
  },
  "weight": {
    "crossWeight": { "value": <number>, "explanation": "<string>" },
    "leftPct": { "value": <number>, "explanation": "<string>" },
    "rearPct": { "value": <number>, "explanation": "<string>" }
  },
  "other": {
    "swayBar": { "value": "<string>", "explanation": "<string>" },
    "gearRatio": { "value": "<string>", "explanation": "<string>" }
  },
  "summary": "<2-3 sentence overall strategy summary>"
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = response.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Extract JSON from the response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    const recommendations = JSON.parse(jsonMatch[0])

    // --- Physics-based safety check (not artificial clamping) ---
    // Only catch values that would damage equipment or be dangerous.
    // The prompt should produce correct values — this is a last-resort safety net.
    const pressureSection = recommendations.tirePressures
    if (pressureSection && typeof pressureSection === 'object') {
      const surfaceMinPsi = trackSurface
        ? (SAFETY_LIMITS.tire.minPsiByTrackSurface[trackSurface] ?? SAFETY_LIMITS.tire.absoluteMinPsi)
        : SAFETY_LIMITS.tire.absoluteMinPsi
      const effectiveMinPsi = tireCompound?.id === 'dot-street'
        ? Math.max(surfaceMinPsi, SAFETY_LIMITS.tire.minPsiDotStreet)
        : surfaceMinPsi
      const maxPsi = SAFETY_LIMITS.tire.absoluteMaxPsi

      for (const [key, rec] of Object.entries(pressureSection) as [string, { value: unknown; explanation: string }][]) {
        if (!rec || typeof rec !== 'object') continue
        const psi = typeof rec.value === 'number' ? rec.value : Number(rec.value)
        if (isNaN(psi)) continue

        if (psi < effectiveMinPsi) {
          rec.value = effectiveMinPsi
          rec.explanation = `[Safety: ${psi} psi is below the safe minimum of ${effectiveMinPsi} psi for ${trackSurface || 'this'} surface — risk of bead unseating under load. Corrected to ${effectiveMinPsi} psi.] ${rec.explanation}`
        } else if (psi > maxPsi) {
          rec.value = maxPsi
          rec.explanation = `[Safety: ${psi} psi exceeds safe maximum of ${maxPsi} psi — blow-out risk. Corrected to ${maxPsi} psi.] ${rec.explanation}`
        }
      }
    }

    return NextResponse.json(recommendations)
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err)
    const errName = err instanceof Error ? err.constructor.name : 'Unknown'
    console.error('AI setup recommendation error:', JSON.stringify({
      name: errName,
      message: errMsg,
      status: (err as { status?: number })?.status,
      statusText: (err as { statusText?: string })?.statusText,
      error: (err as { error?: unknown })?.error,
      stack: err instanceof Error ? err.stack?.split('\n').slice(0, 3).join(' | ') : undefined,
    }))
    return NextResponse.json(
      { error: 'AI recommendation failed', detail: `${errName}: ${errMsg}` },
      { status: 500 }
    )
  }
}
