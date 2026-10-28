import { afterAll, describe, expect, it } from 'vitest'
import { cleanup, configured, createAdmin, createCourse, createStudent, signedIn } from './supabase'

const isAdmin = async (c) => (await c.rpc('skillbridge_is_admin')).data

// Ticket #5: only the Admin gets admin powers, and only the server can grant them.
describe.skipIf(!configured)('Admin access', () => {
  afterAll(cleanup)

  it('recognises the Admin and nobody else', async () => {
    const admin = await signedIn(await createAdmin())
    const student = await signedIn(await createStudent())

    expect(await isAdmin(admin)).toBe(true)
    expect(await isAdmin(student)).toBe(false)
  })

  it('does not let a Student make themselves Admin from the site', async () => {
    const account = await createStudent()
    const student = await signedIn(account)

    // The only account field a Student can write is user_metadata.
    await student.auth.updateUser({ data: { skillbridge_admin: true } })
    const again = await signedIn(account)

    expect(await isAdmin(again)).toBe(false)
    expect((await again.from('skillbridge_contact_messages').select('id').limit(1)).data ?? []).toEqual([])
  })

  it('lets the Admin do what a Student cannot', async () => {
    const course = await createCourse({ hidden: true })
    const admin = await signedIn(await createAdmin())
    const student = await signedIn(await createStudent())

    // Read Contact Messages.
    const adminRead = await admin.from('skillbridge_contact_messages').select('id').limit(1)
    expect(adminRead.error).toBeNull()

    // Edit a Course, including a Hidden one.
    const edit = await admin.from('skillbridge_courses').update({ title_en: 'Edited by Admin' }).eq('id', course.id).select('title_en')
    expect(edit.data).toEqual([{ title_en: 'Edited by Admin' }])

    const studentEdit = await student.from('skillbridge_courses').update({ title_en: 'Edited by Student' }).eq('id', course.id).select('title_en')
    expect(studentEdit.data ?? []).toEqual([])
  })
})
