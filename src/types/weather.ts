export interface MonitoringLocation {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string; // state/district
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone: string;
}

export interface AtmosphericTelemetry {
  temperature: number; // °C
  apparentTemperature: number; // °C
  minTempToday: number;
  maxTempToday: number;
  relativeHumidity: number; // %
  dewPoint: number; // °C
  surfacePressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGusts: number; // km/h
  precipitation: number; // mm
  precipitationProbability: number; // %
  rain: number;
  snowfall: number;
  cloudCover: number; // %
  uvIndex: number;
  visibility: number; // meters
  weatherCode: number;
  weatherCondition: {
    title: string;
    description: string;
    category: 'clear' | 'partly_cloudy' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';
    iconType: string;
  };
  sunrise: string;
  sunset: string;
  isDay: boolean;
  localTime: string;
  lastUpdated: string;
}

export interface HourlyTelemetryPoint {
  time: string;
  timestamp: number;
  hourDisplay: string;
  temperature: number;
  humidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  surfacePressure: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  weatherCode: number;
}

export interface DailyTelemetryPoint {
  date: string;
  dayDisplay: string;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface TelemetrySystemStatus {
  connectionState: 'ONLINE' | 'RECEIVING' | 'OFFLINE';
  transmissionState: 'ACTIVE' | 'IDLE' | 'ERROR';
  dataSource: string;
  wirelessProtocol: string;
  dataStatus: 'LIVE' | 'STALE' | 'ERROR';
  lastReceivedTimestamp: number;
  updateIntervalSeconds: number;
  packetsReceived: number;
  latencyMs: number;
}

export interface SystemLogEvent {
  id: string;
  timestamp: string;
  category: 'data' | 'system' | 'sync' | 'alert' | 'telemetry';
  message: string;
  status: 'nominal' | 'active' | 'warning' | 'info';
}

export interface WeatherAlert {
  id: string;
  severity: 'WARNING' | 'ADVISORY' | 'WATCH' | 'NOMINAL';
  title: string;
  description: string;
  parameter: string;
  value: string;
  timestamp: string;
}

export type InteractiveTarget = 'sun' | 'cloud' | 'rain' | 'wind' | 'location' | 'storm' | 'snow' | 'fog' | null;

export type ActiveView = 'MONITOR' | 'LOCATIONS' | 'ANALYTICS' | 'FORECAST' | 'ALERTS' | 'SYSTEM';

export interface WeatherThemeConfig {
  id: 'white-black' | 'black-white' | 'sunny' | 'rainy' | 'stormy' | 'cloudy' | 'snowy';
  name: string;
  // CSS classes / styles
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  primaryText: string;
  secondaryText: string;
  glowColor: string;
  particleColor: string;
}

export const THEME_WHITE_BLACK: WeatherThemeConfig = {
  id: 'white-black',
  name: 'White & Black (College Presentation)',
  pageBg: 'bg-[#fafafa]',
  cardBg: 'bg-white shadow-xs',
  cardBorder: 'border-zinc-300',
  headerBg: 'bg-white border-zinc-200',
  accentText: 'text-zinc-950',
  accentBg: 'bg-zinc-100',
  accentBorder: 'border-zinc-900',
  primaryText: 'text-black',
  secondaryText: 'text-zinc-600',
  glowColor: '#000000',
  particleColor: '#18181b',
};

export const THEME_BLACK_WHITE: WeatherThemeConfig = {
  id: 'black-white',
  name: 'Black & White (Dark Academic)',
  pageBg: 'bg-[#09090b]',
  cardBg: 'bg-[#121215] shadow-xs',
  cardBorder: 'border-zinc-800',
  headerBg: 'bg-[#09090b] border-zinc-800',
  accentText: 'text-white',
  accentBg: 'bg-zinc-800',
  accentBorder: 'border-zinc-400',
  primaryText: 'text-white',
  secondaryText: 'text-zinc-400',
  glowColor: '#ffffff',
  particleColor: '#f4f4f5',
};

export function getWeatherTheme(
  _category?: 'clear' | 'partly_cloudy' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm',
  _isDay = true
): WeatherThemeConfig {
  // Default to White & Black theme for clean college representation
  return THEME_WHITE_BLACK;
}

