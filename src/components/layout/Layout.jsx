import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useApp } from '../../context/AppContext'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
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
