import { afterAll, describe, expect, it } from 'vitest'
import { addLessonContent, cleanup, configured, createAdmin, createCourse, createOrder, createStudent, signedIn, visitor } from './supabase'

const readContent = async (c, courseId) =>
  (await c.from('skillbridge_lesson_content').select('body_en, video_url').eq('course_id', courseId)).data ?? []

// Ticket #6: Lesson Content only for Students who own the Course.
describe.skipIf(!configured)('Lesson Content', () => {
  afterAll(cleanup)

  it('opens a Free Course to any signed-in Student, but not to visitors', async () => {
    const course = await createCourse({ price_piasters: 0 })
    await addLessonContent(course.id)
    const student = await signedIn(await createStudent())

    expect(await readContent(visitor(), course.id)).toEqual([])
    expect(await readContent(student, course.id)).toEqual([{ body_en: 'Secret lesson text', video_url: 'https://example.com/video' }])
  })

  it('keeps a paid Course locked until the Student has a Paid Order', async () => {
    const course = await createCourse({ price_piasters: 5000 })
    await addLessonContent(course.id)
    const buyer = await createStudent()
    const other = await createStudent()
    await createOrder(buyer, course.id, 'paid')

    expect(await readContent(await signedIn(other), course.id)).toEqual([])
    expect(await readContent(await signedIn(buyer), course.id)).toHaveLength(1)
  })

  it('does not count a Pending, Failed or Refunded Order as owning', async () => {
    const course = await createCourse({ price_piasters: 5000 })
    await addLessonContent(course.id)
    for (const status of ['pending', 'failed', 'refunded']) {
      const student = await createStudent()
      await createOrder(student, course.id, status)
      expect(await readContent(await signedIn(student), course.id)).toEqual([])
    }
  })

  it('lets an owner keep a Hidden Course and its content, while others lose sight of it', async () => {
    const course = await createCourse({ price_piasters: 5000, hidden: true })
    await addLessonContent(course.id)
    const owner = await createStudent()
    await createOrder(owner, course.id, 'paid')
    const ownerClient = await signedIn(owner)
    const otherClient = await signedIn(await createStudent())

    expect((await ownerClient.from('skillbridge_courses').select('id').eq('id', course.id)).data).toHaveLength(1)
    expect(await readContent(ownerClient, course.id)).toHaveLength(1)
    expect((await otherClient.from('skillbridge_courses').select('id').eq('id', course.id)).data ?? []).toEqual([])
    expect(await readContent(otherClient, course.id)).toEqual([])
  })

  it('does not open a hidden Free Course to Students', async () => {
    const course = await createCourse({ price_piasters: 0, hidden: true })
    await addLessonContent(course.id)

    expect(await readContent(await signedIn(await createStudent()), course.id)).toEqual([])
  })

  it('lets the Admin read any Lesson Content, and nobody else change it', async () => {
    const course = await createCourse({ price_piasters: 5000 })
    await addLessonContent(course.id)
    const admin = await signedIn(await createAdmin())
    const owner = await createStudent()
    await createOrder(owner, course.id, 'paid')
    const ownerClient = await signedIn(owner)

    expect(await readContent(admin, course.id)).toHaveLength(1)

    await ownerClient.from('skillbridge_lesson_content').update({ body_en: 'Changed by Student' }).eq('course_id', course.id)
    expect((await readContent(admin, course.id))[0].body_en).toBe('Secret lesson text')
  })
})
