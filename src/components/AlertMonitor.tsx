import React from 'react';
import { WeatherAlert, WeatherThemeConfig } from '../types/weather';

interface AlertMonitorProps {
  alerts: WeatherAlert[];
  locationName: string;
  theme: WeatherThemeConfig;
}

export const AlertMonitor: React.FC<AlertMonitorProps> = ({ alerts, locationName, theme }) => {
  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
      <div className={`flex items-center justify-between mb-3 border-b ${theme.cardBorder} pb-2`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.glowColor }} />
          <h3 className={`font-display font-bold text-sm tracking-wider uppercase ${theme.primaryText}`}>
            WEATHER ALERT MONITOR
          </h3>
        </div>
        <span className={`text-[10px] font-mono font-bold uppercase ${theme.secondaryText}`}>
          ZONE: {locationName}
        </span>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-2.5">
          {alerts.map((alert) => {
            const isWarning = alert.severity === 'WARNING';
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isWarning
                    ? 'bg-zinc-100 border-2 border-zinc-950 text-zinc-950'
                    : 'bg-zinc-50 border border-zinc-400 text-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs uppercase tracking-wider">
                      {isWarning ? 'WEATHER WARNING' : 'WEATHER ADVISORY'}
                    </span>
                    <span className="text-[10px] font-mono opacity-60">[{alert.timestamp}]</span>
                  </div>
                  <div className="font-bold text-sm mt-0.5">
                    {alert.title}
                  </div>
                  <div className="text-xs opacity-80 font-mono mt-0.5">
                    {alert.description}
                  </div>
                </div>

                <div className="self-start sm:self-center shrink-0 px-3 py-1 rounded-lg bg-white border border-zinc-400 font-mono text-right">
                  <div className="text-[10px] uppercase opacity-70 font-semibold">{alert.parameter}</div>
                  <div className="text-xs font-bold">{alert.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-300 flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-sm text-zinc-950 uppercase tracking-wide">
              NO ACTIVE WEATHER WARNINGS
            </div>
            <div className={`text-xs font-mono mt-0.5 ${theme.secondaryText}`}>
              Atmospheric conditions for {locationName} are currently within nominal limits.
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-white bg-zinc-950 px-2.5 py-1 rounded-md uppercase">
            NOMINAL
          </div>
        </div>
      )}
    </div>
  );
};
