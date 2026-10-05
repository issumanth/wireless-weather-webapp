import React from 'react';
import { AtmosphericTelemetry, MonitoringLocation, WeatherThemeConfig } from '../types/weather';

interface WeatherMonitorsGridProps {
  telemetry: AtmosphericTelemetry;
  location: MonitoringLocation;
  speedUnit?: 'km/h' | 'mph';
  theme: WeatherThemeConfig;
  onOpenLocationSearch?: () => void;
}

export const WeatherMonitorsGrid: React.FC<WeatherMonitorsGridProps> = ({
  telemetry,
  location,
  speedUnit = 'km/h',
  theme,
  onOpenLocationSearch,
}) => {
  const displaySpeed = (kmh: number) => {
    if (speedUnit === 'mph') return Math.round(kmh * 0.621371);
    return kmh;
  };

  const getCardinalDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  const calculateDaylightDuration = (sunrise: string, sunset: string) => {
    try {
      const [srH, srM] = sunrise.split(':').map(Number);
      const [ssH, ssM] = sunset.split(':').map(Number);
      const srMinutes = srH * 60 + srM;
      const ssMinutes = ssH * 60 + ssM;
      let diff = ssMinutes - srMinutes;
      if (diff < 0) diff += 24 * 60;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `${hours}h ${mins}m`;
    } catch {
      return '12h 15m';
    }
  };

  const daylightDuration = calculateDaylightDuration(telemetry.sunrise, telemetry.sunset);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className={`font-display font-bold text-sm tracking-wider uppercase ${theme.primaryText}`}>
          ATMOSPHERIC MONITORS
        </h2>
        <span className={`text-xs font-mono ${theme.secondaryText}`}>
          Live Telemetry Channels
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. SUN MONITOR */}
        <div className={`p-4 rounded-xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
              SUN MONITOR
            </span>
            <span className={`text-[10px] font-mono ${theme.secondaryText}`}>Solar Cycle</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Sunrise:</span>
              <span className={`font-bold font-mono-data ${theme.primaryText}`}>{telemetry.sunrise}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Sunset:</span>
              <span className={`font-bold font-mono-data ${theme.primaryText}`}>{telemetry.sunset}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
              <span className={theme.secondaryText}>Daylight:</span>
              <span className={`font-bold ${theme.accentText}`}>{daylightDuration}</span>
            </div>
          </div>
        </div>

        {/* 2. CLOUD MONITOR */}
        <div className={`p-4 rounded-xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
              CLOUD MONITOR
            </span>
            <span className={`text-[10px] font-mono ${theme.secondaryText}`}>Coverage</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Cloud Cover:</span>
              <span className={`font-bold font-mono-data ${theme.accentText}`}>{telemetry.cloudCover}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Condition:</span>
              <span className={`font-bold truncate max-w-[105px] ${theme.primaryText}`}>
                {telemetry.weatherCondition.title}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
              <span className={theme.secondaryText}>WMO Code:</span>
              <span className={`font-mono-data ${theme.secondaryText}`}>{telemetry.weatherCode}</span>
            </div>
          </div>
        </div>

        {/* 3. PRECIPITATION MONITOR */}
        <div className={`p-4 rounded-xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
              PRECIPITATION MONITOR
            </span>
            <span className={`text-[10px] font-mono ${theme.secondaryText}`}>Hydrometeors</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Probability:</span>
              <span className={`font-bold font-mono-data ${theme.accentText}`}>
                {telemetry.precipitationProbability}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Expected Rain:</span>
              <span className={`font-bold font-mono-data ${theme.primaryText}`}>{telemetry.precipitation} mm</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
              <span className={theme.secondaryText}>Dew Point:</span>
              <span className={`font-mono-data ${theme.secondaryText}`}>{telemetry.dewPoint}°C</span>
            </div>
          </div>
        </div>

        {/* 4. WIND MONITOR */}
        <div className={`p-4 rounded-xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
              WIND MONITOR
            </span>
            <span className={`text-[10px] font-mono ${theme.secondaryText}`}>Vectors</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Speed:</span>
              <span className={`font-bold font-mono-data ${theme.accentText}`}>
                {displaySpeed(telemetry.windSpeed)} {speedUnit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Direction:</span>
              <span className={`font-bold ${theme.primaryText}`}>
                {telemetry.windDirection}° {getCardinalDirection(telemetry.windDirection)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
              <span className={theme.secondaryText}>Peak Gusts:</span>
              <span className={`font-mono-data ${theme.secondaryText}`}>
                {displaySpeed(telemetry.windGusts)} {speedUnit}
              </span>
            </div>
          </div>
        </div>

        {/* 5. LOCATION MONITOR */}
        <div className={`p-4 rounded-xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
              LOCATION MONITOR
            </span>
            {onOpenLocationSearch && (
              <button
                onClick={onOpenLocationSearch}
                className={`text-[10px] font-mono underline ${theme.secondaryText} hover:${theme.primaryText}`}
              >
                Change
              </button>
            )}
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Node:</span>
              <span className={`font-bold truncate max-w-[110px] ${theme.primaryText}`}>{location.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={theme.secondaryText}>Coords:</span>
              <span className={`font-mono-data text-[11px] ${theme.primaryText}`}>
                {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
              <span className={theme.secondaryText}>Local Time:</span>
              <span className={`font-bold font-mono-data ${theme.accentText}`}>{telemetry.localTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
