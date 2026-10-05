import React from 'react';
import { TelemetrySystemStatus, WeatherThemeConfig } from '../types/weather';

interface HeaderBannerProps {
  status: TelemetrySystemStatus;
  onOpenSearch: () => void;
  currentLocationName: string;
  theme: WeatherThemeConfig;
  weatherConditionTitle?: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  status,
  onOpenSearch,
  currentLocationName,
  theme,
  weatherConditionTitle,
}) => {
  const isOnline = status.connectionState === 'ONLINE';

  return (
    <div className={`w-full rounded-2xl p-5 border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.glowColor }}
            />
            <h1 className={`font-display font-bold text-lg sm:text-2xl tracking-wider uppercase ${theme.primaryText}`}>
              WIRELESS WEATHER MONITORING SYSTEM
            </h1>
          </div>
          <div className={`font-display text-xs sm:text-sm tracking-widest uppercase font-semibold pl-5 ${theme.accentText}`}>
            LIVE ATMOSPHERIC MONITORING
          </div>
        </div>

        {/* Status Indicators & Location Action */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Weather Condition */}
          {weatherConditionTitle && (
            <div className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border ${theme.accentBg} ${theme.accentText} ${theme.accentBorder}`}>
              {weatherConditionTitle}
            </div>
          )}

          {/* System Online Status (Clean White & Black academic badge) */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-bold transition-colors ${
            isOnline
              ? 'bg-zinc-950 text-white border-zinc-950'
              : 'bg-zinc-200 text-zinc-700 border-zinc-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-white' : 'bg-zinc-500'}`} />
            <span>{isOnline ? 'SYSTEM ONLINE' : 'OFFLINE'}</span>
          </div>

          {/* Live Data Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-bold border ${theme.accentBorder} ${theme.accentBg} ${theme.accentText}`}>
            <span>LIVE DATA</span>
          </div>

          {/* Location Selector Button */}
          <button
            onClick={onOpenSearch}
            className={`px-3.5 py-1 rounded-lg border text-xs font-mono font-semibold transition-all flex items-center gap-2 ${theme.accentBg} ${theme.accentText} ${theme.accentBorder} hover:brightness-95`}
          >
            <span className="max-w-[140px] sm:max-w-[180px] truncate">{currentLocationName}</span>
            <span className="text-[10px] opacity-70">▼</span>
          </button>
        </div>
      </div>
    </div>
  );
};
