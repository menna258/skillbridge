# SkillBridge — Smart Career Development Platform

SkillBridge helps university students discover their strengths, get a personalised learning roadmap, take curated courses and find internships and entry-level jobs. The whole site works in **English and Arabic** (with a right-to-left layout for Arabic).

**Live site:** https://skillbridge-ar7.pages.dev (deployed on Cloudflare Pages from the `main` branch)

Students create real accounts (Supabase Auth) and buy courses with real online payment (Paymob). One Admin manages courses, sees orders and reads Contact messages at `/admin`, and gets an email for every paid order. Jobs, companies and student stories are realistic sample data. See [GLOSSARY.md](GLOSSARY.md) for the words we use and [docs/adr](docs/adr) for the big decisions.

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


## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About + FAQ |
| `/assessment` | 12-question career assessment with scored results |
| `/roadmap` | Personalised learning roadmap (add `?career=data` etc. to explore other paths) |
| `/courses`, `/courses/:id` | Course catalogue with prices, course page with buying, locked lessons and lesson tracking |
| `/payment/result` | Where Paymob sends the Student back after paying |
| `/jobs` | Job listings with search, filters, save and apply |
| `/contact` | Contact form (Supabase) |
| `/dashboard` | Student dashboard (login required) |
| `/profile` | Editable profile (login required) |
| `/login`, `/signup` | Student and Admin accounts (Supabase Auth) |
| `/admin`, `/admin/courses`, `/admin/messages` | Admin dashboard: orders, courses, contact messages |

## How it works

- **Assessment** — every answer adds points to career paths and traits (`src/data/questions.js`). The match % is the share of the maximum points each career could earn (`src/lib/assessment.js`).
- **Roadmap** — built from the top-matching career's stages and steps (`src/data/careers.js`); each step links to courses.
- **Courses and orders** — courses live in the `skillbridge_courses` table (`src/lib/catalog.js`); `src/data/courses.js` is only the first import. Buying calls the `create-checkout` Edge Function, which creates a Pending Order and sends the Student to Paymob. Only the `paymob-webhook` Edge Function marks an Order Paid, after checking Paymob's HMAC signature, and then emails the Admin Inbox through Resend. Row Level Security decides who sees what (`supabase/shop.sql`).
- **Progress** — completed lessons, roadmap steps, saved jobs and applications are stored per account in localStorage (`src/context/AppContext.jsx`). The dashboard charts are computed from that data (`src/lib/progress.js`).
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
  context/    AppContext (accounts, owned courses, progress), ToastContext
  data/       careers, courses (first import only), jobs, questions, skills, students
  i18n/       en, ar, LanguageContext
  lib/        catalog, assessment scoring, progress helpers, storage, validation, supabase
  pages/      one file per page; admin/ for the Admin dashboard
scripts/      seed-courses.mjs (rebuilds supabase/seed_courses.sql)
supabase/
  contact_messages.sql, shop.sql, seed_courses.sql   run once, in that order
  functions/  create-checkout, paymob-webhook (Edge Functions)
```

## Setting up payments, the Admin and order emails

You need: a Paymob merchant account, a free [Resend](https://resend.com) account, and the [Supabase CLI](https://supabase.com/docs/guides/cli) (`npx supabase` works without installing).

1. **Database.** In Supabase **SQL Editor** run `supabase/shop.sql`, then `supabase/seed_courses.sql`. Every imported course starts free; set prices in `/admin/courses`.
2. **Edge Functions.** From the project folder:
   ```bash
   npx supabase login
   ```
   ```bash
   npx supabase functions deploy create-checkout --project-ref zwhyspllkkvtusucvkva
   ```
   ```bash
   npx supabase functions deploy paymob-webhook --no-verify-jwt --project-ref zwhyspllkkvtusucvkva
   ```
3. **Secrets.** Set these once (Supabase dashboard → Edge Functions → Secrets, or `npx supabase secrets set NAME=value`):

   | Secret | Where it comes from |
   | --- | --- |
   | `PAYMOB_SECRET_KEY`, `PAYMOB_PUBLIC_KEY` | Paymob dashboard → Settings → Developers → API Keys (test or live) |
   | `PAYMOB_INTEGRATION_IDS` | Paymob → Payment Integrations, comma-separated, same mode as the keys (e.g. `12345,67890` for card and wallet) |
   | `PAYMOB_HMAC_SECRET` | Paymob dashboard (HMAC secret, not the API key) |
   | `SITE_URL` | `https://skillbridge-ar7.pages.dev` |
   | `RESEND_API_KEY` | Resend → API Keys |
   | `ADMIN_INBOX` | The shared email that gets order notices. Without a verified domain in Resend this must be the email you signed up to Resend with. |
   | `EMAIL_FROM` | Optional, e.g. `SkillBridge <orders@your-domain.com>` once your domain is verified in Resend |

4. **Make yourself Admin.** Sign up on the site, then run in SQL Editor (with your email):
   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"skillbridge_admin": true}'
   where email = 'you@example.com';
   ```
   Log out and in again; **Admin** appears in your account menu.
5. **Test a payment** with Paymob test keys and a test card before switching the secrets to live keys.

Refunds: refund the money in the Paymob dashboard, then press **Mark refunded** on the order in `/admin`.

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
6. عشان تجربي: اعملي حساب من **إنشاء حساب**.
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

### تشغيل الدفع ولوحة الأدمن وإيميل الطلبات

الخطوات بالتفصيل في قسم **Setting up payments, the Admin and order emails** فوق. باختصار:

1. في **SQL Editor**: شغّلي `supabase/shop.sql`، وبعده `supabase/seed_courses.sql`.
2. انشري الـ Edge Functions بالأوامر اللي فوق.
3. حطي الـ Secrets بتاعة Paymob وResend وإيميل الأدمن.
4. اعملي حساب على الموقع، وشغّلي أمر الـ SQL اللي بيخليكي أدمن (بإيميلك)، واعملي تسجيل خروج ودخول تاني.
5. جرّبي عملية دفع بمفاتيح Paymob التجريبية الأول، وبعدين حطي المفاتيح الحقيقية.
