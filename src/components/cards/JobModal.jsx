import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, LogIn, MapPin, Wallet } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import { skills as skillNames } from '../../data/skills'
import { userSkills } from '../../lib/progress'
import { isEmail, isPhone, isUrl } from '../../lib/validation'
import { delay } from '../../lib/storage'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Field from '../ui/Field'
import { CompanyLogo, useJobMeta } from './JobCard'

export default function JobModal({ job, startOnApply, onClose }) {
  const { t, L } = useLang()
  const { user, data, apply } = useApp()
  const [view, setView] = useState('details')
  const [form, setForm] = useState({ name: '', email: '', phone: '', portfolio: '', cover: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!job) return
    setView(startOnApply ? 'apply' : 'details')
    setErrors({})
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      portfolio: data.profile.linkedin || data.profile.github || '',
      cover: '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job, startOnApply])

  const meta = useJobMeta(job || { company: '', salary: null, postedDays: 1 })
  if (!job) return null

  const applied = data.applications.some((a) => a.jobId === job.id)
  const have = userSkills(data)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = t('auth.errors.name')
    if (!isEmail(form.email)) e.email = t('auth.errors.email')
    if (!isPhone(form.phone)) e.phone = t('auth.errors.phone')
    if (form.portfolio.trim() && !isUrl(form.portfolio)) e.portfolio = t('auth.errors.url')
    if (form.cover.trim().length < 30) e.cover = t('auth.errors.cover')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    await delay(900)
    apply(job.id, {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      portfolio: form.portfolio.trim(),
      cover: form.cover.trim(),
    })
    setSending(false)
    setView('success')
  }

  return (
    <Modal open={!!job} onClose={onClose} title={view === 'apply' ? t('jobs.applyTitle', { title: L(job.title) }) : t('jobs.details')} wide>
      {view === 'success' ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 flex h-16 w-16 animate-slide-in items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h3 className="text-xl font-bold text-navy-900">{t('jobs.successTitle')}</h3>
          <p className="mt-2 max-w-sm text-sm text-navy-500">{t('jobs.successText', { company: job.company })}</p>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={onClose}>{t('common.close')}</Button>
            <Button to="/dashboard" onClick={onClose}>{t('jobs.toDashboard')}</Button>
          </div>
        </div>
      ) : view === 'apply' ? (
        !user ? (
          <div className="flex flex-col items-center py-6 text-center">
            <LogIn className="mb-3 h-10 w-10 text-teal-500" />
            <p className="mb-5 text-sm text-navy-600">{t('auth.needLogin')}</p>
            <Button to={`/login?next=${encodeURIComponent('/jobs')}`} onClick={onClose}>{t('jobs.loginToApply')}</Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
            <Field label={t('jobs.fullName')} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            <Field label={t('jobs.email')} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" dir="ltr" />
            <Field label={t('jobs.phone')} type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="+20 1XX XXX XXXX" autoComplete="tel" dir="ltr" />
            <Field label={t('jobs.portfolio')} value={form.portfolio} onChange={set('portfolio')} error={errors.portfolio} placeholder="https://" dir="ltr" />
            <Field
              as="textarea"
              className="sm:col-span-2"
              label={t('jobs.cover')}
              value={form.cover}
              onChange={set('cover')}
              error={errors.cover}
              hint={t('jobs.coverHint')}
            />
            <div className="flex gap-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => (startOnApply ? onClose() : setView('details'))}>
                {t('common.back')}
              </Button>
              <Button type="submit" className="flex-1" loading={sending}>
                {sending ? t('jobs.submitting') : t('jobs.submit')}
              </Button>
            </div>
          </form>
        )
      ) : (
        <div>
          <div className="flex items-start gap-4">
            <CompanyLogo job={job} size="h-14 w-14 text-lg" />
            <div>
              <h3 className="text-xl font-bold text-navy-900">{L(job.title)}</h3>
              <p className="text-navy-500">{job.company}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 rounded-xl bg-navy-50/60 p-4 text-sm text-navy-700 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-600" /> {t(`locations.${job.location}`)} · {t(`modes.${job.mode}`)}</span>
            <span className="inline-flex items-center gap-2"><Wallet className="h-4 w-4 text-teal-600" /> {meta.salary}</span>
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-teal-600" /> {meta.posted}</span>
          </div>
          <p className="mt-5 leading-relaxed text-navy-700">{L(job.description)}</p>
          <h4 className="mt-6 mb-2 font-semibold text-navy-900">{t('jobs.skills')}</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((s) => (
              <span
                key={s}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  have.has(s) ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' : 'bg-navy-50 text-navy-600'
                }`}
              >
                {have.has(s) && <CheckCircle2 className="h-3.5 w-3.5" />}
                {L(skillNames[s])}
              </span>
            ))}
          </div>
          <div className="mt-7">
            {applied ? (
              <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-50 font-semibold text-teal-700">
                <CheckCircle2 className="h-5 w-5" /> {t('jobs.applied')}
              </span>
            ) : (
              <Button className="w-full" onClick={() => setView('apply')}>{t('jobs.apply')}</Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
