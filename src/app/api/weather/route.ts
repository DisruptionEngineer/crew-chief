import { NextRequest, NextResponse } from 'next/server'

export interface WeatherData {
  current: {
    temp: number          // °F
    humidity: number       // %
    dewPoint: number       // °F
    pressure: number       // inHg (barometric)
    windSpeed: number      // mph
    windDirection: number  // degrees
    windGusts: number      // mph
    cloudCover: number     // %
    feelsLike: number      // °F
    condition: string      // human-readable
  }
  hourly: {
    time: string
    temp: number
    humidity: number
    dewPoint: number
    pressure: number
    windSpeed: number
    windDirection: number
    precipProbability: number
    condition: string
  }[]
  location: {
    latitude: number
    longitude: number
    elevation: number
    timezone: string
  }
  fetchedAt: string
}

// Map WMO weather codes to human-readable conditions
function wmoToCondition(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly Cloudy'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 84) return 'Rain Showers'
  if (code <= 86) return 'Snow Showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

// Convert hPa to inHg
function hpaToInhg(hpa: number): number {
  return +(hpa * 0.02953).toFixed(2)
}

// Convert Celsius to Fahrenheit
function cToF(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

// Convert km/h to mph
function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })
  }

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', lat)
    url.searchParams.set('longitude', lng)
    url.searchParams.set('current', [
      'temperature_2m', 'relative_humidity_2m', 'dew_point_2m',
      'apparent_temperature', 'pressure_msl', 'cloud_cover',
      'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
      'weather_code',
    ].join(','))
    url.searchParams.set('hourly', [
      'temperature_2m', 'relative_humidity_2m', 'dew_point_2m',
      'pressure_msl', 'wind_speed_10m', 'wind_direction_10m',
      'precipitation_probability', 'weather_code',
    ].join(','))
    url.searchParams.set('temperature_unit', 'celsius')
    url.searchParams.set('wind_speed_unit', 'kmh')
    url.searchParams.set('forecast_days', '3')
    url.searchParams.set('timezone', 'auto')

    const res = await fetch(url.toString(), {
      next: { revalidate: 900 }, // Cache for 15 minutes
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Weather API error' }, { status: 502 })
    }

    const raw = await res.json()

    const weather: WeatherData = {
      current: {
        temp: cToF(raw.current.temperature_2m),
        humidity: Math.round(raw.current.relative_humidity_2m),
        dewPoint: cToF(raw.current.dew_point_2m),
        pressure: hpaToInhg(raw.current.pressure_msl),
        windSpeed: kmhToMph(raw.current.wind_speed_10m),
        windDirection: Math.round(raw.current.wind_direction_10m),
        windGusts: kmhToMph(raw.current.wind_gusts_10m),
        cloudCover: Math.round(raw.current.cloud_cover),
        feelsLike: cToF(raw.current.apparent_temperature),
        condition: wmoToCondition(raw.current.weather_code),
      },
      hourly: (raw.hourly.time as string[]).map((time: string, i: number) => ({
        time,
        temp: cToF(raw.hourly.temperature_2m[i]),
        humidity: Math.round(raw.hourly.relative_humidity_2m[i]),
        dewPoint: cToF(raw.hourly.dew_point_2m[i]),
        pressure: hpaToInhg(raw.hourly.pressure_msl[i]),
        windSpeed: kmhToMph(raw.hourly.wind_speed_10m[i]),
        windDirection: Math.round(raw.hourly.wind_direction_10m[i]),
        precipProbability: Math.round(raw.hourly.precipitation_probability[i]),
        condition: wmoToCondition(raw.hourly.weather_code[i]),
      })),
      location: {
        latitude: raw.latitude,
        longitude: raw.longitude,
        elevation: raw.elevation,
        timezone: raw.timezone,
      },
      fetchedAt: new Date().toISOString(),
    }

    return NextResponse.json(weather, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}
