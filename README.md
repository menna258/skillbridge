# SkillBridge — Smart Career Development Platform

SkillBridge helps university students discover their strengths, get a personalised learning roadmap, take curated courses and find internships and entry-level jobs. The whole site works in **English and Arabic** (with a right-to-left layout for Arabic).

> **Demo project.** Courses, jobs, companies and student stories are realistic sample data. Accounts and progress are stored only in your browser (localStorage). The Contact form can save messages to Supabase.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves the built site locally |

### Demo account

On the **Log in** page click **“Log in as demo student”**. It signs you in as *Sara Ahmed* (`demo@skillbridge.app` / `Demo1234`) with an assessment, courses, roadmap progress and a job application already filled in.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About + FAQ |
| `/assessment` | 12-question career assessment with scored results |
| `/roadmap` | Personalised learning roadmap (add `?career=data` etc. to explore other paths) |
| `/courses`, `/courses/:id` | Course catalogue with search/filters, course page with lesson tracking |
| `/jobs` | Job listings with search, filters, save and apply |
| `/contact` | Contact form (Supabase) |
| `/dashboard` | Student dashboard (login required) |
| `/profile` | Editable profile (login required) |
| `/login`, `/signup` | Demo authentication |

## How it works

- **Assessment** — every answer adds points to career paths and traits (`src/data/questions.js`). The match % is the share of the maximum points each career could earn (`src/lib/assessment.js`).
- **Roadmap** — built from the top-matching career's stages and steps (`src/data/careers.js`); each step links to courses.
- **Progress** — enrolments, completed lessons, roadmap steps, saved jobs and applications are stored per account in localStorage (`src/context/AppContext.jsx`). The dashboard charts are computed from that data (`src/lib/progress.js`).
- **Job match %** — 70% skill overlap (profile skills + skills from completed courses) + 30% assessment fit for the job's field.
- **Languages** — all UI text lives in `src/i18n/en.js` and `src/i18n/ar.js`; data items carry `{ en, ar }` fields.
- **Images** — Unsplash photos with a branded fallback if one fails to load (`src/components/ui/SmartImage.jsx`).

## Connecting the Contact form to Supabase

1. In the Supabase dashboard open **SQL Editor**, paste the contents of `supabase/contact_messages.sql` and run it once. It creates the `skillbridge_contact_messages` table with Row Level Security that only allows inserting messages (visitors cannot read, edit or delete).
2. Copy `.env.example` to `.env` and fill in your project URL and **publishable** key (Project Settings → API Keys).
3. Restart `npm run dev`. The note under the contact details changes to “stored securely in the SkillBridge database”.

Until `.env` exists, the form still works and keeps messages in the browser (`sb_contact_outbox` in localStorage).

## Project structure

```
src/
  components/
    cards/    CourseCard, JobCard, JobModal
    layout/   Navbar, Footer, Layout (+ route guards), AuthShell, Logo
    ui/       Button, Field, Modal, SmartImage, ProgressBar/Ring, BarChart, …
  context/    AppContext (accounts + progress), ToastContext
  data/       careers, courses, jobs, questions, skills, students
  i18n/       en, ar, LanguageContext
  lib/        assessment scoring, progress helpers, storage, validation, supabase
  pages/      one file per page
supabase/     SQL for the contact table
```

---

## بالعربي: إزاي تشغّلي المشروع خطوة بخطوة

1. افتحي فولدر `skillbridge` في VS Code.
2. افتحي الـ Terminal (من فوق: **Terminal ← New Terminal**).
3. اكتبي الأمر ده واستني لحد ما يخلص (أول مرة بس):
   ```bash
   npm install
   ```
4. بعد كده شغّلي الموقع:
   ```bash
   npm run dev
   ```
5. هيظهر لينك زي `http://localhost:5173` — اضغطي عليه وهو ماسك Ctrl، أو انسخيه في المتصفح.
6. عشان تجربي بسرعة: ادخلي **تسجيل الدخول** واضغطي **«الدخول كطالب تجريبي»**.
7. زرار **العربية / English** فوق بيغيّر اللغة، والصفحة بتتقلب يمين لشمال لوحدها.
8. عشان توقفي الموقع: ارجعي للـ Terminal واضغطي **Ctrl + C**.

### ربط فورم «تواصل معنا» بـ Supabase

1. ادخلي على لوحة Supabase بتاعة مشروعك، وافتحي **SQL Editor**.
2. افتحي ملف `supabase/contact_messages.sql`، انسخي كل اللي فيه، والصقيه هناك، واضغطي **Run** (مرة واحدة بس).
3. في فولدر المشروع، اعملي نسخة من ملف `.env.example` وسمّيها `.env`.
4. من Supabase: **Project Settings ← API Keys**، انسخي الـ **Project URL** والـ **Publishable key** وحطيهم مكان القيم اللي في `.env`.
5. وقّفي الموقع (Ctrl + C) وشغّليه تاني بـ `npm run dev`.
6. ابعتي رسالة تجربة من صفحة **تواصل معنا**، وبعدين شوفيها في Supabase من **Table Editor ← skillbridge_contact_messages**.

> ملف `.env` مش بيترفع على GitHub (موجود في `.gitignore`)، وده الصح.
