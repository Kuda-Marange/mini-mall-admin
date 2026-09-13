# CLAUDE.md

Rules for working in this repo — read this every session, follow it
whether you're a person or an AI assistant.

## Stack & tooling
- pnpm only. Never npm, yarn, or bun — a stray lockfile from another
  package manager breaks the build.

## Money
- All monetary values in integer cents, never floats. Format with the
  shared `formatPrice` helper (`lib/format-price.ts`) at the point of
  display — never inline.

## Git workflow
- Never push to staging or main directly, ever.
- Branch off staging for every piece of work: `feat/short-description`
  for new features, `fix/short-description` for bug fixes — lowercase,
  hyphenated, no abbreviations like `bugFix`.
- PR into staging with a screenshot showing the visual change, unless
  the change has zero visual effect (e.g. pure tooling/config cleanup),
  in which case include the verification steps you ran instead.
- Only promote staging to main after clicking through the deployed
  staging build yourself.

## Before every PR
- Run `pnpm build` locally, confirm it passes clean with no warnings
  left unaddressed.
- Check every screen at 360px in the browser's device toolbar.
- Check dark mode on every screen touched by the change.

## Testing
- Playwright tests live in `tests/` (or wherever configured) — at
  minimum, one test covers creating an order end-to-end.
- New interactive features should get a corresponding test where
  practical.

## Deployment
- The app must build and run in a Dockerfile serving on port 8080 —
  do not assume Vercel's zero-config build is the only deploy target.

## Repo hygiene
- One `README.md` only — no `README.txt`, no duplicate docs.
- No tool-specific config folders committed (`.clinerules`, `.agents`,
  `.claude/skills`, etc.) — this `CLAUDE.md` is the one exception.
- Use `cn` from `lib/utils` — do not add a separate `cn` / `clsx`
  package; shadcn/ui already provides this.

## Security
- Any Supabase (or other backend) writes must be behind real
  authentication, scoped by RLS policies tied to the authenticated
  user — never a blanket `using (true)` policy on the public anon key.
- Never commit `.env` files or paste keys/tokens into chat, commits,
  or this file.