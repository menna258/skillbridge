import { describe, expect, it } from 'vitest'
import en from '../src/i18n/en'
import ar from '../src/i18n/ar'

// Every text on the site needs both languages. This needs no Supabase, so it
// runs even without .env.test.
const keys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  )

describe('Translations', () => {
  it('has every English key in Arabic', () => {
    const arKeys = new Set(keys(ar))
    expect(keys(en).filter((k) => !arKeys.has(k))).toEqual([])
  })

  it('has every Arabic key in English', () => {
    const enKeys = new Set(keys(en))
    expect(keys(ar).filter((k) => !enKeys.has(k))).toEqual([])
  })

  it('leaves no text empty', () => {
    const at = (obj, key) => key.split('.').reduce((o, k) => o[k], obj)
    const empty = (obj) => keys(obj).filter((k) => at(obj, k) === '')
    expect({ en: empty(en), ar: empty(ar) }).toEqual({ en: [], ar: [] })
  })
})
