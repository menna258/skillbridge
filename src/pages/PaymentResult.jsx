import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useApp } from '../context/AppContext'
import { supabase, ORDERS_TABLE } from '../lib/supabase'
import { Spinner } from '../components/ui/Feedback'
import Button from '../components/ui/Button'

// Paymob sends the Student back here after checkout. The query string Paymob
// adds is not trusted: we wait for our own server to mark the Order Paid.
export default function PaymentResult() {
  const { t } = useLang()
  const { refreshCatalog } = useApp()
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState(null)
  const [gaveUp, setGaveUp] = useState(false)

  useEffect(() => {
    if (!orderId || !supabase) return
    let tries = 0
    let timer
    const check = async () => {
      const { data } = await supabase.from(ORDERS_TABLE).select('id, course_id, status').eq('id', orderId).maybeSingle()
      setOrder(data)
      if (data?.status === 'paid') return refreshCatalog()
      // Keep checking a Failed Order too: Paymob can still confirm it late.
      if (++tries >= 30) return setGaveUp(true)
      timer = setTimeout(check, 2000)
    }
    check()
    return () => clearTimeout(timer)
  }, [orderId, refreshCatalog])

  const status = order?.status

  let icon, title, text, action
  if (status === 'paid') {
    icon = <CheckCircle2 className="h-8 w-8 text-teal-600" />
    title = t('payment.paidTitle')
    text = t('payment.paid')
    action = <Button to={`/courses/${order.course_id}`}>{t('payment.start')}</Button>
  } else if (status === 'failed') {
    icon = <XCircle className="h-8 w-8 text-red-600" />
    title = t('payment.failedTitle')
    text = t('payment.failed')
    action = <Button to={`/courses/${order.course_id}`}>{t('payment.retry')}</Button>
  } else if (gaveUp || !orderId) {
    // No confirmation we can trust: never claim the Student wasn't charged.
    icon = <Clock className="h-8 w-8 text-amber-600" />
    title = t('payment.pendingTitle')
    text = t('payment.pending')
    action = <Button to="/contact" variant="outline">{t('payment.contact')}</Button>
  } else {
    return (
      <section className="container-page py-24">
        <Spinner label={t('payment.checking')} />
      </section>
    )
  }

  return (
    <section className="container-page flex justify-center py-24">
      <div className="card flex max-w-md flex-col items-center p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">{icon}</div>
        <h1 className="text-2xl font-extrabold text-navy-900">{title}</h1>
        <p className="mt-2 text-navy-600">{text}</p>
        <div className="mt-6">{action}</div>
      </div>
    </section>
  )
}
