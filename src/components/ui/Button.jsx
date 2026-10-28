import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/20',
  navy: 'bg-navy-800 text-white hover:bg-navy-900',
  outline: 'border border-navy-300 bg-white text-navy-800 hover:border-navy-400 hover:bg-navy-50',
  ghost: 'text-navy-700 hover:bg-navy-50',
  white: 'bg-white text-navy-900 hover:bg-navy-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}
const sizes = {
  sm: 'h-10 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({ to, href, variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[background-color,border-color,color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer" {...props}>{children}</a>
  return (
    <button type="button" className={cls} {...props} disabled={loading || props.disabled} aria-busy={loading || undefined}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
