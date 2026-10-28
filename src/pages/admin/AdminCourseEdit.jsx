import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { supabase, COURSES_TABLE, LESSON_CONTENT_TABLE } from '../../lib/supabase'
import { courseById, courseCategories, courseLevels, courses, toRow } from '../../lib/catalog'
import { skills as skillNames } from '../../data/skills'
import Field from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Feedback'

const emptyLesson = () => ({ en: '', ar: '', body_en: '', body_ar: '', video_url: '' })

const blank = () => ({
  id: '',
  title: { en: '', ar: '' },
  description: { en: '', ar: '' },
  category: courseCategories[0],
  level: courseLevels[0],
  hours: 1,
  instructor: '',
  image: '',
  skills: [],
  rating: 0,
  learners: 0,
  priceEgp: '0',
  hidden: true,
  lessons: [emptyLesson()],
})

export default function AdminCourseEdit() {
  const { id } = useParams()
  const isNew = id === 'new'
  const { t, L } = useLang()
  const { refreshCatalog } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return setForm(blank())
    const c = courseById[id]
    if (!c) return setForm(false)
    supabase
      .from(LESSON_CONTENT_TABLE)
      .select('*')
      .eq('course_id', id)
      .then(({ data }) => {
        const byIndex = Object.fromEntries((data || []).map((r) => [r.lesson_index, r]))
        setForm({
          ...c,
          priceEgp: String(c.price / 100),
          lessons: c.lessons.map((l, i) => ({
            ...emptyLesson(),
            ...l,
            body_en: byIndex[i]?.body_en || '',
            body_ar: byIndex[i]?.body_ar || '',
            video_url: byIndex[i]?.video_url || '',
          })),
        })
      })
  }, [id, isNew])

  if (form === null) return <Spinner />
  if (form === false) return <p className="text-navy-600">{t('course.notFound')}</p>

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setLang = (key, lang) => (e) => setForm((f) => ({ ...f, [key]: { ...f[key], [lang]: e.target.value } }))
  const setLesson = (i, key) => (e) =>
    setForm((f) => ({ ...f, lessons: f.lessons.map((l, j) => (j === i ? { ...l, [key]: e.target.value } : l)) }))
  const toggleSkill = (s) =>
    setForm((f) => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s] }))

  const validate = () => {
    const e = {}
    const req = t('auth.errors.required')
    if (isNew && !/^[a-z0-9-]{2,60}$/.test(form.id)) e.id = t('admin.idError')
    else if (isNew && courseById[form.id]) e.id = t('admin.idTaken')
    if (!form.title.en.trim()) e.titleEn = req
    if (!form.title.ar.trim()) e.titleAr = req
    if (!form.description.en.trim()) e.descEn = req
    if (!form.description.ar.trim()) e.descAr = req
    if (!form.instructor.trim()) e.instructor = req
    if (!/^https:\/\/\S+$/i.test(form.image.trim())) e.image = t('admin.imageError')
    if (!(Number(form.hours) >= 1)) e.hours = t('admin.numberError')
    if (!(Number(form.priceEgp) >= 0)) e.price = t('admin.numberError')
    form.lessons.forEach((l, i) => {
      if (!l.en.trim() || !l.ar.trim()) e[`lesson${i}`] = t('admin.lessonError')
      if (l.video_url.trim() && !/^https:\/\/\S+$/i.test(l.video_url.trim())) e[`video${i}`] = t('admin.imageError')
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const save = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const course = {
      ...form,
      id: form.id.trim(),
      title: { en: form.title.en.trim(), ar: form.title.ar.trim() },
      description: { en: form.description.en.trim(), ar: form.description.ar.trim() },
      instructor: form.instructor.trim(),
      image: form.image.trim(),
      hours: Math.round(Number(form.hours)),
      rating: Number(form.rating) || 0,
      learners: Math.round(Number(form.learners)) || 0,
      price: Math.round(Number(form.priceEgp) * 100),
      lessons: form.lessons.map((l) => ({ en: l.en.trim(), ar: l.ar.trim() })),
      sortOrder: isNew ? courses.length : form.sortOrder,
    }
    const row = toRow(course)
    const { error } = isNew
      ? await supabase.from(COURSES_TABLE).insert(row)
      : await supabase.from(COURSES_TABLE).update(row).eq('id', course.id)

    // Lesson Content is keyed by lesson position, so rewrite it as a whole.
    let contentError = null
    if (!error) {
      const del = await supabase.from(LESSON_CONTENT_TABLE).delete().eq('course_id', course.id)
      const rows = form.lessons
        .map((l, i) => ({ course_id: course.id, lesson_index: i, body_en: l.body_en.trim(), body_ar: l.body_ar.trim(), video_url: l.video_url.trim() || null }))
        .filter((r) => r.body_en || r.body_ar || r.video_url)
      const ins = rows.length ? await supabase.from(LESSON_CONTENT_TABLE).insert(rows) : {}
      contentError = del.error || ins.error
    }
    setSaving(false)
    if (error || contentError) return toast(t('admin.saveError'), 'error')
    await refreshCatalog()
    toast(t('admin.saved'))
    navigate('/admin/courses')
  }

  const remove = async () => {
    if (!window.confirm(t('admin.deleteConfirm', { title: L(form.title) }))) return
    const { error } = await supabase.from(COURSES_TABLE).delete().eq('id', form.id)
    // Courses with Orders can't be deleted (the database refuses); hide them instead.
    if (error) return toast(t(error.code === '23503' ? 'admin.deleteHasOrders' : 'admin.saveError'), 'error')
    await refreshCatalog()
    toast(t('admin.deleted'))
    navigate('/admin/courses')
  }

  return (
    <form onSubmit={save} noValidate className="space-y-8">
      <Link to="/admin/courses" className="inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-800">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('admin.courses')}
      </Link>

      <fieldset className="card grid gap-5 p-6 sm:grid-cols-2">
        <legend className="sr-only">{t('admin.details')}</legend>
        {isNew && <Field className="sm:col-span-2" label={t('admin.id')} hint={t('admin.idHint')} value={form.id} onChange={set('id')} error={errors.id} dir="ltr" />}
        <Field label={t('admin.titleEn')} value={form.title.en} onChange={setLang('title', 'en')} error={errors.titleEn} dir="ltr" />
        <Field label={t('admin.titleAr')} value={form.title.ar} onChange={setLang('title', 'ar')} error={errors.titleAr} dir="rtl" />
        <Field as="textarea" label={t('admin.descEn')} value={form.description.en} onChange={setLang('description', 'en')} error={errors.descEn} dir="ltr" />
        <Field as="textarea" label={t('admin.descAr')} value={form.description.ar} onChange={setLang('description', 'ar')} error={errors.descAr} dir="rtl" />
        <Field as="select" label={t('courses.category')} value={form.category} onChange={set('category')}>
          {courseCategories.map((c) => <option key={c} value={c}>{t(`careers.${c}`)}</option>)}
        </Field>
        <Field as="select" label={t('courses.level')} value={form.level} onChange={set('level')}>
          {courseLevels.map((l) => <option key={l} value={l}>{t(`levels.${l}`)}</option>)}
        </Field>
        <Field label={t('course.instructor')} value={form.instructor} onChange={set('instructor')} error={errors.instructor} />
        <Field label={t('admin.hours')} type="number" min="1" value={form.hours} onChange={set('hours')} error={errors.hours} />
        <Field className="sm:col-span-2" label={t('admin.image')} hint={t('admin.imageHint')} value={form.image} onChange={set('image')} error={errors.image} dir="ltr" />
        <Field label={t('admin.price')} hint={t('admin.priceHint')} type="number" min="0" step="0.01" value={form.priceEgp} onChange={set('priceEgp')} error={errors.price} />
        <label className="flex items-center gap-3 self-center text-sm font-medium text-navy-800">
          <input type="checkbox" checked={form.hidden} onChange={set('hidden')} className="h-4 w-4 accent-teal-500" />
          {t('admin.hiddenLabel')}
        </label>
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-navy-800">{t('course.skills')}</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(skillNames).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSkill(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${form.skills.includes(s) ? 'bg-teal-500 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}`}
                aria-pressed={form.skills.includes(s)}
              >
                {L(skillNames[s])}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <div>
        <h2 className="mb-1 text-xl font-bold text-navy-900">{t('course.syllabus')}</h2>
        <p className="mb-4 text-sm text-navy-500">{t('admin.lessonsHint')}</p>
        <ol className="space-y-4">
          {form.lessons.map((l, i) => (
            <li key={i} className="card space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-navy-900">{t('course.lesson', { n: i + 1 })}</p>
                {form.lessons.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setForm((f) => ({ ...f, lessons: f.lessons.filter((_, j) => j !== i) }))}
                    aria-label={t('admin.removeLesson')}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.titleEn')} value={l.en} onChange={setLesson(i, 'en')} error={errors[`lesson${i}`]} dir="ltr" />
                <Field label={t('admin.titleAr')} value={l.ar} onChange={setLesson(i, 'ar')} dir="rtl" />
                <Field as="textarea" label={t('admin.bodyEn')} value={l.body_en} onChange={setLesson(i, 'body_en')} dir="ltr" />
                <Field as="textarea" label={t('admin.bodyAr')} value={l.body_ar} onChange={setLesson(i, 'body_ar')} dir="rtl" />
                <Field className="sm:col-span-2" label={t('admin.video')} value={l.video_url} onChange={setLesson(i, 'video_url')} error={errors[`video${i}`]} dir="ltr" />
              </div>
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" className="mt-4" onClick={() => setForm((f) => ({ ...f, lessons: [...f.lessons, emptyLesson()] }))}>
          <Plus className="h-4 w-4" /> {t('admin.addLesson')}
        </Button>
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-navy-100 pt-6">
        {!isNew ? (
          <Button type="button" variant="ghost" className="text-red-600" onClick={remove}>
            <Trash2 className="h-4 w-4" /> {t('admin.delete')}
          </Button>
        ) : <span />}
        <Button type="submit" size="lg" loading={saving}>{t('admin.save')}</Button>
      </div>
    </form>
  )
}
