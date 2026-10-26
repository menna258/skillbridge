import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'
import ar from './ar'
import { readJSON, writeJSON } from '../lib/storage'

const dictionaries = { en, ar }
const LanguageContext = createContext(null)

const lookup = (dict, key) => key.split('.').reduce((obj, part) => (obj == null ? obj : obj[part]), dict)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => (readJSON('sb_lang', 'en') === 'ar' ? 'ar' : 'en'))
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    writeJSON('sb_lang', lang)
  }, [lang, dir])

  const fmtNum = useCallback((n) => new Intl.NumberFormat(locale).format(n), [locale])
  const fmtPct = useCallback((n) => `${new Intl.NumberFormat(locale).format(n)}${lang === 'ar' ? '٪' : '%'}`, [locale, lang])

  const fmtDate = useCallback(
    (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
      new Intl.DateTimeFormat(locale, opts).format(new Date(iso)),
    [locale],
  )

  const t = useCallback(
    (key, vars) => {
      let str = lookup(dictionaries[lang], key) ?? lookup(en, key)
      if (str == null) {
        if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`)
        return key
      }
      if (vars && typeof str === 'string') {
        str = str.replace(/\{(\w+)\}/g, (_, v) => {
          const val = vars[v]
          return typeof val === 'number' ? fmtNum(val) : val ?? ''
        })
      }
      return str
    },
    [lang, fmtNum],
  )

  // Picks the right language from a bilingual data object { en, ar }.
  const L = useCallback((obj) => (obj ? obj[lang] ?? obj.en : ''), [lang])

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'ar' : 'en')), [])

  const value = useMemo(
    () => ({ lang, dir, setLang, toggle, t, L, fmtNum, fmtPct, fmtDate, isRTL: dir === 'rtl' }),
    [lang, dir, toggle, t, L, fmtNum, fmtPct, fmtDate],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLang = () => useContext(LanguageContext)
