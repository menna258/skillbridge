import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Briefcase, Compass, Map, Sparkles, TrendingUp, UserPlus, Target, Send } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { careers, careerById } from '../data/careers'
import { listedCourses } from '../lib/catalog'
import { jobs } from '../data/jobs'
import { questions } from '../data/questions'
import { studentStories } from '../data/students'
import { img } from '../lib/images'
import { activeCareerId, roadmapProgress } from '../lib/progress'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import CareerIcon from '../components/ui/CareerIcon'
import { ProgressBar, Ring } from '../components/ui/Progress'
import { DemoBadge } from '../components/ui/Feedback'

export default function Home() {
  const { t, L, fmtNum, fmtPct } = useLang()
  const { data } = useApp()

  const result = data.assessment
  const heroCareer = careerById[result?.topCareer] || careers[1]
  const heroScore = result?.matches[0].score
  const careerId = activeCareerId(data)
  const progress = careerId ? roadmapProgress(data, careerId).pct : null

  const stats = [
    [careers.length, 'home.statCareers'],
    [listedCourses().length, 'home.statCourses'],
    [jobs.length, 'home.statJobs'],
    [questions.length, 'home.statQuestions'],
  ]
  const features = [
    [Compass, 'home.f1Title', 'home.f1Text', '/assessment'],
    [Map, 'home.f2Title', 'home.f2Text', '/roadmap'],
    [BookOpen, 'home.f3Title', 'home.f3Text', '/courses'],
    [Briefcase, 'home.f4Title', 'home.f4Text', '/jobs'],
  ]
  const steps = [
    [UserPlus, 'home.step1', 'home.step1Text'],
    [Target, 'home.step2', 'home.step2Text'],
    [TrendingUp, 'home.step3', 'home.step3Text'],
    [Send, 'home.step4', 'home.step4Text'],
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="pointer-events-none absolute -top-40 end-[-10%] h-[480px] w-[480px] rounded-full bg-teal-100/60 blur-3xl" />
        <div className="pointer-events-none absolute top-40 start-[-10%] h-[380px] w-[380px] rounded-full bg-navy-100/60 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-semibold text-teal-700 ring-1 ring-teal-100">
              <Sparkles className="h-4 w-4" /> {t('home.badge')}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-[3.4rem]">
              {t('home.title1')}{' '}
              <span className="bg-gradient-to-r from-teal-500 to-navy-600 bg-clip-text text-transparent">{t('home.titleHighlight')}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-500">{t('home.subtitle')}</p>
            <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
              <Button to="/assessment" size="lg">
                {t('home.ctaAssessment')} <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </Button>
              <Button to="/courses" size="lg" variant="outline">
                {t('home.ctaExplore')}
              </Button>
            </div>
            <dl className="mt-10 grid animate-fade-up grid-cols-2 gap-6 [animation-delay:320ms] sm:grid-cols-4">
              {stats.map(([n, key]) => (
                <div key={key}>
                  <dt className="sr-only">{t(key)}</dt>
                  <dd className="text-3xl font-extrabold tabular-nums text-navy-900">{fmtNum(n)}</dd>
                  <dd className="text-sm text-navy-500">{t(key)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-lg animate-fade-in [animation-delay:200ms]">
            <SmartImage
              src={img('photo-1523240795612-9a054b0db644', 1000)}
              alt=""
              priority
              className="aspect-[4/5] rounded-[2rem] shadow-soft"
            />
            <div className="absolute -start-4 top-10 w-60 animate-float rounded-2xl bg-white p-4 shadow-soft sm:-start-10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-navy-500">{t('home.floatMatch')}</p>
                {!result && <DemoBadge>{t('common.demo')}</DemoBadge>}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <CareerIcon id={heroCareer.id} />
                </div>
                <p className="text-sm font-bold leading-tight text-navy-900">{L(heroCareer.title)}</p>
              </div>
              {result && (
                <div className="mt-3">
                  <ProgressBar value={heroScore} label={t('home.floatMatch')} />
                  <p className="mt-1 text-end text-xs font-semibold text-teal-700">{t('assessment.match', { n: heroScore })}</p>
                </div>
              )}
            </div>
            {progress !== null && (
              <div className="absolute -end-4 bottom-10 flex animate-float items-center gap-3 rounded-2xl bg-navy-900 p-4 text-white shadow-soft [animation-delay:1.5s] sm:-end-8">
                <Ring value={progress} size={58} stroke={6} track="#273f78" color="#26bcad">
                  <span className="text-xs font-bold">{fmtPct(progress)}</span>
                </Ring>
                <p className="max-w-[110px] text-sm font-semibold leading-tight">{t('home.floatProgress')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-20">
        <Reveal>
          <SectionHeading title={t('home.featuresTitle')} subtitle={t('home.featuresSubtitle')} />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, title, text, to], i) => (
            <Reveal key={title} delay={i * 80}>
              <Link to={to} className="card group block h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-soft">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-teal-300 transition group-hover:bg-teal-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">{t(title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{t(text)}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600">
                  {t('common.learnMore')} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-900 py-20 text-white">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-2xl font-extrabold sm:text-3xl">{t('home.howTitle')}</h2>
              <p className="mt-3 text-navy-200">{t('home.howSubtitle')}</p>
            </div>
          </Reveal>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([Icon, title, text], i) => (
              <Reveal as="li" key={title} delay={i * 100} className="relative h-full rounded-2xl border border-navy-700 bg-navy-800/60 p-6">
                <span className="absolute end-5 top-5 text-4xl font-extrabold text-navy-700" aria-hidden="true">{fmtNum(i + 1)}</span>
                <Icon className="h-8 w-8 text-teal-300" />
                <h3 className="mt-5 font-bold">{t(title)}</h3>
                <p className="mt-2 text-sm text-navy-200">{t(text)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Careers */}
      <section className="container-page py-20">
        <Reveal>
          <SectionHeading title={t('home.careersTitle')} subtitle={t('home.careersSubtitle')} />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {careers.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 80}>
              <Link to={`/roadmap?career=${c.id}`} className="card group block h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                <div className="relative">
                  <SmartImage src={c.image} alt="" className="h-44" imgClassName="transition duration-500 group-hover:scale-105" />
                  <span className="absolute start-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-navy-800">
                    {t(`careers.demand.${c.demand}`)}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <CareerIcon id={c.id} className="h-5 w-5 text-teal-600" />
                    <h3 className="font-bold text-navy-900">{L(c.title)}</h3>
                  </div>
                  <p className="mt-2 text-sm text-navy-500">{L(c.summary)}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4 text-sm">
                    <span className="text-navy-400">{t('home.entrySalary')}</span>
                    <span className="font-semibold text-navy-800">{t('common.egpMonth', { min: c.salary[0], max: c.salary[1] })}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="bg-white py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading title={t('home.storiesTitle')} subtitle={t('home.storiesSubtitle')} />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {studentStories.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 100}>
                <figure className="card flex h-full gap-5 p-6">
                  <SmartImage src={s.photo} alt="" className="h-16 w-16 shrink-0 rounded-full" />
                  <div className="flex-1">
                    <blockquote className="leading-relaxed text-navy-700">“{L(s.quote)}”</blockquote>
                    <figcaption className="mt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-navy-900">{L(s.name)}</p>
                        <DemoBadge>{t('common.demo')}</DemoBadge>
                      </div>
                      <p className="text-sm text-navy-500">{L(s.university)} · {L(careerById[s.career].title)}</p>
                      <div className="mt-3">
                        <ProgressBar value={s.progress} label={L(s.name)} />
                        <p className="mt-1 text-xs text-navy-500">{t('home.roadmapDone', { n: s.progress })}</p>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-teal-800 px-6 py-14 text-center text-white sm:px-12">
            <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
            <h2 className="text-3xl font-extrabold">{t('home.ctaTitle')}</h2>
            <p className="mx-auto mt-3 max-w-lg text-navy-100">{t('home.ctaText')}</p>
            <Button to="/assessment" size="lg" variant="white" className="mt-8">
              {t('home.ctaButton')} <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}
