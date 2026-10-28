import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Languages, LayoutDashboard, LogOut, Menu, ShieldCheck, User, X } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import Logo from './Logo'

const links = [
  ['/', 'nav.home'],
  ['/about', 'nav.about'],
  ['/assessment', 'nav.assessment'],
  ['/roadmap', 'nav.roadmap'],
  ['/courses', 'nav.courses'],
  ['/jobs', 'nav.jobs'],
  ['/contact', 'nav.contact'],
]

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

export default function Navbar() {
  const { t, toggle } = useLang()
  const { user, logout } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const menuBtn = useRef(null)
  const burger = useRef(null)

  useEffect(() => {
    setOpen(false)
    setMenu(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes whichever menu is open and returns focus to its button;
  // clicking or tabbing outside the account menu closes it.
  useEffect(() => {
    if (!menu && !open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (menu) {
        setMenu(false)
        menuBtn.current?.focus()
      } else {
        setOpen(false)
        burger.current?.focus()
      }
    }
    const onOutside = (e) => menu && !menuRef.current?.contains(e.target) && setMenu(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('focusin', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('focusin', onOutside)
    }
  }, [menu, open])

  const handleLogout = () => {
    logout()
    toast(t('auth.loggedOut'), 'info')
    navigate('/')
  }

  const linkCls = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-teal-50 text-teal-700' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
    }`

  return (
    <header className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur transition-shadow ${scrolled ? 'border-navy-100 shadow-sm' : 'border-transparent'}`}>
      <nav aria-label={t('common.mainNav')} className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([to, key]) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkCls}>
              {t(key)}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-navy-300 px-2.5 text-sm font-semibold text-navy-700 transition hover:border-teal-300 hover:text-teal-700"
            aria-label={t('nav.switchLangLabel')}
          >
            <Languages className="h-4 w-4" />
            <span>{t('nav.switchLang')}</span>
          </button>

          {user ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                ref={menuBtn}
                type="button"
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full border border-navy-100 py-1 pe-2 ps-1 transition hover:border-navy-200"
                aria-label={t('nav.account')}
                aria-expanded={menu}
                aria-controls="account-menu"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
                  {initials(user.name)}
                </span>
                <span className="max-w-[110px] truncate text-sm font-medium text-navy-800">{user.name.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4 text-navy-400" />
              </button>
              {menu && (
                <div id="account-menu" className="absolute end-0 mt-2 w-52 animate-slide-in overflow-hidden rounded-xl border border-navy-100 bg-white py-1 shadow-soft">
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50">
                    <LayoutDashboard className="h-4 w-4" /> {t('nav.dashboard')}
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50">
                    <User className="h-4 w-4" /> {t('nav.profile')}
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50">
                      <ShieldCheck className="h-4 w-4" /> {t('nav.admin')}
                    </Link>
                  )}
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-navy-50 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button to="/login" variant="ghost" size="sm">
                {t('nav.login')}
              </Button>
              <Button to="/signup" size="sm">
                {t('nav.signup')}
              </Button>
            </div>
          )}

          <button
            ref={burger}
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-700 hover:bg-navy-50 lg:hidden"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="animate-slide-in border-t border-navy-100 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map(([to, key]) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkCls}>
                {t(key)}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-navy-100" />
            {user ? (
              <>
                <NavLink to="/dashboard" className={linkCls}>{t('nav.dashboard')}</NavLink>
                <NavLink to="/profile" className={linkCls}>{t('nav.profile')}</NavLink>
                {user.isAdmin && <NavLink to="/admin" className={linkCls}>{t('nav.admin')}</NavLink>}
                <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-start text-sm font-medium text-red-600 hover:bg-red-50">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button to="/login" variant="outline" size="sm">{t('nav.login')}</Button>
                <Button to="/signup" size="sm">{t('nav.signup')}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
