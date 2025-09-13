# Health Tracker Clock

A modern, weather-aware health tracking web application that provides timely reminders for hydration, movement, and sleep based on real-time weather conditions.

## Features

### 🕐 Real-Time Clock
- Current time and date display
- Clean, readable interface with modern design

### 🌤️ Weather Integration
- Real-time weather data from Open-Meteo API
- Temperature, humidity, and UV index monitoring
- Weather-based health alerts and recommendations
- Automatic location detection with fallback to default coordinates

### 💧 Smart Hydration Tracking
- Weather-aware hydration reminders
- Customizable temperature, humidity, and UV thresholds
- Daily intake tracking with visual progress
- Quick-log buttons for different water amounts

### 🏃 Movement Reminders
- Configurable stretch and movement intervals
- Guided stretching sessions with timers
- Multiple stretch types (neck, back, legs, eyes, full body)
- Daily movement tracking

### 😴 Sleep Schedule Management
- Personalized bedtime and wake-up time settings
- Sleep duration analysis and recommendations
- Circadian rhythm-based suggestions
- Time-aware sleep quality tips

### ⚙️ Customizable Settings
- All thresholds and intervals are adjustable
- Local storage backup for offline functionality
- Anonymous data storage via Supabase
- No authentication required

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time API)
- **Weather Data**: Open-Meteo API
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (optional, app works offline)

### 1. Environment Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Setup (Optional)

1. Create a new Supabase project
2. Run the migration file `supabase/migrations/create_health_tracker_tables.sql`
3. Ensure Row Level Security is enabled with anonymous access policies
4. Add your Supabase credentials to `.env`

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### First Time Setup
1. Open the app in your browser
2. Allow location access for accurate weather data (optional)
3. Click the settings icon to customize your preferences:
   - Hydration thresholds (temperature, humidity, UV index)
   - Reminder intervals for water and movement
   - Sleep schedule (bedtime and wake time)

### Daily Usage
1. **Monitor Weather**: Check the weather panel for current conditions and health alerts
2. **Track Hydration**: Log water intake using the quick buttons when reminded or manually
3. **Take Movement Breaks**: Follow stretch reminders with guided timing
4. **Follow Sleep Schedule**: View recommendations based on your preferred sleep times

### Features Overview

- **Anonymous Usage**: No sign-up required, data stored locally and optionally synced
- **Weather-Smart Alerts**: Reminders adapt based on temperature, humidity, and UV conditions
- **Offline Capable**: Core functionality works without internet connection
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Privacy Focused**: All data stored anonymously, no personal information required

## API Configuration

### Weather Data
The app uses the free Open-Meteo API which requires no API key. Weather data includes:
- Current temperature and humidity
- UV index for sun exposure warnings
- Weather conditions for contextual recommendations

### Location Services
- Automatic location detection for accurate weather data
- Falls back to New York coordinates if location access is denied
- No location data is stored or transmitted

## Data Storage

### Local Storage
- User preferences are automatically backed up to browser local storage
- Ensures app functionality even when offline
- Data persists across browser sessions

### Supabase (Optional)
- Anonymous data storage without authentication
- Syncs preferences and logs across devices
- Provides backup for local storage data

## Customization

### Thresholds and Intervals
All reminder thresholds can be adjusted in settings:
- **Temperature Threshold**: When to increase hydration alerts (default: 25°C)
- **Humidity Threshold**: When to alert for dry air (default: 60%)
- **UV Threshold**: When to warn about sun exposure (default: 6)
- **Hydration Interval**: Time between water reminders (default: 60 minutes)
- **Stretch Interval**: Time between movement reminders (default: 30 minutes)

### Sleep Schedule
- Set personal bedtime and wake-up times
- Receive contextual sleep recommendations
- Monitor sleep duration and quality indicators

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Progressive Web App capabilities
- Responsive design for mobile devices

## Privacy & Security

- No personal information required or stored
- Anonymous database access only
- Local-first data storage
- Weather data fetched directly from public APIs
- No tracking or analytics

## Troubleshooting

### Weather Data Not Loading
- Check internet connection
- Verify Open-Meteo API accessibility
- Location services may be blocked (uses fallback coordinates)

### Settings Not Saving
- Ensure Supabase connection is configured correctly
- Settings will save locally even if server sync fails
- Check browser local storage permissions

### Reminders Not Working
- Verify notification permissions in browser
- Check that intervals are set correctly in settings
- Ensure app tab remains active for timers to function

## Contributing

This project welcomes contributions! Areas for enhancement:
- Additional stretch/exercise routines
- More weather condition integrations
- Enhanced notification systems
- Additional health metrics tracking
- Accessibility improvements

## License

MIT License - feel free to use and modify for personal and commercial projects.