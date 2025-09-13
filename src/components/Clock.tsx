import React, { useState, useEffect } from 'react'
import { Clock as ClockIcon } from 'lucide-react'

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <div className="flex items-center justify-center mb-6">
        <ClockIcon className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Health Tracker Clock</h1>
      </div>
      
      <div className="text-center">
        <div className="text-6xl font-mono font-bold text-blue-600 mb-2">
          {formatTime(time)}
        </div>
        <div className="text-lg text-gray-600">
          {formatDate(time)}
        </div>
      </div>
    </div>
  )
}