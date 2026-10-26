import { Search, X } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'

export default function SearchBox({ value, onChange, placeholder }) {
  const { t } = useLang()
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-12 w-full rounded-xl border border-navy-100 bg-white pe-11 ps-12 text-sm text-navy-900 shadow-sm placeholder:text-navy-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
          aria-label={t('common.clearFilters')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
