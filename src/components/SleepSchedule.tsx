import React, { useState, useEffect } from 'react'
import { Moon, Sun, Clock } from 'lucide-react'

interface SleepScheduleProps {
  preferences: any
}

export function SleepSchedule({ preferences }: SleepScheduleProps) {
  const [currentRecommendation, setCurrentRecommendation] = useState<string>('')
  const [sleepStats, setSleepStats] = useState({
    hoursUntilBedtime: 0,
    hoursUntilWakeup: 0,
    sleepDuration: 0
  })

  useEffect(() => {
    if (!preferences?.sleep_time || !preferences?.wake_time) return

    const updateRecommendations = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      
      const [sleepHour, sleepMinute] = preferences.sleep_time.split(':').map(Number)
      const [wakeHour, wakeMinute] = preferences.wake_time.split(':').map(Number)

      // Calculate time until bedtime
      const bedtime = new Date(now)
      bedtime.setHours(sleepHour, sleepMinute, 0, 0)
      if (bedtime <= now) {
        bedtime.setDate(bedtime.getDate() + 1)
      }
      
      // Calculate time until wake up
      const wakeup = new Date(now)
      wakeup.setHours(wakeHour, wakeMinute, 0, 0)
      if (wakeup <= now) {
        wakeup.setDate(wakeup.getDate() + 1)
      }

      const hoursUntilBedtime = Math.round((bedtime.getTime() - now.getTime()) / (1000 * 60 * 60 * 100)) / 10
      const hoursUntilWakeup = Math.round((wakeup.getTime() - now.getTime()) / (1000 * 60 * 60 * 100)) / 10

      // Calculate sleep duration
      let sleepDuration = (wakeHour - sleepHour + (wakeMinute - sleepMinute) / 60)
      if (sleepDuration <= 0) sleepDuration += 24

      setSleepStats({
        hoursUntilBedtime,
        hoursUntilWakeup,
        sleepDuration
      })

      // Generate recommendations based on time
      if (currentHour >= 21 || currentHour <= 6) {
        if (currentHour >= sleepHour || currentHour <= 2) {
          setCurrentRecommendation("It's bedtime! Wind down and prepare for sleep.")
        } else {
          setCurrentRecommendation("Evening time - consider reducing screen brightness and avoiding caffeine.")
        }
      } else if (currentHour >= 6 && currentHour <= 10) {
        setCurrentRecommendation("Good morning! Get some natural light to help regulate your circadian rhythm.")
      } else if (currentHour >= 14 && currentHour <= 16) {
        setCurrentRecommendation("Afternoon dip is normal. Avoid long naps to maintain night sleep quality.")
      } else {
        setCurrentRecommendation("Maintain consistent energy with regular meals and movement.")
      }
    }

    updateRecommendations()
    const interval = setInterval(updateRecommendations, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [preferences])

  const getSleepQualityColor = (hours: number) => {
    if (hours < 6) return 'text-red-500'
    if (hours < 7) return 'text-orange-500'
    if (hours <= 9) return 'text-green-500'
    return 'text-blue-500'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Moon className="w-6 h-6 text-indigo-500 mr-2" />
        Sleep Schedule
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <Moon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <div className="text-sm text-gray-600 mb-1">Bedtime</div>
          <div className="text-xl font-semibold text-gray-800">
            {preferences?.sleep_time || '22:00'}
          </div>
          <div className="text-xs text-gray-500">
            in {sleepStats.hoursUntilBedtime}h
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-sm text-gray-600 mb-1">Wake up</div>
          <div className="text-xl font-semibold text-gray-800">
            {preferences?.wake_time || '06:00'}
          </div>
          <div className="text-xs text-gray-500">
            in {sleepStats.hoursUntilWakeup}h
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Sleep Duration</span>
          <span className={`font-semibold ${getSleepQualityColor(sleepStats.sleepDuration)}`}>
            {sleepStats.sleepDuration.toFixed(1)} hours
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              sleepStats.sleepDuration < 6 ? 'bg-red-500' :
              sleepStats.sleepDuration < 7 ? 'bg-orange-500' :
              sleepStats.sleepDuration <= 9 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min((sleepStats.sleepDuration / 9) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {currentRecommendation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <p className="text-sm text-blue-800">{currentRecommendation}</p>
          </div>
        </div>
      )}
    </div>
  )
}