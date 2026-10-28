import { useEffect, useState } from 'react'
import { Check, Inbox, Mail, RotateCcw } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useToast } from '../../context/ToastContext'
import { supabase, CONTACT_TABLE } from '../../lib/supabase'
import { EmptyState, Spinner } from '../../components/ui/Feedback'
import Button from '../../components/ui/Button'

export default function AdminMessages() {
  const { t, fmtDate } = useLang()
  const toast = useToast()
  const [messages, setMessages] = useState(null)
  const [showHandled, setShowHandled] = useState(false)

  const load = () =>
    supabase
      .from(CONTACT_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data }) => setMessages(data || []))

  useEffect(() => {
    load()
  }, [])

  const setHandled = async (m, handled) => {
    const { error } = await supabase.from(CONTACT_TABLE).update({ handled }).eq('id', m.id)
    if (error) return toast(t('admin.saveError'), 'error')
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, handled } : x)))
  }

  if (!messages) return <Spinner />

  const open = messages.filter((m) => !m.handled)
  const shown = showHandled ? messages.filter((m) => m.handled) : open

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {[false, true].map((h) => (
          <button
            key={String(h)}
            onClick={() => setShowHandled(h)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${showHandled === h ? 'bg-navy-800 text-white' : 'bg-white text-navy-600 ring-1 ring-navy-100 hover:ring-navy-200'}`}
          >
            {h ? t('admin.handled') : t('admin.unhandled', { n: open.length })}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-6"><EmptyState icon={Inbox} title={t('admin.noMessages')} /></div>
      ) : (
        <ul className="mt-6 space-y-4">
          {shown.map((m) => (
            <li key={m.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy-900">{m.name}</p>
                  <p className="text-xs text-navy-500">
                    <span dir="ltr">{m.email}</span> · {t(`contact.topics.${m.topic}`)} · {fmtDate(m.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" href={`mailto:${m.email}?subject=${encodeURIComponent('SkillBridge')}`}>
                    <Mail className="h-4 w-4" /> {t('admin.reply')}
                  </Button>
                  {m.handled ? (
                    <Button size="sm" variant="ghost" onClick={() => setHandled(m, false)}>
                      <RotateCcw className="h-4 w-4" /> {t('admin.markUnhandled')}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setHandled(m, true)}>
                      <Check className="h-4 w-4" /> {t('admin.markHandled')}
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-navy-700" dir="auto">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
