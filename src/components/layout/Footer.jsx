import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import Logo from './Logo'

export default function Footer() {
  const { t } = useLang()
  const { user } = useApp()
  const explore = [
    ['/about', 'nav.about'],
    ['/assessment', 'nav.assessment'],
    ['/roadmap', 'nav.roadmap'],
    ['/courses', 'nav.courses'],
    ['/jobs', 'nav.jobs'],
    ['/contact', 'nav.contact'],
  ]
  const account = user
    ? [['/dashboard', 'nav.dashboard'], ['/profile', 'nav.profile']]
    : [['/login', 'nav.login'], ['/signup', 'nav.signup']]

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">{t('footer.text')}</p>
          <p className="mt-5 flex max-w-md items-start gap-2 rounded-xl bg-navy-900 p-3 text-xs text-navy-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
            {t('common.demoNotice')}
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">{t('footer.explore')}</h2>
          <ul className="space-y-2.5 text-sm">
            {explore.map(([to, key]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-teal-300">{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">{t('footer.account')}</h2>
          <ul className="space-y-2.5 text-sm">
            {account.map(([to, key]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-teal-300">{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-900">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-300 sm:flex-row">
          <span>{t('footer.rights', { year: String(new Date().getFullYear()) })}</span>
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="hover:text-teal-300">
            {t('footer.photos')}
          </a>
        </div>
      </div>
    </footer>
  )
}
