import { useId } from 'react'

export const inputCls =
  'rounded-xl border bg-white text-sm text-navy-900 placeholder:text-navy-400 transition-[border-color,box-shadow] focus:outline-none focus:ring-2'
export const inputOkCls = 'border-navy-300 focus:border-teal-600 focus:ring-teal-600/40'

// Labelled input / textarea / select with an inline validation message.
export default function Field({ label, error, hint, as = 'input', className = '', children, ...props }) {
  const id = useId()
  const Tag = as
  const base = `w-full px-3.5 py-2.5 ${inputCls} ${error ? 'border-red-500 focus:ring-red-300' : inputOkCls}`
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined
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
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Tag>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

// Moves focus to the first invalid field after a failed submit.
export function focusFirstInvalid(form) {
  setTimeout(() => form?.querySelector('[aria-invalid="true"]')?.focus())
}

// Compact select used by the filter bars.
export const selectCls = `h-10 px-3 text-navy-800 ${inputCls} ${inputOkCls}`
