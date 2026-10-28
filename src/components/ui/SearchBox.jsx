import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { inputCls, inputOkCls } from './Field'

// Keeps typing instant and reports the value after a short pause.
export default function SearchBox({ value, onChange, placeholder }) {
  const { t } = useLang()
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [value])
  useEffect(() => {
    if (text === value) return
    const id = setTimeout(() => onChange(text), 250)
    return () => clearTimeout(id)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" aria-hidden="true" />
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`h-12 w-full pe-12 ps-12 shadow-sm ${inputCls} ${inputOkCls} [&::-webkit-search-cancel-button]:hidden`}
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText('')
            onChange('')
          }}
          className="absolute end-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 hover:text-navy-800"
          aria-label={t('common.clearSearch')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
