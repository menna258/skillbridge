# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Egyptian university students who want to find a career direction and get job-ready. Most read Arabic first; English is the second language the site fully supports. They come to learn what they are suited for, pick up skills through Courses, and find internships and entry-level jobs.

The second audience is the single Admin (the project owner), who runs the Course catalogue, reviews Orders and reads Contact Messages at `/admin`.

## Product Purpose

SkillBridge is a bilingual (Arabic/English) career development platform. A Student takes a career assessment, gets a personalised learning roadmap, takes Courses, and finds jobs that match their skills.

It serves two purposes at once: it is a training-course project graded by the course trainer, and it is meant to become a real product that real students use and pay for. Work must hold up to both: look professional and meet the course sheet, while staying honest enough to launch.

## Positioning

The jobs and the match percentage are what set SkillBridge apart. Courses are not an end in themselves: each completed Course raises the Student's match % with real jobs (70% skill overlap from profile and completed Courses, 30% assessment fit for the job's field). The site shows a Student how close they are to a specific job and what to learn to get closer.

## Operating Context

- Flow: assessment (`/assessment`) → roadmap (`/roadmap`) → Courses (`/courses`) → jobs with match % (`/jobs`), with a Student dashboard (`/dashboard`) and profile.
- Every page works in Arabic (right-to-left) and English. All UI text lives in `src/i18n/ar.js` and `src/i18n/en.js`; data items carry `{ en, ar }` fields.
- Students sign up with real accounts (Supabase Auth). Progress, saved jobs and applications are stored per account in localStorage.
- Deployed on Cloudflare Pages from `main` (https://skillbridge-ar7.pages.dev).

## Capabilities and Constraints

- Stack already in place: React 18, Vite, Tailwind CSS, React Router, lucide-react icons, Supabase.
- Courses live in the `skillbridge_courses` Supabase table; `src/data/courses.js` was only the first import.
- Payment is through Paymob, but it is on hold until a Paymob account exists. Until then every Course price is zero.
- There is exactly one Admin. Terminology follows `GLOSSARY.md` (Course, Student, Order, Owns, Admin, and so on).
- Undecided: whether hosting moves to Render (the course sheet asks for it; Render needs a card, so the site stays on Cloudflare until the trainer agrees).

## Brand Commitments

- Name: SkillBridge.
- Arabic and English are both first-class; Arabic layout is right-to-left, not a mirrored afterthought.

## Evidence on Hand

- Jobs, companies and student stories are realistic sample data (`src/data/jobs.js`, `src/data/students.js`), not real companies or real testimonials. Never present them as real, and never invent real partners, hiring numbers or reviews.
- Images are Unsplash photos with a branded fallback (`src/components/ui/SmartImage.jsx`).
- No real users, testimonials, press or metrics exist yet.

## Product Principles

1. Every Course earns its place by moving a Student closer to a real job; show that link wherever a Course or job appears.
2. Arabic-first for Egyptian students, with English equal in completeness.
3. Honest before impressive: sample data stays labelled as sample, prices stay at zero until payment is real.
4. Good enough to grade and good enough to launch: no shortcuts that would have to be undone before real students arrive.
