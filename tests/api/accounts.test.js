import { afterAll, describe, expect, it } from 'vitest'
import { cleanup, configured, createStudent, signedIn, visitor } from './supabase'

// Ticket #3: real Student accounts.
describe.skipIf(!configured)('Student accounts', () => {
  afterAll(cleanup)

  it('signs a Student in and keeps their name and university on the account', async () => {
    const student = await createStudent({ name: 'Mona Ali', university: 'Cairo University' })
    const c = await signedIn(student)

    const { data, error } = await c.auth.getUser()
    expect(error).toBeNull()
    expect(data.user.email).toBe(student.email)
    expect(data.user.user_metadata).toMatchObject({ name: 'Mona Ali', university: 'Cairo University' })
  })

  it('finds the same account when the Student signs in again from another device', async () => {
    const student = await createStudent()
    const first = await signedIn(student)
    const second = await signedIn(student)

    const a = (await first.auth.getUser()).data.user
    const b = (await second.auth.getUser()).data.user
    expect(b.id).toBe(a.id)
  })

  // The site's own sign-up call. Only the "email already used" path is tested:
  // a brand-new sign-up sends a confirmation email, and tests send none.
  it('tells the sign-up form when the email is already used', async () => {
    const student = await createStudent()
    const { data, error } = await visitor().auth.signUp({
      email: student.email,
      password: `Pw${Math.random().toString(36).slice(2)}1`,
      options: { data: { name: 'Someone Else', university: 'Test University' } },
    })

    expect(error).toBeNull()
    expect(data.session).toBeNull()
    // AppContext.signup reads an account with no identities as "taken".
    expect(data.user.identities ?? []).toEqual([])
  })

  it('refuses a wrong password', async () => {
    const student = await createStudent()
    const { data, error } = await visitor().auth.signInWithPassword({ email: student.email, password: 'Wrong12345' })

    expect(data.session).toBeNull()
    expect(error.message.toLowerCase()).toContain('invalid login')
  })

  it('lets a Student update their name and university', async () => {
    const student = await createStudent()
    const c = await signedIn(student)

    const { data, error } = await c.auth.updateUser({ data: { name: 'New Name', university: 'Ain Shams University' } })
    expect(error).toBeNull()
    expect(data.user.user_metadata).toMatchObject({ name: 'New Name', university: 'Ain Shams University' })
  })

  it('lets a signed-in Student send a Contact Message', async () => {
    const student = await createStudent()
    const c = await signedIn(student)

    const { error } = await c.from('skillbridge_contact_messages').insert({
      name: student.name,
      email: student.email,
      topic: 'support',
      message: 'I signed in and still want to reach the team.',
      lang: 'en',
    })
    expect(error).toBeNull()
  })

  it('does not let a Student read Contact Messages', async () => {
    const student = await createStudent()
    const c = await signedIn(student)

    const { data } = await c.from('skillbridge_contact_messages').select('id').limit(1)
    expect(data ?? []).toEqual([])
  })
})
