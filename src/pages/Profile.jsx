import { useState } from 'react'
import { AlertTriangle, CalendarDays, Check, GraduationCap, Mail, Save } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { careerById } from '../data/careers'
import { skills as skillNames, skillIds } from '../data/skills'
import { activeCareerId } from '../lib/progress'
import { isUrl } from '../lib/validation'
import { delay } from '../lib/storage'
import PageHeader from '../components/ui/PageHeader'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import CareerIcon from '../components/ui/CareerIcon'
import { ProgressBar } from '../components/ui/Progress'
import { initials } from '../components/layout/Navbar'

export default function Profile() {
  const { t, L, fmtNum, fmtPct, fmtDate } = useLang()
  const { user, data, updateAccount, updateProfile, resetProgress } = useApp()
  const toast = useToast()
  const [form, setForm] = useState(() => ({
    name: user.name,
    university: user.university || '',
    ...data.profile,
  }))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggleSkill = (id) =>
    setForm((f) => ({ ...f, skills: f.skills.includes(id) ? f.skills.filter((s) => s !== id) : [...f.skills, id] }))

  const career = careerById[activeCareerId(data)]
  const checks = [
    user.name, user.university, data.profile.major, data.profile.gradYear, data.profile.bio,
    data.profile.skills.length, data.profile.linkedin || data.profile.github, data.assessment,
  ]
  const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100)

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = t('auth.errors.name')
    if (!form.university.trim()) e.university = t('auth.errors.required')
    if (form.gradYear && !(Number(form.gradYear) >= 2020 && Number(form.gradYear) <= 2035)) e.gradYear = t('auth.errors.year')
    if (form.linkedin.trim() && !isUrl(form.linkedin)) e.linkedin = t('auth.errors.url')
    if (form.github.trim() && !isUrl(form.github)) e.github = t('auth.errors.url')
    setErrors(e)
    return !Object.keys(e).length
  }

  const save = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await delay(700)
    updateAccount({ name: form.name.trim(), university: form.university.trim() })
    updateProfile({
      major: form.major.trim(),
      gradYear: form.gradYear,
      bio: form.bio.trim(),
      skills: form.skills,
      linkedin: form.linkedin.trim(),
      github: form.github.trim(),
    })
    setSaving(false)
    toast(t('profile.saved'))
  }

  const doReset = () => {
    resetProgress()
    setConfirmReset(false)
    toast(t('profile.resetDone'), 'info')
  }

  return (
    <>
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />
      <section className="container-page grid gap-8 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-navy-700 to-teal-500 text-2xl font-extrabold text-white">
              {initials(user.name)}
            </div>
            <h2 className="mt-4 text-lg font-bold text-navy-900">{user.name}</h2>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-navy-500" dir="ltr"><Mail className="h-4 w-4" /> {user.email}</p>
            {user.university && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-navy-500"><GraduationCap className="h-4 w-4" /> {user.university}</p>
            )}
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-navy-400">
              <CalendarDays className="h-3.5 w-3.5" /> {t('profile.memberSince', { date: fmtDate(user.createdAt) })}
            </p>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-start">
              <p className="text-xs font-semibold text-navy-400">{t('profile.careerLabel')}</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold text-navy-900">
                {career ? <><CareerIcon id={career.id} className="h-4 w-4 text-teal-600" /> {L(career.title)}</> : t('profile.noCareer')}
              </p>
            </div>
            <div className="mt-4 text-start">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-navy-600">
                <span>{t('profile.completeness')}</span>
                <span>{fmtPct(completeness)}</span>
              </div>
              <ProgressBar value={completeness} label={t('profile.completeness')} />
            </div>
          </div>

          <div className="card border-red-100 p-6">
            <h3 className="flex items-center gap-2 font-bold text-navy-900"><AlertTriangle className="h-5 w-5 text-red-500" /> {t('profile.resetTitle')}</h3>
            <p className="mt-2 text-sm text-navy-500">{t('profile.resetText')}</p>
            {confirmReset ? (
              <div className="mt-4 animate-fade-in rounded-xl bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">{t('profile.resetConfirm')}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="danger" onClick={doReset}>{t('profile.resetYes')}</Button>
                  <Button size="sm" variant="outline" onClick={() => setConfirmReset(false)}>{t('common.cancel')}</Button>
                </div>
              </div>
            ) : (
              <Button size="sm" variant="outline" className="mt-4 !border-red-200 !text-red-600 hover:!bg-red-50" onClick={() => setConfirmReset(true)}>
                {t('profile.resetButton')}
              </Button>
            )}
          </div>
        </aside>

        <form onSubmit={save} noValidate className="card space-y-8 p-6 sm:p-8">
          <fieldset>
            <legend className="mb-5 text-lg font-bold text-navy-900">{t('profile.personal')}</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t('profile.fullName')} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <Field label={t('profile.email')} value={user.email} disabled dir="ltr" className="opacity-70" />
              <Field label={t('profile.university')} value={form.university} onChange={set('university')} error={errors.university} />
              <Field label={t('profile.major')} value={form.major} onChange={set('major')} />
              <Field label={t('profile.gradYear')} type="number" min="2020" max="2035" value={form.gradYear} onChange={set('gradYear')} error={errors.gradYear} />
              <Field as="textarea" className="sm:col-span-2" label={t('profile.bio')} placeholder={t('profile.bioPlaceholder')} value={form.bio} onChange={set('bio')} maxLength={400} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-bold text-navy-900">{t('profile.skills')}</legend>
            <p className="mb-4 mt-1 text-sm text-navy-500">{t('profile.skillsHint')}</p>
            <div className="flex flex-wrap gap-2">
              {skillIds.map((id) => {
                const on = form.skills.includes(id)
                return (
                  <button type="button" key={id} onClick={() => toggleSkill(id)} className={`chip ${on ? 'border-teal-500 bg-teal-500 text-white' : 'chip-off'}`} aria-pressed={on}>
                    {on && <Check className="h-3.5 w-3.5" />} {L(skillNames[id])}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-5 text-lg font-bold text-navy-900">{t('profile.links')}</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t('profile.linkedin')} value={form.linkedin} onChange={set('linkedin')} error={errors.linkedin} placeholder="https://linkedin.com/in/…" dir="ltr" />
              <Field label={t('profile.github')} value={form.github} onChange={set('github')} error={errors.github} placeholder="https://github.com/…" dir="ltr" />
            </div>
          </fieldset>

          <div className="flex justify-end border-t border-navy-50 pt-6">
            <Button type="submit" loading={saving}>
              {!saving && <Save className="h-4 w-4" />} {saving ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}
