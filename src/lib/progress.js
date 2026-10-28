import { careerById } from '../data/careers'
import { courses, courseById } from './catalog'
import { todayKey } from './storage'

// The career whose roadmap the student is following.
export const activeCareerId = (data) => data.roadmapCareer || data.assessment?.topCareer || null

export function roadmapProgress(data, careerId) {
  const career = careerById[careerId]
  if (!career) return { done: 0, total: 0, pct: 0 }
  const ids = career.roadmap.flatMap((s) => s.steps.map((st) => st.id))
  const done = ids.filter((id) => data.roadmapDone.includes(id)).length
  return { done, total: ids.length, pct: ids.length ? Math.round((done / ids.length) * 100) : 0 }
}

export function nextRoadmapStep(data, careerId) {
  const career = careerById[careerId]
  if (!career) return null
  for (const [i, stage] of career.roadmap.entries()) {
    const step = stage.steps.find((s) => !data.roadmapDone.includes(s.id))
    if (step) return { step, stage, stageIndex: i }
  }
  return null
}

export function courseProgress(data, courseId) {
  const e = data.enrollments[courseId]
  const c = courseById[courseId]
  if (!e || !c) return null
  const pct = Math.round((e.done.length / c.lessons.length) * 100)
  return { done: e.done.length, total: c.lessons.length, pct, complete: pct === 100 }
}

// Skills from the profile plus skills from fully completed courses.
export function userSkills(data) {
  const set = new Set(data.profile.skills)
  Object.keys(data.enrollments).forEach((id) => {
    if (courseProgress(data, id)?.complete) courseById[id]?.skills.forEach((s) => set.add(s))
  })
  return set
}

// 70% skill overlap + 30% assessment fit for the job's career field.
export function jobMatch(job, data) {
  const skills = userSkills(data)
  const overlap = job.skills.filter((s) => skills.has(s)).length / job.skills.length
  const fit = (data.assessment?.matches.find((m) => m.id === job.career)?.score || 0) / 100
  return Math.round(overlap * 70 + fit * 30)
}

export function weeklyActivity(data) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = todayKey(d)
    days.push({
      date: d,
      minutes: data.activity.filter((a) => a.date === key).reduce((sum, a) => sum + a.minutes, 0),
    })
  }
  return days
}

// Progress per key skill of a career, from completed lessons of courses teaching it.
export function skillProgress(data, careerId) {
  const career = careerById[careerId]
  if (!career) return []
  return career.skills.map((skill) => {
    const related = courses.filter((c) => c.skills.includes(skill))
    const total = related.reduce((s, c) => s + c.lessons.length, 0)
    const done = related.reduce((s, c) => s + (data.enrollments[c.id]?.done.length || 0), 0)
    return { skill, pct: total ? Math.round((done / total) * 100) : 0 }
  })
}

export const totalLessonsDone = (data) =>
  Object.values(data.enrollments).reduce((sum, e) => sum + e.done.length, 0)
