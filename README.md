# Mini Mall Admin

A merchant order dashboard built as part of a Lioncap Ventures developer
onboarding ramp. Merchants can view, filter, and search their orders,
update an order's status, and create new orders.

Live: https://mini-mall-admin.vercel.app

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- TanStack Table (sorting, pagination)
- react-hook-form + zod (form validation)
- Recharts (dashboard chart)
- next-themes (dark mode)

## Getting started

This project uses **pnpm only**. Do not use npm, yarn, or bun — a
stray lockfile from another package manager will break the build.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
pnpm build
```

## Data

Order data currently lives in an in-memory fixture file
(`lib/orders-data.ts`), not a persisted database.

An earlier version of this project connected to Supabase for real
persistence. That was reverted: the RLS policies in place allowed
writes and deletes using the public anon/publishable key, meaning
anyone with the deployed URL could modify or wipe the orders table.
Rather than ship that, the project reverted to mock data until proper
authentication exists to scope the RLS policies to an authenticated
user instead of allowing all writes unconditionally.

Practical effect: creating an order or changing an order's status
updates the shared in-memory array for the current server process,
visible across pages during that session, but resets on redeploy or
server restart.

## Routes

| Route | What it does |
|---|---|
| `/` | Dashboard home: stat cards, orders-over-time chart |
| `/orders` | Filterable, sortable, paginated orders table |
| `/orders/[id]` | Order detail, with an editable status |
| `/orders/new` | Create-order form (react-hook-form + zod validation) |

## Git workflow

See `CLAUDE.md` for the full set of rules this repo follows
(branching, commit style, build-before-PR, etc.) — the same rules
apply whether you're a person or an AI assistant working in this repo.

## Known limitations / next steps

- No real backend persistence (see "Data" above) — reintroduce
  Supabase once real auth exists to scope RLS policies correctly
- No authentication yet — the dashboard is currently open to anyone
  who has the URL
- No public storefront yet (product list, cart, checkout) — planned
- No automated tests yet (a Playwright test covering order creation
  is planned)
- No Dockerfile yet (planned: build the app and serve it on port 8080)