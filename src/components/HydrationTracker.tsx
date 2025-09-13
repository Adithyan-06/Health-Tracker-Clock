import React, { useState, useEffect } from 'react'
import { Droplets, Plus } from 'lucide-react'
import { logHydration, getTodayHydrationLogs } from '../services/healthService'
import { WeatherData } from '../services/weatherService'

interface HydrationTrackerProps {
  weather: WeatherData | null
  preferences: any
}

export function HydrationTracker({ weather, preferences }: HydrationTrackerProps) {
  const [todayIntake, setTodayIntake] = useState(0)
  const [lastReminder, setLastReminder] = useState<Date | null>(null)
  const [showReminder, setShowReminder] = useState(false)

  useEffect(() => {
    loadTodayIntake()
  }, [])

  useEffect(() => {
    if (!weather || !preferences) return

    const shouldRemind = () => {
      const now = new Date()
      const timeSinceLastReminder = lastReminder ? now.getTime() - lastReminder.getTime() : Infinity
      const intervalMs = preferences.hydration_interval * 60 * 1000

      if (timeSinceLastReminder < intervalMs) return false

      // Check weather conditions
      const tempThreshold = preferences.hydration_threshold_temp || 25
      const humidityThreshold = preferences.hydration_threshold_humidity || 60
      const uvThreshold = preferences.hydration_threshold_uv || 6

      return (
        weather.temperature > tempThreshold ||
        weather.humidity < humidityThreshold ||
        weather.uv_index > uvThreshold
      )
    }

    if (shouldRemind()) {
      setShowReminder(true)
      setLastReminder(new Date())
    }
  }, [weather, preferences, lastReminder])

  const loadTodayIntake = async () => {
    const logs = await getTodayHydrationLogs()
    const total = logs.reduce((sum, log) => sum + log.amount, 0)
    setTodayIntake(total)
  }

  const handleLogWater = async (amount: number) => {
    const success = await logHydration(
      amount, 
      weather?.temperature, 
      weather?.humidity
    )
    
    if (success) {
      setTodayIntake(prev => prev + amount)
      setShowReminder(false)
    }
  }

  const dismissReminder = () => {
    setShowReminder(false)
    setLastReminder(new Date())
  }

  const getHydrationStatus = () => {
    const dailyGoal = 2000 // 2L daily goal
    const percentage = Math.min((todayIntake / dailyGoal) * 100, 100)
    
    if (percentage < 30) return { color: 'text-red-500', message: 'Low hydration' }
    if (percentage < 70) return { color: 'text-yellow-500', message: 'Moderate hydration' }
    return { color: 'text-green-500', message: 'Good hydration' }
  }

  const status = getHydrationStatus()

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Droplets className="w-6 h-6 text-blue-500 mr-2" />
          Hydration Tracker
        </h2>
        <span className={`text-sm font-medium ${status.color}`}>
          {status.message}
        </span>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Today's intake</span>
          <span className="text-lg font-semibold text-gray-800">
            {todayIntake}ml / 2000ml
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((todayIntake / 2000) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {showReminder && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-center justify-between">
            <p className="text-blue-800 text-sm">
              Time to hydrate! Weather conditions suggest increased water intake.
            </p>
            <button
              onClick={dismissReminder}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[250, 500, 750].map((amount) => (
          <button
            key={amount}
            onClick={() => handleLogWater(amount)}
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <Plus className="w-5 h-5 text-gray-500 mb-1" />
            <span className="text-sm font-medium text-gray-700">{amount}ml</span>
          </button>
        ))}
      </div>
    </div>
  )
}