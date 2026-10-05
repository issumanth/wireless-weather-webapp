import {
  AtmosphericTelemetry,
  DailyTelemetryPoint,
  HourlyTelemetryPoint,
  MonitoringLocation,
  WeatherAlert,
} from '../types/weather';

export const DEFAULT_LOCATION: MonitoringLocation = {
  id: 'loc_hyderabad',
  name: 'Hyderabad',
  country: 'India',
  countryCode: 'IN',
  admin1: 'Telangana',
  latitude: 17.385,
  longitude: 78.4867,
  elevation: 505,
  timezone: 'Asia/Kolkata',
};

export const PRESET_LOCATIONS: MonitoringLocation[] = [
  DEFAULT_LOCATION,
  {
    id: 'loc_mumbai',
    name: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    admin1: 'Maharashtra',
    latitude: 19.076,
    longitude: 72.8777,
    elevation: 14,
    timezone: 'Asia/Kolkata',
  },
  {
    id: 'loc_delhi',
    name: 'New Delhi',
    country: 'India',
    countryCode: 'IN',
    admin1: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    elevation: 216,
    timezone: 'Asia/Kolkata',
  },
  {
    id: 'loc_tokyo',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    admin1: 'Tokyo Prefecture',
    latitude: 35.6762,
    longitude: 139.6503,
    elevation: 40,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'loc_london',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    elevation: 25,
    timezone: 'Europe/London',
  },
  {
    id: 'loc_newyork',
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    elevation: 10,
    timezone: 'America/New_York',
  },
  {
    id: 'loc_dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    admin1: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    elevation: 5,
    timezone: 'Asia/Dubai',
  },
  {
    id: 'loc_sydney',
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    elevation: 19,
    timezone: 'Australia/Sydney',
  },
  {
    id: 'loc_reykjavik',
    name: 'Reykjavik',
    country: 'Iceland',
    countryCode: 'IS',
    admin1: 'Capital Region',
    latitude: 64.1466,
    longitude: -21.9426,
    elevation: 38,
    timezone: 'Atlantic/Reykjavik',
  },
];

export function decodeWmoWeather(code: number, isDay = true): {
  title: string;
  description: string;
  category: 'clear' | 'partly_cloudy' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';
  iconType: string;
} {
  switch (code) {
    case 0:
      return {
        title: isDay ? 'Clear Sky' : 'Clear Night',
        description: 'Atmosphere unobstructed, minimal atmospheric haze',
        category: 'clear',
        iconType: isDay ? 'sun' : 'moon',
      };
    case 1:
      return {
        title: 'Mainly Clear',
        description: 'Scattered high-altitude wisps, stable barometric layer',
        category: 'clear',
        iconType: isDay ? 'sun-cloud' : 'moon-cloud',
      };
    case 2:
      return {
        title: 'Partly Cloudy',
        description: 'Moderate cumulus formations, variable solar insolation',
        category: 'partly_cloudy',
        iconType: 'cloud-sun',
      };
    case 3:
      return {
        title: 'Overcast',
        description: 'Continuous altostratus stratum covering upper troposphere',
        category: 'cloudy',
        iconType: 'cloud',
      };
    case 45:
    case 48:
      return {
        title: 'Atmospheric Fog',
        description: 'High particulate moisture saturation reducing line-of-sight visibility',
        category: 'fog',
        iconType: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        title: 'Atmospheric Drizzle',
        description: 'Fine aerosolized water droplets with minimal ground accumulation',
        category: 'rain',
        iconType: 'drizzle',
      };
    case 56:
    case 57:
      return {
        title: 'Freezing Drizzle',
        description: 'Supercooled liquid droplets freezing upon structural contact',
        category: 'snow',
        iconType: 'sleet',
      };
    case 61:
      return {
        title: 'Light Rainfall',
        description: 'Low intensity precipitation cells moving through troposphere',
        category: 'rain',
        iconType: 'rain-light',
      };
    case 63:
      return {
        title: 'Moderate Rainfall',
        description: 'Sustained convective precipitation bands detected',
        category: 'rain',
        iconType: 'rain',
      };
    case 65:
      return {
        title: 'Heavy Rainfall',
        description: 'Intense atmospheric precipitation flux, high run-off rates',
        category: 'rain',
        iconType: 'rain-heavy',
      };
    case 66:
    case 67:
      return {
        title: 'Freezing Rain',
        description: 'Hazardous thermal inversion causing immediate surface ice glaze',
        category: 'snow',
        iconType: 'sleet',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        title: 'Snowfall Event',
        description: 'Crystalline solid precipitation descending through sub-zero thermal column',
        category: 'snow',
        iconType: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        title: 'Convective Rain Showers',
        description: 'Rapid localized precipitation bursts with fluctuating density',
        category: 'rain',
        iconType: 'showers',
      };
    case 85:
    case 86:
      return {
        title: 'Snow Showers',
        description: 'Pulsing solid precipitation bursts with varying velocity',
        category: 'snow',
        iconType: 'snow-flurry',
      };
    case 95:
      return {
        title: 'Severe Thunderstorm',
        description: 'Deep cumulonimbus electrical discharge with turbulence',
        category: 'storm',
        iconType: 'lightning',
      };
    case 96:
    case 99:
      return {
        title: 'Thunderstorm with Hail',
        description: 'Violent convective updrafts creating solid ice projectile fall',
        category: 'storm',
        iconType: 'storm-hail',
      };
    default:
      return {
        title: 'Atmospheric Equilibrium',
        description: 'Telemetry readings within standard operational variance',
        category: 'clear',
        iconType: 'compass',
      };
  }
}

