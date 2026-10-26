import { Loader2 } from 'lucide-react'

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex animate-fade-in flex-col items-center rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-navy-900">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm text-navy-500">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-500" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-50 bg-white">
      <div className="h-40 animate-pulse bg-navy-100" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-navy-100" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-navy-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-navy-100" />
      </div>
    </div>
  )
}

export function DemoBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
      {children}
    </span>
  )
}
