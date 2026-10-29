// Checks that a test message sent from the live Contact form reached Supabase,
// then deletes it (see docs/deploy.md).
// Run: node scripts/check-contact.mjs sbtest-check-<something>@example.com
// Only that email is touched: the API tests use other sbtest- messages, and
// their cleanup removes every sbtest- message, so run this right after sending.
import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

const email = process.argv[2]
if (!email?.startsWith('sbtest-')) {
  console.error('Give the email you sent the message with, starting with sbtest-.')
  process.exit(1)
}

// Same keys as the API tests: .env for the URL, .env.test for the secret key.
const env = loadEnv('test', process.cwd(), '')
if (!env.VITE_SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
  console.error('Needs VITE_SUPABASE_URL in .env and SUPABASE_SECRET_KEY in .env.test.')
  process.exit(1)
}

const db = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const TABLE = 'skillbridge_contact_messages'

const { data, error } = await db.from(TABLE).select('id, created_at, email, topic, message').eq('email', email)
if (error) throw error

if (!data.length) {
  console.error(`No message from ${email}. The form did not save it, or a test run's cleanup removed it first.`)
  process.exit(1)
}

for (const m of data) console.log(`✓ ${m.created_at}  ${m.email}  [${m.topic}]  ${m.message.slice(0, 60)}`)

const { error: delError } = await db.from(TABLE).delete().in('id', data.map((m) => m.id))
if (delError) throw delError
console.log(`Deleted ${data.length} test message(s).`)
