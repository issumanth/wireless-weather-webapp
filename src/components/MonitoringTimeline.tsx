import React from 'react';
import { decodeWmoWeather } from '../services/weatherService';
import { AtmosphericTelemetry, HourlyTelemetryPoint, WeatherThemeConfig } from '../types/weather';

interface MonitoringTimelineProps {
  currentTelemetry: AtmosphericTelemetry;
  hourlyList: HourlyTelemetryPoint[];
  selectedHourOffset: number;
  onSelectOffset: (offset: number) => void;
  tempUnit?: 'C' | 'F';
  speedUnit?: 'km/h' | 'mph';
  theme: WeatherThemeConfig;
}

export const MonitoringTimeline: React.FC<MonitoringTimelineProps> = ({
  currentTelemetry,
  hourlyList,
  selectedHourOffset,
  onSelectOffset,
  tempUnit = 'C',
  speedUnit = 'km/h',
  theme,
}) => {
  const displayTemp = (celsius: number) => {
    if (tempUnit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return celsius;
  };

  const displaySpeed = (kmh: number) => {
    if (speedUnit === 'mph') return Math.round(kmh * 0.621371);
    return kmh;
  };

  const milestones = [
    { label: 'CURRENT', offset: 0, tag: 'Live' },
    { label: 'NEXT HOUR', offset: 1, tag: '+1h' },
    { label: 'NEXT 3 HOURS', offset: 3, tag: '+3h' },
    { label: 'NEXT 6 HOURS', offset: 6, tag: '+6h' },
    { label: 'NEXT 12 HOURS', offset: 12, tag: '+12h' },
    { label: 'NEXT 24 HOURS', offset: 24, tag: '+24h' },
  ];

  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor }} />
          <h3 className={`font-display font-bold text-sm tracking-wider uppercase ${theme.primaryText}`}>
            LIVE MONITORING TIMELINE
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${theme.secondaryText}`}>
            {selectedHourOffset === 0 ? 'Viewing: Current Live' : `Simulating: +${selectedHourOffset} Hours`}
          </span>
          {selectedHourOffset !== 0 && (
            <button
              onClick={() => onSelectOffset(0)}
              className={`text-xs font-mono font-bold underline ${theme.accentText}`}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Responsive Milestones Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {milestones.map((m) => {
          const isSelected = selectedHourOffset === m.offset;
          let hourData: HourlyTelemetryPoint | null = null;
          if (m.offset === 0) {
            hourData = hourlyList[0] || null;
          } else {
            hourData = hourlyList[m.offset] || hourlyList[hourlyList.length - 1] || null;
          }

          const temp = hourData ? hourData.temperature : currentTelemetry.temperature;
          const condition = decodeWmoWeather(hourData ? hourData.weatherCode : currentTelemetry.weatherCode);
          const precipProb = hourData ? hourData.precipitationProbability : currentTelemetry.precipitationProbability;
          const wind = hourData ? hourData.windSpeed : currentTelemetry.windSpeed;
          const timeLabel = hourData ? hourData.hourDisplay : 'Now';

          return (
            <div
              key={m.offset}
              onClick={() => onSelectOffset(m.offset)}
              className={`cursor-pointer rounded-xl p-3 border transition-all text-left relative overflow-hidden ${
                isSelected
                  ? `${theme.accentBg} ${theme.accentBorder} shadow-sm`
                  : `bg-black/5 dark:bg-white/5 ${theme.cardBorder} hover:shadow-xs`
              }`}
            >
              {/* Top Tag */}
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1">
                <span className={isSelected ? `font-bold ${theme.accentText}` : theme.secondaryText}>
                  {m.label}
                </span>
                <span className={theme.secondaryText}>{m.tag}</span>
              </div>

              {/* Time */}
              <div className={`text-xs font-mono ${theme.secondaryText}`}>{timeLabel}</div>

              {/* Temperature & Condition */}
              <div className="my-2 flex items-baseline justify-between">
                <div className="flex items-baseline">
                  <span className={`font-mono-data text-2xl font-bold ${theme.primaryText}`}>
                    {displayTemp(temp)}
                  </span>
                  <span className={`text-xs font-mono font-semibold ml-0.5 ${theme.accentText}`}>°{tempUnit}</span>
                </div>
                <div className={`text-[11px] font-mono truncate max-w-[85px] ${theme.secondaryText}`}>
                  {condition.title}
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className={`pt-2 border-t border-black/10 dark:border-white/10 space-y-1 text-[10px] font-mono`}>
                <div className="flex items-center justify-between">
                  <span className={theme.secondaryText}>Rain:</span>
                  <span className={`font-semibold ${theme.accentText}`}>{precipProb}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={theme.secondaryText}>Wind:</span>
                  <span className={theme.primaryText}>{displaySpeed(wind)} {speedUnit}</span>
                </div>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: theme.glowColor }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
