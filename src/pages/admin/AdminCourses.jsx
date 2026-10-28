import { Eye, EyeOff, Pencil, Plus } from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { supabase, COURSES_TABLE } from '../../lib/supabase'
import { courses, isFree } from '../../lib/catalog'
import Button from '../../components/ui/Button'
import SmartImage from '../../components/ui/SmartImage'

export default function AdminCourses() {
  const { t, L, fmtPrice } = useLang()
  const { refreshCatalog } = useApp()
  const toast = useToast()

  const toggleHidden = async (c) => {
    const { error } = await supabase.from(COURSES_TABLE).update({ hidden: !c.hidden }).eq('id', c.id)
    if (error) return toast(t('admin.saveError'), 'error')
    toast(t(c.hidden ? 'admin.shown' : 'admin.hiddenToast'))
    refreshCatalog()
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy-500">{t('admin.coursesHint')}</p>
        <Button to="/admin/courses/new"><Plus className="h-4 w-4" /> {t('admin.newCourse')}</Button>
      </div>
      <ul className="mt-6 space-y-3">
        {courses.map((c) => (
          <li key={c.id} className={`card flex flex-wrap items-center gap-4 p-4 ${c.hidden ? 'opacity-60' : ''}`}>
            <SmartImage src={c.image} alt="" className="h-14 w-20 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy-900">{L(c.title)}</p>
              <p className="text-xs text-navy-500">
                {t(`careers.${c.category}`)} · {t('common.lessons', { n: c.lessons.length })}
                {c.hidden && <> · <span className="font-semibold text-amber-700">{t('admin.hiddenBadge')}</span></>}
              </p>
            </div>
            <p className="w-28 font-bold text-navy-900">{isFree(c) ? t('courses.free') : fmtPrice(c.price)}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => toggleHidden(c)} title={t(c.hidden ? 'admin.show' : 'admin.hide')}>
                {c.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="hidden sm:inline">{t(c.hidden ? 'admin.show' : 'admin.hide')}</span>
              </Button>
              <Button size="sm" variant="outline" to={`/admin/courses/${c.id}`}>
                <Pencil className="h-4 w-4" /> {t('admin.edit')}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
