import { questions } from '../data/questions'
import { careers } from '../data/careers'
import { traits } from '../data/skills'

// Highest number of points each career / trait can collect across all questions.
const maxPoints = (key) => {
  const totals = {}
  questions.forEach((q) => {
    const best = {}
    q.options.forEach((o) => {
      Object.entries(o[key]).forEach(([id, pts]) => {
        best[id] = Math.max(best[id] || 0, pts)
      })
    })
    Object.entries(best).forEach(([id, pts]) => {
      totals[id] = (totals[id] || 0) + pts
    })
  })
  return totals
}

const MAX_CAREER = maxPoints('c')
const MAX_TRAIT = maxPoints('t')

// answers: { [questionId]: optionIndex }
export function scoreAssessment(answers) {
  const careerPts = {}
  const traitPts = {}
  questions.forEach((q) => {
    const opt = q.options[answers[q.id]]
    if (!opt) return
    Object.entries(opt.c).forEach(([id, p]) => (careerPts[id] = (careerPts[id] || 0) + p))
    Object.entries(opt.t).forEach(([id, p]) => (traitPts[id] = (traitPts[id] || 0) + p))
  })

  const matches = careers
    .map((c) => ({ id: c.id, score: Math.round(((careerPts[c.id] || 0) / MAX_CAREER[c.id]) * 100) }))
    .sort((a, b) => b.score - a.score)

  const traitScores = Object.keys(traits).map((id) => ({
    id,
    score: Math.round(((traitPts[id] || 0) / MAX_TRAIT[id]) * 100),
  }))

  return {
    topCareer: matches[0].id,
    matches,
    traits: traitScores,
    answers,
    completedAt: new Date().toISOString(),
  }
}
