import React, { useEffect, useState } from 'react';
import { TelemetrySystemStatus, WeatherThemeConfig } from '../types/weather';

interface SystemMonitorPanelProps {
  status: TelemetrySystemStatus;
  onRefresh: () => void;
  isSyncing: boolean;
  theme: WeatherThemeConfig;
}

export const SystemMonitorPanel: React.FC<SystemMonitorPanelProps> = ({
  status,
  onRefresh,
  isSyncing,
  theme,
}) => {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - status.lastReceivedTimestamp) / 1000));
      setSecondsAgo(diff);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [status.lastReceivedTimestamp]);

  return (
    <div className={`rounded-2xl p-4 border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 mb-3 border-b ${theme.cardBorder}`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.glowColor }} />
          <h3 className={`font-display font-bold text-sm tracking-wider uppercase ${theme.primaryText}`}>
            SYSTEM MONITOR
          </h3>
        </div>
        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${theme.accentBg} ${theme.accentText} ${theme.accentBorder}`}>
          ONLINE
        </span>
      </div>

      {/* Field List matching exact specification */}
      <div className="space-y-2 text-xs font-mono">
        {/* Connection */}
        <div className="flex items-center justify-between">
          <span className={theme.secondaryText}>Connection:</span>
          <div className="flex items-center gap-1.5 font-bold text-zinc-950">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
            <span>{status.connectionState}</span>
          </div>
        </div>

        {/* Data Transmission */}
        <div className="flex items-center justify-between">
          <span className={theme.secondaryText}>Data transmission:</span>
          <div className="flex items-center gap-1.5 font-bold text-zinc-950">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
            <span>{status.transmissionState}</span>
          </div>
        </div>

        {/* Weather Source */}
        <div className="flex items-center justify-between">
          <span className={theme.secondaryText}>Weather source:</span>
          <span className={`font-bold ${theme.primaryText}`}>
            {status.dataSource}
          </span>
        </div>

        {/* Data status */}
        <div className="flex items-center justify-between">
          <span className={theme.secondaryText}>Data status:</span>
          <div className="flex items-center gap-1.5 font-bold text-zinc-950">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
            <span>{status.dataStatus}</span>
          </div>
        </div>

        {/* Last received */}
        <div className="flex items-center justify-between">
          <span className={theme.secondaryText}>Last received:</span>
          <span className={`font-bold font-mono-data ${theme.accentText}`}>
            {secondsAgo === 0 ? 'Just now' : `${secondsAgo} seconds ago`}
          </span>
        </div>

        {/* Update interval */}
        <div className="flex items-center justify-between">
          <span className={theme.secondaryText}>Update interval:</span>
          <span className={`font-bold font-mono-data ${theme.primaryText}`}>
            {Math.floor(status.updateIntervalSeconds / 60)} minutes
          </span>
        </div>
      </div>

      {/* Sync trigger button */}
      <div className={`mt-3 pt-3 border-t ${theme.cardBorder}`}>
        <button
          onClick={onRefresh}
          disabled={isSyncing}
          className={`w-full py-2 px-3 text-xs font-mono uppercase tracking-wider font-bold rounded-lg border transition-all flex items-center justify-center gap-2 ${theme.accentBg} ${theme.accentText} ${theme.accentBorder} hover:brightness-95 disabled:opacity-50`}
        >
          <span>{isSyncing ? 'Synchronizing...' : 'Synchronize Data'}</span>
        </button>
      </div>
    </div>
  );
};
