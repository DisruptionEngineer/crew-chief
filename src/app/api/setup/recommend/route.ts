import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

const anthropic = new Anthropic()

const SYSTEM_PROMPT = `You are an expert dirt track racing crew chief with 30+ years of experience setting up stock cars, modifieds, and compact cars for short track racing. You specialize in figure-8 and oval racing at tracks between 1/4 mile and 1/2 mile.

When given a car's specifications, track information, and conditions, you provide specific, actionable setup recommendations with brief explanations of WHY each value is recommended.

You understand:
- Spring rate selection based on car weight, suspension geometry, and track conditions
- Alignment (camber, caster, toe) for different racing formats
- Tire pressure management for dirt and asphalt surfaces
- Weight distribution and cross-weight percentage
- How track conditions (heavy/tacky/moderate/dry/slick) affect setup choices
- The difference between figure-8 (symmetric) and oval (asymmetric) setups
- How weather affects setup: temperature affects tire pressures (~1 psi per 10°F), humidity/dew point affects track grip, barometric pressure affects engine performance

Always respond with valid JSON matching the exact schema requested. Be specific with numbers, not ranges. Every recommendation should have a concise explanation (1-2 sentences max).`

interface SetupRequest {
  car: {
    id: string
    name: string
    year: number
    make: string
    model: string
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

  const userPrompt = `Generate an optimized setup for this car and conditions:

**Car:** ${body.car.year} ${body.car.make} ${body.car.model}
- Weight: ${body.car.weight} lbs
- Wheelbase: ${body.car.wheelbase}"
- Front suspension: ${body.car.frontSuspension}
- Rear suspension: ${body.car.rearSuspension}
- Engine: ${body.car.engine.displacement}ci ${body.car.engine.block}

**Track:** ${body.track ? `${body.track.name} (${body.track.length} mi, ${body.track.surface}, ${body.track.banking}° banking)` : 'Generic short track (3/8 mi, mixed surface, 6° banking)'}

**Conditions:** ${body.condition}
**Race Type:** ${body.raceType}
${body.tireCompound ? `**Tire Compound:** ${body.tireCompound}` : ''}
${body.weather ? `**Current Weather at Track:**
- Temperature: ${body.weather.temp}°F
- Humidity: ${body.weather.humidity}%
- Dew Point: ${body.weather.dewPoint}°F (spread: ${body.weather.temp - body.weather.dewPoint}°)
- Barometric Pressure: ${body.weather.pressure} inHg
- Wind: ${body.weather.windSpeed} mph from ${body.weather.windDirection}°
- Conditions: ${body.weather.condition}
Use this real-time weather data to fine-tune tire pressures and overall setup. High humidity/tight dew point spread means a slicker track surface. High barometric pressure generally means more engine power. Adjust accordingly.` : ''}
${body.raceTimeWeather ? `**Forecast at Race Time (${new Date(body.raceTimeWeather.raceTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}):**
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
    "crossWeightPct": { "value": <number>, "explanation": "<string>" },
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
      model: 'claude-sonnet-4-5-20250514',
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
    return NextResponse.json(recommendations)
  } catch (err) {
    console.error('AI setup recommendation error:', err)
    return NextResponse.json({ error: 'AI recommendation failed' }, { status: 500 })
  }
}
