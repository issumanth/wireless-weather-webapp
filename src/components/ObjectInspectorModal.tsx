import React from 'react';
import { AtmosphericTelemetry, InteractiveTarget, MonitoringLocation, WeatherThemeConfig } from '../types/weather';

interface ObjectInspectorModalProps {
  target: InteractiveTarget;
  telemetry: AtmosphericTelemetry | null;
  location: MonitoringLocation;
  onClose: () => void;
  tempUnit?: 'C' | 'F';
  speedUnit?: 'km/h' | 'mph';
  theme: WeatherThemeConfig;
}

export const ObjectInspectorModal: React.FC<ObjectInspectorModalProps> = ({
  target,
  telemetry,
  location,
  onClose,
  speedUnit = 'km/h',
  theme,
}) => {
  if (!target || !telemetry) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${theme.cardBg} ${theme.cardBorder}`}>
        {/* Header Ribbon */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${theme.cardBorder} bg-black/5 dark:bg-white/5`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor }} />
            <h3 className={`font-display font-bold text-sm tracking-wider uppercase ${theme.primaryText}`}>
              {target === 'sun' && 'SUN MONITOR'}
              {target === 'cloud' && 'CLOUD MONITOR'}
              {(target === 'rain' || target === 'snow') && 'PRECIPITATION MONITOR'}
              {target === 'wind' && 'WIND MONITOR'}
              {target === 'location' && 'LOCATION MONITOR'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors font-mono text-sm ${theme.secondaryText} hover:bg-black/10 dark:hover:bg-white/10`}
          >
            ✕
          </button>
        </div>

        {/* Content Body with Minimal Text */}
        <div className="p-5 space-y-4">
          {/* 1. SUN MONITOR: Sunrise, Sunset, Daylight duration */}
          {target === 'sun' && (
            <div className="space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5`}>
                  <div className={`text-xs ${theme.secondaryText}`}>SUNRISE</div>
                  <div className={`text-2xl font-bold mt-1 ${theme.primaryText}`}>{telemetry.sunrise}</div>
                </div>
                <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5`}>
                  <div className={`text-xs ${theme.secondaryText}`}>SUNSET</div>
                  <div className={`text-2xl font-bold mt-1 ${theme.primaryText}`}>{telemetry.sunset}</div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>DAYLIGHT DURATION</div>
                <div className={`text-xl font-bold ${theme.accentText}`}>{daylightDuration}</div>
              </div>
            </div>
          )}

          {/* 2. CLOUD MONITOR: Cloud cover and Weather conditions */}
          {target === 'cloud' && (
            <div className="space-y-3 font-mono">
              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>CLOUD COVER</div>
                <div className={`text-2xl font-bold ${theme.accentText}`}>{telemetry.cloudCover}%</div>
              </div>

              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>WEATHER CONDITION</div>
                <div className={`text-base font-bold ${theme.primaryText}`}>{telemetry.weatherCondition.title}</div>
              </div>
            </div>
          )}

          {/* 3. PRECIPITATION MONITOR: Rain probability and Expected rainfall */}
          {(target === 'rain' || target === 'snow') && (
            <div className="space-y-3 font-mono">
              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>RAIN PROBABILITY</div>
                <div className={`text-2xl font-bold ${theme.accentText}`}>{telemetry.precipitationProbability}%</div>
              </div>

              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>EXPECTED RAINFALL</div>
                <div className={`text-2xl font-bold ${theme.primaryText}`}>{telemetry.precipitation} mm</div>
              </div>
            </div>
          )}

          {/* 4. WIND MONITOR: Speed and Direction */}
          {target === 'wind' && (
            <div className="space-y-3 font-mono">
              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>WIND SPEED</div>
                <div className={`text-2xl font-bold ${theme.accentText}`}>
                  {displaySpeed(telemetry.windSpeed)} {speedUnit}
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>WIND DIRECTION</div>
                <div className={`text-xl font-bold ${theme.primaryText}`}>
                  {telemetry.windDirection}° {getCardinalDirection(telemetry.windDirection)}
                </div>
              </div>
            </div>
          )}

          {/* 5. LOCATION MONITOR: Coordinates and Local time */}
          {target === 'location' && (
            <div className="space-y-3 font-mono">
              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5`}>
                <div className={`text-xs mb-1 ${theme.secondaryText}`}>LOCATION</div>
                <div className={`text-base font-bold ${theme.primaryText}`}>
                  {location.name}, {location.country}
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>COORDINATES</div>
                <div className={`text-sm font-bold ${theme.primaryText}`}>
                  {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${theme.cardBorder} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
                <div className={`text-xs ${theme.secondaryText}`}>LOCAL TIME</div>
                <div className={`text-xl font-bold ${theme.accentText}`}>{telemetry.localTime}</div>
              </div>
            </div>
          )}

          {/* Close Action */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${theme.accentBg} ${theme.accentText} ${theme.accentBorder} border hover:brightness-105`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