export async function searchLocations(query: string): Promise<MonitoringLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding service unavailable (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: {
    id: number;
    name: string;
    country: string;
    country_code?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    timezone?: string;
  }) => ({
    id: `loc_${item.id}`,
    name: item.name,
    country: item.country || '',
    countryCode: item.country_code || '',
    admin1: item.admin1 || '',
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation || 0,
    timezone: item.timezone || 'auto',
  }));
}

export async function fetchLiveWeatherTelemetry(location: MonitoringLocation): Promise<{
  telemetry: AtmosphericTelemetry;
  hourly: HourlyTelemetryPoint[];
  daily: DailyTelemetryPoint[];
  alerts: WeatherAlert[];
  latencyMs: number;
}> {
  const startTime = performance.now();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,surface_pressure,wind_speed_10m,uv_index,visibility,cloud_cover,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const response = await fetch(url);
  const latencyMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    throw new Error(`Open-Meteo API wireless link error: ${response.statusText}`);
  }

  const raw = await response.json();
  const current = raw.current;
  const hourlyRaw = raw.hourly;
  const dailyRaw = raw.daily;

  const isDay = current.is_day === 1;
  const weatherCondition = decodeWmoWeather(current.weather_code, isDay);

  // Hourly parsing (first 24-48 hours)
  const hourly: HourlyTelemetryPoint[] = [];
  if (hourlyRaw && hourlyRaw.time) {
    const currentIso = current.time;
    let startIndex = hourlyRaw.time.findIndex((t: string) => t >= currentIso);
    if (startIndex < 0) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 36, hourlyRaw.time.length); i++) {
      const timeStr = hourlyRaw.time[i];
      const d = new Date(timeStr);
      hourly.push({
        time: timeStr,
        timestamp: d.getTime(),
        hourDisplay: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        temperature: Math.round(hourlyRaw.temperature_2m?.[i] ?? 0),
        humidity: Math.round(hourlyRaw.relative_humidity_2m?.[i] ?? 0),
        dewPoint: Math.round(hourlyRaw.dew_point_2m?.[i] ?? 0),
        precipitationProbability: Math.round(hourlyRaw.precipitation_probability?.[i] ?? 0),
        precipitation: Number((hourlyRaw.precipitation?.[i] ?? 0).toFixed(1)),
        surfacePressure: Math.round(hourlyRaw.surface_pressure?.[i] ?? 1013),
        windSpeed: Math.round(hourlyRaw.wind_speed_10m?.[i] ?? 0),
        uvIndex: Math.round(hourlyRaw.uv_index?.[i] ?? 0),
        visibility: Math.round((hourlyRaw.visibility?.[i] ?? 10000) / 1000), // in km
        cloudCover: Math.round(hourlyRaw.cloud_cover?.[i] ?? 0),
        weatherCode: hourlyRaw.weather_code?.[i] ?? 0,
      });
    }
  }

  // Daily parsing (7 days)
  const daily: DailyTelemetryPoint[] = [];
  if (dailyRaw && dailyRaw.time) {
    for (let i = 0; i < dailyRaw.time.length; i++) {
      const dateStr = dailyRaw.time[i];
      const d = new Date(dateStr);
      daily.push({
        date: dateStr,
        dayDisplay: i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
        tempMin: Math.round(dailyRaw.temperature_2m_min?.[i] ?? 0),
        tempMax: Math.round(dailyRaw.temperature_2m_max?.[i] ?? 0),
        weatherCode: dailyRaw.weather_code?.[i] ?? 0,
        precipitationSum: Number((dailyRaw.precipitation_sum?.[i] ?? 0).toFixed(1)),
        precipitationProbabilityMax: Math.round(dailyRaw.precipitation_probability_max?.[i] ?? 0),
        windSpeedMax: Math.round(dailyRaw.wind_speed_10m_max?.[i] ?? 0),
        uvIndexMax: Math.round(dailyRaw.uv_index_max?.[i] ?? 0),
        sunrise: dailyRaw.sunrise?.[i] ? new Date(dailyRaw.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '06:00',
        sunset: dailyRaw.sunset?.[i] ? new Date(dailyRaw.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '18:00',
      });
    }
  }

  const todayDaily = daily[0] || {
    tempMin: Math.round(current.temperature_2m - 4),
    tempMax: Math.round(current.temperature_2m + 5),
    sunrise: '06:12',
    sunset: '18:24',
  };

  // Calculate dew point approximation from Magnus formula if not direct
  const temp = current.temperature_2m;
  const rh = current.relative_humidity_2m;
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(rh / 100);
  const calculatedDewPoint = Math.round((b * alpha) / (a - alpha));

  const telemetry: AtmosphericTelemetry = {
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(current.apparent_temperature),
    minTempToday: todayDaily.tempMin,
    maxTempToday: todayDaily.tempMax,
    relativeHumidity: Math.round(current.relative_humidity_2m),
    dewPoint: calculatedDewPoint,
    surfacePressure: Math.round(current.surface_pressure),
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: Math.round(current.wind_direction_10m),
    windGusts: Math.round(current.wind_gusts_10m),
    precipitation: Number((current.precipitation ?? 0).toFixed(1)),
    precipitationProbability: hourly[0]?.precipitationProbability ?? 0,
    rain: Number((current.rain ?? 0).toFixed(1)),
    snowfall: Number((current.snowfall ?? 0).toFixed(1)),
    cloudCover: Math.round(current.cloud_cover),
    uvIndex: Math.round(current.uv_index ?? 0),
    visibility: hourly[0]?.visibility ?? 10,
    weatherCode: current.weather_code,
    weatherCondition,
    sunrise: todayDaily.sunrise,
    sunset: todayDaily.sunset,
    isDay,
    localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    lastUpdated: new Date().toISOString(),
  };

  // Build empirical alerts
  const alerts: WeatherAlert[] = [];

  if (current.weather_code >= 95) {
    alerts.push({
      id: 'alert_thunderstorm',
      severity: 'WARNING',
      title: 'Active Thunderstorm Cell Detected',
      description: 'Severe convective turbulence and electrical discharges in monitored atmosphere. High risk of electrical activity.',
      parameter: 'WMO Atmospheric Code',
      value: `${current.weather_code}`,
      timestamp: telemetry.localTime,
    });
  }

  if (current.wind_speed_10m >= 45 || current.wind_gusts_10m >= 60) {
    alerts.push({
      id: 'alert_wind_gale',
      severity: 'WARNING',
      title: 'High Velocity Atmospheric Vector',
      description: `Elevated surface wind velocity of ${Math.round(current.wind_speed_10m)} km/h with gusts exceeding ${Math.round(current.wind_gusts_10m)} km/h.`,
      parameter: 'Wind Speed & Gusts',
      value: `${Math.round(current.wind_speed_10m)} km/h / ${Math.round(current.wind_gusts_10m)} km/h gusts`,
      timestamp: telemetry.localTime,
    });
  }

  if (current.precipitation >= 7 || (hourly[0] && hourly[0].precipitation >= 7)) {
    alerts.push({
      id: 'alert_heavy_rain',
      severity: 'ADVISORY',
      title: 'Heavy Precipitation Flux',
      description: 'Elevated hydrometeor accumulation detected. Runoff and localized surface pooling probable.',
      parameter: 'Precipitation Rate',
      value: `${current.precipitation} mm/h`,
      timestamp: telemetry.localTime,
    });
  }

  if (current.temperature_2m >= 40) {
    alerts.push({
      id: 'alert_extreme_heat',
      severity: 'WARNING',
      title: 'Extreme Thermal Atmospheric Index',
      description: `Ambient temperature elevated at ${Math.round(current.temperature_2m)}°C with apparent thermal index of ${Math.round(current.apparent_temperature)}°C.`,
      parameter: 'Ambient Temperature',
      value: `${Math.round(current.temperature_2m)}°C`,
      timestamp: telemetry.localTime,
    });
  } else if (current.temperature_2m <= 0) {
    alerts.push({
      id: 'alert_freezing',
      severity: 'ADVISORY',
      title: 'Sub-Zero Thermal Layering',
      description: 'Atmospheric boundary temperature at or below freezing threshold. Risk of crystalline icing.',
      parameter: 'Ambient Temperature',
      value: `${Math.round(current.temperature_2m)}°C`,
      timestamp: telemetry.localTime,
    });
  }

  if (current.uv_index >= 8) {
    alerts.push({
      id: 'alert_uv_high',
      severity: 'ADVISORY',
      title: 'High Ultraviolet Insolation',
      description: `Solar ultraviolet radiation flux at index level ${Math.round(current.uv_index)}. Protective shielding recommended during peak elevation.`,
      parameter: 'Solar UV Index',
      value: `${Math.round(current.uv_index)}`,
      timestamp: telemetry.localTime,
    });
  }

  if ((hourly[0]?.visibility ?? 10) <= 1.5 || current.weather_code === 45 || current.weather_code === 48) {
    alerts.push({
      id: 'alert_dense_fog',
      severity: 'WATCH',
      title: 'Reduced Atmospheric Visibility',
      description: 'Suspended aerosol condensation producing low optical range (< 1.5 km). Optical sensors degraded.',
      parameter: 'Atmospheric Visibility',
      value: `${hourly[0]?.visibility ?? 1.0} km`,
      timestamp: telemetry.localTime,
    });
  }

  return {
    telemetry,
    hourly,
    daily,
    alerts,
    latencyMs,
  };
}
