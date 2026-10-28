import { afterAll, describe, expect, it } from 'vitest'
import { cleanup, configured, createAdmin, createCourse, createStudent, signedIn, visitor } from './supabase'

const COURSES = 'skillbridge_courses'

// Ticket #4: Courses come from the database, with their price.
describe.skipIf(!configured)('Course catalogue', () => {
  afterAll(cleanup)

  it('shows visitors the imported catalogue with a price on every Course', async () => {
    const { data, error } = await visitor().from(COURSES).select('id, price_piasters, hidden').like('id', 'c-%')

    expect(error).toBeNull()
    expect(data.length).toBeGreaterThanOrEqual(22)
    for (const c of data) {
      expect(Number.isInteger(c.price_piasters)).toBe(true)
      expect(c.price_piasters).toBeGreaterThanOrEqual(0)
    }
  })

  it('shows a visitor the new price after the Admin changes it', async () => {
    const course = await createCourse({ price_piasters: 0 })
    const admin = await signedIn(await createAdmin())

    const { error } = await admin.from(COURSES).update({ price_piasters: 7500 }).eq('id', course.id)
    expect(error).toBeNull()

    const { data } = await visitor().from(COURSES).select('price_piasters').eq('id', course.id).single()
    expect(data.price_piasters).toBe(7500)
  })

  it('hides a Hidden Course from visitors and Students, but not from the Admin', async () => {
    const course = await createCourse({ hidden: true })
    const student = await signedIn(await createStudent())
    const admin = await signedIn(await createAdmin())

    const seenBy = async (c) => (await c.from(COURSES).select('id').eq('id', course.id)).data ?? []
    expect(await seenBy(visitor())).toEqual([])
    expect(await seenBy(student)).toEqual([])
    expect(await seenBy(admin)).toHaveLength(1)
  })

  it('does not let a visitor add, change or delete a Course', async () => {
    const course = await createCourse({ price_piasters: 0 })
    const v = visitor()

    const insert = await v.from(COURSES).insert({ ...course, id: `${course.id}-x` })
    expect(insert.error).not.toBeNull()

    await v.from(COURSES).update({ price_piasters: 1 }).eq('id', course.id)
    await v.from(COURSES).delete().eq('id', course.id)

    const { data } = await visitor().from(COURSES).select('price_piasters').eq('id', course.id).single()
    expect(data.price_piasters).toBe(0)
  })

  it('does not let a Student add, change or delete a Course', async () => {
    const course = await createCourse({ price_piasters: 0 })
    const student = await signedIn(await createStudent())

    const insert = await student.from(COURSES).insert({ ...course, id: `${course.id}-x` })
    expect(insert.error).not.toBeNull()

    await student.from(COURSES).update({ price_piasters: 1 }).eq('id', course.id)
    await student.from(COURSES).delete().eq('id', course.id)

    const { data } = await visitor().from(COURSES).select('price_piasters').eq('id', course.id).single()
    expect(data.price_piasters).toBe(0)
  })
})
