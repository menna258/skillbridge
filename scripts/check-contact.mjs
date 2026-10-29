// Checks that a test message sent from the live Contact form reached Supabase,
// then deletes it. Send it with an email starting with sbtest- (see docs/deploy.md).
// Run: node scripts/check-contact.mjs
import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

// Same keys as the API tests: .env for the URL, .env.test for the secret key.
const env = loadEnv('test', process.cwd(), '')
if (!env.VITE_SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
  console.error('Needs VITE_SUPABASE_URL in .env and SUPABASE_SECRET_KEY in .env.test.')
  process.exit(1)
}

const db = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const TABLE = 'skillbridge_contact_messages'

const { data, error } = await db
  .from(TABLE)
  .select('id, created_at, name, email, topic, message')
  .like('email', 'sbtest-%')
  .order('created_at', { ascending: false })
if (error) throw error

if (!data.length) {
  console.error('No sbtest- message found. The form did not save it, or it was sent with another email.')
  process.exit(1)
}

for (const m of data) console.log(`✓ ${m.created_at}  ${m.email}  [${m.topic}]  ${m.message.slice(0, 60)}`)

const { error: delError } = await db.from(TABLE).delete().in('id', data.map((m) => m.id))
if (delError) throw delError
console.log(`Deleted ${data.length} test message(s).`)
