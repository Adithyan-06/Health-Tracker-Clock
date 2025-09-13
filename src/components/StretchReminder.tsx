import React, { useState, useEffect } from 'react'
import { Activity, Clock, CheckCircle } from 'lucide-react'
import { logStretch, getTodayStretchLogs } from '../services/healthService'

interface StretchReminderProps {
  preferences: any
}

export function StretchReminder({ preferences }: StretchReminderProps) {
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null)
  const [showReminder, setShowReminder] = useState(false)
  const [todayStretches, setTodayStretches] = useState(0)
  const [currentStretch, setCurrentStretch] = useState<string | null>(null)
  const [stretchTimer, setStretchTimer] = useState(0)
  const [isStretching, setIsStretching] = useState(false)

  const stretchTypes = [
    { name: 'Neck & Shoulders', duration: 5, description: 'Gentle neck rolls and shoulder shrugs' },
    { name: 'Back Stretch', duration: 5, description: 'Seated spinal twist and back extension' },
    { name: 'Leg Stretch', duration: 5, description: 'Calf raises and leg extensions' },
    { name: 'Eye Rest', duration: 2, description: 'Look away from screen and blink exercises' },
    { name: 'Full Body', duration: 10, description: 'Complete stretching routine' }
  ]

  useEffect(() => {
    loadTodayStretches()
    setupReminder()
  }, [preferences])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStretching && stretchTimer > 0) {
      interval = setInterval(() => {
        setStretchTimer(prev => prev - 1)
      }, 1000)
    } else if (stretchTimer === 0 && isStretching) {
      completeStretch()
    }
    return () => clearInterval(interval)
  }, [isStretching, stretchTimer])

  const loadTodayStretches = async () => {
    const logs = await getTodayStretchLogs()
    setTodayStretches(logs.length)
  }

  const setupReminder = () => {
    if (!preferences?.stretch_interval) return

    const now = new Date()
    const intervalMs = preferences.stretch_interval * 60 * 1000
    const nextReminder = new Date(now.getTime() + intervalMs)
    setNextReminderTime(nextReminder)

    const timeUntilReminder = intervalMs
    setTimeout(() => {
      setShowReminder(true)
    }, timeUntilReminder)
  }

  const startStretch = (stretch: typeof stretchTypes[0]) => {
    setCurrentStretch(stretch.name)
    setStretchTimer(stretch.duration * 60) // Convert to seconds
    setIsStretching(true)
    setShowReminder(false)
  }

  const completeStretch = async () => {
    if (currentStretch) {
      const duration = stretchTypes.find(s => s.name === currentStretch)?.duration || 5
      await logStretch(currentStretch, duration)
      setTodayStretches(prev => prev + 1)
    }
    
    setIsStretching(false)
    setCurrentStretch(null)
    setStretchTimer(0)
    setupReminder()
  }

  const skipStretch = () => {
    setShowReminder(false)
    setupReminder()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Activity className="w-6 h-6 text-green-500 mr-2" />
          Movement Tracker
        </h2>
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">{todayStretches} today</span>
        </div>
      </div>

      {isStretching && currentStretch && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4 text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            {currentStretch} in progress
          </h3>
          <div className="text-3xl font-mono font-bold text-green-600 mb-2">
            {formatTime(stretchTimer)}
          </div>
          <p className="text-sm text-green-700 mb-4">
            {stretchTypes.find(s => s.name === currentStretch)?.description}
          </p>
          <button
            onClick={completeStretch}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Early
          </button>
        </div>
      )}

      {showReminder && !isStretching && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-amber-800 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Time for a movement break!
            </h3>
            <button
              onClick={skipStretch}
              className="text-amber-600 hover:text-amber-800 text-sm font-medium"
            >
              Skip
            </button>
          </div>
          <p className="text-sm text-amber-700 mb-4">
            Regular movement helps reduce strain and improve circulation.
          </p>
          <div className="grid grid-cols-1 gap-2">
            {stretchTypes.slice(0, 3).map((stretch) => (
              <button
                key={stretch.name}
                onClick={() => startStretch(stretch)}
                className="flex justify-between items-center p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-800">{stretch.name}</div>
                  <div className="text-sm text-gray-600">{stretch.description}</div>
                </div>
                <div className="text-sm text-gray-500">{stretch.duration} min</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!showReminder && !isStretching && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Next reminder: {nextReminderTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {stretchTypes.map((stretch) => (
              <button
                key={stretch.name}
                onClick={() => startStretch(stretch)}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
              >
                <div className="font-medium text-gray-800 text-sm">{stretch.name}</div>
                <div className="text-xs text-gray-600">{stretch.duration} min</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}