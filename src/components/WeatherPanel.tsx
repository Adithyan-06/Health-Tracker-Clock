import React, { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Eye } from 'lucide-react'
import { fetchWeatherData, getWeatherDescription, WeatherData } from '../services/weatherService'

export function WeatherPanel() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateWeather = async () => {
      setLoading(true)
      const data = await fetchWeatherData()
      setWeather(data)
      setLoading(false)
    }

    updateWeather()
    // Update weather every 30 minutes
    const interval = setInterval(updateWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (code: number, isDay: boolean) => {
    if (code === 0) return isDay ? <Sun className="w-8 h-8 text-yellow-500" /> : <Sun className="w-8 h-8 text-blue-300" />
    if (code <= 3) return <Cloud className="w-8 h-8 text-gray-500" />
    if (code >= 61 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-500" />
    return <Cloud className="w-8 h-8 text-gray-400" />
  }

  const getHealthAlerts = (weather: WeatherData) => {
    const alerts = []
    
    if (weather.temperature > 30) {
      alerts.push({
        type: 'warning',
        message: 'High temperature today — stay hydrated and avoid prolonged sun exposure',
        icon: <Thermometer className="w-5 h-5 text-red-500" />
      })
    }
    
    if (weather.uv_index > 6) {
      alerts.push({
        type: 'warning',
        message: 'UV index is strong — limit sun exposure and use sunscreen',
        icon: <Eye className="w-5 h-5 text-orange-500" />
      })
    }
    
    if (weather.humidity < 30) {
      alerts.push({
        type: 'info',
        message: 'Low humidity detected — increase water intake to prevent dehydration',
        icon: <Droplets className="w-5 h-5 text-blue-500" />
      })
    }
    
    return alerts
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <p className="text-gray-500 text-center">Unable to load weather data</p>
      </div>
    )
  }

  const alerts = getHealthAlerts(weather)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Weather & Health Alerts</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getWeatherIcon(weather.weather_code, weather.is_day)}
          <div className="ml-4">
            <div className="text-3xl font-bold text-gray-800">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-gray-600">
              {getWeatherDescription(weather.weather_code)}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">
            Humidity: {weather.humidity}%
          </div>
          <div className="text-sm text-gray-600">
            UV Index: {weather.uv_index}
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-start ${
                alert.type === 'warning' 
                  ? 'bg-orange-50 border border-orange-200' 
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              {alert.icon}
              <p className="ml-3 text-sm text-gray-700">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}