// Paymob's server-to-server "transaction processed" callback. This is the only
// place an Order becomes Paid (or Failed), and only after the HMAC signature
// checks out. Every newly Paid Order is emailed to the Admin Inbox.
import { createClient } from 'npm:@supabase/supabase-js@2.49.4'
import { env } from '../_shared/env.ts'

// Field order is fixed by Paymob's HMAC spec for the transaction callback.
const HMAC_FIELDS = [
  'amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction',
  'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded',
  'is_standalone_payment', 'is_voided', 'order.id', 'owner', 'pending',
  'source_data.pan', 'source_data.sub_type', 'source_data.type', 'success',
]

const pick = (o: any, path: string) => path.split('.').reduce((a, k) => a?.[k], o)

async function hmacHex(secret: string, message: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function sameText(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const egp = (piasters: number) => (piasters / 100).toLocaleString('en-EG', { minimumFractionDigits: 2 })

async function emailAdmin(order: any, courseTitle: string, duplicate = false) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('EMAIL_FROM') || 'SkillBridge <onboarding@resend.dev>',
      to: [env('ADMIN_INBOX')],
      subject: duplicate
        ? `Refund needed: student paid twice for ${courseTitle}`
        : `New order: ${courseTitle} (${egp(order.amount_piasters)} EGP)`,
      text: [
        duplicate
          ? 'A student paid for a course they already own. Refund this payment in the Paymob dashboard.'
          : 'A new course order was paid on SkillBridge.',
        '',
        `Course:  ${courseTitle}`,
        `Amount:  ${egp(order.amount_piasters)} EGP`,
        `Student: ${order.student_name} <${order.student_email}>`,
        `Paid at: ${new Date(order.paid_at).toUTCString()}`,
        `Order:   ${order.id}`,
        `Paymob transaction: ${order.paymob_transaction_id}`,
      ].join('\n'),
    }),
  })
  if (!res.ok) console.error('Admin email failed', res.status, await res.text())
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('ok')

  try {
    const body = await req.json().catch(() => null)
    const tx = body?.obj
    if (body?.type !== 'TRANSACTION' || !tx) return new Response('ignored')

    const message = HMAC_FIELDS.map((f) => String(pick(tx, f) ?? '')).join('')
    const expected = await hmacHex(env('PAYMOB_HMAC_SECRET'), message)
    const given = new URL(req.url).searchParams.get('hmac') || body.hmac || ''
    if (!sameText(expected, String(given).toLowerCase())) {
      console.error('Bad HMAC for transaction', tx.id)
      return new Response('bad signature', { status: 401 })
    }

    const orderId = tx.order?.merchant_order_id
    if (!orderId) return new Response('no order')

    const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'))
    const { data: order } = await admin
      .from('skillbridge_orders')
      .select('id, amount_piasters, course_id, student_name, student_email')
      .eq('id', orderId)
      .maybeSingle()
    if (!order) return new Response('unknown order')

    // Refunds and voids are handled by the Admin in the dashboard.
    if (tx.is_refunded || tx.is_voided || tx.pending) return new Response('ok')

    if (tx.success === true && Number(tx.amount_cents) === order.amount_piasters) {
      const { data: paid, error } = await admin
        .from('skillbridge_orders')
        .update({ status: 'paid', paid_at: new Date().toISOString(), paymob_transaction_id: String(tx.id) })
        .eq('id', order.id)
        .in('status', ['pending', 'failed'])
        .select('*')
        .maybeSingle()
      const { data: course } = await admin.from('skillbridge_courses').select('title_en').eq('id', order.course_id).single()
      const title = course?.title_en || order.course_id
      if (error?.code === '23505') {
        // The Student already owns this Course: the money was taken twice.
        // Record the transaction once, so Paymob's retries don't email again.
        const { data: first } = await admin
          .from('skillbridge_orders')
          .update({ paymob_transaction_id: String(tx.id) })
          .eq('id', order.id)
          .is('paymob_transaction_id', null)
          .select('id')
          .maybeSingle()
        if (first) await emailAdmin({ ...order, paid_at: new Date().toISOString(), paymob_transaction_id: tx.id }, title, true)
        return new Response('ok')
      }
      if (error) throw error
      if (paid) await emailAdmin(paid, title)
    } else if (tx.success === false) {
      await admin.from('skillbridge_orders').update({ status: 'failed' }).eq('id', order.id).eq('status', 'pending')
    }
    return new Response('ok')
  } catch (e) {
    console.error(e)
    return new Response('error', { status: 500 })
  }
})
