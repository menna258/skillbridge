# Supabase is the whole backend; the site stays static on Cloudflare Pages

Buying Courses needs real accounts, a database the Admin can edit and a server that can talk to the payment provider. We keep the React site as a static build on Cloudflare Pages and put everything server-side in the existing Supabase project: Supabase Auth for Students and the Admin, Postgres with Row Level Security for Courses, Orders and Contact Messages, and Edge Functions for anything that needs a secret (starting a payment, receiving the payment callback, sending email). We chose this over adding a separate Node server because the project already uses Supabase and Cloudflare Pages has no server we control.

## Consequences

- Courses move from `src/data/courses.js` into the database, so the Admin can edit them. The file stays only as the seed for the first import. Jobs, careers, questions and skills stay in `src/data`.
- Browser-only accounts and the "demo student" go away. Learning progress (lessons ticked, roadmap, saved jobs) stays in the browser, keyed by the Supabase user id; what a Student Owns always comes from the database.
- The Admin is a normal Supabase Auth user whose `app_metadata.role` is `admin`. Only the database owner can set that, so nobody can make themselves Admin from the site.
