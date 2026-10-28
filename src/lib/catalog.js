import { supabase, COURSES_TABLE } from './supabase'
import { courses as seedCourses } from '../data/courses'

// The live course catalogue. Courses live in Supabase (the Admin edits them);
// without Supabase configured the app falls back to src/data/courses.js.
// These are live ES-module bindings: importers always see the latest list.
export let courses = []
export let courseById = {}

export { courseCategories, courseLevels } from '../data/courses'

// Minutes per lesson, derived from the course length.
export const lessonMinutes = (c) => Math.round((c.hours * 60) / c.lessons.length)

export const isFree = (c) => !c.price

const fromRow = (r) => ({
  id: r.id,
  category: r.category,
  level: r.level,
  hours: r.hours,
  rating: Number(r.rating),
  learners: r.learners,
  image: r.image,
  instructor: r.instructor,
  skills: r.skills,
  title: { en: r.title_en, ar: r.title_ar },
  description: { en: r.description_en, ar: r.description_ar },
  lessons: r.lessons,
  price: r.price_piasters,
  hidden: r.hidden,
  sortOrder: r.sort_order,
})

export const toRow = (c) => ({
  id: c.id,
  category: c.category,
  level: c.level,
  hours: c.hours,
  rating: c.rating,
  learners: c.learners,
  image: c.image,
  instructor: c.instructor,
  skills: c.skills,
  title_en: c.title.en,
  title_ar: c.title.ar,
  description_en: c.description.en,
  description_ar: c.description.ar,
  lessons: c.lessons,
  price_piasters: c.price,
  hidden: c.hidden,
  sort_order: c.sortOrder,
})

function setCourses(list) {
  courses = list
  courseById = Object.fromEntries(list.map((c) => [c.id, c]))
}

// Loads every course the current viewer may see (RLS decides which).
export async function loadCatalog() {
  const { data, error } = supabase
    ? await supabase.from(COURSES_TABLE).select('*').order('sort_order').order('created_at')
    : { error: true }
  if (!error) return setCourses(data.map(fromRow))
  // No database (yet): show the bundled catalogue, all free, rather than nothing.
  if (!courses.length) setCourses(seedCourses.map((c, i) => ({ ...c, price: 0, hidden: false, sortOrder: i })))
}

// Courses shown in the catalogue (the Admin also sees hidden ones elsewhere).
export const listedCourses = () => courses.filter((c) => !c.hidden)
