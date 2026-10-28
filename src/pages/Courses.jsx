import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { courses, courseCategories, courseLevels } from '../lib/catalog'
import { skills as skillNames } from '../data/skills'
import useFilteredLoading from '../lib/useFilteredLoading'
import PageHeader from '../components/ui/PageHeader'
import SearchBox from '../components/ui/SearchBox'
import CourseCard from '../components/cards/CourseCard'
import Button from '../components/ui/Button'
import CareerIcon from '../components/ui/CareerIcon'
import { EmptyState, SkeletonCard } from '../components/ui/Feedback'

const selectCls =
  'h-10 rounded-xl border border-navy-100 bg-white px-3 text-sm text-navy-800 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100'

export default function Courses() {
  const { t } = useLang()
  const { user, data, catalogVersion } = useApp()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('cat') || 'all'
  const level = params.get('level') || 'all'
  const sort = params.get('sort') || 'popular'
  const mine = params.get('mine') === '1'

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = courses.filter((c) => {
      if (c.hidden && !data.enrollments[c.id]) return false
      if (cat !== 'all' && c.category !== cat) return false
      if (level !== 'all' && c.level !== level) return false
      if (mine && !data.enrollments[c.id]) return false
      if (!term) return true
      const haystack = [c.title.en, c.title.ar, c.description.en, c.description.ar, c.instructor, ...c.skills.flatMap((s) => [skillNames[s].en, skillNames[s].ar])]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
    const sorters = {
      popular: (a, b) => b.learners - a.learners,
      rating: (a, b) => b.rating - a.rating,
      short: (a, b) => a.hours - b.hours,
    }
    return list.sort(sorters[sort] || sorters.popular)
  }, [q, cat, level, sort, mine, data.enrollments, catalogVersion])

  const loading = useFilteredLoading(`${q}|${cat}|${level}|${sort}|${mine}`)
  const filtered = q || cat !== 'all' || level !== 'all' || mine

  return (
    <>
      <PageHeader title={t('courses.title')} subtitle={t('courses.subtitle')}>
        <div className="max-w-2xl">
          <SearchBox value={q} onChange={(v) => setParam('q', v, '')} placeholder={t('courses.search')} />
        </div>
      </PageHeader>

      <section className="container-page py-10">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label={t('courses.category')}>
          <button onClick={() => setParam('cat', 'all', 'all')} className={`chip shrink-0 ${cat === 'all' ? 'chip-on' : 'chip-off'}`} aria-pressed={cat === 'all'}>
            {t('common.all')}
          </button>
          {courseCategories.map((c) => (
            <button key={c} onClick={() => setParam('cat', c, 'all')} className={`chip shrink-0 ${cat === c ? 'chip-on' : 'chip-off'}`} aria-pressed={cat === c}>
              <CareerIcon id={c} className="h-4 w-4" /> {t(`careers.${c}`)}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-navy-500">
            {t('courses.level')}
            <select value={level} onChange={(e) => setParam('level', e.target.value, 'all')} className={selectCls}>
              <option value="all">{t('common.all')}</option>
              {courseLevels.map((l) => (
                <option key={l} value={l}>{t(`levels.${l}`)}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-500">
            {t('courses.sort')}
            <select value={sort} onChange={(e) => setParam('sort', e.target.value, 'popular')} className={selectCls}>
              <option value="popular">{t('courses.sortPopular')}</option>
              <option value="rating">{t('courses.sortRating')}</option>
              <option value="short">{t('courses.sortShort')}</option>
            </select>
          </label>
          {user && (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-700">
              <input type="checkbox" checked={mine} onChange={(e) => setParam('mine', e.target.checked ? '1' : '', '')} className="h-4 w-4 rounded border-navy-300 accent-teal-500" />
              {t('courses.myCourses')}
            </label>
          )}
          <span className="ms-auto text-sm text-navy-500" aria-live="polite">
            {results.length === 1 ? t('common.result') : t('common.results', { n: results.length })}
          </span>
          {filtered && (
            <button onClick={() => setParams({}, { replace: true })} className="text-sm font-semibold text-teal-600 hover:underline">
              {t('common.clearFilters')}
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: Math.min(6, Math.max(results.length, 3)) }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((c, i) => (
              <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title={t('courses.emptyTitle')}
            text={t('courses.emptyText')}
            action={<Button variant="outline" onClick={() => setParams({}, { replace: true })}>{t('common.clearFilters')}</Button>}
          />
        )}
      </section>
    </>
  )
}
