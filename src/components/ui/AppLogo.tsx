import React from 'react';

interface AppLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'badge' | 'plain' | 'circle';
  withShadow?: boolean;
  alt?: string;
}

/**
 * Official Glow Up Lab Logo
 * Recreates faithfully the 5-petal white flower emblem with the central magenta sparkle star
 * on a soft pastel blush background.
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  size = 36,
  className = '',
  variant = 'badge',
  withShadow = false,
  alt = 'Glow Up Lab Logo',
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const rx = variant === 'circle' ? '256' : variant === 'badge' ? '128' : '0';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      style={{ width: pixelSize, height: pixelSize }}
      className={`inline-block select-none shrink-0 ${withShadow ? 'shadow-xs' : ''} ${className}`}
      role="img"
      aria-label={alt}
    >
      <defs>
        {/* Subtle radial glow matching the original brand aesthetic */}
        <radialGradient id="flowerBgGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#EDB2D3" />
          <stop offset="100%" stopColor="#E599C0" />
        </radialGradient>
      </defs>

      {/* Background squircle / circle if badge or circle variant */}
      {variant !== 'plain' && (
        <rect width="512" height="512" rx={rx} fill="url(#flowerBgGlow)" />
      )}

      {/* 5-Petal Organic Flower in Crisp Porcelain White */}
      <g fill="#FFFFFF">
        {/* Petal 1 (Top / 12 o'clock) */}
        <ellipse cx="256" cy="180" rx="66" ry="88" transform="rotate(0 256 256)" />
        {/* Petal 2 (Top-Right / 72 deg) */}
        <ellipse cx="256" cy="180" rx="66" ry="88" transform="rotate(72 256 256)" />
        {/* Petal 3 (Bottom-Right / 144 deg) */}
        <ellipse cx="256" cy="180" rx="66" ry="88" transform="rotate(144 256 256)" />
        {/* Petal 4 (Bottom-Left / 216 deg) */}
        <ellipse cx="256" cy="180" rx="66" ry="88" transform="rotate(216 256 256)" />
        {/* Petal 5 (Top-Left / 288 deg) */}
        <ellipse cx="256" cy="180" rx="66" ry="88" transform="rotate(288 256 256)" />
        {/* Center core filling to merge petals seamlessly */}
        <circle cx="256" cy="256" r="75" />
      </g>

      {/* Signature 4-Point Sparkle / Star in Vibrant Magenta Pink */}
      <path
        d="M 256 195 Q 256 256 317 256 Q 256 256 256 317 Q 256 256 195 256 Q 256 256 256 195 Z"
        fill="#D9468F"
      />
    </svg>
  );
};
