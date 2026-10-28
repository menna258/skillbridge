import { CheckCircle2 } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { img } from '../../lib/images'
import SmartImage from '../ui/SmartImage'

// Two-column frame shared by the login and sign-up pages.
export default function AuthShell({ title, subtitle, children }) {
  const { t } = useLang()
  return (
    <section className="container-page py-10 sm:py-16">
      <div className="card mx-auto grid max-w-5xl overflow-hidden lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <SmartImage src={img('photo-1531482615713-2afd69097998', 1000)} alt="" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-900/70 to-navy-900/20" />
          <div className="relative flex h-full flex-col justify-end p-10 text-white">
            <h2 className="text-2xl font-extrabold leading-snug">{t('auth.sideTitle')}</h2>
            <p className="mt-2 text-navy-100">{t('auth.sideText')}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {['auth.sidePoint1', 'auth.sidePoint2', 'auth.sidePoint3'].map((k) => (
                <li key={k} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-300" /> {t(k)}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="animate-fade-up p-6 sm:p-10">
          <h1 className="text-2xl font-extrabold text-navy-900">{title}</h1>
          <p className="mt-1.5 text-sm text-navy-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  )
}
