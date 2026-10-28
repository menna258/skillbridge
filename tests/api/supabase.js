import { createClient } from '@supabase/supabase-js'

// The one test seam: Supabase's public API, used exactly like the site uses it.
// A visitor, Student or Admin is just a client holding a different session.
const url = process.env.VITE_SUPABASE_URL
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const secretKey = process.env.SUPABASE_SECRET_KEY

export const configured = !!(url && publishableKey && secretKey)

const client = (key) => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

// Everything a test creates is marked with this prefix and removed by cleanup().
export const PREFIX = 'sbtest-'
const created = []

export const visitor = () => client(publishableKey)
const server = () => client(secretKey)

export const testEmail = () => `${PREFIX}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}@example.com`

// A confirmed Student account, created with the secret key so no emails go out.
export async function createStudent({ name = 'Test Student', university = 'Test University' } = {}) {
  const email = testEmail()
  const password = `Pw${Math.random().toString(36).slice(2)}1`
  const { data, error } = await server().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, university },
  })
  if (error) throw error
  created.push(data.user.id)
  return { id: data.user.id, email, password, name, university }
}

// The Admin: a Student whose app_metadata flag only the server can set.
export async function createAdmin() {
  const admin = await createStudent({ name: 'Test Admin' })
  const { error } = await server().auth.admin.updateUserById(admin.id, { app_metadata: { skillbridge_admin: true } })
  if (error) throw error
  return admin
}

// A Course row, inserted with the secret key. Ids start with the test prefix.
const courseIds = []
export async function createCourse(fields = {}) {
  const id = `${PREFIX}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  const row = {
    id,
    category: 'career',
    level: 'beginner',
    hours: 1,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    instructor: 'Test Instructor',
    title_en: 'Automated test course',
    title_ar: 'كورس اختبار آلي',
    description_en: 'Created and removed by the automated tests.',
    description_ar: 'بيتعمل ويتمسح في الاختبارات الآلية.',
    lessons: [{ en: 'Lesson one', ar: 'الدرس الأول' }],
    ...fields,
  }
  const { error } = await server().from('skillbridge_courses').insert(row)
  if (error) throw error
  courseIds.push(id)
  return row
}

// A client signed in as the given account.
export async function signedIn({ email, password }) {
  const c = visitor()
  const { error } = await c.auth.signInWithPassword({ email, password })
  if (error) throw error
  return c
}

export async function cleanup() {
  const s = server()
  await s.from('skillbridge_contact_messages').delete().like('email', `${PREFIX}%`)
  if (courseIds.length) await s.from('skillbridge_courses').delete().in('id', courseIds.splice(0))
  for (const id of created.splice(0)) await s.auth.admin.deleteUser(id)
}
