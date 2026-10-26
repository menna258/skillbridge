import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AlertCircle, Sparkles } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { isEmail } from '../lib/validation'
import { delay } from '../lib/storage'
import AuthShell from '../components/layout/AuthShell'
import Field from '../components/ui/Field'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'

export default function Login() {
  const { t } = useLang()
  const { login, loginDemo } = useApp()
  const toast = useToast()
  const { search } = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.email.trim()) errs.email = t('auth.errors.required')
    else if (!isEmail(form.email)) errs.email = t('auth.errors.email')
    if (!form.password) errs.password = t('auth.errors.required')
    setErrors(errs)
    setFormError('')
    if (Object.keys(errs).length) return
    setLoading('form')
    await delay(700)
    const res = await login(form.email, form.password)
    if (!res.ok) {
      setLoading(null)
      setFormError(t(`auth.errors.${res.error}`))
      return
    }
    toast(t('auth.welcome', { name: res.user.name.split(' ')[0] }))
  }

  const demo = async () => {
    setLoading('demo')
    await delay(600)
    const res = await loginDemo()
    toast(t('auth.welcome', { name: res.user.name.split(' ')[0] }))
  }

  return (
    <AuthShell title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <form onSubmit={submit} noValidate className="space-y-5">
        {formError && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
          </p>
        )}
        <Field label={t('auth.email')} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" dir="ltr" />
        <PasswordField label={t('auth.password')} value={form.password} onChange={set('password')} error={errors.password} autoComplete="current-password" />
        <Button type="submit" className="w-full" size="lg" loading={loading === 'form'} disabled={!!loading}>
          {loading === 'form' ? t('auth.loggingIn') : t('auth.loginButton')}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
        <p className="flex items-center gap-2 font-semibold text-navy-900"><Sparkles className="h-4 w-4 text-teal-600" /> {t('auth.demoTitle')}</p>
        <p className="mt-1 text-sm text-navy-600">{t('auth.demoText')}</p>
        <Button variant="navy" className="mt-4 w-full" onClick={demo} loading={loading === 'demo'} disabled={!!loading}>
          {t('auth.demoButton')}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-navy-500">
        {t('auth.noAccount')}{' '}
        <Link to={`/signup${search}`} className="font-semibold text-teal-600 hover:underline">{t('nav.signup')}</Link>
      </p>
    </AuthShell>
  )
}
