import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="SkillBridge">
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill={light ? '#ffffff' : '#15234a'} />
        <path d="M12 42c8-14 32-14 40 0" stroke="#26bcad" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="42" r="4" fill={light ? '#15234a' : '#fff'} />
        <circle cx="52" cy="42" r="4" fill={light ? '#15234a' : '#fff'} />
        <path d="M32 18v14" stroke={light ? '#15234a' : '#fff'} strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy-900'}`} dir="ltr">
        Skill<span className="text-teal-500">Bridge</span>
      </span>
    </Link>
  )
}
