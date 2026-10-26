import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm shadow-teal-500/20',
  navy: 'bg-navy-800 text-white hover:bg-navy-900',
  outline: 'border border-navy-200 bg-white text-navy-800 hover:border-navy-300 hover:bg-navy-50',
  ghost: 'text-navy-700 hover:bg-navy-50',
  white: 'bg-white text-navy-900 hover:bg-navy-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}
const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({ to, href, variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer" {...props}>{children}</a>
  return (
    <button className={cls} {...props} disabled={loading || props.disabled}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
