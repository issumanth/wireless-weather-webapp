import React, { useState } from 'react';
import { HourlyTelemetryPoint, WeatherThemeConfig } from '../types/weather';

interface MonitoringAnalyticsProps {
  hourlyList: HourlyTelemetryPoint[];
  tempUnit?: 'C' | 'F';
  speedUnit?: 'km/h' | 'mph';
  theme: WeatherThemeConfig;
}

type MetricChannel = 'temperature' | 'humidity' | 'wind' | 'precipitation' | 'pressure';

export const MonitoringAnalytics: React.FC<MonitoringAnalyticsProps> = ({
  hourlyList,
  tempUnit = 'C',
  speedUnit = 'km/h',
  theme,
}) => {
  const [activeChannel, setActiveChannel] = useState<MetricChannel>('temperature');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = hourlyList.slice(0, 24);

  const displayTemp = (celsius: number) => {
    if (tempUnit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return celsius;
  };

  const displaySpeed = (kmh: number) => {
    if (speedUnit === 'mph') return Math.round(kmh * 0.621371);
    return kmh;
  };

  if (data.length === 0) {
    return (
      <div className={`w-full rounded-2xl p-6 text-center text-xs font-mono border ${theme.cardBg} ${theme.cardBorder} ${theme.secondaryText}`}>
        NO TELEMETRY BUFFER AVAILABLE
      </div>
    );
  }

  let values: number[] = [];
  let unitLabel = '';
  let colorStroke = '#18181b';
  let colorFill = 'rgba(0, 0, 0, 0.04)';

  if (activeChannel === 'temperature') {
    values = data.map((d) => displayTemp(d.temperature));
    unitLabel = `°${tempUnit}`;
  } else if (activeChannel === 'humidity') {
    values = data.map((d) => d.humidity);
    unitLabel = '%';
  } else if (activeChannel === 'wind') {
    values = data.map((d) => displaySpeed(d.windSpeed));
    unitLabel = speedUnit;
  } else if (activeChannel === 'precipitation') {
    values = data.map((d) => d.precipitationProbability);
    unitLabel = '%';
  } else if (activeChannel === 'pressure') {
    values = data.map((d) => d.surfacePressure);
    unitLabel = 'hPa';
  }

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const innerW = svgWidth - paddingX * 2;
  const innerH = svgHeight - paddingY * 2;

  const points = values.map((val, idx) => {
    const x = paddingX + (idx / (values.length - 1)) * innerW;
    const y = svgHeight - paddingY - ((val - minVal) / range) * innerH;
    return { x, y, val, original: data[idx] };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Header and Channel Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-widest ${theme.accentText}`}>
            24-Hour Waveform
          </div>
          <h3 className={`font-display font-bold text-sm sm:text-base tracking-wider uppercase ${theme.primaryText}`}>
            WEATHER MONITORING ANALYTICS
          </h3>
        </div>

        {/* Channel Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl">
          {(['temperature', 'humidity', 'wind', 'precipitation', 'pressure'] as MetricChannel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg capitalize transition-all ${
                activeChannel === ch
                  ? `${theme.accentBg} ${theme.accentText} ${theme.accentBorder} border shadow-xs`
                  : `${theme.secondaryText} hover:${theme.primaryText}`
              }`}
            >
              {ch === 'precipitation' ? 'Rain Prob' : ch}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Chart Stage */}
      <div className="relative w-full overflow-hidden rounded-xl p-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 sm:h-56 cursor-crosshair overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Hairline Grid Lines */}
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="currentColor" strokeOpacity="0.2" />

          {/* Area Fill */}
          <path d={areaD} fill={colorFill} />

          {/* Telemetry Stroke Line */}
          <path d={pathD} fill="none" stroke={colorStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === idx ? 5 : 2.5}
              fill={hoveredIndex === idx ? '#ffffff' : colorStroke}
              stroke={theme.primaryText.includes('white') ? '#0b1021' : '#ffffff'}
              strokeWidth="1.5"
            />
          ))}

          {/* Active Hover Crosshair Line */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingY}
                x2={hoveredPoint.x}
                y2={svgHeight - paddingY}
                stroke={colorStroke}
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6" fill={colorStroke} stroke="#ffffff" strokeWidth="2" />
            </g>
          )}

          {/* Invisible mouse hover trigger columns */}
          {points.map((pt, idx) => {
            const colWidth = innerW / (points.length - 1);
            return (
              <rect
                key={`rect-${idx}`}
                x={pt.x - colWidth / 2}
                y={0}
                width={colWidth}
                height={svgHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(idx)}
              />
            );
          })}
        </svg>

        {/* Hover Monospace Probe HUD Tooltip */}
        {hoveredPoint && (
          <div
            className={`pointer-events-none absolute top-4 left-4 p-2.5 rounded-xl shadow-lg font-mono text-xs z-20 border ${theme.cardBg} ${theme.cardBorder}`}
          >
            <div className={`text-[10px] ${theme.secondaryText}`}>
              TIME: <span className={`font-bold ${theme.primaryText}`}>{hoveredPoint.original.hourDisplay}</span>
            </div>
            <div className={`font-bold text-sm ${theme.accentText}`}>
              {hoveredPoint.val} {unitLabel}
            </div>
          </div>
        )}
      </div>

      {/* Time axis ticks */}
      <div className={`flex justify-between px-2 pt-2 text-[10px] font-mono ${theme.secondaryText}`}>
        <span>{data[0]?.hourDisplay || '00:00'}</span>
        <span>{data[6]?.hourDisplay || '+6h'}</span>
        <span>{data[12]?.hourDisplay || '+12h'}</span>
        <span>{data[18]?.hourDisplay || '+18h'}</span>
        <span>{data[23]?.hourDisplay || '+23h'}</span>
      </div>
    </div>
  );
};
