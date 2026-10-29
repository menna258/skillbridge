# Deploying

## The site

Every push to `main` deploys to Cloudflare Pages on its own (skillbridge-ar7.pages.dev), and every PR gets a preview link. The course sheet asks for Render, but Render needs a card, so the site stays on Cloudflare until the instructor approves.

## The database

There are no migrations. The files in `supabase/*.sql` are run by hand in Supabase → SQL Editor. The Supabase MCP has no access to this project.

## Edge Functions

```
npx.cmd supabase functions deploy <name> --project-ref zwhyspllkkvtusucvkva --use-api
```

`paymob-webhook` also needs `--no-verify-jwt`, because Paymob calls it without a Supabase login.

## After a change goes live

Check the Contact form end to end:

1. On skillbridge-ar7.pages.dev, send a message from the Contact form with an email that starts with `sbtest-` (for example `sbtest-check@example.com`).
2. Run `node scripts/check-contact.mjs`. It shows the message if it reached `skillbridge_contact_messages`, then deletes it.
