import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Award, BarChart2, CheckCircle2, ChevronDown, Circle, Clock, Lock, PlayCircle, SearchX, ShieldCheck, Star, Users, UserRound, Video } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { courseById, courses, isFree, lessonMinutes } from '../lib/catalog'
import { supabase, LESSON_CONTENT_TABLE } from '../lib/supabase'
import { skills as skillNames } from '../data/skills'
import { courseProgress } from '../lib/progress'
import { delay } from '../lib/storage'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import CourseCard from '../components/cards/CourseCard'
import CareerIcon from '../components/ui/CareerIcon'
import { ProgressBar } from '../components/ui/Progress'
import { EmptyState } from '../components/ui/Feedback'

export default function CourseDetail() {
  const { id } = useParams()
  const { t, L, fmtNum, fmtPct, fmtPrice } = useLang()
  const { user, data, enroll, completeLesson, owns } = useApp()
  const toast = useToast()
  const [enrolling, setEnrolling] = useState(false)
  const [buying, setBuying] = useState(false)
  const [content, setContent] = useState({})
  const [openLesson, setOpenLesson] = useState(null)
  const course = courseById[id]
  const owned = owns(id)

  // Lesson Content is only readable by Students who own the Course (RLS).
  useEffect(() => {
    setContent({})
    if (!owned || !supabase) return
    supabase
      .from(LESSON_CONTENT_TABLE)
      .select('lesson_index, body_en, body_ar, video_url')
      .eq('course_id', id)
      .then(({ data: rows }) => setContent(Object.fromEntries((rows || []).map((r) => [r.lesson_index, r]))))
  }, [id, owned])

  if (!course) {
    return (
      <section className="container-page py-20">
        <EmptyState
          icon={SearchX}
          title={t('course.notFound')}
          text={t('course.notFoundText')}
          action={<Button to="/courses">{t('course.back')}</Button>}
        />
      </section>
    )
  }

  const progress = owned ? courseProgress(data, course.id) : null
  const enrolled = !!progress
  const done = data.enrollments[course.id]?.done || []
  const minutes = lessonMinutes(course)
  const related = courses.filter((c) => c.category === course.category && c.id !== course.id && !c.hidden).slice(0, 3)

  const onEnroll = async () => {
    setEnrolling(true)
    await delay(600)
    enroll(course.id)
    setEnrolling(false)
    toast(t('toast.enrolled', { title: L(course.title) }))
  }

  // Paid Courses go through Paymob's hosted checkout; the Order only becomes
  // Paid when Paymob's signed callback reaches our server.
  const onBuy = async () => {
    setBuying(true)
    const { data: res, error } = await supabase.functions.invoke('create-checkout', { body: { courseId: course.id } })
    if (error || !res?.url) {
      setBuying(false)
      toast(t('course.paymentError'), 'error')
      return
    }
    window.location.assign(res.url)
  }

  const onComplete = (i) => {
    completeLesson(course.id, i)
    const finished = done.length + 1 === course.lessons.length
    toast(finished ? t('toast.courseDone') : t('toast.lessonDone', { n: minutes }))
  }

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr] lg:py-14">
          <div className="animate-fade-up">
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-navy-200 hover:text-white">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('course.back')}
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                <CareerIcon id={course.category} className="h-3.5 w-3.5 text-teal-300" /> {t(`careers.${course.category}`)}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1">{t(`levels.${course.level}`)}</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{L(course.title)}</h1>
            <p className="mt-4 max-w-2xl text-navy-200">{L(course.description)}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-100">
              <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {fmtNum(course.rating)}</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {t('common.learners', { n: course.learners })}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {t('common.hours', { n: course.hours })}</span>
              <span className="inline-flex items-center gap-1.5"><UserRound className="h-4 w-4" /> {course.instructor}</span>
            </div>
          </div>
          <SmartImage src={course.image} alt={L(course.title)} className="aspect-video animate-fade-in rounded-2xl lg:aspect-auto lg:h-full" />
        </div>
      </section>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="mb-4 text-xl font-bold text-navy-900">{t('course.syllabus')}</h2>
          {!enrolled && <p className="mb-4 rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-600">{t(owned || isFree(course) ? 'course.enrollPrompt' : 'course.buyPrompt')}</p>}
          <ol className="card divide-y divide-navy-50">
            {course.lessons.map((lesson, i) => {
              const isDone = done.includes(i)
              const body = content[i]
              const text = body && L({ en: body.body_en, ar: body.body_ar })
              const isOpen = enrolled && openLesson === i
              return (
                <li key={i} className="p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                  {isDone ? <CheckCircle2 className="h-6 w-6 shrink-0 text-teal-500" /> : owned ? <Circle className="h-6 w-6 shrink-0 text-navy-200" /> : <Lock className="h-5 w-5 shrink-0 text-navy-300" />}
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-start disabled:cursor-default"
                    onClick={() => setOpenLesson(isOpen ? null : i)}
                    disabled={!enrolled}
                    aria-expanded={isOpen}
                  >
                    <p className="text-xs font-semibold text-navy-400">{t('course.lesson', { n: i + 1 })} · {t('common.minutes', { n: minutes })}</p>
                    <p className={`flex items-center gap-1.5 font-medium ${isDone ? 'text-navy-500' : 'text-navy-900'}`}>
                      {L(lesson)}
                      {enrolled && <ChevronDown className={`h-4 w-4 shrink-0 text-navy-400 transition ${isOpen ? 'rotate-180' : ''}`} />}
                    </p>
                  </button>
                  {enrolled &&
                    (isDone ? (
                      <span className="text-xs font-semibold text-teal-600">{t('course.completedLesson')}</span>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => onComplete(i)}>
                        <PlayCircle className="h-4 w-4" /> <span className="hidden sm:inline">{t('course.markComplete')}</span>
                      </Button>
                    ))}
                  </div>
                  {isOpen && (
                    <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-navy-700 sm:ms-10">
                      {text || body?.video_url ? (
                        <>
                          {text && <p className="whitespace-pre-line">{text}</p>}
                          {body.video_url && (
                            <a href={body.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:underline">
                              <Video className="h-4 w-4" /> {t('course.watchVideo')}
                            </a>
                          )}
                        </>
                      ) : (
                        <p className="text-navy-500">{t('course.noContent')}</p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            {enrolled ? (
              <>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-navy-800">
                  <span>{t('course.progress')}</span>
                  <span>{fmtPct(progress.pct)}</span>
                </div>
                <ProgressBar value={progress.pct} label={t('course.progress')} />
                <p className="mt-2 text-xs text-navy-500">{t('course.lessonsDone', { done: progress.done, total: progress.total })}</p>
                {progress.complete && (
                  <p className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 p-3 text-sm font-semibold text-teal-700">
                    <Award className="h-5 w-5" /> {t('course.finished')}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="mb-4 text-3xl font-extrabold text-navy-900">{isFree(course) ? t('courses.free') : fmtPrice(course.price)}</p>
                {owned ? (
                  <Button className="w-full" size="lg" onClick={onEnroll} loading={enrolling}>
                    {isFree(course) ? t('courses.enroll') : t('course.start')}
                  </Button>
                ) : !user ? (
                  <Button className="w-full" size="lg" to={`/login?next=${encodeURIComponent(`/courses/${course.id}`)}`}>
                    {t(isFree(course) ? 'course.loginToEnroll' : 'course.loginToBuy')}
                  </Button>
                ) : (
                  <>
                    <Button className="w-full" size="lg" onClick={onBuy} loading={buying}>
                      {buying ? t('course.buying') : t('course.buy')}
                    </Button>
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-navy-500"><ShieldCheck className="h-4 w-4 text-teal-600" /> {t('course.securePayment')}</p>
                  </>
                )}
              </>
            )}
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-navy-500">{t('course.instructor')}</dt><dd className="font-medium text-navy-900">{course.instructor}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-navy-500">{t('course.duration')}</dt><dd className="font-medium text-navy-900">{t('common.hours', { n: course.hours })}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-navy-500">{t('courses.level')}</dt><dd className="inline-flex items-center gap-1 font-medium text-navy-900"><BarChart2 className="h-4 w-4 text-teal-600" />{t(`levels.${course.level}`)}</dd></div>
            </dl>
          </div>
          <div className="card p-6">
            <h3 className="mb-3 font-bold text-navy-900">{t('course.skills')}</h3>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((s) => (
                <span key={s} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{L(skillNames[s])}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="container-page pb-16">
          <h2 className="mb-5 text-xl font-bold text-navy-900">{t('course.related')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>
      )}
    </>
  )
}
