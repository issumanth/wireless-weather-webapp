import React from 'react';
import { PRESET_LOCATIONS } from '../services/weatherService';
import { MonitoringLocation, WeatherThemeConfig } from '../types/weather';

interface LocationsManagerViewProps {
  currentLocation: MonitoringLocation;
  recentLocations: MonitoringLocation[];
  onSelectLocation: (loc: MonitoringLocation) => void;
  onOpenSearch: () => void;
  theme: WeatherThemeConfig;
}

export const LocationsManagerView: React.FC<LocationsManagerViewProps> = ({
  currentLocation,
  recentLocations,
  onSelectLocation,
  onOpenSearch,
  theme,
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-widest ${theme.accentText}`}>
            Station Network Topology
          </div>
          <h2 className={`font-display font-bold text-lg sm:text-xl uppercase tracking-wider ${theme.primaryText}`}>
            MONITORING LOCATIONS
          </h2>
          <div className={`text-xs font-mono mt-0.5 ${theme.secondaryText}`}>
            Active node: {currentLocation.name}, {currentLocation.country}
          </div>
        </div>

        <button
          onClick={onOpenSearch}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold rounded-xl border transition-all ${theme.accentBg} ${theme.accentText} ${theme.accentBorder} hover:brightness-105`}
        >
          Select Location
        </button>
      </div>

      {/* Currently Monitored Location Node */}
      <div className={`p-5 rounded-2xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor }} />
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
              PRIMARY MONITORING STATION
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-white bg-zinc-950 px-2.5 py-0.5 rounded-md uppercase border border-zinc-950">
            ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <div className={`text-xl font-bold font-display ${theme.primaryText}`}>
              {currentLocation.name}
            </div>
            <div className={`text-xs font-mono ${theme.accentText}`}>
              {currentLocation.country} {currentLocation.admin1 && `· ${currentLocation.admin1}`}
            </div>
          </div>
          <div className="font-mono text-xs">
            <div className={`text-[10px] ${theme.secondaryText}`}>COORDINATES</div>
            <div className={theme.primaryText}>{currentLocation.latitude.toFixed(4)}°N, {currentLocation.longitude.toFixed(4)}°E</div>
          </div>
          <div className="font-mono text-xs">
            <div className={`text-[10px] ${theme.secondaryText}`}>ELEVATION</div>
            <div className={theme.primaryText}>{currentLocation.elevation ?? 500} m above MSL</div>
          </div>
          <div className="font-mono text-xs">
            <div className={`text-[10px] ${theme.secondaryText}`}>TIMEZONE</div>
            <div className={theme.primaryText}>{currentLocation.timezone}</div>
          </div>
        </div>
      </div>

      {/* Preset Global Stations */}
      <div className={`p-5 rounded-2xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display font-bold text-sm tracking-wider uppercase ${theme.primaryText}`}>
            GLOBAL MONITORING STATIONS
          </h3>
          <span className={`text-xs font-mono ${theme.secondaryText}`}>
            Click to switch node
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_LOCATIONS.map((loc) => {
            const isSelected = loc.name === currentLocation.name && loc.country === currentLocation.country;
            return (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? `${theme.accentBg} ${theme.accentBorder} shadow-sm`
                    : `bg-black/5 dark:bg-white/5 ${theme.cardBorder} hover:shadow-xs`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-display font-bold text-sm ${theme.primaryText}`}>
                    {loc.name}
                  </span>
                  {isSelected && (
                    <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${theme.accentBg} ${theme.accentText}`}>
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className={`text-xs font-mono mt-1 ${theme.secondaryText}`}>
                  {loc.country} {loc.admin1 && `· ${loc.admin1}`}
                </div>

                <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={theme.secondaryText}>{loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E</span>
                  <span className={`font-semibold ${theme.accentText}`}>Connect →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Location History */}
      {recentLocations.length > 1 && (
        <div className={`p-5 rounded-2xl border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className={`text-[11px] font-mono uppercase tracking-wider mb-3 ${theme.secondaryText}`}>
            RECENTLY MONITORED NODES
          </div>
          <div className="flex flex-wrap gap-2">
            {recentLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all bg-black/5 dark:bg-white/5 ${theme.cardBorder} hover:shadow-xs ${theme.primaryText}`}
              >
                <span>{loc.name}, {loc.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
