import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readJSON, writeJSON, removeKey, hashPassword, todayKey } from '../lib/storage'
import { buildDemoData, DEMO_USER } from '../lib/demo'
import { courseById, lessonMinutes } from '../data/courses'

const AppContext = createContext(null)

export const emptyData = () => ({
  profile: { major: '', gradYear: '', bio: '', skills: [], linkedin: '', github: '' },
  assessment: null,
  roadmapCareer: null,
  roadmapDone: [],
  enrollments: {},
  savedJobs: [],
  applications: [],
  activity: [],
})

const USERS = 'sb_users'
const SESSION = 'sb_session'
const GUEST = 'guest'
const dataKey = (id) => `sb_data_${id}`
const loadData = (id) => ({ ...emptyData(), ...readJSON(dataKey(id), {}) })

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => readJSON(USERS, []))
  const [sessionId, setSessionId] = useState(() => readJSON(SESSION, null))
  const user = users.find((u) => u.id === sessionId) || null
  const ownerId = user ? user.id : GUEST
  const [data, setData] = useState(() => loadData(user ? user.id : GUEST))

  // Reload data whenever the signed-in account changes.
  useEffect(() => {
    setData(loadData(ownerId))
  }, [ownerId])

  const update = useCallback(
    (fn) => {
      setData((prev) => {
        const next = fn(prev)
        writeJSON(dataKey(ownerId), next)
        return next
      })
    },
    [ownerId],
  )

  const saveUsers = (list) => {
    setUsers(list)
    writeJSON(USERS, list)
  }

  const startSession = (id) => {
    // Carry a guest assessment over to the account if it has none yet.
    const guest = loadData(GUEST)
    const own = loadData(id)
    if (guest.assessment && !own.assessment) {
      writeJSON(dataKey(id), { ...own, assessment: guest.assessment })
      removeKey(dataKey(GUEST))
    }
    writeJSON(SESSION, id)
    setSessionId(id)
  }

  const signup = async ({ name, email, password, university }) => {
    const normalized = email.trim().toLowerCase()
    if (users.some((u) => u.email === normalized)) return { ok: false, error: 'taken' }
    const newUser = {
      id: `u-${Date.now().toString(36)}`,
      name: name.trim(),
      email: normalized,
      university: university.trim(),
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    }
    saveUsers([...users, newUser])
    startSession(newUser.id)
    return { ok: true, user: newUser }
  }

  const login = async (email, password) => {
    const normalized = email.trim().toLowerCase()
    const hash = await hashPassword(password)
    const found = users.find((u) => u.email === normalized && u.passwordHash === hash)
    if (!found) return { ok: false, error: 'invalid' }
    startSession(found.id)
    return { ok: true, user: found }
  }

  const loginDemo = async () => {
    let demo = users.find((u) => u.email === DEMO_USER.email)
    if (!demo) {
      demo = { ...DEMO_USER, passwordHash: await hashPassword(DEMO_USER.password), createdAt: new Date().toISOString() }
      delete demo.password
      saveUsers([...users, demo])
      writeJSON(dataKey(demo.id), buildDemoData())
    } else if (!readJSON(dataKey(demo.id), null)) {
      writeJSON(dataKey(demo.id), buildDemoData())
    }
    writeJSON(SESSION, demo.id)
    setSessionId(demo.id)
    return { ok: true, user: demo }
  }

  const logout = () => {
    removeKey(SESSION)
    setSessionId(null)
  }

  const updateAccount = (fields) => {
    if (!user) return
    saveUsers(users.map((u) => (u.id === user.id ? { ...u, ...fields } : u)))
  }

  const actions = {
    saveAssessment: (result) => update((d) => ({ ...d, assessment: result, roadmapCareer: null })),
    setRoadmapCareer: (id) => update((d) => ({ ...d, roadmapCareer: id })),
    toggleStep: (stepId) =>
      update((d) => ({
        ...d,
        roadmapDone: d.roadmapDone.includes(stepId)
          ? d.roadmapDone.filter((s) => s !== stepId)
          : [...d.roadmapDone, stepId],
      })),
    enroll: (courseId) =>
      update((d) =>
        d.enrollments[courseId]
          ? d
          : { ...d, enrollments: { ...d.enrollments, [courseId]: { enrolledAt: new Date().toISOString(), done: [] } } },
      ),
    completeLesson: (courseId, index) =>
      update((d) => {
        const e = d.enrollments[courseId]
        if (!e || e.done.includes(index)) return d
        return {
          ...d,
          enrollments: { ...d.enrollments, [courseId]: { ...e, done: [...e.done, index] } },
          activity: [...d.activity, { date: todayKey(), minutes: lessonMinutes(courseById[courseId]), courseId }],
        }
      }),
    toggleSaveJob: (jobId) =>
      update((d) => ({
        ...d,
        savedJobs: d.savedJobs.includes(jobId) ? d.savedJobs.filter((j) => j !== jobId) : [...d.savedJobs, jobId],
      })),
    apply: (jobId, form) =>
      update((d) => ({
        ...d,
        applications: [...d.applications.filter((a) => a.jobId !== jobId), { jobId, ...form, date: new Date().toISOString() }],
      })),
    updateProfile: (profile) => update((d) => ({ ...d, profile: { ...d.profile, ...profile } })),
    resetProgress: () => update((d) => ({ ...emptyData(), profile: d.profile })),
  }

  const value = useMemo(
    () => ({ user, data, signup, login, loginDemo, logout, updateAccount, ...actions }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, data],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
