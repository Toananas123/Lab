export interface RunningActivity {
  id: string;
  name: string;
  date: string;
  distanceKm: number;
  durationMinutes: number;
  averagePace: string; // e.g. "5:20" (min/km)
  elevationGain?: number; // meters
  avgHeartRate?: number; // bpm
  cadence?: number; // steps per minute
  source: 'strava' | 'manual';
  stravaActivityId?: number | string;
  perceivedEffort?: number; // 1-5
  shoes?: string;
  notes?: string;
}

export interface StravaRawActivity {
  id: number;
  name: string;
  type: string;
  sport_type?: string;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number;
  total_elevation_gain: number;
  start_date_local: string;
  average_speed: number; // m/s
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
}

export interface StravaAthlete {
  id: number;
  username?: string;
  firstname: string;
  lastname: string;
  profile?: string;
  city?: string;
  country?: string;
}

export interface PaceZone {
  name: string;
  label: string;
  percentage: string;
  paceMinKm: string;
  speedKmh: number;
  purpose: string;
  color: string;
}
