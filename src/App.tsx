import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { Clock } from './components/Clock'
import { WeatherPanel } from './components/WeatherPanel'
import { HydrationTracker } from './components/HydrationTracker'
import { StretchReminder } from './components/StretchReminder'
import { SleepSchedule } from './components/SleepSchedule'
import { Settings } from './components/Settings'
import { fetchWeatherData, WeatherData } from './services/weatherService'
import { getPreferences } from './services/healthService'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [localPrefs, setLocalPrefs] = useLocalStorage('health-tracker-prefs', {
    hydration_threshold_temp: 25,
    hydration_threshold_humidity: 60,
    hydration_threshold_uv: 6,
    hydration_interval: 60,
    stretch_interval: 30,
    sleep_time: '22:00',
    wake_time: '06:00'
  })
  const [preferences, setPreferences] = useState(localPrefs)

  useEffect(() => {
    // Load initial preferences
    loadPreferences()
    
    // Load weather data
    loadWeather()
    
    // Request location permission for better weather accuracy
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(position.coords.latitude, position.coords.longitude)
        },
        () => {
          console.log('Location access denied, using default coordinates')
        }
      )
    }
  }, [])

  const loadPreferences = async () => {
    const serverPrefs = await getPreferences()
    if (serverPrefs) {
      const merged = { ...localPrefs, ...serverPrefs }
      setPreferences(merged)
      setLocalPrefs(merged)
    } else {
      setPreferences(localPrefs)
    }
  }

  const loadWeather = async (lat?: number, lon?: number) => {
    const weatherData = await fetchWeatherData(lat, lon)
    setWeather(weatherData)
  }

  const handlePreferencesUpdate = (newPrefs: any) => {
    setPreferences(newPrefs)
    setLocalPrefs(newPrefs)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Health Tracker</h1>
            <p className="text-gray-600 text-sm">Stay healthy with weather-smart reminders</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
            aria-label="Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content - Vertical Layout */}
        <div className="space-y-6">
          <Clock />
          <WeatherPanel />
          <HydrationTracker weather={weather} preferences={preferences} />
          <StretchReminder preferences={preferences} />
          <SleepSchedule preferences={preferences} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Weather data provided by Open-Meteo API</p>
          <p className="mt-2">Stay healthy and hydrated! 💪</p>
        </div>

        {/* Settings Modal */}
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onPreferencesUpdate={handlePreferencesUpdate}
        />
      </div>
    </div>
  )
}

export default App