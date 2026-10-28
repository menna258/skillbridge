import { afterAll, describe, expect, it } from 'vitest'
import { cleanup, configured, createAdmin, createStudent, signedIn, testEmail, visitor } from './supabase'

const MESSAGES = 'skillbridge_contact_messages'

// A Contact Message sent from the form by a visitor, found again by its email.
async function sendMessage() {
  const email = testEmail()
  const { error } = await visitor().from(MESSAGES).insert({
    name: 'Test Visitor',
    email,
    topic: 'general',
    message: 'Hello, this message comes from the automated tests.',
    lang: 'en',
  })
  if (error) throw error
  return email
}

const byEmail = async (c, email) => (await c.from(MESSAGES).select('id, message, handled, handled_at').eq('email', email)).data ?? []

// Ticket #8: Contact Messages in the admin dashboard.
describe.skipIf(!configured)('Contact Messages for the Admin', () => {
  afterAll(cleanup)

  it('shows the Admin a new message as not handled', async () => {
    const email = await sendMessage()
    const admin = await signedIn(await createAdmin())

    const [msg] = await byEmail(admin, email)
    expect(msg.handled).toBe(false)
    expect(msg.handled_at).toBeNull()
  })

  it('marks a message handled, then new again, recording when', async () => {
    const email = await sendMessage()
    const admin = await signedIn(await createAdmin())
    const [msg] = await byEmail(admin, email)

    await admin.from(MESSAGES).update({ handled: true }).eq('id', msg.id)
    const [handled] = await byEmail(admin, email)
    expect(handled.handled).toBe(true)
    expect(handled.handled_at).not.toBeNull()

    await admin.from(MESSAGES).update({ handled: false }).eq('id', msg.id)
    const [again] = await byEmail(admin, email)
    expect(again.handled).toBe(false)
    expect(again.handled_at).toBeNull()
  })

  it('does not let visitors or Students read or mark messages', async () => {
    const email = await sendMessage()
    const student = await signedIn(await createStudent())
    const admin = await signedIn(await createAdmin())
    const [msg] = await byEmail(admin, email)

    expect(await byEmail(visitor(), email)).toEqual([])
    expect(await byEmail(student, email)).toEqual([])

    await student.from(MESSAGES).update({ handled: true }).eq('id', msg.id)
    await visitor().from(MESSAGES).update({ handled: true }).eq('id', msg.id)
    expect((await byEmail(admin, email))[0].handled).toBe(false)
  })

  it('keeps what the sender wrote: the Admin can neither edit nor delete a message', async () => {
    const email = await sendMessage()
    const admin = await signedIn(await createAdmin())
    const [msg] = await byEmail(admin, email)

    const edit = await admin.from(MESSAGES).update({ message: 'Rewritten by the Admin, which is not allowed.' }).eq('id', msg.id)
    expect(edit.error).not.toBeNull()

    await admin.from(MESSAGES).delete().eq('id', msg.id)
    expect((await byEmail(admin, email))[0].message).toBe(msg.message)
  })
})
