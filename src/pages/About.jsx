import { useState } from 'react'
import { ChevronDown, Eye, Globe2, Hammer, LineChart, Target, Focus } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { img } from '../lib/images'
import PageHeader from '../components/ui/PageHeader'
import SmartImage from '../components/ui/SmartImage'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'

export default function About() {
  const { t } = useLang()
  const { user } = useApp()
  const [openFaq, setOpenFaq] = useState(0)

  const values = [
    [Focus, 'about.v1', 'about.v1Text'],
    [Hammer, 'about.v2', 'about.v2Text'],
    [LineChart, 'about.v3', 'about.v3Text'],
    [Globe2, 'about.v4', 'about.v4Text'],
  ]
  const faqs = [1, 2, 3, 4, 5]

  return (
    <>
      <PageHeader title={t('about.title')} subtitle={t('about.subtitle')} />

      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal>
          <SmartImage src={img('photo-1522202176988-66273c2fd55f', 1000)} alt="Students collaborating on a project" className="aspect-[4/3] rounded-3xl shadow-soft" />
        </Reveal>
        <div className="space-y-8">
          <Reveal>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><Target className="h-6 w-6" /></div>
              <div>
                <h2 className="text-2xl font-extrabold text-navy-900">{t('about.missionTitle')}</h2>
                <p className="mt-3 leading-relaxed text-navy-600">{t('about.missionText')}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700"><Eye className="h-6 w-6" /></div>
              <div>
                <h2 className="text-2xl font-extrabold text-navy-900">{t('about.visionTitle')}</h2>
                <p className="mt-3 leading-relaxed text-navy-600">{t('about.visionText')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <Reveal><SectionHeading title={t('about.valuesTitle')} /></Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([Icon, title, text], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="h-full rounded-2xl bg-slate-50 p-6">
                  <Icon className="h-7 w-7 text-teal-600" />
                  <h3 className="mt-4 font-bold text-navy-900">{t(title)}</h3>
                  <p className="mt-2 text-sm text-navy-500">{t(text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page max-w-3xl py-20">
        <Reveal><SectionHeading title={t('about.faqTitle')} /></Reveal>
        <div className="space-y-3">
          {faqs.map((n, i) => {
            const open = openFaq === i
            return (
              <div key={n} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start font-semibold text-navy-900"
                  aria-expanded={open}
                >
                  {t(`about.q${n}`)}
                  <ChevronDown className={`h-5 w-5 shrink-0 text-navy-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-navy-600">{t(`about.a${n}`)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-teal-500 px-8 py-10 text-white sm:flex-row">
          <div>
            <h2 className="text-2xl font-extrabold">{t('about.ctaTitle')}</h2>
            <p className="mt-2 text-teal-50">{t('about.ctaText')}</p>
          </div>
          <Button variant="navy" size="lg" to={user ? '/dashboard' : '/signup'} className="shrink-0">
            {user ? t('nav.dashboard') : t('nav.signup')}
          </Button>
        </div>
      </section>
    </>
  )
}
