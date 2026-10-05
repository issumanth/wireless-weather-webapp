import React from 'react';
import { SystemLogEvent, WeatherThemeConfig } from '../types/weather';

interface SystemEventLogProps {
  events: SystemLogEvent[];
  onClear?: () => void;
  theme: WeatherThemeConfig;
}

export const SystemEventLog: React.FC<SystemEventLogProps> = ({ events, onClear, theme }) => {
  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 mb-3 border-b ${theme.cardBorder}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.glowColor }} />
          <h3 className={`font-display font-bold text-sm tracking-wider uppercase ${theme.primaryText}`}>
            SYSTEM EVENT LOG
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono uppercase ${theme.secondaryText}`}>
            TELEMETRY FEED
          </span>
          {onClear && (
            <button
              onClick={onClear}
              className={`text-[10px] font-mono hover:underline ${theme.accentText}`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 font-mono text-xs">
        {events.length === 0 ? (
          <div className={`text-center py-4 text-[11px] ${theme.secondaryText}`}>
            Awaiting telemetry events...
          </div>
        ) : (
          events.slice(0, 15).map((evt) => {
            const isWarn = evt.status === 'warning';
            return (
              <div
                key={evt.id}
                className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span className={`font-mono-data text-[11px] shrink-0 ${theme.secondaryText}`}>
                  {evt.timestamp}
                </span>

                <span className={`text-[7px] ${isWarn ? 'text-zinc-950 font-bold' : 'text-zinc-500'}`}>
                  ●
                </span>

                <span className={`truncate ${isWarn ? 'text-zinc-950 font-bold' : theme.primaryText}`}>
                  {evt.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
