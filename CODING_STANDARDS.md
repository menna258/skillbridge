# Coding standards

The reviewer applies every rule here to the diff. Rules a machine can check live in tests instead (`tests/i18n.test.js` for translation keys, the CI job in `.github/workflows/test.yml` for build and tests), so this file holds the judgement calls.

## Data

- Jobs, roadmaps, assessment questions and the other static content come from `src/data`. Courses come from the `skillbridge_courses` table; `src/data/courses.js` was only the first import. A change that adds data from anywhere else, or makes up values, is a finding.
- Course prices stay 0 until there is a Paymob account (tickets #9–#11). Text shown to Students describes courses as free.

## Words

- Code, UI text and comments use the terms in `GLOSSARY.md` (Course, Student, Order…), not the words it lists under _Avoid_. A new domain term goes into the glossary in the same change.
- A decision that is hard to reverse (a new service, a new table, a change of host) gets an ADR in `docs/adr`.

## Text and direction

- Every text a visitor sees goes through `t()`, with the English in `src/i18n/en.js` and the Arabic in `src/i18n/ar.js`. Text written straight into JSX is a finding.
- Anything with a direction follows the reading direction: arrow keys, arrow icons, left/right spacing. In Arabic, "next" is to the left.

## Security

- The Admin is whoever has `app_metadata.skillbridge_admin = true`. Code reads the flag only from `app_metadata` (never `user_metadata`), and only SQL sets it.
- Table access is decided by row level security in `supabase/*.sql`. Hiding a button in the UI is never the protection.
- Secret keys live only in `.env.test` and GitHub Secrets. The site uses only the publishable key.

## Tests

- Each ticket's acceptance criteria have an automated test in `tests/api`, and the ticket closes only when that test passes in CI.
- Tests follow `tests/api/README.md`: everything they create starts with `sbtest-` and is deleted at the end, and they assert only the shape of real rows.
