export function TenthsLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Carbon fiber weave pattern */}
        <pattern id="carbonWeave" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="rgba(255,255,255,0.04)" />
          <rect x="2" y="2" width="2" height="2" fill="rgba(255,255,255,0.04)" />
        </pattern>
        {/* Gradient for the glow */}
        <linearGradient id="logoGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00B4FF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#00B4FF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#00B4FF" stopOpacity="0.2" />
        </linearGradient>
        {/* Brushed metal edge */}
        <linearGradient id="metalEdge" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3A3A4A" />
          <stop offset="40%" stopColor="#2A2A3A" />
          <stop offset="60%" stopColor="#3A3A4A" />
          <stop offset="100%" stopColor="#2A2A3A" />
        </linearGradient>
      </defs>

      {/* Outer shell — brushed metal border */}
      <rect x="1" y="1" width="46" height="46" rx="10" fill="url(#metalEdge)" />

      {/* Inner body — deep carbon */}
      <rect x="2.5" y="2.5" width="43" height="43" rx="8.5" fill="#0F0F1A" />

      {/* Carbon texture overlay */}
      <rect x="2.5" y="2.5" width="43" height="43" rx="8.5" fill="url(#carbonWeave)" />

      {/* Subtle glow wash */}
      <rect x="2.5" y="2.5" width="43" height="43" rx="8.5" fill="url(#logoGlow)" />

      {/* The "T" letterform — angular, precision-cut */}
      <path
        d="M13 15h22v4.5H28v14.5h-8V19.5H13V15z"
        fill="#00B4FF"
      />

      {/* Precision accent line — bottom right corner */}
      <line x1="32" y1="36" x2="36" y2="36" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function TenthsWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-bold tracking-wider uppercase ${className}`}
      style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}
    >
      <span style={{ color: '#00B4FF' }}>TENTH</span>
      <span style={{ color: '#FF6B00' }}>S</span>
    </span>
  )
}
