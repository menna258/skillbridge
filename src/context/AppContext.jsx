import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readJSON, writeJSON, removeKey, todayKey } from '../lib/storage'
import { supabase, ORDERS_TABLE } from '../lib/supabase'
import { courseById, isFree, lessonMinutes, loadCatalog } from '../lib/catalog'
import { Spinner } from '../components/ui/Feedback'

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

// Accounts live in Supabase Auth. Learning progress stays in this browser,
// keyed by the account id; what a Student owns always comes from the database.
const GUEST = 'guest'
const dataKey = (id) => `sb_data_${id}`
const loadData = (id) => ({ ...emptyData(), ...readJSON(dataKey(id), {}) })

const toUser = (u) =>
  u && {
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name || u.email.split('@')[0],
    university: u.user_metadata?.university || '',
    createdAt: u.created_at,
    isAdmin: u.app_metadata?.skillbridge_admin === true,
  }

const authError = (error) => {
  const msg = error?.message?.toLowerCase() || ''
  if (msg.includes('already registered')) return 'taken'
  if (msg.includes('invalid login')) return 'invalid'
  if (msg.includes('not confirmed')) return 'unconfirmed'
  return 'server'
}

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(undefined)
  const [catalogVersion, setCatalogVersion] = useState(0)
  const [ownedIds, setOwnedIds] = useState([])
  const user = useMemo(() => toUser(authUser), [authUser])
  const ownerId = user ? user.id : GUEST
  const [data, setData] = useState(() => loadData(GUEST))

  useEffect(() => {
    if (!supabase) {
      setAuthUser(null)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => setAuthUser(session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setAuthUser(session?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  // What the viewer can see and owns depends on who is signed in.
  const refreshCatalog = useCallback(async () => {
    try {
      await loadCatalog()
    } catch {
      /* keep the last catalogue we had */
    }
    if (supabase && user) {
      const { data: rows } = await supabase.from(ORDERS_TABLE).select('course_id').eq('student_id', user.id).eq('status', 'paid')
      setOwnedIds((rows || []).map((r) => r.course_id))
    } else {
      setOwnedIds([])
    }
    setCatalogVersion((v) => v + 1)
  }, [user?.id])

  useEffect(() => {
    if (authUser !== undefined) refreshCatalog()
  }, [authUser === undefined, refreshCatalog])

  // Reload progress whenever the signed-in account changes.
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

  // Carry a guest assessment over to the account if it has none yet.
  const adoptGuestData = (id) => {
    const guest = loadData(GUEST)
    const own = loadData(id)
    if (guest.assessment && !own.assessment) {
      writeJSON(dataKey(id), { ...own, assessment: guest.assessment })
      removeKey(dataKey(GUEST))
    }
  }

  const signup = async ({ name, email, password, university }) => {
    if (!supabase) return { ok: false, error: 'server' }
    const { data: res, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { name: name.trim(), university: university.trim() }, emailRedirectTo: `${window.location.origin}/login` },
    })
    if (error) return { ok: false, error: authError(error) }
    // Supabase hides "already registered" behind an account with no identities.
    if (res.user && !res.user.identities?.length) return { ok: false, error: 'taken' }
    if (!res.session) return { ok: true, confirm: true, user: toUser(res.user) }
    adoptGuestData(res.user.id)
    return { ok: true, user: toUser(res.user) }
  }

  const login = async (email, password) => {
    if (!supabase) return { ok: false, error: 'server' }
    const { data: res, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (error) return { ok: false, error: authError(error) }
    adoptGuestData(res.user.id)
    return { ok: true, user: toUser(res.user) }
  }

  const logout = () => supabase?.auth.signOut()

  const updateAccount = async (fields) => {
    if (!user) return
    const { data: res } = await supabase.auth.updateUser({ data: fields })
    if (res?.user) setAuthUser(res.user)
  }

  const owns = useCallback(
    (courseId) => {
      const c = courseById[courseId]
      if (!c || !user) return false
      return (isFree(c) && !c.hidden) || ownedIds.includes(courseId)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, ownedIds, catalogVersion],
  )

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
    () => ({ user, data, signup, login, logout, updateAccount, owns, refreshCatalog, catalogVersion, ...actions }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, data, owns, catalogVersion],
  )

  // Wait for the session and the first catalogue load before rendering pages.
  if (catalogVersion === 0) return <Spinner />

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
