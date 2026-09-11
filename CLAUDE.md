## Stack & tooling
- pnpm only

## Money
- All monetary values in integer cents, never floats

## Git workflow
- Never push to staging or main directly
- Branch off staging: fix/..., feat/...
- PR into staging with a screenshot, then promote

## Before every PR
- Run the build locally, confirm it passes
- Check every screen at 360px

## Repo hygiene
- One README.md, no README.txt, no tool config folders except CLAUDE.md
- Use cn from lib/utils, not a separate package

## Security
- Supabase writes behind auth, not public anon key
