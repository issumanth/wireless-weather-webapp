import React from 'react';
import { WeatherThemeConfig } from '../types/weather';

interface FooterProps {
  theme: WeatherThemeConfig;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer className={`w-full py-8 px-4 sm:px-6 mt-8 text-center font-mono border-t transition-all ${theme.headerBg} ${theme.cardBorder}`}>
      <div className="max-w-7xl mx-auto space-y-2">
        <div className={`font-display font-bold text-base sm:text-lg tracking-wider uppercase ${theme.primaryText}`}>
          WIRELESS WEATHER MONITORING SYSTEM
        </div>
        <div className={`text-xs sm:text-sm font-semibold ${theme.accentText}`}>
          Real-time atmospheric monitoring through wireless Internet data.
        </div>

        <div className={`pt-2 text-xs flex flex-wrap items-center justify-center gap-4 ${theme.secondaryText}`}>
          <div>
            <span className="uppercase">DATA SOURCE: </span>
            <span className={`font-semibold ${theme.primaryText}`}>Open-Meteo</span>
          </div>
          <span>·</span>
          <div>
            <span className="uppercase">TELEMETRY LINK: </span>
            <span className={`font-semibold ${theme.primaryText}`}>Internet / HTTPS</span>
          </div>
          <span>·</span>
          <div>
            <span className="uppercase">ENGINE: </span>
            <span className={`font-semibold ${theme.primaryText}`}>Live Telemetry Processing Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
