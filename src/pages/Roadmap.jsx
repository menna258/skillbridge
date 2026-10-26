import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Briefcase, Check, CheckCircle2, Clock, Compass, Flag, Lock, PlayCircle, Wallet } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { careers, careerById } from '../data/careers'
import { courseById } from '../data/courses'
import { skills as skillNames } from '../data/skills'
import { activeCareerId, roadmapProgress } from '../lib/progress'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import CareerIcon from '../components/ui/CareerIcon'
import { Ring } from '../components/ui/Progress'
import { EmptyState } from '../components/ui/Feedback'

export default function Roadmap() {
  const { t, L, fmtNum, fmtPct, fmtDate } = useLang()
  const { user, data, toggleStep, setRoadmapCareer } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const ownCareer = activeCareerId(data)
  const viewId = careerById[params.get('career')] ? params.get('career') : ownCareer
  const career = careerById[viewId]

  if (!career) {
    return (
      <>
        <PageHeader title={t('roadmap.title')} subtitle={t('roadmap.subtitle')} />
        <section className="container-page py-16">
          <EmptyState
            icon={Compass}
            title={t('roadmap.emptyTitle')}
            text={t('roadmap.emptyText')}
            action={<Button to="/assessment">{t('roadmap.emptyCta')}</Button>}
          />
          <PathSwitcher current={null} onPick={(id) => setParams({ career: id })} />
        </section>
      </>
    )
  }

  const isOwn = viewId === ownCareer
  const progress = roadmapProgress(data, career.id)
  const totalWeeks = career.roadmap.reduce((s, st) => s + st.weeks, 0)
  const match = data.assessment?.matches.find((m) => m.id === career.id)?.score

  const onToggle = (stepId) => {
    if (!user) return navigate(`/login?next=${encodeURIComponent(`/roadmap?career=${career.id}`)}`)
    const wasDone = data.roadmapDone.includes(stepId)
    toggleStep(stepId)
    if (!wasDone) toast(t('toast.stepDone'))
  }

  const follow = () => {
    setRoadmapCareer(career.id === data.assessment?.topCareer ? null : career.id)
    setParams({})
  }

  return (
    <>
      <PageHeader title={t('roadmap.title')} subtitle={t('roadmap.subtitle')} />
      <section className="container-page py-12">
        {/* Summary */}
        <div className="card overflow-hidden md:grid md:grid-cols-[280px_1fr]">
          <SmartImage src={career.image} alt={L(career.title)} className="h-48 md:h-full" />
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                {isOwn && data.assessment && !data.roadmapCareer
                  ? t('roadmap.basedOn', { date: fmtDate(data.assessment.completedAt) })
                  : isOwn
                    ? t('roadmap.following')
                    : t('roadmap.manual')}
              </p>
              <h2 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-navy-900">
                <CareerIcon id={career.id} className="h-6 w-6 text-teal-600" /> {L(career.title)}
              </h2>
              <p className="mt-2 text-navy-500">{L(career.summary)}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy-600">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-teal-600" /> {t('roadmap.totalDuration')}: {t('common.weeks', { n: totalWeeks })}</span>
                <span className="inline-flex items-center gap-1.5"><Wallet className="h-4 w-4 text-teal-600" /> {t('common.egpMonth', { min: career.salary[0], max: career.salary[1] })}</span>
                {match !== undefined && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-navy-800">{t('roadmap.matchFromAssessment', { n: match })}</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="me-1 text-sm font-medium text-navy-500">{t('roadmap.keySkills')}:</span>
                {career.skills.map((s) => (
                  <span key={s} className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700">{L(skillNames[s])}</span>
                ))}
              </div>
              {user && !isOwn && (
                <Button size="sm" className="mt-5" onClick={follow}>
                  <Flag className="h-4 w-4" /> {t('roadmap.follow')}
                </Button>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-5">
              <Ring value={progress.pct} size={110}>
                <span className="text-2xl font-extrabold text-navy-900">{fmtPct(progress.pct)}</span>
              </Ring>
              <p className="text-xs font-medium text-navy-500">{t('roadmap.stepsDone', { done: progress.done, total: progress.total })}</p>
            </div>
          </div>
        </div>

        {!user && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 sm:flex-row">
            <p className="flex items-center gap-2 text-sm text-navy-600"><Lock className="h-4 w-4 text-navy-400" /> {t('roadmap.loginToTrack')}</p>
            <Button to={`/login?next=${encodeURIComponent(`/roadmap?career=${career.id}`)}`} size="sm" variant="outline">{t('nav.login')}</Button>
          </div>
        )}

        {progress.pct === 100 && (
          <div className="mt-6 flex animate-fade-up flex-col items-center justify-between gap-3 rounded-2xl bg-teal-500 p-5 text-white sm:flex-row">
            <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" /> {t('roadmap.complete')}</p>
            <Button to="/jobs" variant="white" size="sm"><Briefcase className="h-4 w-4" /> {t('roadmap.findJobs')}</Button>
          </div>
        )}

        {/* Timeline */}
        <ol className="relative mt-10 space-y-8 before:absolute before:bottom-4 before:start-5 before:top-4 before:w-0.5 before:bg-navy-100">
          {career.roadmap.map((stage, si) => {
            const stageDone = stage.steps.every((s) => data.roadmapDone.includes(s.id))
            return (
              <li key={si} className="relative ps-14">
                <span
                  className={`absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-4 ring-slate-50 ${
                    stageDone ? 'bg-teal-500 text-white' : 'bg-navy-800 text-white'
                  }`}
                >
                  {stageDone ? <Check className="h-5 w-5" /> : fmtNum(si + 1)}
                </span>
                <div className="card p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{t('roadmap.stage', { n: si + 1 })}</p>
                      <h3 className="text-lg font-bold text-navy-900">{L(stage.title)}</h3>
                    </div>
                    <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600">{t('common.weeks', { n: stage.weeks })}</span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {stage.steps.map((step) => {
                      const done = data.roadmapDone.includes(step.id)
                      return (
                        <li key={step.id} className={`rounded-xl border p-4 transition ${done ? 'border-teal-200 bg-teal-50/50' : 'border-navy-100'}`}>
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => onToggle(step.id)}
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                                done ? 'border-teal-500 bg-teal-500 text-white' : 'border-navy-200 hover:border-teal-400'
                              }`}
                              role="checkbox"
                              aria-checked={done}
                              aria-label={done ? t('roadmap.undo') : t('roadmap.markDone')}
                              title={done ? t('roadmap.undo') : t('roadmap.markDone')}
                            >
                              {done && <Check className="h-4 w-4" />}
                            </button>
                            <div className="flex-1">
                              <p className={`font-medium ${done ? 'text-navy-500 line-through decoration-teal-400' : 'text-navy-900'}`}>{L(step.title)}</p>
                              <div className="mt-2.5 flex flex-wrap gap-2">
                                {step.courses.map((cid) => (
                                  <Link
                                    key={cid}
                                    to={`/courses/${cid}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-navy-700 ring-1 ring-navy-100 transition hover:text-teal-700 hover:ring-teal-300"
                                  >
                                    <PlayCircle className="h-3.5 w-3.5 text-teal-600" /> {L(courseById[cid].title)}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>

        <PathSwitcher current={career.id} onPick={(id) => setParams({ career: id })} />
      </section>
    </>
  )
}

function PathSwitcher({ current, onPick }) {
  const { t, L } = useLang()
  return (
    <div className="mt-12">
      <h3 className="mb-4 font-bold text-navy-900">{t('roadmap.switchPath')}</h3>
      <div className="flex flex-wrap gap-2">
        {careers.map((c) => (
          <button key={c.id} onClick={() => onPick(c.id)} className={`chip ${current === c.id ? 'chip-on' : 'chip-off'}`} aria-pressed={current === c.id}>
            <CareerIcon id={c.id} className="h-4 w-4" /> {L(c.title)}
          </button>
        ))}
      </div>
    </div>
  )
}
