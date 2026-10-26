import { useId } from 'react'

// Labelled input / textarea / select with an inline validation message.
export default function Field({ label, error, hint, as = 'input', className = '', children, ...props }) {
  const id = useId()
  const Tag = as
  const base = `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 transition focus:outline-none focus:ring-2 ${
    error ? 'border-red-400 focus:ring-red-200' : 'border-navy-100 focus:border-teal-400 focus:ring-teal-100'
  }`
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-800">
          {label}
        </label>
      )}
      <Tag
        id={id}
        className={`${base} ${as === 'textarea' ? 'min-h-[110px] resize-y' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        {...props}
      >
        {children}
      </Tag>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-navy-400">{hint}</p>
      ) : null}
    </div>
  )
}
