import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, X } from 'lucide-react'
import { getPreferences, updatePreferences } from '../services/healthService'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  onPreferencesUpdate: (prefs: any) => void
}

export function Settings({ isOpen, onClose, onPreferencesUpdate }: SettingsProps) {
  const [localPrefs, setLocalPrefs] = useLocalStorage('health-tracker-prefs', {
    hydration_threshold_temp: 25,
    hydration_threshold_humidity: 60,
    hydration_threshold_uv: 6,
    hydration_interval: 60,
    stretch_interval: 30,
    sleep_time: '22:00',
    wake_time: '06:00'
  })

  const [formData, setFormData] = useState(localPrefs)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadPreferences()
    }
  }, [isOpen])

  const loadPreferences = async () => {
    const serverPrefs = await getPreferences()
    if (serverPrefs) {
      const merged = { ...localPrefs, ...serverPrefs }
      setFormData(merged)
      setLocalPrefs(merged)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    // Save locally first
    setLocalPrefs(formData)
    
    // Try to save to server
    const success = await updatePreferences(formData)
    
    setSaving(false)
    onPreferencesUpdate(formData)
    onClose()
    
    if (!success) {
      console.warn('Failed to save preferences to server, saved locally instead')
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <SettingsIcon className="w-6 h-6 text-gray-600 mr-2" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hydration Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Hydration Alerts</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature Threshold (°C)
                </label>
                <input
                  type="number"
                  value={formData.hydration_threshold_temp}
                  onChange={(e) => handleChange('hydration_threshold_temp', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Humidity Threshold (%)
                </label>
                <input
                  type="number"
                  value={formData.hydration_threshold_humidity}
                  onChange={(e) => handleChange('hydration_threshold_humidity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UV Index Threshold
                </label>
                <input
                  type="number"
                  value={formData.hydration_threshold_uv}
                  onChange={(e) => handleChange('hydration_threshold_uv', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Interval (minutes)
                </label>
                <input
                  type="number"
                  value={formData.hydration_interval}
                  onChange={(e) => handleChange('hydration_interval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="15"
                  max="240"
                />
              </div>
            </div>
          </div>

          {/* Movement Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Movement Reminders</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stretch Interval (minutes)
              </label>
              <input
                type="number"
                value={formData.stretch_interval}
                onChange={(e) => handleChange('stretch_interval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="10"
                max="120"
              />
            </div>
          </div>

          {/* Sleep Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Sleep Schedule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedtime
                </label>
                <input
                  type="time"
                  value={formData.sleep_time}
                  onChange={(e) => handleChange('sleep_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wake Up Time
                </label>
                <input
                  type="time"
                  value={formData.wake_time}
                  onChange={(e) => handleChange('wake_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}