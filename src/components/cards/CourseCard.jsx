import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, PlayCircle, Star, Users } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import { courseProgress } from '../../lib/progress'
import { isFree } from '../../lib/catalog'
import SmartImage from '../ui/SmartImage'
import { ProgressBar } from '../ui/Progress'
import CareerIcon from '../ui/CareerIcon'

export default function CourseCard({ course }) {
  const { t, L, fmtNum, fmtPct, fmtPrice } = useLang()
  const { data, owns } = useApp()
  const progress = owns(course.id) ? courseProgress(data, course.id) : null

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-50 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative">
        <SmartImage src={course.image} alt="" className="h-44" imgClassName="transition duration-500 group-hover:scale-105" />
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-navy-800 shadow-sm">
          <CareerIcon id={course.category} className="h-3.5 w-3.5 text-teal-600" />
          {t(`careers.${course.category}`)}
        </span>
        {progress?.complete && (
          <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-teal-700 px-2.5 py-1 text-xs font-semibold text-white">
            <CheckCircle2 className="h-3.5 w-3.5" /> {t('courses.completed')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium">
          <span className="rounded-md bg-navy-50 px-2 py-0.5 text-navy-600">{t(`levels.${course.level}`)}</span>
          <span className="inline-flex items-center gap-1 text-amber-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {fmtNum(course.rating)}
          </span>
        </div>
        <h3 className="font-bold leading-snug text-navy-900 transition group-hover:text-teal-700">{L(course.title)}</h3>
        <p className="mt-1 text-sm text-navy-500">{t('courses.by', { name: course.instructor })}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-500">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t('common.hours', { n: course.hours })}</span>
          <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" /> {t('common.lessons', { n: course.lessons.length })}</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {fmtNum(course.learners)}</span>
        </div>
        <div className="mt-auto pt-4">
          {progress ? (
            <div>
              <div className="mb-1.5 flex justify-between text-xs font-medium text-navy-600">
                <span>{progress.complete ? t('courses.completed') : t('courses.enrolled')}</span>
                <span>{fmtPct(progress.pct)}</span>
              </div>
              <ProgressBar value={progress.pct} label={L(course.title)} />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-navy-900">{isFree(course) ? t('courses.free') : fmtPrice(course.price)}</span>
              <span className="text-sm font-semibold text-teal-600 group-hover:underline">{t('courses.view')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
