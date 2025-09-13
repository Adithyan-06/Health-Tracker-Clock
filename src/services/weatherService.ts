export interface WeatherData {
  temperature: number
  humidity: number
  uv_index: number
  weather_code: number
  is_day: boolean
}

export async function fetchWeatherData(lat: number = 40.7128, lon: number = -74.0060): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code,is_day&timezone=auto`
    )
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed')
    }
    
    const data = await response.json()
    const current = data.current
    
    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      uv_index: current.uv_index || 0,
      weather_code: current.weather_code,
      is_day: current.is_day === 1
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    // Return default values on error
    return {
      temperature: 20,
      humidity: 50,
      uv_index: 3,
      weather_code: 0,
      is_day: true
    }
  }
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
  }
  return descriptions[code] || 'Unknown'
}