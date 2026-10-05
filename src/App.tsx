import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertMonitor } from './components/AlertMonitor';
import { DataTransmissionLink } from './components/DataTransmissionLink';
import { Footer } from './components/Footer';
import { ForecastMonitoringView } from './components/ForecastMonitoringView';
import { LocationsManagerView } from './components/LocationsManagerView';
import { LocationSearchModal } from './components/LocationSearchModal';
import { MonitoringAnalytics } from './components/MonitoringAnalytics';
import { MonitoringPanels } from './components/MonitoringPanels';
import { MonitoringTimeline } from './components/MonitoringTimeline';
import { HeaderBanner } from './components/HeaderBanner';
import { ObjectInspectorModal } from './components/ObjectInspectorModal';
import { SystemConfigView } from './components/SystemConfigView';
import { SystemEventLog } from './components/SystemEventLog';
import { SystemMonitorPanel } from './components/SystemMonitorPanel';
import { WeatherMonitorsGrid } from './components/WeatherMonitorsGrid';
import {
  DEFAULT_LOCATION,
  decodeWmoWeather,
  fetchLiveWeatherTelemetry,
} from './services/weatherService';
import {
  AtmosphericTelemetry,
  DailyTelemetryPoint,
  HourlyTelemetryPoint,
  InteractiveTarget,
  MonitoringLocation,
  SystemLogEvent,
  TelemetrySystemStatus,
  WeatherAlert,
  WeatherThemeConfig,
  THEME_WHITE_BLACK,
  THEME_BLACK_WHITE,
} from './types/weather';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<MonitoringLocation>(DEFAULT_LOCATION);
  const [recentLocations, setRecentLocations] = useState<MonitoringLocation[]>([DEFAULT_LOCATION]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeInspectorTarget, setActiveInspectorTarget] = useState<InteractiveTarget>(null);

  // Timeline offset selection (0 = Current, 1, 3, 6, 12, 24)
  const [selectedTimelineOffset, setSelectedTimelineOffset] = useState<number>(0);

  // User Settings
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [speedUnit, setSpeedUnit] = useState<'km/h' | 'mph'>('km/h');
  const [updateIntervalSeconds, setUpdateIntervalSeconds] = useState<number>(300);
  const [manualThemeId, setManualThemeId] = useState<'white-black' | 'black-white'>('white-black');

  // Live Telemetry Data States
  const [telemetry, setTelemetry] = useState<AtmosphericTelemetry | null>(null);
  const [hourlyList, setHourlyList] = useState<HourlyTelemetryPoint[]>([]);
  const [dailyList, setDailyList] = useState<DailyTelemetryPoint[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // System Status
  const [systemStatus, setSystemStatus] = useState<TelemetrySystemStatus>({
    connectionState: 'ONLINE',
    transmissionState: 'ACTIVE',
    dataSource: 'Open-Meteo',
    wirelessProtocol: 'HTTPS / REST',
    dataStatus: 'LIVE',
    lastReceivedTimestamp: Date.now(),
    updateIntervalSeconds: 300,
    packetsReceived: 1,
    latencyMs: 120,
  });

  // Rolling System Event Log
  const [eventLogs, setEventLogs] = useState<SystemLogEvent[]>([
    {
      id: 'log_init',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      category: 'system',
      message: 'Wireless Weather Monitoring System initialized',
      status: 'nominal',
    },
    {
      id: 'log_link',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      category: 'system',
      message: 'Wireless connection active (Internet / HTTPS)',
      status: 'active',
    },
  ]);

  const addLogEvent = useCallback((message: string, status: SystemLogEvent['status'] = 'nominal') => {
    const newEvt: SystemLogEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      category: 'data',
      message,
      status,
    };
    setEventLogs((prev) => [newEvt, ...prev].slice(0, 30));
  }, []);

  // Main Telemetry Synchronization Procedure
  const syncTelemetryData = useCallback(async (loc: MonitoringLocation, isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setIsSyncing(true);
    setFetchError(null);

    try {
      const result = await fetchLiveWeatherTelemetry(loc);

      setTelemetry(result.telemetry);
      setHourlyList(result.hourly);
      setDailyList(result.daily);
      setAlerts(result.alerts);

      const now = Date.now();
      setSystemStatus((prev) => ({
        ...prev,
        connectionState: 'ONLINE',
        transmissionState: 'ACTIVE',
        dataStatus: 'LIVE',
        lastReceivedTimestamp: now,
        latencyMs: result.latencyMs,
        packetsReceived: prev.packetsReceived + 1,
      }));

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const newItems: SystemLogEvent[] = [
        {
          id: `log_data_${Date.now()}`,
          timestamp: timeStr,
          category: 'data',
          message: `Weather data received for ${loc.name}`,
          status: 'nominal',
        },
        {
          id: `log_wind_${Date.now()}`,
          timestamp: timeStr,
          category: 'telemetry',
          message: `Wind updated (${result.telemetry.windSpeed} km/h ${result.telemetry.windDirection}°)`,
          status: 'nominal',
        },
        {
          id: `log_hum_${Date.now()}`,
          timestamp: timeStr,
          category: 'telemetry',
          message: `Humidity updated (${result.telemetry.relativeHumidity}%)`,
          status: 'nominal',
        },
        {
          id: `log_temp_${Date.now()}`,
          timestamp: timeStr,
          category: 'telemetry',
          message: `Temperature updated (${result.telemetry.temperature}°C)`,
          status: 'nominal',
        },
      ];
      setEventLogs((prev) => [...newItems, ...prev].slice(0, 30));

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Telemetry sync failed';
      setFetchError(msg);
      setSystemStatus((prev) => ({
        ...prev,
        connectionState: 'OFFLINE',
        transmissionState: 'ERROR',
        dataStatus: 'ERROR',
      }));
      addLogEvent(`Connection error: ${msg}`, 'warning');
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [addLogEvent]);

  useEffect(() => {
    syncTelemetryData(currentLocation, true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      syncTelemetryData(currentLocation, false);
    }, updateIntervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [currentLocation, updateIntervalSeconds, syncTelemetryData]);

  const handleSelectLocation = (loc: MonitoringLocation) => {
    setCurrentLocation(loc);
    setSelectedTimelineOffset(0);
    setRecentLocations((prev) => {
      const filtered = prev.filter((item) => item.id !== loc.id && item.name !== loc.name);
      return [loc, ...filtered].slice(0, 8);
    });

    addLogEvent(`Switching node to ${loc.name}, ${loc.country}`, 'active');
    syncTelemetryData(loc, false);
  };

  // Derive effective telemetry based on selected timeline offset
  const effectiveTelemetry: AtmosphericTelemetry | null = useMemo(() => {
    if (!telemetry) return null;
    if (selectedTimelineOffset === 0 || hourlyList.length === 0) {
      return telemetry;
    }

    const point = hourlyList[selectedTimelineOffset] || hourlyList[hourlyList.length - 1];
    if (!point) return telemetry;

    const condition = decodeWmoWeather(point.weatherCode, telemetry.isDay);

    return {
      ...telemetry,
      temperature: point.temperature,
      relativeHumidity: point.humidity,
      dewPoint: point.dewPoint,
      surfacePressure: point.surfacePressure,
      windSpeed: point.windSpeed,
      precipitation: point.precipitation,
      precipitationProbability: point.precipitationProbability,
      cloudCover: point.cloudCover,
      uvIndex: point.uvIndex,
      visibility: point.visibility,
      weatherCode: point.weatherCode,
      weatherCondition: condition,
    };
  }, [telemetry, selectedTimelineOffset, hourlyList]);

  // College representation White & Black theme
  const activeTheme: WeatherThemeConfig = useMemo(() => {
    if (manualThemeId === 'black-white') {
      return THEME_BLACK_WHITE;
    }
    return THEME_WHITE_BLACK;
  }, [manualThemeId]);

  return (
    <div className={`min-h-screen ${activeTheme.pageBg} transition-colors duration-500 flex flex-col font-sans`}>
      {/* Main Single-Page Content: All sections rendered one after the other */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-8 space-y-6">
        {/* 1. Header (WIRELESS WEATHER MONITORING SYSTEM · LIVE ATMOSPHERIC MONITORING) */}
        <HeaderBanner
          status={systemStatus}
          onOpenSearch={() => setIsSearchOpen(true)}
          currentLocationName={currentLocation.name}
          theme={activeTheme}
          weatherConditionTitle={effectiveTelemetry?.weatherCondition.title}
        />
        {/* Error notification if connection lost */}
        {fetchError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-xs font-mono text-rose-600 dark:text-rose-400">
            <div>
              <span className="font-bold">CONNECTION ERROR: </span>
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => syncTelemetryData(currentLocation, false)}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg transition-colors font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* 2. Wireless Data Transmission Pipeline (Subtle continuous flowing particles) */}
        <DataTransmissionLink
          status={systemStatus}
          onManualSync={() => syncTelemetryData(currentLocation, false)}
          isSyncing={isSyncing}
          theme={activeTheme}
        />

        {/* 3. System Monitor & Active Node Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Active Station Overview */}
          <div className={`md:col-span-2 p-5 rounded-2xl border transition-all flex flex-col justify-between ${activeTheme.cardBg} ${activeTheme.cardBorder}`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${activeTheme.accentText}`}>
                  NOW MONITORING STATION
                </span>
                <span className="text-[10px] font-mono font-bold text-white bg-zinc-950 px-2.5 py-0.5 rounded-md uppercase border border-zinc-950">
                  ONLINE
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 mt-1">
                <div>
                  <h2 className={`font-display font-bold text-2xl sm:text-3xl ${activeTheme.primaryText}`}>
                    {currentLocation.name}
                  </h2>
                  <div className={`text-xs font-mono ${activeTheme.secondaryText}`}>
                    {currentLocation.country} {currentLocation.admin1 && `· ${currentLocation.admin1}`}
                  </div>
                </div>

                {effectiveTelemetry && (
                  <div className="text-right">
                    <div className={`text-xs font-mono font-semibold ${activeTheme.accentText}`}>
                      {effectiveTelemetry.weatherCondition.title}
                    </div>
                    <div className={`font-mono-data text-2xl font-bold ${activeTheme.primaryText}`}>
                      {tempUnit === 'F' ? Math.round((effectiveTelemetry.temperature * 9) / 5 + 32) : effectiveTelemetry.temperature}°{tempUnit}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-black/10 dark:border-white/10 text-xs font-mono">
              <div>
                <span className={`text-[10px] block ${activeTheme.secondaryText}`}>COORDINATES</span>
                <span className={activeTheme.primaryText}>
                  {currentLocation.latitude.toFixed(2)}°, {currentLocation.longitude.toFixed(2)}°
                </span>
              </div>
              <div>
                <span className={`text-[10px] block ${activeTheme.secondaryText}`}>ELEVATION</span>
                <span className={activeTheme.primaryText}>{currentLocation.elevation ?? 500} m</span>
              </div>
              <div>
                <span className={`text-[10px] block ${activeTheme.secondaryText}`}>TIMEZONE</span>
                <span className={activeTheme.primaryText}>{currentLocation.timezone}</span>
              </div>
            </div>
          </div>

          {/* System Monitor Status Panel */}
          <div className="md:col-span-1">
            <SystemMonitorPanel
              status={systemStatus}
              onRefresh={() => syncTelemetryData(currentLocation, false)}
              isSyncing={isSyncing}
              theme={activeTheme}
            />
          </div>
        </div>

        {/* 4. Atmospheric Telemetry Metrics Panels */}
        {effectiveTelemetry && (
          <MonitoringPanels
            telemetry={effectiveTelemetry}
            onInspect={(target) => setActiveInspectorTarget(target)}
            tempUnit={tempUnit}
            speedUnit={speedUnit}
            theme={activeTheme}
          />
        )}

        {/* 5. The 5 Live Atmospheric Monitors (Sun, Cloud, Precipitation, Wind, Location) */}
        {effectiveTelemetry && (
          <WeatherMonitorsGrid
            telemetry={effectiveTelemetry}
            location={currentLocation}
            speedUnit={speedUnit}
            theme={activeTheme}
            onOpenLocationSearch={() => setIsSearchOpen(true)}
          />
        )}

        {/* 6. Live Monitoring Timeline (Current, Next 1h, 3h, 6h, 12h, 24h) */}
        {effectiveTelemetry && (
          <MonitoringTimeline
            currentTelemetry={effectiveTelemetry}
            hourlyList={hourlyList}
            selectedHourOffset={selectedTimelineOffset}
            onSelectOffset={setSelectedTimelineOffset}
            tempUnit={tempUnit}
            speedUnit={speedUnit}
            theme={activeTheme}
          />
        )}

        {/* 7. Weather Monitoring Analytics (24-Hour Waveform Graphs) */}
        <MonitoringAnalytics
          hourlyList={hourlyList}
          tempUnit={tempUnit}
          speedUnit={speedUnit}
          theme={activeTheme}
        />

        {/* 8. Weather Alert Monitor */}
        <AlertMonitor alerts={alerts} locationName={currentLocation.name} theme={activeTheme} />

        {/* 9. 7-Day Forecast Monitoring Grid */}
        <ForecastMonitoringView
          dailyList={dailyList}
          location={currentLocation}
          tempUnit={tempUnit}
          speedUnit={speedUnit}
          theme={activeTheme}
        />

        {/* 10. Monitoring Locations Station Network */}
        <LocationsManagerView
          currentLocation={currentLocation}
          recentLocations={recentLocations}
          onSelectLocation={handleSelectLocation}
          onOpenSearch={() => setIsSearchOpen(true)}
          theme={activeTheme}
        />

        {/* 11. System Configuration & Preferences */}
        <SystemConfigView
          status={systemStatus}
          tempUnit={tempUnit}
          speedUnit={speedUnit}
          onToggleTempUnit={setTempUnit}
          onToggleSpeedUnit={setSpeedUnit}
          onSetUpdateInterval={(sec) => {
            setUpdateIntervalSeconds(sec);
            setSystemStatus((prev) => ({ ...prev, updateIntervalSeconds: sec }));
          }}
          onTriggerSync={() => syncTelemetryData(currentLocation, false)}
          isSyncing={isSyncing}
          theme={activeTheme}
          manualThemeId={manualThemeId}
          onSetThemeId={setManualThemeId}
        />

        {/* 12. System Event Log */}
        <SystemEventLog
          events={eventLogs}
          onClear={() => setEventLogs([])}
          theme={activeTheme}
        />
      </main>

      {/* Interactive Object Inspector Modal for clicked parameter details */}
      <ObjectInspectorModal
        target={activeInspectorTarget}
        telemetry={effectiveTelemetry}
        location={currentLocation}
        onClose={() => setActiveInspectorTarget(null)}
        tempUnit={tempUnit}
        speedUnit={speedUnit}
        theme={activeTheme}
      />

      {/* Location Search Modal */}
      <LocationSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLocation={handleSelectLocation}
        currentLocation={currentLocation}
        theme={activeTheme}
      />

      {/* 13. Footer */}
      <Footer theme={activeTheme} />
    </div>
  );
}
