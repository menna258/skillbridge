import { afterAll, describe, expect, it } from 'vitest'
import {
  addLessonContent, cleanup, configured, courseRow, createAdmin, createCourse, createOrder, createStudent, signedIn, testCourseId, visitor,
} from './supabase'

const COURSES = 'skillbridge_courses'
const CONTENT = 'skillbridge_lesson_content'
const visibleToVisitors = async (id) => ((await visitor().from(COURSES).select('id').eq('id', id)).data ?? []).length === 1

// Ticket #7: the Admin manages Courses.
describe.skipIf(!configured)('Admin manages Courses', () => {
  afterAll(cleanup)

  it('adds a new Course that visitors then see', async () => {
    const admin = await signedIn(await createAdmin())
    const id = testCourseId()

    const { error } = await admin.from(COURSES).insert(courseRow(id))
    expect(error).toBeNull()
    expect(await visibleToVisitors(id)).toBe(true)
  })

  it('hides a Course and shows it again', async () => {
    const course = await createCourse()
    const admin = await signedIn(await createAdmin())

    await admin.from(COURSES).update({ hidden: true }).eq('id', course.id)
    expect(await visibleToVisitors(course.id)).toBe(false)

    await admin.from(COURSES).update({ hidden: false }).eq('id', course.id)
    expect(await visibleToVisitors(course.id)).toBe(true)
  })

  it('saves Lesson Content the way the editor does, and owners see the new text', async () => {
    const course = await createCourse({ lessons: [{ en: 'One', ar: 'واحد' }, { en: 'Two', ar: 'اتنين' }] })
    await addLessonContent(course.id, 0)
    await addLessonContent(course.id, 1)
    const admin = await signedIn(await createAdmin())

    // The editor upserts every remaining lesson, then drops rows past the last one.
    const up = await admin.from(CONTENT).upsert([{ course_id: course.id, lesson_index: 0, body_en: 'Updated text', body_ar: 'نص جديد', video_url: null }])
    expect(up.error).toBeNull()
    const del = await admin.from(CONTENT).delete().eq('course_id', course.id).gte('lesson_index', 1)
    expect(del.error).toBeNull()

    const student = await signedIn(await createStudent())
    const { data } = await student.from(CONTENT).select('lesson_index, body_en').eq('course_id', course.id)
    expect(data).toEqual([{ lesson_index: 0, body_en: 'Updated text' }])
  })

  it('refuses to delete a Course that has Orders, and deletes one that has none', async () => {
    const sold = await createCourse({ price_piasters: 5000 })
    await createOrder(await createStudent(), sold.id, 'paid')
    const unsold = await createCourse()
    const admin = await signedIn(await createAdmin())

    const refused = await admin.from(COURSES).delete().eq('id', sold.id)
    expect(refused.error?.code).toBe('23503')
    expect(await visibleToVisitors(sold.id)).toBe(true)

    const removed = await admin.from(COURSES).delete().eq('id', unsold.id)
    expect(removed.error).toBeNull()
    expect(await visibleToVisitors(unsold.id)).toBe(false)
  })

  it('rejects a Course with a negative price or an image link that is not https', async () => {
    const admin = await signedIn(await createAdmin())

    const negative = await admin.from(COURSES).insert(courseRow(testCourseId(), { price_piasters: -100 }))
    expect(negative.error).not.toBeNull()

    const badImage = await admin.from(COURSES).insert(courseRow(testCourseId(), { image: 'http://example.com/a.jpg' }))
    expect(badImage.error).not.toBeNull()
  })
})
