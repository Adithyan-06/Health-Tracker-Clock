/*
  # Health Tracker Database Schema

  1. New Tables
    - `preferences`
      - `id` (uuid, primary key)
      - `hydration_threshold_temp` (integer, temperature threshold for hydration alerts)
      - `hydration_threshold_humidity` (integer, humidity threshold)
      - `hydration_threshold_uv` (integer, UV index threshold)
      - `hydration_interval` (integer, minutes between hydration reminders)
      - `stretch_interval` (integer, minutes between stretch reminders)
      - `sleep_time` (text, preferred sleep time)
      - `wake_time` (text, preferred wake time)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `hydration_logs`
      - `id` (uuid, primary key)
      - `amount` (integer, water amount in ml)
      - `logged_at` (timestamp)
      - `weather_temp` (integer, optional)
      - `weather_humidity` (integer, optional)
    
    - `stretch_logs`
      - `id` (uuid, primary key)
      - `type` (text, stretch type)
      - `duration` (integer, duration in minutes)
      - `logged_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous access to read/write data
    - No authentication required - fully anonymous access
*/

-- Preferences table for storing user health preferences
CREATE TABLE IF NOT EXISTS preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hydration_threshold_temp integer DEFAULT 25,
  hydration_threshold_humidity integer DEFAULT 60,
  hydration_threshold_uv integer DEFAULT 6,
  hydration_interval integer DEFAULT 60,
  stretch_interval integer DEFAULT 30,
  sleep_time text DEFAULT '22:00',
  wake_time text DEFAULT '06:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hydration logs for tracking water intake
CREATE TABLE IF NOT EXISTS hydration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount integer NOT NULL DEFAULT 250,
  logged_at timestamptz DEFAULT now(),
  weather_temp integer,
  weather_humidity integer
);

-- Stretch logs for tracking movement/exercise
CREATE TABLE IF NOT EXISTS stretch_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'general',
  duration integer DEFAULT 5,
  logged_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stretch_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous access to preferences"
  ON preferences
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to hydration_logs"
  ON hydration_logs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to stretch_logs"
  ON stretch_logs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert default preferences record
INSERT INTO preferences (id) VALUES ('00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;