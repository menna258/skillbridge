import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Map, RotateCcw, Sparkles, Target, UserPlus } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { questions } from '../data/questions'
import { careerById } from '../data/careers'
import { skills as skillNames, traits as traitNames } from '../data/skills'
import { scoreAssessment } from '../lib/assessment'
import { readJSON, writeJSON, removeKey, delay } from '../lib/storage'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import CareerIcon from '../components/ui/CareerIcon'
import { ProgressBar, Ring } from '../components/ui/Progress'
import { Spinner } from '../components/ui/Feedback'

const DRAFT = 'sb_quiz_draft'

export default function Assessment() {
  const { t } = useLang()
  const { data, user, saveAssessment } = useApp()
  const toast = useToast()
  const [stage, setStage] = useState(data.assessment ? 'result' : 'intro')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => readJSON(DRAFT, {}))
  const hasDraft = Object.keys(answers).length > 0

  useEffect(() => {
    if (stage === 'quiz') writeJSON(DRAFT, answers)
  }, [answers, stage])

  const start = () => {
    const firstOpen = questions.findIndex((q) => answers[q.id] === undefined)
    setIndex(firstOpen === -1 ? questions.length - 1 : firstOpen)
    setStage('quiz')
  }

  const restart = () => {
    setAnswers({})
    removeKey(DRAFT)
    setIndex(0)
    setStage('quiz')
  }

  const finish = async () => {
    setStage('calculating')
    await delay(1400)
    saveAssessment(scoreAssessment(answers))
    removeKey(DRAFT)
    setAnswers({})
    setStage('result')
    toast(t('toast.assessmentSaved'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageHeader title={t('assessment.title')} subtitle={t('assessment.subtitle')} />
      <section className="container-page py-12 sm:py-16">
        {stage === 'intro' && <Intro onStart={start} hasDraft={hasDraft} />}
        {stage === 'quiz' && (
          <Quiz
            index={index}
            setIndex={setIndex}
            answers={answers}
            setAnswers={setAnswers}
            onFinish={finish}
          />
        )}
        {stage === 'calculating' && (
          <div className="card mx-auto max-w-xl">
            <Spinner label={t('assessment.calculating')} />
          </div>
        )}
        {stage === 'result' && data.assessment && <Result result={data.assessment} isGuest={!user} onRetake={restart} />}
      </section>
    </>
  )
}

function Intro({ onStart, hasDraft }) {
  const { t } = useLang()
  const points = [
    [Clock, 'assessment.point1'],
    [Target, 'assessment.point2'],
    [Map, 'assessment.point3'],
  ]
  return (
    <div className="card mx-auto max-w-2xl animate-fade-up p-8 text-center sm:p-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
        <Sparkles className="h-8 w-8" />
      </div>
      <ul className="mx-auto mb-8 grid max-w-lg gap-3 sm:grid-cols-3">
        {points.map(([Icon, key]) => (
          <li key={key} className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm font-medium text-navy-700">
            <Icon className="h-5 w-5 text-teal-600" /> {t(key)}
          </li>
        ))}
      </ul>
      <Button size="lg" onClick={onStart}>
        {hasDraft ? t('assessment.resume') : t('assessment.start')} <ArrowRight className="h-5 w-5 rtl:rotate-180" />
      </Button>
    </div>
  )
}

function Quiz({ index, setIndex, answers, setAnswers, onFinish }) {
  const { t, L, fmtNum, fmtPct } = useLang()
  const q = questions[index]
  const selected = answers[q.id]
  const isLast = index === questions.length - 1
  const answered = Object.keys(answers).length

  const choose = (i) => setAnswers((a) => ({ ...a, [q.id]: i }))
  const next = () => (isLast ? onFinish() : setIndex(index + 1))

  const heading = useRef(null)
  const optionRefs = useRef([])
  const firstQuestion = useRef(true)

  // Each new question takes focus so keyboard and screen-reader users hear it
  // without tabbing back from the top.
  useEffect(() => {
    if (firstQuestion.current) firstQuestion.current = false
    else heading.current?.focus()
  }, [index])

  // Number keys pick an answer; Enter moves on. Ignored while a control has
  // focus so it never fights with that control's own keys.
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.target.closest?.('button, a, input, textarea, select')) return
      const n = Number(e.key)
      if (n >= 1 && n <= q.options.length) choose(n - 1)
      if (e.key === 'Enter' && selected !== undefined) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Arrow keys move between options like a native radio group.
  const onOptionKey = (e, i) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const to = (i + step + q.options.length) % q.options.length
    choose(to)
    optionRefs.current[to]?.focus()
  }
  const focusable = selected ?? 0

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-navy-500">
          <span>{t('assessment.questionOf', { n: index + 1, total: questions.length })}</span>
          <span>{fmtPct(Math.round((answered / questions.length) * 100))}</span>
        </div>
        <ProgressBar value={(answered / questions.length) * 100} label={t('assessment.title')} />
      </div>

      <div className="card p-6 sm:p-8">
        <div key={q.id} className="animate-fade-up">
          <h2 ref={heading} tabIndex={-1} className="text-balance text-xl font-bold leading-snug text-navy-900 sm:text-2xl focus:outline-none">{L(q.text)}</h2>
          <div className="mt-6 grid gap-3" role="radiogroup" aria-label={L(q.text)}>
            {q.options.map((o, i) => {
              const on = selected === i
              return (
                <button
                  key={i}
                  ref={(el) => (optionRefs.current[i] = el)}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={i === focusable ? 0 : -1}
                  onClick={() => choose(i)}
                  onKeyDown={(e) => onOptionKey(e, i)}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                    on ? 'border-teal-600 bg-teal-50/60' : 'border-navy-200 hover:border-navy-400 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      on ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-600'
                    }`}
                  >
                    {on ? <CheckCircle2 className="h-5 w-5" /> : fmtNum(i + 1)}
                  </span>
                  <span className={`font-medium ${on ? 'text-navy-900' : 'text-navy-700'}`}>{L(o.label)}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setIndex(index - 1)} disabled={index === 0}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('assessment.back')}
          </Button>
          <Button onClick={next} disabled={selected === undefined} title={selected === undefined ? t('assessment.chooseOption') : undefined}>
            {isLast ? t('assessment.finish') : t('assessment.next')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Result({ result, isGuest, onRetake }) {
  const { t, L, fmtNum, fmtPct, fmtDate } = useLang()
  const top = careerById[result.topCareer]
  const topScore = result.matches[0].score

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">{t('assessment.resultTitle')}</h2>
        <p className="mt-2 text-navy-500">{t('assessment.resultSubtitle')}</p>
        <p className="mt-1 text-xs text-navy-500">{t('assessment.takenOn', { date: fmtDate(result.completedAt) })}</p>
      </div>

      <div className="card overflow-hidden lg:grid lg:grid-cols-[1.1fr_1fr]">
        <SmartImage src={top.image} alt={L(top.title)} className="h-56 lg:h-full" />
        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">{t('assessment.topMatch')}</p>
          <div className="mt-3 flex items-center gap-5">
            <Ring value={topScore} size={92} stroke={9}>
              <span className="text-xl font-extrabold text-navy-900">{fmtPct(topScore)}</span>
            </Ring>
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-extrabold text-navy-900">
                <CareerIcon id={top.id} className="h-6 w-6 text-teal-600" /> {L(top.title)}
              </h3>
              <p className="mt-1 text-sm text-navy-500">{t(`careers.demand.${top.demand}`)}</p>
            </div>
          </div>
          <p className="mt-5 leading-relaxed text-navy-600">{L(top.summary)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {top.skills.map((s) => (
              <span key={s} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700">{L(skillNames[s])}</span>
            ))}
          </div>
          <p className="mt-5 text-sm text-navy-500">
            {t('roadmap.salary')}: <span className="font-semibold text-navy-800">{t('common.egpMonth', { min: top.salary[0], max: top.salary[1] })}</span>
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button to="/roadmap">
              <Map className="h-4 w-4" /> {t('assessment.viewRoadmap')}
            </Button>
            <Button variant="outline" onClick={onRetake}>
              <RotateCcw className="h-4 w-4" /> {t('assessment.retake')}
            </Button>
          </div>
        </div>
      </div>

      {isGuest && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:flex-row">
          <p className="flex items-center gap-3 text-sm font-medium text-teal-800">
            <UserPlus className="h-5 w-5 shrink-0" /> {t('assessment.guestHint')}
          </p>
          <Button to="/signup" size="sm" className="shrink-0">{t('nav.signup')}</Button>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-5 font-bold text-navy-900">{t('assessment.otherMatches')}</h3>
          <ul className="space-y-4">
            {result.matches.slice(1).map((m) => {
              const c = careerById[m.id]
              return (
                <li key={m.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium text-navy-800">
                      <CareerIcon id={c.id} className="h-4 w-4 text-navy-400" /> {L(c.title)}
                    </span>
                    <span className="font-semibold text-navy-600">{fmtPct(m.score)}</span>
                  </div>
                  <ProgressBar value={m.score} color="bg-navy-400" label={L(c.title)} />
                </li>
              )
            })}
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="mb-5 font-bold text-navy-900">{t('assessment.traitsTitle')}</h3>
          <ul className="space-y-4">
            {[...result.traits].sort((a, b) => b.score - a.score).map((tr) => (
              <li key={tr.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-navy-800">{L(traitNames[tr.id])}</span>
                  <span className="font-semibold text-navy-600">{fmtPct(tr.score)}</span>
                </div>
                <ProgressBar value={tr.score} label={L(traitNames[tr.id])} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
