import React from 'react';
import { TelemetrySystemStatus, WeatherThemeConfig } from '../types/weather';

interface SystemConfigViewProps {
  status: TelemetrySystemStatus;
  tempUnit: 'C' | 'F';
  speedUnit: 'km/h' | 'mph';
  onToggleTempUnit: (unit: 'C' | 'F') => void;
  onToggleSpeedUnit: (unit: 'km/h' | 'mph') => void;
  onSetUpdateInterval: (intervalSec: number) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  theme: WeatherThemeConfig;
  manualThemeId: string;
  onSetThemeId: (id: 'white-black' | 'black-white') => void;
}

export const SystemConfigView: React.FC<SystemConfigViewProps> = ({
  status,
  tempUnit,
  speedUnit,
  onToggleTempUnit,
  onToggleSpeedUnit,
  onSetUpdateInterval,
  onTriggerSync,
  isSyncing,
  theme,
  manualThemeId,
  onSetThemeId,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${theme.cardBg} ${theme.cardBorder}`}>
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-widest ${theme.accentText}`}>
            Diagnostics & Preferences
          </div>
          <h2 className={`font-display font-bold text-lg sm:text-xl uppercase tracking-wider ${theme.primaryText}`}>
            SYSTEM STATUS & CONFIGURATION
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-white bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-950 font-bold">
          <span>NOMINAL</span>
        </div>
      </div>

      {/* College Representation Theme Switcher */}
      <div className={`p-5 rounded-2xl border transition-all space-y-3 ${theme.cardBg} ${theme.cardBorder}`}>
        <div className={`text-xs font-bold uppercase tracking-wider font-mono ${theme.accentText}`}>
          PRESENTATION THEME (COLLEGE REPRESENTATION)
        </div>
        <p className={`text-xs ${theme.secondaryText}`}>
          High-contrast academic engineering palette configured for college presentation, projector displays, and viva review.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            { id: 'white-black', label: 'White & Black (College Presentation Default)' },
            { id: 'black-white', label: 'Black & White (High Contrast Dark Mode)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSetThemeId(item.id as 'white-black' | 'black-white')}
              className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                manualThemeId === item.id
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Status Grid */}
      <div className={`p-5 rounded-2xl border transition-all space-y-4 font-mono text-xs ${theme.cardBg} ${theme.cardBorder}`}>
        <div className={`text-xs font-bold uppercase tracking-wider pb-2 border-b border-black/10 dark:border-white/10 ${theme.accentText}`}>
          TELEMETRY PARAMETERS
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className={`p-3 rounded-xl border bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
            <div className={`text-[10px] ${theme.secondaryText}`}>DATA SOURCE</div>
            <div className={`text-sm font-bold mt-1 ${theme.primaryText}`}>{status.dataSource}</div>
          </div>

          <div className={`p-3 rounded-xl border bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
            <div className={`text-[10px] ${theme.secondaryText}`}>LINK PROTOCOL</div>
            <div className={`text-sm font-bold mt-1 ${theme.accentText}`}>HTTPS / REST</div>
          </div>

          <div className={`p-3 rounded-xl border bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
            <div className={`text-[10px] ${theme.secondaryText}`}>LATENCY</div>
            <div className="text-sm font-bold text-zinc-950 mt-1">{status.latencyMs} ms</div>
          </div>

          <div className={`p-3 rounded-xl border bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
            <div className={`text-[10px] ${theme.secondaryText}`}>PACKETS RECEIVED</div>
            <div className={`text-sm font-bold mt-1 font-mono-data ${theme.primaryText}`}>{status.packetsReceived}</div>
          </div>

          <div className={`p-3 rounded-xl border bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
            <div className={`text-[10px] ${theme.secondaryText}`}>PIPELINE STATUS</div>
            <div className="text-sm font-bold text-zinc-950 mt-1">STREAMING ACTIVE</div>
          </div>

          <div className={`p-3 rounded-xl border bg-black/5 dark:bg-white/5 ${theme.cardBorder}`}>
            <div className={`text-[10px] ${theme.secondaryText}`}>ENGINE</div>
            <div className={`text-sm font-bold mt-1 ${theme.accentText}`}>Real-time Telemetry</div>
          </div>
        </div>
      </div>

      {/* Units Preferences */}
      <div className={`p-5 rounded-2xl border transition-all space-y-4 ${theme.cardBg} ${theme.cardBorder}`}>
        <div className={`text-xs font-bold uppercase tracking-wider pb-2 border-b border-black/10 dark:border-white/10 font-mono ${theme.accentText}`}>
          MEASUREMENT UNITS
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Temperature Units */}
          <div className={`p-4 rounded-xl border bg-zinc-50 ${theme.cardBorder}`}>
            <div className={`text-xs font-mono mb-2 font-bold ${theme.primaryText}`}>
              TEMPERATURE
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleTempUnit('C')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  tempUnit === 'C'
                    ? 'bg-zinc-950 text-white border border-zinc-950 shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => onToggleTempUnit('F')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  tempUnit === 'F'
                    ? 'bg-zinc-950 text-white border border-zinc-950 shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Speed Units */}
          <div className={`p-4 rounded-xl border bg-zinc-50 ${theme.cardBorder}`}>
            <div className={`text-xs font-mono mb-2 font-bold ${theme.primaryText}`}>
              WIND VELOCITY
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleSpeedUnit('km/h')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  speedUnit === 'km/h'
                    ? 'bg-zinc-950 text-white border border-zinc-950 shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                }`}
              >
                km/h
              </button>
              <button
                onClick={() => onToggleSpeedUnit('mph')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  speedUnit === 'mph'
                    ? 'bg-zinc-950 text-white border border-zinc-950 shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                }`}
              >
                mph
              </button>
            </div>
          </div>

          {/* Sync Interval */}
          <div className={`p-4 rounded-xl border sm:col-span-2 bg-zinc-50 ${theme.cardBorder}`}>
            <div className="flex items-center justify-between text-xs font-mono mb-2 font-bold">
              <span className={theme.primaryText}>UPDATE INTERVAL</span>
              <span className={theme.accentText}>{Math.floor(status.updateIntervalSeconds / 60)} Minutes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[60, 180, 300, 600].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onSetUpdateInterval(sec)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                    status.updateIntervalSeconds === sec
                      ? 'bg-zinc-950 text-white border border-zinc-950 shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                  }`}
                >
                  {sec / 60}m
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="w-full py-2.5 text-xs font-mono uppercase tracking-wider font-bold rounded-xl border transition-all flex items-center justify-center gap-2 bg-zinc-950 text-white border-zinc-950 hover:brightness-110 disabled:opacity-50"
          >
            <span>{isSyncing ? 'Synchronizing...' : 'Force Synchronize Telemetry'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
