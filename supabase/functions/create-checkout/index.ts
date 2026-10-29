// Starts paying for a Course: creates a Pending Order and a Paymob payment
// intention, and returns the hosted checkout URL to send the Student to.
// The price always comes from the database, never from the browser.
import { createClient } from 'npm:@supabase/supabase-js@2.49.4'
import { corsHeaders, json } from '../_shared/cors.ts'
import { env } from '../_shared/env.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  try {
    const supabaseUrl = env('SUPABASE_URL')
    const admin = createClient(supabaseUrl, env('SUPABASE_SERVICE_ROLE_KEY'))

    // Who is buying: the signed-in Student from the request's JWT.
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer /, '')
    const { data: { user }, error: authError } = await admin.auth.getUser(token)
    if (authError || !user) return json({ error: 'auth' }, 401)

    const { courseId } = await req.json().catch(() => ({}))
    if (typeof courseId !== 'string') return json({ error: 'course' }, 400)

    const { data: course } = await admin
      .from('skillbridge_courses')
      .select('id, title_en, price_piasters, hidden')
      .eq('id', courseId)
      .maybeSingle()
    if (!course || course.hidden) return json({ error: 'course' }, 404)
    if (course.price_piasters <= 0) return json({ error: 'free' }, 400)

    const { count } = await admin
      .from('skillbridge_orders')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('course_id', course.id)
      .eq('status', 'paid')
    if (count) return json({ error: 'owned' }, 409)

    // An older unfinished checkout for the same Course is abandoned.
    await admin
      .from('skillbridge_orders')
      .update({ status: 'failed' })
      .eq('student_id', user.id)
      .eq('course_id', course.id)
      .eq('status', 'pending')

    const name = String(user.user_metadata?.name || user.email!.split('@')[0]).trim()
    const { data: order, error: orderError } = await admin
      .from('skillbridge_orders')
      .insert({
        student_id: user.id,
        course_id: course.id,
        amount_piasters: course.price_piasters,
        student_name: name,
        student_email: user.email,
      })
      .select('id')
      .single()
    if (orderError) throw orderError

    const [firstName, ...rest] = name.split(/\s+/)
    const siteUrl = env('SITE_URL').replace(/\/$/, '')
    const res = await fetch('https://accept.paymob.com/v1/intention/', {
      method: 'POST',
      headers: { Authorization: `Token ${env('PAYMOB_SECRET_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: course.price_piasters,
        currency: 'EGP',
        payment_methods: env('PAYMOB_INTEGRATION_IDS').split(',').map((id) => Number(id.trim())),
        items: [{ name: course.title_en.slice(0, 50), amount: course.price_piasters, quantity: 1 }],
        billing_data: {
          first_name: firstName || 'Student',
          last_name: rest.join(' ') || 'Student',
          email: user.email,
          phone_number: 'NA',
          apartment: 'NA', floor: 'NA', street: 'NA', building: 'NA',
          city: 'NA', state: 'NA', country: 'EG', postal_code: 'NA', shipping_method: 'NA',
        },
        special_reference: order.id,
        notification_url: `${supabaseUrl}/functions/v1/paymob-webhook`,
        redirection_url: `${siteUrl}/payment/result?order=${order.id}`,
      }),
    })
    const intention = await res.json().catch(() => null)
    // Paymob's own order id is the only Order link its webhook signs, so a
    // checkout without one could never be confirmed.
    if (!res.ok || !intention?.client_secret || !intention?.intention_order_id) {
      console.error('Paymob intention failed', res.status, intention)
      await admin.from('skillbridge_orders').update({ status: 'failed' }).eq('id', order.id)
      return json({ error: 'payment' }, 502)
    }

    await admin
      .from('skillbridge_orders')
      .update({ paymob_intention_id: String(intention.id), paymob_order_id: String(intention.intention_order_id) })
      .eq('id', order.id)

    const url = `https://eg.checkout.paymob.com/?publicKey=${encodeURIComponent(env('PAYMOB_PUBLIC_KEY'))}&clientSecret=${encodeURIComponent(intention.client_secret)}`
    return json({ url, orderId: order.id })
  } catch (e) {
    console.error(e)
    return json({ error: 'server' }, 500)
  }
})
