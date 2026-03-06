import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { getSetupRecommendations } from '@/data/setup/recommendations'
import { getTireCompoundByLabel, getEffectivePressureRange } from '@/data/setup/tires'
import { getDivisionById } from '@/data/divisions/registry'
import type { Car, TrackCondition, RaceType, RaceClass } from '@/lib/types'

export const maxDuration = 60

const anthropic = new Anthropic()

const SYSTEM_PROMPT = `You are an expert short track racing crew chief with 30+ years of experience setting up stock cars, modifieds, and compact cars. You specialize in figure-8 and oval racing at tracks between 1/5 mile and 1/2 mile on dirt, asphalt, concrete, and mixed surfaces.

When given a car's specifications, track information, and conditions, you provide specific, actionable setup recommendations with brief explanations of WHY each value is recommended.

You understand:
- Spring rate selection based on car weight, suspension geometry, and track conditions
- Alignment (camber, caster, toe) for different racing formats
- Tire pressure management — CRITICAL: tire pressures vary dramatically by surface type. Mixed/asphalt/concrete surfaces require significantly higher pressures (20-30+ psi) than dirt surfaces (10-16 psi). Always check the provided valid ranges.
- Weight distribution and cross-weight percentage
- How track conditions (heavy/tacky/moderate/dry/slick) affect setup choices
- The difference between figure-8 (symmetric) and oval (asymmetric) setups
- How weather affects setup: temperature affects tire pressures (~1 psi per 10°F), humidity/dew point affects track grip, barometric pressure affects engine performance
- Wet weather on asphalt/mixed: reduce pressures slightly (1-2 psi) for more contact patch, soften springs for mechanical grip

IMPORTANT: When valid parameter ranges are provided, you MUST keep your recommendations within those ranges. These ranges come from the tire manufacturer's specifications and track-specific data.

Always respond with valid JSON matching the exact schema requested. Be specific with numbers, not ranges. Every recommendation should have a concise explanation (1-2 sentences max).`

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

  // --- Resolve ranges from the deterministic engine ---
  const condition = (body.condition || 'moderate') as TrackCondition
  const raceType = (body.raceType || 'figure-8') as RaceType
  const trackSurface = body.track?.surface
  const tireCompound = body.tireCompound
    ? getTireCompoundByLabel(body.tireCompound)
    : undefined

  // Build a minimal Car-shaped object for getSetupRecommendations (it only uses car.id and car.class)
  const carForRecs = { ...body.car, class: body.car.class || 'ironman-f8' } as unknown as Car
  const detRecs = getSetupRecommendations(carForRecs, condition, raceType, tireCompound, trackSurface)

  // Collect all numeric parameter ranges for prompt context and post-processing clamping
  const allParams = [
    ...detRecs.springs,
    ...detRecs.alignment.filter(p => typeof p.rangeLow === 'number'),
    ...detRecs.tirePressures,
    ...detRecs.weight.filter(p => typeof p.rangeLow === 'number'),
  ].filter(p => typeof p.rangeLow === 'number' && typeof p.rangeHigh === 'number')

  const rangeLines = allParams
    .map(p => `- ${p.parameter}: ${p.rangeLow}–${p.rangeHigh} ${p.unit}`)
    .join('\n')

  // Build tire pressure context — the most critical range info
  let tirePressureContext = ''
  if (tireCompound && trackSurface) {
    const effRange = getEffectivePressureRange(tireCompound, trackSurface)
    const surfaceLabel = (trackSurface === 'asphalt' || trackSurface === 'concrete' || trackSurface === 'mixed')
      ? 'asphalt/mixed (higher pressures required)'
      : 'dirt (lower pressures)'
    tirePressureContext = `
**TIRE PRESSURE RANGES — CRITICAL (do not go outside these bounds):**
Tire: ${body.tireCompound} on ${trackSurface} surface (${surfaceLabel})
Front pressure range: ${effRange.front[0]}–${effRange.front[1]} psi
Rear pressure range: ${effRange.rear[0]}–${effRange.rear[1]} psi
You MUST recommend pressures within these ranges. Do NOT use dirt pressures on asphalt/mixed surfaces.`
  }

  // Build wet weather guidance for asphalt/mixed surfaces
  let wetWeatherContext = ''
  const isHardSurface = trackSurface === 'asphalt' || trackSurface === 'concrete' || trackSurface === 'mixed'
  const precipProb = body.raceTimeWeather?.precipProbability ?? 0
  const weatherCond = (body.raceTimeWeather?.condition ?? body.weather?.condition ?? '').toLowerCase()
  const isWetCondition = precipProb > 30 || weatherCond.includes('rain') || weatherCond.includes('drizzle') || weatherCond.includes('shower')

  if (isHardSurface && isWetCondition) {
    wetWeatherContext = `
**WET WEATHER ADJUSTMENT (asphalt/mixed surface):**
Rain probability: ${precipProb}%. On wet asphalt/mixed, reduce tire pressures 1–2 psi from the dry baseline (but stay within the valid range above) to increase contact patch for better water displacement.
Consider softening front springs 5–10% for more mechanical grip on the slick surface.
Add 0.5° additional negative camber on loaded corners to compensate for reduced lateral grip.`
  }

  // Build applicable class rules context
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
**CLASS RULES (${division.name}) — your setup must comply with these:**
${ruleLines}
Min weight: ${division.minWeightLbs} lbs${division.minLeftPct ? `, Min left %: ${division.minLeftPct}%` : ''}${division.minRearPct ? `, Min rear %: ${division.minRearPct}%` : ''}`
      }
    }
  }

  const userPrompt = `Generate an optimized setup for this car and conditions:

