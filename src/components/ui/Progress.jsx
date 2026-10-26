const clamp = (v) => Math.max(0, Math.min(100, v))

export function ProgressBar({ value, className = '', color = 'bg-teal-500', label }) {
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-navy-100 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`} style={{ width: `${clamp(value)}%` }} />
    </div>
  )
}

export function Ring({ value, size = 120, stroke = 10, children, track = '#e6ebf5', color = '#0fa094' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * clamp(value)) / 100}
          style={{ transition: 'stroke-dashoffset 0.9s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}
