import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SparklineProps {
  data?: number[];
  badgeText?: string;
  strokeColor?: string;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data = [38, 42, 36, 48, 44, 58, 64],
  badgeText,
  strokeColor = '#EC4899',
  width = 200,
  height = 56,
}) => {
  const values = data.length >= 2 ? data : [35, 42, 38, 52, 48, 62];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padX = 10;
  const padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = padY + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });

  // Build smooth cubic bezier path
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cpx1 = curr.x + (next.x - curr.x) * 0.45;
      const cpy1 = curr.y;
      const cpx2 = curr.x + (next.x - curr.x) * 0.55;
      const cpy2 = next.y;
      d += ` C ${cpx1.toFixed(1)} ${cpy1.toFixed(1)}, ${cpx2.toFixed(1)} ${cpy2.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const highlightPoint = points[points.length - 2] || points[points.length - 1];

  return (
    <div className="relative w-full select-none">
      {badgeText && (
        <div
          className="absolute -top-1 right-2 px-2 py-0.5 rounded-full bg-[#FCFBF9] border border-[#E6E2D8] text-[10px] font-semibold text-[#141414] tabular-nums shadow-2xs"
        >
          {badgeText}
        </div>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height }}
      >
        {/* Subtle vertical dashed guide lines like Image 3 */}
        {[0.2, 0.45, 0.7, 0.9].map((ratio, idx) => (
          <line
            key={idx}
            x1={padX + innerW * ratio}
            y1={4}
            x2={padX + innerW * ratio}
            y2={height - 2}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
        ))}

        {/* Smooth curve */}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Highlighted node with soft halo */}
        {highlightPoint && (
          <g>
            <circle
              cx={highlightPoint.x}
              cy={highlightPoint.y}
              r="6"
              fill={strokeColor}
              fillOpacity="0.22"
            />
            <circle
              cx={highlightPoint.x}
              cy={highlightPoint.y}
              r="3"
              fill={strokeColor}
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export const GeometricRings: React.FC<{ className?: string }> = ({ className = 'h-9' }) => (
  <svg
    viewBox="0 0 120 44"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle cx="22" cy="22" r="19" stroke="#F687EA" strokeWidth="1.25" />
    <path
      d="M46 3 A19 19 0 0 1 46 41 Z"
      stroke="#F687EA"
      strokeWidth="1.25"
    />
    <path
      d="M66 3 A19 19 0 0 1 66 41 Z"
      stroke="#F687EA"
      strokeWidth="1.25"
    />
    <path
      d="M86 3 A19 19 0 0 1 86 41 Z"
      stroke="#F687EA"
      strokeWidth="1.25"
    />
  </svg>
);

export const CircularArrow: React.FC<{ dark?: boolean; variant?: 'light' | 'dark'; size?: 'sm' | 'md' }> = ({
  dark = false,
  variant,
  size = 'md',
}) => {
  const isDark = dark || variant === 'dark';
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  return (
    <span
      className={`${dim} rounded-full border flex items-center justify-center transition-transform group-hover:translate-x-0.5 shrink-0 ${
        isDark
          ? 'border-[#F8A5F8]/50 text-[#F8A5F8]'
          : 'border-[#141414] text-[#141414]'
      }`}
    >
      <ArrowRight className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
    </span>
  );
};
