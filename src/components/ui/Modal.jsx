import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, title, children, wide = false }) {
  const { t } = useLang()
  const titleId = useId()
  const panel = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  // Moves focus into the dialog, keeps Tab inside it and gives focus back to
  // the button that opened it when it closes.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    const root = document.getElementById('root')
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    root?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'
    document.body.style.paddingInlineEnd = `${scrollbar}px`
    const onKey = (e) => {
      if (e.key === 'Escape') return closeRef.current()
      if (e.key !== 'Tab' || !panel.current) return
      const items = [...panel.current.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const [head, tail] = [items[0], items[items.length - 1]]
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault()
        tail.focus()
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault()
        head.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root?.removeAttribute('inert')
      document.body.style.overflow = ''
      document.body.style.paddingInlineEnd = ''
      // The opener may be gone (e.g. its card was filtered out); fall back to
      // the page so focus doesn't drop to <body>.
      if (opener?.isConnected) opener.focus()
      else document.getElementById('main')?.focus({ preventScroll: true })
    }
  }, [open])

  // Keeps focus inside when the content changes under it (e.g. a new step).
  useEffect(() => {
    if (!open || !panel.current || panel.current.contains(document.activeElement)) return
    const first = panel.current.querySelector(`.modal-body :is(${FOCUSABLE})`)
    ;(first || panel.current).focus()
  })

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="absolute inset-0 animate-fade-in bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        className={`relative max-h-[92dvh] w-full animate-slide-in overflow-y-auto overscroll-contain rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-soft focus:outline-none sm:rounded-2xl ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-navy-50 bg-white px-5 py-3">
          <h2 id={titleId} className="text-balance text-lg font-bold text-navy-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 hover:text-navy-800"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body p-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
