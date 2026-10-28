import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useToast } from '../../context/ToastContext'
import { supabase, ORDERS_TABLE } from '../../lib/supabase'
import { courseById } from '../../lib/catalog'
import { EmptyState, Spinner } from '../../components/ui/Feedback'
import Button from '../../components/ui/Button'

const statuses = ['all', 'paid', 'pending', 'failed', 'refunded']
const badge = {
  paid: 'bg-teal-50 text-teal-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
  refunded: 'bg-navy-50 text-navy-600',
}

export default function AdminOrders() {
  const { t, L, fmtPrice, fmtDate } = useLang()
  const toast = useToast()
  const [orders, setOrders] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = () =>
    supabase
      .from(ORDERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data }) => setOrders(data || []))

  useEffect(() => {
    load()
  }, [])

  // The money goes back through the Paymob dashboard; this only records it
  // and takes the Course away from the Student.
  const markRefunded = async (o) => {
    if (!window.confirm(t('admin.refundConfirm', { name: o.student_name }))) return
    const { error } = await supabase.from(ORDERS_TABLE).update({ status: 'refunded' }).eq('id', o.id)
    if (error) return toast(t('admin.saveError'), 'error')
    toast(t('admin.refunded'))
    load()
  }

  if (!orders) return <Spinner />

  const shown = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const paid = orders.filter((o) => o.status === 'paid')
  const revenue = paid.reduce((s, o) => s + o.amount_piasters, 0)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm text-navy-500">{t('admin.paidOrders')}</p>
          <p className="mt-1 text-2xl font-extrabold text-navy-900">{paid.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-navy-500">{t('admin.revenue')}</p>
          <p className="mt-1 text-2xl font-extrabold text-navy-900">{fmtPrice(revenue)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${filter === s ? 'bg-navy-800 text-white' : 'bg-white text-navy-600 ring-1 ring-navy-100 hover:ring-navy-200'}`}
          >
            {t(`admin.status.${s}`)}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-6"><EmptyState icon={ShoppingBag} title={t('admin.noOrders')} /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-slate-50 text-start text-xs font-semibold uppercase text-navy-500">
              <tr>
                <th className="px-4 py-3 text-start">{t('admin.date')}</th>
                <th className="px-4 py-3 text-start">{t('admin.student')}</th>
                <th className="px-4 py-3 text-start">{t('admin.course')}</th>
                <th className="px-4 py-3 text-start">{t('admin.amount')}</th>
                <th className="px-4 py-3 text-start">{t('admin.statusLabel')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {shown.map((o) => (
                <tr key={o.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-navy-600">{fmtDate(o.paid_at || o.created_at, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{o.student_name}</p>
                    <a href={`mailto:${o.student_email}`} className="text-xs text-teal-700 hover:underline" dir="ltr">{o.student_email}</a>
                  </td>
                  <td className="px-4 py-3 text-navy-800">{courseById[o.course_id] ? L(courseById[o.course_id].title) : o.course_id}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-navy-900">{fmtPrice(o.amount_piasters)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[o.status]}`}>{t(`admin.status.${o.status}`)}</span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    {o.status === 'paid' && (
                      <Button size="sm" variant="outline" onClick={() => markRefunded(o)}>{t('admin.markRefunded')}</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
