import { Bookmark, BookmarkCheck, CheckCircle2, Clock, MapPin, Wallet } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import { jobMatch } from '../../lib/progress'
import { skills as skillNames } from '../../data/skills'

export function CompanyLogo({ job, size = 'h-12 w-12 text-base' }) {
  const letters = job.company.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-xl font-bold text-white ${size}`} style={{ background: job.logoColor }} dir="ltr">
      {letters}
    </div>
  )
}

export function useJobMeta(job) {
  const { t } = useLang()
  const salary = job.salary ? t('common.egpMonth', { min: job.salary[0], max: job.salary[1] }) : t('common.competitive')
  const posted = job.postedDays === 1 ? t('jobs.postedOne') : t('jobs.posted', { n: job.postedDays })
  return { salary, posted }
}

export default function JobCard({ job, onOpen, onToggleSave }) {
  const { t, L } = useLang()
  const { user, data } = useApp()
  const saved = data.savedJobs.includes(job.id)
  const applied = data.applications.some((a) => a.jobId === job.id)
  const showMatch = user && (data.assessment || data.profile.skills.length > 0)
  const match = showMatch ? jobMatch(job, data) : null
  const { salary, posted } = useJobMeta(job)

  return (
    <article className="group flex flex-col rounded-2xl border border-navy-50 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start gap-4">
        <CompanyLogo job={job} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">{t(`jobTypes.${job.type}`)}</span>
            {match !== null && (
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold ${match >= 60 ? 'bg-navy-800 text-white' : 'bg-navy-50 text-navy-600'}`}
                title={t('jobs.matchHint')}
              >
                {t('jobs.match', { n: match })}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 font-bold leading-snug text-navy-900">
            <button onClick={() => onOpen(job)} className="text-start hover:text-teal-700">
              {L(job.title)}
            </button>
          </h3>
          <p className="text-sm text-navy-500" dir="auto">{job.company}</p>
        </div>
        <button
          onClick={() => onToggleSave(job)}
          className={`rounded-lg p-2 transition ${saved ? 'bg-teal-50 text-teal-600' : 'text-navy-300 hover:bg-navy-50 hover:text-navy-600'}`}
          aria-label={saved ? t('jobs.unsave') : t('jobs.save')}
          aria-pressed={saved}
          title={saved ? t('jobs.unsave') : t('jobs.save')}
        >
          {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy-500">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {t(`locations.${job.location}`)} · {t(`modes.${job.mode}`)}</span>
        <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" /> {salary}</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {posted}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.map((s) => (
          <span key={s} className="rounded-full border border-navy-100 px-2.5 py-0.5 text-xs text-navy-600">{L(skillNames[s])}</span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-navy-50 pt-4">
        <button onClick={() => onOpen(job)} className="h-9 flex-1 rounded-xl border border-navy-100 text-sm font-semibold text-navy-700 transition hover:bg-navy-50">
          {t('jobs.details')}
        </button>
        {applied ? (
          <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-50 text-sm font-semibold text-teal-700">
            <CheckCircle2 className="h-4 w-4" /> {t('jobs.applied')}
          </span>
        ) : (
          <button onClick={() => onOpen(job, true)} className="h-9 flex-1 rounded-xl bg-teal-500 text-sm font-semibold text-white transition hover:bg-teal-600">
            {t('jobs.apply')}
          </button>
        )}
      </div>
    </article>
  )
}
