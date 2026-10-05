import React, { useEffect, useRef } from 'react';
import { TelemetrySystemStatus, WeatherThemeConfig } from '../types/weather';

interface DataTransmissionLinkProps {
  status: TelemetrySystemStatus;
  onManualSync: () => void;
  isSyncing: boolean;
  theme: WeatherThemeConfig;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
}

export const DataTransmissionLink: React.FC<DataTransmissionLinkProps> = ({
  status,
  onManualSync,
  isSyncing,
  theme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particleCount = 40;
    const particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 700;
      canvas.height = 36;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles along the pipeline
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height / 2 + (Math.random() - 0.5) * 8,
        speed: 1.2 + Math.random() * 1.8,
        size: 2.2 + Math.random() * 2.0,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Draw faint guideline pipe
      ctx.beginPath();
      ctx.moveTo(10, centerY);
      ctx.lineTo(w - 10, centerY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw dashed data line
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(10, centerY);
      ctx.lineTo(w - 10, centerY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw & update flowing particles
      particles.forEach((p) => {
        p.x += p.speed;
        if (p.x > w) {
          p.x = 0;
          p.y = centerY + (Math.random() - 0.5) * 8;
        }

        // Particle dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme.particleColor;
        ctx.shadowColor = theme.particleColor;
        ctx.shadowBlur = 4;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Subtle particle tail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speed * 6, p.y);
        ctx.strokeStyle = theme.particleColor;
        ctx.lineWidth = p.size * 0.7;
        ctx.globalAlpha = p.alpha * 0.35;
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme.particleColor]);

  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 border transition-all ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.glowColor }} />
          <span className={`font-display font-bold text-xs uppercase tracking-wider ${theme.accentText}`}>
            WIRELESS DATA TRANSMISSION PIPELINE
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Signal Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-300 text-xs font-mono">
            <span className={theme.secondaryText}>SIGNAL</span>
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 h-1.5 rounded-xs bg-zinc-900" />
              <span className="w-1 h-2 rounded-xs bg-zinc-900" />
              <span className="w-1 h-2.5 rounded-xs bg-zinc-900" />
              <span className="w-1 h-3 rounded-xs bg-zinc-900" />
            </div>
            <span className={`font-bold ml-1 ${theme.primaryText}`}>{status.latencyMs}ms</span>
          </div>

          {/* Sync Trigger */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${theme.accentBg} ${theme.accentText} ${theme.accentBorder} hover:brightness-95 disabled:opacity-50`}
          >
            <span>{isSyncing ? 'Synchronizing...' : 'Synchronize Data'}</span>
          </button>
        </div>
      </div>

      {/* 3 Main Labeled Elements Connected by Flowing Particle Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Source Element: WEATHER DATA PROVIDER */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className={theme.secondaryText}>SOURCE NODE</span>
            <span className="font-bold text-zinc-950">ACTIVE</span>
          </div>
          <div className={`text-sm font-bold font-display ${theme.primaryText}`}>
            WEATHER DATA PROVIDER
          </div>
          <div className={`text-xs font-mono mt-0.5 ${theme.accentText}`}>
            {status.dataSource} Global Model
          </div>
        </div>

        {/* Transmission Element: WIRELESS DATA LINK */}
        <div className={`relative p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all ${theme.cardBg} ${theme.accentBorder}`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className={theme.secondaryText}>TRANSMISSION LINK</span>
            <span className={`font-bold ${theme.accentText}`}>STREAMING</span>
          </div>
          <div className={`text-sm font-bold font-display ${theme.primaryText}`}>
            WIRELESS DATA LINK
          </div>
          <div className={`text-xs font-mono mt-0.5 ${theme.accentText}`}>
            Internet / HTTPS Telemetry
          </div>
        </div>

        {/* Destination Element: MONITORING SYSTEM */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className={theme.secondaryText}>RECEIVER NODE</span>
            <span className="font-bold text-zinc-950">ONLINE</span>
          </div>
          <div className={`text-sm font-bold font-display ${theme.primaryText}`}>
            MONITORING SYSTEM
          </div>
          <div className={`text-xs font-mono mt-0.5 ${theme.accentText}`}>
            Live Atmospheric Control
          </div>
        </div>
      </div>

      {/* Animated Flowing Particles Ribbon (Continuous Data Transmission) */}
      <div className="relative mt-3 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-200">
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 text-[10px] font-mono opacity-60">
          <span className={theme.secondaryText}>Data Flow ──▶</span>
          <span className={theme.secondaryText}>Continuous Packet Transmission</span>
          <span className={theme.secondaryText}>──▶ Ingestion</span>
        </div>
      </div>
    </div>
  );
};
