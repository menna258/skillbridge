// Writes supabase/seed_courses.sql from src/data/courses.js (one-time import).
// Run: node scripts/seed-courses.mjs
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

// Load through Vite so the app's extensionless imports resolve.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { courses } = await vite.ssrLoadModule('/src/data/courses.js')
await vite.close()

const q = (s) => `'${String(s).replace(/'/g, "''")}'`
const rows = courses.map((c, i) =>
  `  (${[
    q(c.id), q(c.category), q(c.level), c.hours, c.rating, c.learners, q(c.image), q(c.instructor),
    `array[${c.skills.map(q).join(', ')}]::text[]`,
    q(c.title.en), q(c.title.ar), q(c.description.en), q(c.description.ar),
    `${q(JSON.stringify(c.lessons))}::jsonb`, i,
  ].join(', ')})`,
)

writeFileSync(
  new URL('../supabase/seed_courses.sql', import.meta.url),
  `-- نقل الكورسات الحالية من src/data/courses.js لقاعدة البيانات (مرة واحدة، بعد shop.sql).
-- اتعمل تلقائي بـ: node scripts/seed-courses.mjs
-- كل الكورسات بتبدأ مجانية (السعر صفر). حددي الأسعار من لوحة الأدمن.
insert into public.skillbridge_courses
  (id, category, level, hours, rating, learners, image, instructor, skills,
   title_en, title_ar, description_en, description_ar, lessons, sort_order)
values
${rows.join(',\n')}
on conflict (id) do nothing;
`,
)
console.log(`Wrote ${courses.length} courses`)
