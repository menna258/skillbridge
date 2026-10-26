import { scoreAssessment } from './assessment'
import { todayKey } from './storage'
import { courseById, lessonMinutes } from '../data/courses'

// The demo student account, pre-filled with realistic progress.
export const DEMO_USER = {
  id: 'u-demo',
  name: 'Sara Ahmed',
  email: 'demo@skillbridge.app',
  password: 'Demo1234',
  university: 'Cairo University',
}

const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

export function buildDemoData() {
  const answers = { q1: 1, q2: 1, q3: 0, q4: 2, q5: 3, q6: 1, q7: 2, q8: 1, q9: 1, q10: 1, q11: 0, q12: 1 }
  const assessment = { ...scoreAssessment(answers), completedAt: daysAgo(16).toISOString() }

  // Lessons finished, oldest first: [courseId, lessonIndex, daysAgo]
  const finished = [
    ['c-excel', 0, 14], ['c-excel', 1, 13], ['c-excel', 2, 12], ['c-excel', 3, 10], ['c-excel', 4, 9],
    ['c-stats', 0, 8], ['c-stats', 1, 6], ['c-stats', 2, 5], ['c-stats', 3, 4], ['c-stats', 4, 4],
    ['c-sql', 0, 3], ['c-sql', 1, 1], ['c-sql', 2, 0],
  ]

  const enrollments = {}
  finished.forEach(([id, idx]) => {
    enrollments[id] ??= { enrolledAt: daysAgo(15).toISOString(), done: [] }
    enrollments[id].done.push(idx)
  })
  enrollments['c-python-data'] = { enrolledAt: daysAgo(1).toISOString(), done: [] }

  return {
    profile: {
      major: 'Business Information Systems',
      gradYear: '2027',
      bio: 'Third-year BIS student who loves finding stories in numbers. Currently learning SQL and building a sales dashboard portfolio project.',
      skills: ['excel', 'statistics', 'communication'],
      linkedin: 'https://www.linkedin.com/in/sara-ahmed-demo',
      github: '',
    },
    assessment,
    roadmapCareer: null,
    roadmapDone: ['da-1', 'da-2', 'da-3'],
    enrollments,
    savedJobs: ['j-5', 'j-6'],
    applications: [
      {
        jobId: 'j-4',
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        phone: '+20 100 123 4567',
        portfolio: 'https://www.linkedin.com/in/sara-ahmed-demo',
        cover: 'I have completed Excel and statistics courses and I am now learning SQL. I would love to support your analytics team.',
        date: daysAgo(2).toISOString(),
      },
    ],
    activity: finished.map(([id, , ago]) => ({
      date: todayKey(daysAgo(ago)),
      minutes: lessonMinutes(courseById[id]),
      courseId: id,
    })),
  }
}
