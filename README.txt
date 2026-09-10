# Mini Mall Admin

A small merchant admin dashboard for viewing and managing orders on a digital
mall platform. Built as a learning project that mirrors the shape of a real
client dashboard: a table, a form, some numbers, on a phone-sized screen.

There's no real backend — order data lives in a local JSON fixture / mock API
route inside the app. The focus is frontend craft and the workflow around it
(branches, PRs, staging verification) rather than a production data layer.

## Tech stack

- **Next.js** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **shadcn/ui** (on Radix UI) for components — Checkbox, Badge, Button, etc.
- **lucide-react** for icons
- **pnpm** as the package manager

## Pages

| Route         | What's on it                                              | Status |
|---------------|-------------------------------------------------------------|--------|
| `/`           | Stat cards (orders today, revenue, pending) + a chart       | Not started |
| `/orders`     | Orders table with search, status filter, pagination         | In progress — table + search + status filter + responsive layout done |
| `/orders/[id]`| Single order detail, with an editable status                | Not started |
| `/orders/new` | Form to create a new order, validated                       | Not started |

## Running locally

```bash
pnpm install
pnpm dev       # http://localhost:3000
```

Before opening any PR, always confirm the production build is clean:

```bash
pnpm build     # this is the build that actually matters — dev is forgiving, build isn't
```

## Branching workflow

This repo follows a two-branch model:

- `main` — production. Never committed to directly.
- `staging` — pre-production, where changes are verified before promotion.

Every change happens on its own `feat/…` or `fix/…` branch cut from `staging`,
opened as a pull request into `staging`, with a screenshot in the PR
description. Once verified on the deployed staging URL, `staging` is promoted
to `main`.

## Deployment

Deployed on Vercel. `staging` currently maps to the Production Branch setting
in Vercel (since `main` doesn't yet have the full app on it) — merges to
`staging` auto-deploy and are checked on the live staging URL before anything
is promoted to `main`.

## What's next

- Finish `/orders/[id]` and `/orders/new` with `react-hook-form` + `zod`
  validation
- Build out the `/` dashboard with stat cards and a Recharts chart
- Swap the orders table to TanStack Table for sorting/pagination
- Add a Dockerfile serving the app on port 8080
- Pass on dark mode and a 360px check across every page
- Promote `staging` to `main` and point Vercel's Production Branch back at
  `main`