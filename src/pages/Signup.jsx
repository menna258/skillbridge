import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AlertCircle, MailCheck } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { isEmail, isStrongPassword } from '../lib/validation'
import AuthShell from '../components/layout/AuthShell'
import Field, { focusFirstInvalid } from '../components/ui/Field'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'

export default function Signup() {
  const { t } = useLang()
  const { signup } = useApp()
  const toast = useToast()
  const { search } = useLocation()
  const [form, setForm] = useState({ name: '', email: '', university: '', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = form.name.trim() ? t('auth.errors.name') : t('auth.errors.required')
    if (!form.email.trim()) e.email = t('auth.errors.required')
    else if (!isEmail(form.email)) e.email = t('auth.errors.email')
    if (!form.university.trim()) e.university = t('auth.errors.required')
    if (!isStrongPassword(form.password)) e.password = t('auth.errors.password')
    if (!form.confirm) e.confirm = t('auth.errors.required')
    else if (form.confirm !== form.password) e.confirm = t('auth.errors.match')
    if (!form.terms) e.terms = t('auth.errors.terms')
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return focusFirstInvalid(e.currentTarget)
    setLoading(true)
    const res = await signup(form)
    setLoading(false)
    if (!res.ok) {
      setFormError(t(`auth.errors.${res.error}`))
      return
    }
    if (res.confirm) {
      setSentTo(form.email.trim())
      return
    }
    toast(t('auth.created', { name: res.user.name.split(' ')[0] }))
  }

  if (sentTo) {
    return (
      <AuthShell title={t('auth.checkEmailTitle')} subtitle={t('auth.checkEmail', { email: sentTo })}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600"><MailCheck className="h-7 w-7" /></div>
          <Button to={`/login${search}`} className="w-full" size="lg">{t('nav.login')}</Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title={t('auth.signupTitle')} subtitle={t('auth.signupSubtitle')}>
      <form onSubmit={submit} noValidate className="space-y-5">
        {formError && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" /> {formError}{' '}
            <Link to={`/login${search}`} className="font-semibold underline">{t('nav.login')}</Link>
          </p>
        )}
        <Field label={t('auth.fullName')} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('auth.email')} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" spellCheck={false} dir="ltr" />
          <Field label={t('auth.university')} value={form.university} onChange={set('university')} error={errors.university} placeholder={t('auth.universityPlaceholder')} autoComplete="organization" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField label={t('auth.password')} value={form.password} onChange={set('password')} error={errors.password} hint={t('auth.passwordHint')} autoComplete="new-password" />
          <PasswordField label={t('auth.confirmPassword')} value={form.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
        </div>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-navy-600">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={set('terms')}
              aria-invalid={!!errors.terms}
              aria-describedby={errors.terms ? 'terms-err' : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600"
            />
            {t('auth.terms')}
          </label>
          {errors.terms && <p id="terms-err" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.terms}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          {loading ? t('auth.creating') : t('auth.signupButton')}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">
        {t('auth.haveAccount')}{' '}
        <Link to={`/login${search}`} className="font-semibold text-teal-700 hover:underline">{t('nav.login')}</Link>
      </p>
    </AuthShell>
  )
}
