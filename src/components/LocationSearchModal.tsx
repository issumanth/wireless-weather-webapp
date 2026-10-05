import React, { useEffect, useState } from 'react';
import { PRESET_LOCATIONS, searchLocations } from '../services/weatherService';
import { MonitoringLocation, WeatherThemeConfig } from '../types/weather';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: MonitoringLocation) => void;
  currentLocation: MonitoringLocation;
  theme: WeatherThemeConfig;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocation,
  theme,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MonitoringLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSearchError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const found = await searchLocations(query);
        setResults(found);
      } catch (err: unknown) {
        setSearchError(err instanceof Error ? err.message : 'Location search failed');
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleDetectCoordinates = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation interface unsupported in this browser.');
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: MonitoringLocation = {
          id: `loc_geo_${Date.now()}`,
          name: 'Detected Station Coordinates',
          country: 'Local Coordinate Node',
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          elevation: Math.round(pos.coords.altitude || 100),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
        };
        setIsGeolocating(false);
        onSelectLocation(loc);
        onClose();
      },
      () => {
        setIsGeolocating(false);
        setSearchError('Unable to acquire GPS fix. Select or search a city manually.');
      },
      { timeout: 8000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all ${theme.cardBg} ${theme.cardBorder}`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor }} />
            <h2 className={`font-display font-bold text-sm sm:text-base tracking-wider uppercase ${theme.primaryText}`}>
              SELECT MONITORING LOCATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-base transition-colors ${theme.secondaryText} hover:bg-black/10 dark:hover:bg-white/10`}
          >
            ✕
          </button>
        </div>

        {/* Search Bar Input */}
        <div className={`p-4 border-b ${theme.cardBorder}`}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, district, state or country..."
              autoFocus
              className={`w-full px-4 py-3 rounded-xl text-sm font-mono border focus:outline-hidden transition-all bg-black/5 dark:bg-white/5 ${theme.cardBorder} ${theme.primaryText} placeholder:opacity-50`}
            />
            {isSearching && (
              <span className={`absolute right-3.5 top-3.5 text-xs font-mono ${theme.accentText}`}>
                Searching...
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={handleDetectCoordinates}
              disabled={isGeolocating}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${theme.accentBg} ${theme.accentText} ${theme.accentBorder} hover:brightness-105 disabled:opacity-50`}
            >
              <span>{isGeolocating ? 'Acquiring GPS...' : 'Detect Coordinates'}</span>
            </button>
            <span className={`text-[11px] font-mono ${theme.secondaryText}`}>Global Geocoding</span>
          </div>

          {searchError && (
            <div className="mt-2 text-xs font-mono text-rose-500 bg-rose-500/10 border border-rose-500/30 p-2 rounded-lg">
              {searchError}
            </div>
          )}
        </div>

        {/* Scrollable Results & Presets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {results.length > 0 && (
            <div>
              <div className={`text-[11px] font-mono uppercase tracking-wider mb-2 ${theme.accentText}`}>
                SEARCH RESULTS ({results.length})
              </div>
              <div className="space-y-1.5">
                {results.map((loc) => {
                  const isCurrent = loc.latitude === currentLocation.latitude && loc.longitude === currentLocation.longitude;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isCurrent
                          ? `${theme.accentBg} ${theme.accentBorder}`
                          : `bg-black/5 dark:bg-white/5 ${theme.cardBorder} hover:shadow-xs`
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-semibold flex items-center gap-2 ${theme.primaryText}`}>
                          <span>{loc.name}</span>
                          {loc.admin1 && <span className={`text-xs ${theme.secondaryText}`}>· {loc.admin1}</span>}
                          <span className={`text-xs font-mono ${theme.accentText}`}>({loc.country})</span>
                        </div>
                        <div className={`text-[11px] font-mono mt-0.5 ${theme.secondaryText}`}>
                          {loc.latitude.toFixed(4)}°N, {loc.longitude.toFixed(4)}°E
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${theme.accentBg} ${theme.accentText}`}>
                          NOW MONITORING
                        </span>
                      ) : (
                        <span className={`text-xs font-mono font-semibold ${theme.accentText}`}>
                          Select →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <div className={`text-[11px] font-mono uppercase tracking-wider mb-2 ${theme.secondaryText}`}>
              GLOBAL STATIONS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_LOCATIONS.map((loc) => {
                const isCurrent = loc.name === currentLocation.name && loc.country === currentLocation.country;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className={`text-left p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? `${theme.accentBg} ${theme.accentBorder}`
                        : `bg-black/5 dark:bg-white/5 ${theme.cardBorder} hover:shadow-xs`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${theme.primaryText}`}>
                        {loc.name}
                      </span>
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.glowColor }} />
                      )}
                    </div>
                    <div className={`text-[10px] font-mono mt-0.5 ${theme.secondaryText}`}>
                      {loc.country} · {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t text-[11px] font-mono flex items-center justify-between bg-black/5 dark:bg-white/5 ${theme.cardBorder} ${theme.secondaryText}`}>
          <span>Select station to synchronize live telemetry</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
