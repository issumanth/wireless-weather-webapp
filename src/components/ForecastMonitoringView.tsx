import React from 'react';
import { decodeWmoWeather } from '../services/weatherService';
import { DailyTelemetryPoint, MonitoringLocation, WeatherThemeConfig } from '../types/weather';

interface ForecastMonitoringViewProps {
  dailyList: DailyTelemetryPoint[];
  location: MonitoringLocation;
  tempUnit?: 'C' | 'F';
  speedUnit?: 'km/h' | 'mph';
  theme: WeatherThemeConfig;
}

export const ForecastMonitoringView: React.FC<ForecastMonitoringViewProps> = ({
  dailyList,
  location,
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

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-widest ${theme.accentText}`}>
            7-Day Synoptic Projection
          </div>
          <h2 className={`font-display font-bold text-lg sm:text-xl uppercase tracking-wider ${theme.primaryText}`}>
            FORECAST MONITORING
          </h2>
          <div className={`text-xs font-mono mt-0.5 ${theme.secondaryText}`}>
            Station: {location.name}, {location.country}
          </div>
        </div>

        <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border ${theme.accentBg} ${theme.accentText} ${theme.accentBorder}`}>
          <span>ECMWF ENSEMBLE MODEL</span>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {dailyList.map((day, idx) => {
          const condition = decodeWmoWeather(day.weatherCode, true);
          return (
            <div
              key={day.date}
              className={`rounded-2xl p-4 border transition-all relative overflow-hidden group ${theme.cardBg} ${theme.cardBorder} hover:shadow-md`}
            >
              {/* Day & Date */}
              <div className="flex items-center justify-between mb-2">
                <span className={`font-display font-bold text-sm uppercase ${theme.primaryText}`}>
                  {day.dayDisplay}
                </span>
                <span className={`text-[10px] font-mono ${theme.secondaryText}`}>
                  {day.date}
                </span>
              </div>

              {/* Weather Condition */}
              <div className="flex items-center gap-2 mb-3">
                <div>
                  <div className={`text-xs font-bold ${theme.accentText}`}>{condition.title}</div>
                  <div className={`text-[10px] font-mono truncate max-w-[200px] ${theme.secondaryText}`}>
                    {condition.description}
                  </div>
                </div>
              </div>

              {/* High / Low */}
              <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
                <div>
                  <div className={`text-[9px] font-mono uppercase ${theme.secondaryText}`}>HIGH / LOW</div>
                  <div className={`font-mono-data text-base font-bold ${theme.primaryText}`}>
                    {displayTemp(day.tempMax)}° <span className={`text-xs font-normal ${theme.secondaryText}`}>/ {displayTemp(day.tempMin)}°{tempUnit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[9px] font-mono uppercase ${theme.secondaryText}`}>UV PEAK</div>
                  <div className={`font-mono-data text-xs font-bold ${theme.accentText}`}>
                    {day.uvIndexMax} / 12
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-1.5 text-[11px] font-mono pt-1 border-t border-black/10 dark:border-white/10">
                <div className="flex justify-between">
                  <span className={theme.secondaryText}>Precipitation:</span>
                  <span className={`font-semibold ${theme.accentText}`}>{day.precipitationProbabilityMax}%</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.secondaryText}>Rain Volume:</span>
                  <span className={theme.primaryText}>{day.precipitationSum} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.secondaryText}>Wind Velocity:</span>
                  <span className={theme.primaryText}>{displaySpeed(day.windSpeedMax)} {speedUnit}</span>
                </div>
              </div>

              {idx === 0 && (
                <div
                  className="absolute top-0 right-0 text-[9px] font-mono font-bold px-2 py-0.5 rounded-bl uppercase text-white"
                  style={{ backgroundColor: theme.glowColor }}
                >
                  Today
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