**Car:** ${body.car.year} ${body.car.make} ${body.car.model}
- Weight: ${body.car.weight} lbs
- Wheelbase: ${body.car.wheelbase}"
- Front suspension: ${body.car.frontSuspension}
- Rear suspension: ${body.car.rearSuspension}
- Engine: ${body.car.engine.displacement}ci ${body.car.engine.block}

**Track:** ${body.track ? `${body.track.name} (${body.track.length} mi, ${body.track.surface} surface, ${body.track.banking}° banking)` : 'Generic short track (3/8 mi, mixed surface, 6° banking)'}

**Conditions:** ${body.condition}
**Race Type:** ${body.raceType}
${body.tireCompound ? `**Tire Compound:** ${body.tireCompound}` : ''}
${tirePressureContext}
${wetWeatherContext}
${rulesContext}
${rangeLines ? `
**VALID PARAMETER RANGES (stay within these bounds):**
${rangeLines}` : ''}
${body.weather ? `
**Current Weather at Track:**
- Temperature: ${body.weather.temp}°F
- Humidity: ${body.weather.humidity}%
- Dew Point: ${body.weather.dewPoint}°F (spread: ${body.weather.temp - body.weather.dewPoint}°)
- Barometric Pressure: ${body.weather.pressure} inHg
- Wind: ${body.weather.windSpeed} mph from ${body.weather.windDirection}°
- Conditions: ${body.weather.condition}
Use this real-time weather data to fine-tune tire pressures and overall setup. High humidity/tight dew point spread means a slicker track surface. High barometric pressure generally means more engine power. Adjust accordingly.` : ''}
${body.raceTimeWeather ? `
**Forecast at Race Time (${new Date(body.raceTimeWeather.raceTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}):**
- Temperature: ${body.raceTimeWeather.temp}°F
- Humidity: ${body.raceTimeWeather.humidity}%
- Dew Point: ${body.raceTimeWeather.dewPoint}°F (spread: ${body.raceTimeWeather.temp - body.raceTimeWeather.dewPoint}°)
- Barometric Pressure: ${body.raceTimeWeather.pressure} inHg
- Wind: ${body.raceTimeWeather.windSpeed} mph from ${body.raceTimeWeather.windDirection}°
- Precipitation Probability: ${body.raceTimeWeather.precipProbability}%
- Conditions: ${body.raceTimeWeather.condition}
IMPORTANT: Optimize the setup for these RACE-TIME conditions, not current conditions. The car needs to be fast when the green flag drops. Set tire pressures for the expected race-time temperature, not current temp.` : ''}

${body.currentSetup ? `**Current Setup (for reference):** ${JSON.stringify(body.currentSetup)}` : ''}
${body.lockedValues && Object.keys(body.lockedValues).length > 0 ? `
**LOCKED VALUES (you MUST use these exact values, do not change them):**
${Object.entries(body.lockedValues).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
The user has locked these parameters. Use the exact values shown above and optimize all other parameters around them.` : ''}

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

    // --- Server-side clamping: enforce valid ranges before returning to client ---
    const rangeBoundsMap = new Map(
      allParams
        .filter((p): p is typeof p & { rangeLow: number; rangeHigh: number } =>
          typeof p.rangeLow === 'number' && typeof p.rangeHigh === 'number'
        )
        .map(p => [p.parameter, { low: p.rangeLow, high: p.rangeHigh }])
    )

    // Allow AI to exceed range by up to 5% of the span before hard-clamping
    const CLAMP_BUFFER_PCT = 0.05

    for (const section of [recommendations.springs, recommendations.alignment, recommendations.tirePressures, recommendations.weight]) {
      if (!section || typeof section !== 'object') continue
      for (const [key, rec] of Object.entries(section) as [string, { value: unknown; explanation: string }][]) {
        if (!rec || typeof rec !== 'object') continue
        const raw = typeof rec.value === 'number' ? rec.value : Number(rec.value)
        if (isNaN(raw)) continue
        const bounds = rangeBoundsMap.get(key)
        if (!bounds) continue
        const span = bounds.high - bounds.low
        const floor = bounds.low - span * CLAMP_BUFFER_PCT
        const ceil = bounds.high + span * CLAMP_BUFFER_PCT
        const clamped = Math.min(ceil, Math.max(floor, raw))
        if (clamped !== raw) {
          rec.value = Math.round(clamped * 100) / 100 // round to 2 decimal places
          rec.explanation = `[Adjusted from ${raw} to ${rec.value} — valid range is ${bounds.low}–${bounds.high}] ${rec.explanation}`
        }
      }
    }

    return NextResponse.json(recommendations)
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err)
    const errName = err instanceof Error ? err.constructor.name : 'Unknown'
    // Log detailed error info for debugging
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
