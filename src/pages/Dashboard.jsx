import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Bookmark, Briefcase, CheckCircle2, Compass, ListChecks, Map, Send, Sparkles } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { careerById } from '../data/careers'
import { courseById } from '../lib/catalog'
import { jobById, jobs } from '../data/jobs'
import { skills as skillNames } from '../data/skills'
import {
  activeCareerId,
  courseProgress,
  jobMatch,
  nextRoadmapStep,
  roadmapProgress,
  skillProgress,
  totalLessonsDone,
  weeklyActivity,
} from '../lib/progress'
import Button from '../components/ui/Button'
import BarChart from '../components/ui/BarChart'
import SmartImage from '../components/ui/SmartImage'
import CareerIcon from '../components/ui/CareerIcon'
import { ProgressBar, Ring } from '../components/ui/Progress'
import { CompanyLogo } from '../components/cards/JobCard'
import JobModal from '../components/cards/JobModal'

function Panel({ title, hint, action, children, className = '' }) {
  return (
    <section className={`card p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-navy-900">{title}</h2>
          {hint && <p className="mt-0.5 text-xs text-navy-400">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Empty({ text, to, label }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-200 p-6 text-center">
      <p className="text-sm text-navy-500">{text}</p>
      <Button to={to} size="sm" variant="outline" className="mt-4">{label}</Button>
    </div>
  )
}

export default function Dashboard() {
  const { t, L, fmtNum, fmtPct, fmtDate } = useLang()
  const { user, data, owns } = useApp()
  const [modalJob, setModalJob] = useState(null)

  const careerId = activeCareerId(data)
  const career = careerById[careerId]
  const roadmap = roadmapProgress(data, careerId)
  const next = nextRoadmapStep(data, careerId)
  // Only courses the student still owns (a refund or removal takes them away).
  const enrolledIds = Object.keys(data.enrollments).filter(owns)
  const week = weeklyActivity(data)
  const weekTotal = week.reduce((s, d) => s + d.minutes, 0)
  const appliedIds = new Set(data.applications.map((a) => a.jobId))
  const recommended = [...jobs]
    .filter((j) => !appliedIds.has(j.id))
    .sort((a, b) => jobMatch(b, data) - jobMatch(a, data))
    .slice(0, 3)
  const continueList = enrolledIds
    .map((id) => ({ course: courseById[id], p: courseProgress(data, id) }))
    .sort((a, b) => (a.p.complete - b.p.complete) || b.p.pct - a.p.pct)

  const stats = [
    [BookOpen, 'dashboard.enrolled', fmtNum(enrolledIds.length), '/courses?mine=1'],
    [ListChecks, 'dashboard.lessonsDone', fmtNum(totalLessonsDone(data)), '/courses?mine=1'],
    [Map, 'dashboard.roadmap', `${fmtPct(roadmap.pct)}`, '/roadmap'],
    [Send, 'dashboard.applications', fmtNum(data.applications.length), '/jobs'],
  ]

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="animate-fade-up">
          <p className="text-sm text-navy-400">{fmtDate(new Date().toISOString(), { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-navy-900">{t('dashboard.welcome', { name: user.name.split(' ')[0] })}</h1>
          <p className="mt-1 text-navy-500">{t('dashboard.subtitle')}</p>
        </div>
        <Button to="/profile" variant="outline" size="sm">{t('nav.profile')}</Button>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([Icon, key, value, to], i) => (
          <Link key={key} to={to} className="card group animate-fade-up p-5 transition hover:-translate-y-0.5 hover:shadow-soft" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-500 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-2xl font-extrabold text-navy-900">{value}</p>
            <p className="text-sm text-navy-500">{t(key)}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title={t('dashboard.activity')}
          hint={t('dashboard.activityHint')}
          action={<span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">{t('dashboard.totalMinutes', { n: weekTotal })}</span>}
        >
          {weekTotal ? (
            <BarChart
              data={week.map((d, i) => ({
                label: fmtDate(d.date.toISOString(), { weekday: 'short' }),
                value: d.minutes,
                highlight: i === week.length - 1,
              }))}
              format={(v) => fmtNum(v)}
            />
          ) : (
            <Empty text={t('dashboard.noActivity')} to="/courses" label={t('dashboard.browse')} />
          )}
        </Panel>

        <Panel title={t('dashboard.targetCareer')}>
          {career ? (
            <div>
              <div className="flex items-center gap-4">
                <Ring value={roadmap.pct} size={84} stroke={8}>
                  <span className="text-lg font-extrabold text-navy-900">{fmtPct(roadmap.pct)}</span>
                </Ring>
                <div>
                  <p className="flex items-center gap-1.5 font-bold text-navy-900">
                    <CareerIcon id={career.id} className="h-4 w-4 text-teal-600" /> {L(career.title)}
                  </p>
                  <p className="mt-0.5 text-xs text-navy-500">{t('roadmap.stepsDone', { done: roadmap.done, total: roadmap.total })}</p>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{t('dashboard.nextStep')}</p>
                {next ? (
                  <>
                    <p className="mt-1 text-sm font-medium text-navy-900">{L(next.step.title)}</p>
                    <p className="mt-0.5 text-xs text-navy-400">{t('roadmap.stage', { n: next.stageIndex + 1 })} · {L(next.stage.title)}</p>
                  </>
                ) : (
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-navy-900"><CheckCircle2 className="h-4 w-4 text-teal-500" /> {t('dashboard.allDone')}</p>
                )}
              </div>
              <Button to="/roadmap" size="sm" className="mt-4 w-full">
                {t('nav.roadmap')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Compass className="mx-auto h-10 w-10 text-teal-500" />
              <p className="mt-3 text-sm text-navy-500">{t('dashboard.noAssessment')}</p>
              <Button to="/assessment" size="sm" className="mt-4"><Sparkles className="h-4 w-4" /> {t('dashboard.takeAssessment')}</Button>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t('dashboard.skills')} hint={t('dashboard.skillsHint')}>
          {career ? (
            <ul className="space-y-4">
              {skillProgress(data, careerId).map(({ skill, pct }) => (
                <li key={skill}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-navy-800">{L(skillNames[skill])}</span>
                    <span className="font-semibold text-navy-600">{fmtPct(pct)}</span>
                  </div>
                  <ProgressBar value={pct} label={L(skillNames[skill])} />
                </li>
              ))}
            </ul>
          ) : (
            <Empty text={t('dashboard.noAssessment')} to="/assessment" label={t('dashboard.takeAssessment')} />
          )}
        </Panel>

        <Panel
          title={t('dashboard.continue')}
          action={enrolledIds.length > 0 && <Link to="/courses?mine=1" className="text-sm font-semibold text-teal-600 hover:underline">{t('common.viewAll')}</Link>}
        >
          {continueList.length ? (
            <ul className="space-y-3">
              {continueList.slice(0, 4).map(({ course, p }) => (
                <li key={course.id}>
                  <Link to={`/courses/${course.id}`} className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-slate-50">
                    <SmartImage src={course.image} alt={L(course.title)} className="h-14 w-20 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy-900">{L(course.title)}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <ProgressBar value={p.pct} label={L(course.title)} />
                        <span className="text-xs font-semibold text-navy-600">{fmtPct(p.pct)}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty text={t('dashboard.noCourses')} to="/courses" label={t('dashboard.browse')} />
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t('dashboard.myApplications')}>
          {data.applications.length ? (
            <ul className="divide-y divide-navy-50">
              {[...data.applications].reverse().map((a) => {
                const job = jobById[a.jobId]
                return (
                  <li key={a.jobId} className="flex items-center gap-3 py-3">
                    <CompanyLogo job={job} size="h-10 w-10 text-sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy-900">{L(job.title)}</p>
                      <p className="text-xs text-navy-500">{job.company} · {t('dashboard.appliedOn', { date: fmtDate(a.date) })}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{t('dashboard.underReview')}</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Empty text={t('dashboard.noApplications')} to="/jobs" label={t('dashboard.browseJobs')} />
          )}
        </Panel>

        <Panel title={t('dashboard.savedJobs')}>
          {data.savedJobs.length ? (
            <ul className="divide-y divide-navy-50">
              {data.savedJobs.map((id) => {
                const job = jobById[id]
                return (
                  <li key={id}>
                    <button onClick={() => setModalJob(job)} className="flex w-full items-center gap-3 py-3 text-start">
                      <CompanyLogo job={job} size="h-10 w-10 text-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy-900 hover:text-teal-700">{L(job.title)}</p>
                        <p className="text-xs text-navy-500">{job.company} · {t(`locations.${job.location}`)}</p>
                      </div>
                      <Bookmark className="h-4 w-4 shrink-0 fill-teal-500 text-teal-500" />
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Empty text={t('dashboard.noSaved')} to="/jobs" label={t('dashboard.browseJobs')} />
          )}
        </Panel>
      </div>

      <Panel className="mt-6" title={t('dashboard.recommended')} hint={t('jobs.matchHint')}
        action={<Link to="/jobs" className="text-sm font-semibold text-teal-600 hover:underline">{t('common.viewAll')}</Link>}>
        <div className="grid gap-4 md:grid-cols-3">
          {recommended.map((job) => (
            <button key={job.id} onClick={() => setModalJob(job)} className="rounded-xl border border-navy-100 p-4 text-start transition hover:border-teal-300 hover:shadow-card">
              <div className="flex items-center gap-3">
                <CompanyLogo job={job} size="h-10 w-10 text-sm" />
                <span className="rounded-md bg-navy-800 px-2 py-0.5 text-xs font-semibold text-white">{t('jobs.match', { n: jobMatch(job, data) })}</span>
              </div>
              <p className="mt-3 font-semibold text-navy-900">{L(job.title)}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-navy-500"><Briefcase className="h-3.5 w-3.5" /> {job.company} · {t(`jobTypes.${job.type}`)}</p>
            </button>
          ))}
        </div>
      </Panel>

      <JobModal job={modalJob} startOnApply={false} onClose={() => setModalJob(null)} />
    </div>
  )
}
