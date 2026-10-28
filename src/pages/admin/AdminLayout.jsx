import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Inbox, ShieldAlert, ShoppingBag } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import { EmptyState } from '../../components/ui/Feedback'
import Button from '../../components/ui/Button'

// The Admin area. The database enforces who is Admin (RLS); this guard only
// keeps everyone else from seeing empty screens.
export default function AdminLayout() {
  const { t } = useLang()
  const { user } = useApp()
  const location = useLocation()

  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  if (!user.isAdmin) {
    return (
      <section className="container-page py-20">
        <EmptyState icon={ShieldAlert} title={t('admin.forbidden')} text={t('admin.forbiddenText')} action={<Button to="/">{t('nav.home')}</Button>} />
      </section>
    )
  }

  const tabs = [
    ['/admin', 'admin.orders', ShoppingBag],
    ['/admin/courses', 'admin.courses', BookOpen],
    ['/admin/messages', 'admin.messages', Inbox],
  ]

  return (
    <section className="container-page py-10">
      <h1 className="text-3xl font-extrabold text-navy-900">{t('admin.title')}</h1>
      <nav className="mt-6 flex gap-2 overflow-x-auto border-b border-navy-100">
        {tabs.map(([to, key, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'border-teal-500 text-teal-700' : 'border-transparent text-navy-500 hover:text-navy-800'
              }`
            }
          >
            <Icon className="h-4 w-4" /> {t(key)}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8">
        <Outlet />
      </div>
    </section>
  )
}
