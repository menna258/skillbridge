import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BriefcaseBusiness } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { jobs, jobLocations, jobTypes } from '../data/jobs'
import { careers } from '../data/careers'
import { skills as skillNames } from '../data/skills'
import { jobMatch } from '../lib/progress'
import useFilteredLoading from '../lib/useFilteredLoading'
import PageHeader from '../components/ui/PageHeader'
import SearchBox from '../components/ui/SearchBox'
import { selectCls } from '../components/ui/Field'
import Button from '../components/ui/Button'
import JobCard from '../components/cards/JobCard'
import JobModal from '../components/cards/JobModal'
import { EmptyState, SkeletonCard } from '../components/ui/Feedback'

export default function Jobs() {
  const { t, L } = useLang()
  const { user, data, toggleSaveJob } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [modal, setModal] = useState({ job: null, apply: false })

  const q = params.get('q') || ''
  const type = params.get('type') || 'all'
  const location = params.get('loc') || 'all'
  const field = params.get('field') || 'all'
  const saved = params.get('saved') === '1'
  const canMatch = !!user && (!!data.assessment || data.profile.skills.length > 0)
  const sort = params.get('sort') || (canMatch ? 'match' : 'newest')

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = jobs.filter((j) => {
      if (type !== 'all' && j.type !== type) return false
      if (location !== 'all' && j.location !== location) return false
      if (field !== 'all' && j.career !== field) return false
      if (saved && !data.savedJobs.includes(j.id)) return false
      if (!term) return true
      return [j.title.en, j.title.ar, j.company, ...j.skills.flatMap((s) => [skillNames[s].en, skillNames[s].ar])]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
    if (sort === 'match' && canMatch) {
      const score = Object.fromEntries(list.map((j) => [j.id, jobMatch(j, data)]))
      return list.sort((a, b) => score[b.id] - score[a.id])
    }
    return list.sort((a, b) => a.postedDays - b.postedDays)
  }, [q, type, location, field, saved, sort, canMatch, data])

  const loading = useFilteredLoading(`${q}|${type}|${location}|${field}|${saved}|${sort}`)
  const filtered = q || type !== 'all' || location !== 'all' || field !== 'all' || saved

  const onToggleSave = (job) => {
    if (!user) return navigate(`/login?next=${encodeURIComponent('/jobs')}`)
    const wasSaved = data.savedJobs.includes(job.id)
    toggleSaveJob(job.id)
    toast(wasSaved ? t('toast.unsaved') : t('toast.saved'), wasSaved ? 'info' : 'success')
  }

  return (
    <>
      <PageHeader title={t('jobs.title')} subtitle={t('jobs.subtitle')}>
        <div className="max-w-2xl">
          <SearchBox value={q} onChange={(v) => setParam('q', v, '')} placeholder={t('jobs.search')} />
        </div>
      </PageHeader>

      <section className="container-page py-10">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label={t('jobs.type')}>
          {['all', ...jobTypes].map((ty) => (
            <button key={ty} onClick={() => setParam('type', ty, 'all')} className={`chip shrink-0 ${type === ty ? 'chip-on' : 'chip-off'}`} aria-pressed={type === ty}>
              {ty === 'all' ? t('common.all') : t(`jobTypes.${ty}`)}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-navy-500">
            {t('jobs.location')}
            <select value={location} onChange={(e) => setParam('loc', e.target.value, 'all')} className={selectCls}>
              <option value="all">{t('common.all')}</option>
              {jobLocations.map((l) => <option key={l} value={l}>{t(`locations.${l}`)}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-500">
            {t('jobs.field')}
            <select value={field} onChange={(e) => setParam('field', e.target.value, 'all')} className={selectCls}>
              <option value="all">{t('common.all')}</option>
              {careers.map((c) => <option key={c.id} value={c.id}>{L(c.title)}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-500">
            {t('courses.sort')}
            <select value={sort} onChange={(e) => setParam('sort', e.target.value, canMatch ? 'match' : 'newest')} className={selectCls}>
              <option value="newest">{t('jobs.sortNewest')}</option>
              {canMatch && <option value="match">{t('jobs.sortMatch')}</option>}
            </select>
          </label>
          {user && (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-700">
              <input type="checkbox" checked={saved} onChange={(e) => setParam('saved', e.target.checked ? '1' : '', '')} className="h-4 w-4 accent-teal-600" />
              {t('jobs.savedOnly')}
            </label>
          )}
          <span className="ms-auto text-sm text-navy-500" aria-live="polite">
            {results.length === 1 ? t('common.result') : t('common.results', { n: results.length })}
          </span>
          {filtered && (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="text-sm font-semibold text-teal-600 hover:underline">
              {t('common.clearFilters')}
            </button>
          )}
        </div>

        <h2 className="sr-only">{t('nav.jobs')}</h2>
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {results.map((j, i) => (
              <div key={j.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <JobCard job={j} onOpen={(job, apply = false) => setModal({ job, apply })} onToggleSave={onToggleSave} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BriefcaseBusiness}
            title={t('jobs.emptyTitle')}
            text={t('jobs.emptyText')}
            action={<Button variant="outline" onClick={() => setParams({}, { replace: true })}>{t('common.clearFilters')}</Button>}
          />
        )}
      </section>

      <JobModal job={modal.job} startOnApply={modal.apply} onClose={() => setModal({ job: null, apply: false })} />
    </>
  )
}
