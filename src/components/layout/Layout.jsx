import { useEffect, useRef } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useApp } from '../../context/AppContext'
import { useLang } from '../../i18n/LanguageContext'

export default function Layout() {
  const { pathname } = useLocation()
  const { t } = useLang()
  const main = useRef(null)
  const firstRender = useRef(true)

  // On every route change: jump to the top, move focus to the new page so
  // screen readers announce it, and name the tab after the page heading.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (firstRender.current) firstRender.current = false
    else main.current?.focus({ preventScroll: true })
  }, [pathname])

  useEffect(() => {
    const id = setTimeout(() => {
      const h1 = main.current?.querySelector('h1')?.textContent?.trim()
      document.title = h1 && pathname !== '/' ? `${h1} · SkillBridge` : 'SkillBridge'
    }, 50)
    return () => clearTimeout(id)
  })

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">{t('common.skipToContent')}</a>
      <Navbar />
      <main id="main" ref={main} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// Redirects guests to the login page and brings them back afterwards.
export function RequireAuth({ children }) {
  const { user } = useApp()
  const location = useLocation()
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  return children
}

// Keeps signed-in users away from the login / sign-up pages and sends them
// back to the page that asked them to log in.
export function GuestOnly({ children }) {
  const { user } = useApp()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next')
  if (user) return <Navigate to={next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'} replace />
  return children
}
