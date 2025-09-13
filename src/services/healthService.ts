import { supabase, Preferences, HydrationLog, StretchLog } from '../lib/supabase'

const DEFAULT_PREFERENCES_ID = '00000000-0000-0000-0000-000000000000'

export async function getPreferences(): Promise<Preferences | null> {
  try {
    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('id', DEFAULT_PREFERENCES_ID)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return null
  }
}

export async function updatePreferences(preferences: Partial<Preferences>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('preferences')
      .upsert({
        id: DEFAULT_PREFERENCES_ID,
        ...preferences,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating preferences:', error)
    return false
  }
}

export async function logHydration(amount: number, weatherTemp?: number, weatherHumidity?: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('hydration_logs')
      .insert({
        amount,
        weather_temp: weatherTemp,
        weather_humidity: weatherHumidity
      })
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error logging hydration:', error)
    return false
  }
}

export async function logStretch(type: string, duration: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('stretch_logs')
      .insert({
        type,
        duration
      })
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error logging stretch:', error)
    return false
  }
}

export async function getTodayHydrationLogs(): Promise<HydrationLog[]> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('hydration_logs')
      .select('*')
      .gte('logged_at', `${today}T00:00:00`)
      .order('logged_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching hydration logs:', error)
    return []
  }
}

export async function getTodayStretchLogs(): Promise<StretchLog[]> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('stretch_logs')
      .select('*')
      .gte('logged_at', `${today}T00:00:00`)
      .order('logged_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching stretch logs:', error)
    return []
  }
}