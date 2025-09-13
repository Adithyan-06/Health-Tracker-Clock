import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_anon_key_here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Preferences {
  id: string
  hydration_threshold_temp: number
  hydration_threshold_humidity: number
  hydration_threshold_uv: number
  hydration_interval: number
  stretch_interval: number
  sleep_time: string
  wake_time: string
  created_at: string
  updated_at: string
}

export interface HydrationLog {
  id: string
  amount: number
  logged_at: string
  weather_temp?: number
  weather_humidity?: number
}

export interface StretchLog {
  id: string
  type: string
  duration: number
  logged_at: string
}