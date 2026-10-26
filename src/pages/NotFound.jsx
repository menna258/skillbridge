import { Compass } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import Button from '../components/ui/Button'

export default function NotFound() {
  const { t } = useLang()
  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <div className="flex h-20 w-20 animate-float items-center justify-center rounded-3xl bg-teal-50 text-teal-600">
        <Compass className="h-10 w-10" />
      </div>
      <p className="mt-6 text-6xl font-extrabold text-navy-200">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-navy-900">{t('notFound.title')}</h1>
      <p className="mt-2 max-w-md text-navy-500">{t('notFound.text')}</p>
      <Button to="/" className="mt-8">{t('notFound.back')}</Button>
    </section>
  )
}
