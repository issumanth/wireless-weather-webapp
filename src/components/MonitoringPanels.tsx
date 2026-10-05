import React from 'react';
import { AtmosphericTelemetry, InteractiveTarget, WeatherThemeConfig } from '../types/weather';

interface MonitoringPanelsProps {
  telemetry: AtmosphericTelemetry;
  onInspect: (target: InteractiveTarget) => void;
  tempUnit?: 'C' | 'F';
  speedUnit?: 'km/h' | 'mph';
  theme: WeatherThemeConfig;
}

export const MonitoringPanels: React.FC<MonitoringPanelsProps> = ({
  telemetry,
  onInspect,
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

  const tempPercent = Math.max(0, Math.min(100, Math.round(((telemetry.temperature + 10) / 60) * 100)));
  const humidityPercent = Math.max(0, Math.min(100, telemetry.relativeHumidity));
  const pressurePercent = Math.max(0, Math.min(100, Math.round(((telemetry.surfacePressure - 960) / 90) * 100)));
  const windPercent = Math.max(0, Math.min(100, telemetry.windSpeed));
  const precipPercent = Math.max(0, Math.min(100, Math.round((telemetry.precipitation / 25) * 100)));
  const uvPercent = Math.max(0, Math.min(100, Math.round((telemetry.uvIndex / 12) * 100)));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {/* 1. TEMPERATURE */}
      <div
        onClick={() => onInspect('sun')}
        className={`group cursor-pointer rounded-xl p-3.5 transition-all border relative overflow-hidden ${theme.cardBg} ${theme.cardBorder} hover:shadow-md`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-1">
          <span className={theme.secondaryText}>TEMPERATURE</span>
          <span className={`text-[11px] ${theme.accentText} group-hover:translate-x-0.5 transition-transform`}>↗</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono-data text-2xl font-bold ${theme.primaryText}`}>
            {displayTemp(telemetry.temperature)}
          </span>
          <span className={`text-xs font-mono font-semibold ${theme.accentText}`}>°{tempUnit}</span>
        </div>
        <div className={`text-[10px] font-mono mt-0.5 ${theme.secondaryText}`}>
          Feels: {displayTemp(telemetry.apparentTemperature)}°{tempUnit}
        </div>
        {/* Progress rail */}
        <div className="mt-2.5 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${tempPercent}%`, backgroundColor: theme.glowColor }}
          />
        </div>
      </div>

      {/* 2. HUMIDITY */}
      <div
        onClick={() => onInspect('cloud')}
        className={`group cursor-pointer rounded-xl p-3.5 transition-all border relative overflow-hidden ${theme.cardBg} ${theme.cardBorder} hover:shadow-md`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-1">
          <span className={theme.secondaryText}>HUMIDITY</span>
          <span className={`text-[11px] ${theme.accentText} group-hover:translate-x-0.5 transition-transform`}>↗</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono-data text-2xl font-bold ${theme.primaryText}`}>
            {telemetry.relativeHumidity}
          </span>
          <span className={`text-xs font-mono font-semibold ${theme.accentText}`}>%</span>
        </div>
        <div className={`text-[10px] font-mono mt-0.5 ${theme.secondaryText}`}>
          Dew: {displayTemp(telemetry.dewPoint)}°{tempUnit}
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${humidityPercent}%`, backgroundColor: theme.glowColor }}
          />
        </div>
      </div>

      {/* 3. PRESSURE */}
      <div
        onClick={() => onInspect('location')}
        className={`group cursor-pointer rounded-xl p-3.5 transition-all border relative overflow-hidden ${theme.cardBg} ${theme.cardBorder} hover:shadow-md`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-1">
          <span className={theme.secondaryText}>PRESSURE</span>
          <span className={`text-[11px] ${theme.accentText} group-hover:translate-x-0.5 transition-transform`}>↗</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono-data text-2xl font-bold ${theme.primaryText}`}>
            {telemetry.surfacePressure}
          </span>
          <span className={`text-xs font-mono font-semibold ${theme.accentText}`}>hPa</span>
        </div>
        <div className={`text-[10px] font-mono mt-0.5 ${theme.secondaryText}`}>
          {telemetry.surfacePressure > 1013 ? 'High Barometer' : 'Low Barometer'}
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pressurePercent}%`, backgroundColor: theme.glowColor }}
          />
        </div>
      </div>

      {/* 4. WIND */}
      <div
        onClick={() => onInspect('wind')}
        className={`group cursor-pointer rounded-xl p-3.5 transition-all border relative overflow-hidden ${theme.cardBg} ${theme.cardBorder} hover:shadow-md`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-1">
          <span className={theme.secondaryText}>WIND</span>
          <span className={`text-[11px] ${theme.accentText} group-hover:translate-x-0.5 transition-transform`}>↗</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono-data text-2xl font-bold ${theme.primaryText}`}>
            {displaySpeed(telemetry.windSpeed)}
          </span>
          <span className={`text-xs font-mono font-semibold ${theme.accentText}`}>{speedUnit}</span>
        </div>
        <div className={`text-[10px] font-mono mt-0.5 ${theme.secondaryText}`}>
          Gusts: {displaySpeed(telemetry.windGusts)} · {telemetry.windDirection}°
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${windPercent}%`, backgroundColor: theme.glowColor }}
          />
        </div>
      </div>

      {/* 5. PRECIPITATION */}
      <div
        onClick={() => onInspect('rain')}
        className={`group cursor-pointer rounded-xl p-3.5 transition-all border relative overflow-hidden ${theme.cardBg} ${theme.cardBorder} hover:shadow-md`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-1">
          <span className={theme.secondaryText}>PRECIPITATION</span>
          <span className={`text-[11px] ${theme.accentText} group-hover:translate-x-0.5 transition-transform`}>↗</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono-data text-2xl font-bold ${theme.primaryText}`}>
            {telemetry.precipitation}
          </span>
          <span className={`text-xs font-mono font-semibold ${theme.accentText}`}>mm</span>
        </div>
        <div className={`text-[10px] font-mono mt-0.5 ${theme.secondaryText}`}>
          Prob: {telemetry.precipitationProbability}%
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${precipPercent}%`, backgroundColor: theme.glowColor }}
          />
        </div>
      </div>

      {/* 6. UV INDEX */}
      <div
        onClick={() => onInspect('sun')}
        className={`group cursor-pointer rounded-xl p-3.5 transition-all border relative overflow-hidden ${theme.cardBg} ${theme.cardBorder} hover:shadow-md`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-1">
          <span className={theme.secondaryText}>UV INDEX</span>
          <span className={`text-[11px] ${theme.accentText} group-hover:translate-x-0.5 transition-transform`}>↗</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono-data text-2xl font-bold ${theme.primaryText}`}>
            {telemetry.uvIndex}
          </span>
          <span className={`text-xs font-mono font-semibold ${theme.accentText}`}>
            {telemetry.uvIndex >= 8 ? 'Very High' : telemetry.uvIndex >= 6 ? 'High' : telemetry.uvIndex >= 3 ? 'Moderate' : 'Low'}
          </span>
        </div>
        <div className={`text-[10px] font-mono mt-0.5 ${theme.secondaryText}`}>
          Clouds: {telemetry.cloudCover}%
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${uvPercent}%`, backgroundColor: theme.glowColor }}
          />
        </div>
      </div>
    </div>
  );
};
