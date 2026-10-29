import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { addLessonContent, cleanup, configured, createAdmin, createCourse, createOrder, createStudent, signedIn } from './supabase'

const ORDERS = 'skillbridge_orders'
// What createOrder charges for every Order.
const AMOUNT = 5000

const orderIds = async (c, courseId) =>
  ((await c.from(ORDERS).select('id').eq('course_id', courseId)).data ?? []).map((o) => o.id)

const orderById = async (c, id) =>
  (await c.from(ORDERS).select('status, amount_piasters, refunded_at').eq('id', id).single()).data

const readContent = async (c, courseId) =>
  (await c.from('skillbridge_lesson_content').select('lesson_index').eq('course_id', courseId)).data ?? []

// Ticket #10: the Admin reviews every Order and records refunds; a Student sees only their own.
describe.skipIf(!configured)('Orders', () => {
  // One Admin for the whole file: sign-ins are rate-limited on the real project.
  let admin
  beforeAll(async () => {
    admin = await signedIn(await createAdmin())
  })
  afterAll(cleanup)

  it('shows a Student their own Orders and nobody else’s', async () => {
    const course = await createCourse({ price_piasters: AMOUNT })
    const me = await createStudent()
    const mine = await createOrder(me, course.id, 'paid')
    await createOrder(await createStudent(), course.id, 'paid')

    expect(await orderIds(await signedIn(me), course.id)).toEqual([mine])
  })

  it('lets the Admin see every Order and mark a Paid one Refunded, which takes the Course away', async () => {
    const course = await createCourse({ price_piasters: AMOUNT })
    await addLessonContent(course.id)
    const buyer = await createStudent()
    const id = await createOrder(buyer, course.id, 'paid')
    await createOrder(await createStudent(), course.id, 'pending')
    const buyerClient = await signedIn(buyer)

    expect(await orderIds(admin, course.id)).toHaveLength(2)
    expect(await readContent(buyerClient, course.id)).toHaveLength(1)

    const { error } = await admin.from(ORDERS).update({ status: 'refunded' }).eq('id', id)
    expect(error).toBeNull()

    const order = await orderById(admin, id)
    expect(order.status).toBe('refunded')
    expect(order.refunded_at).not.toBeNull()
    expect(await readContent(buyerClient, course.id)).toEqual([])
  })

  it('allows no other change of Order Status: not back to Paid, not from Pending or Failed', async () => {
    const course = await createCourse({ price_piasters: AMOUNT })
    const tries = [
      ['refunded', 'paid'],
      ['pending', 'refunded'],
      ['pending', 'paid'],
      ['failed', 'refunded'],
      ['paid', 'failed'],
    ]

    for (const [from, to] of tries) {
      const id = await createOrder(await createStudent(), course.id, from)
      await admin.from(ORDERS).update({ status: to }).eq('id', id)
      expect((await orderById(admin, id)).status, `${from} → ${to}`).toBe(from)
    }
  })

  it('does not let the Admin change the amount, or a Student change their own Order', async () => {
    const course = await createCourse({ price_piasters: AMOUNT })
    const buyer = await createStudent()
    const id = await createOrder(buyer, course.id, 'paid')
    const buyerClient = await signedIn(buyer)

    await admin.from(ORDERS).update({ amount_piasters: 1 }).eq('id', id)
    await buyerClient.from(ORDERS).update({ status: 'refunded' }).eq('id', id)
    await buyerClient.from(ORDERS).delete().eq('id', id)

    expect(await orderById(admin, id)).toMatchObject({ status: 'paid', amount_piasters: AMOUNT })
  })
})
