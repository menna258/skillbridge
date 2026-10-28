import { useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, MapPin, MessageSquare } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { supabase, isSupabaseConfigured, CONTACT_TABLE } from '../lib/supabase'
import { isEmail } from '../lib/validation'
import { readJSON, writeJSON } from '../lib/storage'
import useUnsavedWarning from '../lib/useUnsavedWarning'
import PageHeader from '../components/ui/PageHeader'
import Field, { focusFirstInvalid } from '../components/ui/Field'
import Button from '../components/ui/Button'

const topics = ['general', 'support', 'partnership', 'feedback']

export default function Contact() {
  const { t, lang } = useLang()
  const { user } = useApp()
  const empty = { name: user?.name || '', email: user?.email || '', topic: 'general', message: '' }
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [savedLocally, setSavedLocally] = useState(false)

  useUnsavedWarning(status !== 'sent' && form.message.trim().length > 0)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = form.name.trim() ? t('auth.errors.name') : t('auth.errors.required')
    if (!form.email.trim()) e.email = t('auth.errors.required')
    else if (!isEmail(form.email)) e.email = t('auth.errors.email')
    if (form.message.trim().length < 20) e.message = t('contact.messageError')
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return focusFirstInvalid(e.currentTarget)
    setStatus('sending')
    const row = {
      name: form.name.trim(),
      email: form.email.trim(),
      topic: form.topic,
      message: form.message.trim(),
      lang,
    }
    if (isSupabaseConfigured) {
      const { error } = await supabase.from(CONTACT_TABLE).insert(row)
      if (error) {
        console.error('[contact] Supabase insert failed:', error.message)
        setStatus('error')
        return
      }
      setSavedLocally(false)
    } else {
      // No Supabase keys yet: keep the message in this browser so the form still works.
      writeJSON('sb_contact_outbox', [...readJSON('sb_contact_outbox', []), { ...row, created_at: new Date().toISOString() }])
      setSavedLocally(true)
    }
    setStatus('sent')
    setForm({ ...empty, message: '' })
  }

  const info = [
    [MessageSquare, 'contact.replyLabel', t('contact.reply')],
    [MapPin, 'contact.locationLabel', t('contact.location')],
    [Clock, 'contact.hoursLabel', t('contact.hours')],
  ]

  return (
    <>
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1.6fr]">
        <aside className="space-y-4">
          {info.map(([Icon, label, value]) => (
            <div key={label} className="card flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">{t(label)}</p>
                <p className="mt-0.5 text-sm text-navy-500" dir="auto">{value}</p>
              </div>
            </div>
          ))}
        </aside>

        <div className="card p-6 sm:p-8">
          {status === 'sent' ? (
            <div className="flex animate-fade-up flex-col items-center py-10 text-center" role="status">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 ref={(el) => el?.focus()} tabIndex={-1} className="text-xl font-bold text-navy-900 focus:outline-none">{t('contact.successTitle')}</h2>
              <p className="mt-2 max-w-sm text-sm text-navy-500">{savedLocally ? t('contact.successLocal') : t('contact.successText')}</p>
              <Button variant="outline" className="mt-6" onClick={() => setStatus('idle')}>{t('contact.another')}</Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              {status === 'error' && (
                <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {t('contact.error')}
                </p>
              )}
              <Field label={t('contact.name')} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" maxLength={100} />
              <Field label={t('contact.email')} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" spellCheck={false} dir="ltr" />
              <Field as="select" className="sm:col-span-2" label={t('contact.topic')} value={form.topic} onChange={set('topic')}>
                {topics.map((tp) => <option key={tp} value={tp}>{t(`contact.topics.${tp}`)}</option>)}
              </Field>
              <Field
                as="textarea"
                className="sm:col-span-2"
                label={t('contact.message')}
                placeholder={t('contact.messagePlaceholder')}
                value={form.message}
                onChange={set('message')}
                error={errors.message}
                hint={t('contact.messageHint')}
                maxLength={2000}
              />
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full sm:w-auto" loading={status === 'sending'}>
                  {status === 'sending' ? t('contact.sending') : t('contact.send')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
