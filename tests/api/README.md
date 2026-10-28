# API tests

These tests check what a visitor, a Student and the Admin can see and do, by calling Supabase's public API the same way the site does. This is the project's one test seam (see the spec, issue #2).

They run against the real Supabase project, because the free plan allows only two projects and Docker isn't available for a local one. To keep that safe:

- Every account and message a test creates is marked `sbtest-…@example.com`.
- Each test file deletes everything it created when it finishes.
- Test accounts are created already confirmed, so no emails are sent.

## Run them

1. Copy `.env.test.example` to `.env.test` and paste the project's **secret key** (Supabase → Project Settings → API Keys → Secret keys). `.env.test` is git-ignored; never commit it or paste it into chat.
2. Run `npm test` (on Windows PowerShell: `npm.cmd test`).

Without `.env.test`, the tests are skipped.
