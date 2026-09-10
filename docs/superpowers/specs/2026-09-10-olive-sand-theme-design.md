# Olive & Sand Theme + Syne Headings — Design Spec

**Date:** 2026-09-10
**Status:** Approved
**Scope:** Whole app — all pages and components

## Overview

Final touchups for the mini-mall-admin pizza order dashboard. Apply a warm/earthy **Olive & Sand** color palette (inspired by `inpiration/Inspiration 1.webp`) across the entire app, and fix the broken Syne font setup so headings render in Syne (as used on shonaprince.africa).

## 1. Fix Broken Syne Font Setup

**Bug:** `app/layout.tsx` defines Syne with `variable: "--font-display"`, but `app/globals.css` references `--font-syne` for `--font-heading`. The `font-heading` utility class is therefore broken — Syne never renders.

**Fix:**
- Change `layout.tsx` Syne variable from `--font-display` to `--font-syne`.
- Keep `--font-heading: var(--font-syne)` in `globals.css`.
- Apply `font-heading` to all page headings and card titles.

## 2. Olive & Sand Color Palette — Light Mode

| Token | Value | Usage |
|---|---|---|
| `--background` | `#F2E8D5` (sand) | Page background |
| `--foreground` | `#2D2A26` (dark earth) | Body text |
| `--card` | `#FBF8F2` (warm white) | Cards, popovers |
| `--card-foreground` | `#2D2A26` | Card text |
| `--primary` | `#6B7A3F` (olive) | Buttons, active states, chart line |
| `--primary-foreground` | `#FAF6F0` | Text on primary |
| `--secondary` | `#E8DFCE` (light sand) | Secondary surfaces |
| `--secondary-foreground` | `#3E3A33` | Secondary text |
| `--muted` | `#EDE5D6` | Muted surfaces |
| `--muted-foreground` | `#7A7265` | Muted text |
| `--accent` | `#A98467` (tan) | Hover states, secondary accents |
| `--accent-foreground` | `#FAF6F0` | Text on accent |
| `--destructive` | `#B3402E` | Errors, cancellations |
| `--border` | `#DCD3C2` | Borders |
| `--input` | `#DCD3C2` | Input borders |
| `--ring` | `#6B7A3F` | Focus rings |
| `--sidebar` | `#3E3A33` (dark earth) | Sidebar background |
| `--sidebar-foreground` | `#EDE5D6` | Sidebar text |
| `--sidebar-primary` | `#8A9A55` | Sidebar active item |
| `--sidebar-accent` | `#4A453D` | Sidebar hover |
| `--sidebar-border` | `#4A453D` | Sidebar borders |
| `--chart-1` | `#6B7A3F` (olive) | Primary chart color |
| `--chart-2` | `#A98467` (tan) | Secondary chart color |
| `--chart-3` | `#C4A484` (light tan) | Tertiary chart color |
| `--chart-4` | `#8B5E3C` (warm brown) | Quaternary chart color |
| `--chart-5` | `#5A6B3A` (muted green) | Quinary chart color |
| `--success` | `#6B7A3F` (olive) | Success states |
| `--success-foreground` | `#FAF6F0` | Success text |
| `--warning` | `#C4A484` (tan) | Warning states |
| `--warning-foreground` | `#3E3A33` | Warning text |

## 3. Olive & Sand Dark Mode Variants

| Token | Value | Usage |
|---|---|---|
| `--background` | `#1C1E16` (deep olive-charcoal) | Page background |
| `--foreground` | `#EDE5D6` (sand) | Body text |
| `--card` | `#262820` (dark warm gray) | Cards |
| `--card-foreground` | `#EDE5D6` | Card text |
| `--primary` | `#8A9A55` (lighter olive) | Buttons, active states |
| `--primary-foreground` | `#14150F` | Text on primary |
| `--secondary` | `#2E3026` | Secondary surfaces |
| `--secondary-foreground` | `#EDE5D6` | Secondary text |
| `--muted` | `#2E3026` | Muted surfaces |
| `--muted-foreground` | `#9A9284` | Muted text |
| `--accent` | `#C4A484` (lighter tan) | Hover states |
| `--accent-foreground` | `#14150F` | Text on accent |
| `--destructive` | `#D96C5A` | Errors |
| `--border` | `#3A3C30` | Borders |
| `--input` | `#3A3C30` | Input borders |
| `--ring` | `#8A9A55` | Focus rings |
| `--sidebar` | `#14150F` (near-black olive) | Sidebar background |
| `--sidebar-foreground` | `#C4C0B4` | Sidebar text |
| `--sidebar-primary` | `#8A9A55` | Sidebar active item |
| `--sidebar-accent` | `#1E2018` | Sidebar hover |
| `--sidebar-border` | `#2A2C22` | Sidebar borders |
| `--chart-1` | `#8A9A55` | Primary chart color |
| `--chart-2` | `#C4A484` | Secondary chart color |
| `--chart-3` | `#6B7A3F` | Tertiary chart color |
| `--chart-4` | `#A98467` | Quaternary chart color |
| `--chart-5` | `#5A6B3A` | Quinary chart color |
| `--success` | `#8A9A55` | Success states |
| `--success-foreground` | `#14150F` | Success text |
| `--warning` | `#C4A484` | Warning states |
| `--warning-foreground` | `#14150F` | Warning text |

## 4. Syne Headings Across All Pages

Apply `font-heading` to:

- **Dashboard** (`app/(dashboard)/page.tsx`): "Dashboard Home Page" banner heading
- **Orders** (`app/(dashboard)/orders/page.tsx`): "Orders" page title
- **Create Order** (`app/(dashboard)/orders/new/page.tsx`): "Create Order" page title
- **Order Detail** (`app/(dashboard)/orders/[id]/page.tsx`): Order ID heading + all `CardTitle` components
- **PromotionalBanner**: Banner heading
- **StatItem**: Stat values (numbers)
- **All `CardTitle` components** across the app

## 5. Component Polish

### PromotionalBanner (`components/DashboardComponents/PromotionalBannar.tsx`)
- Olive gradient background (light: `#6B7A3F` → `#5A6B3A`; dark: `#8A9A55` → `#6B7A3F`)
- Syne heading with `font-heading`
- Refined "Go to orders page" button with olive primary

### StatItem (`components/DashboardComponents/StatItem.tsx`)
- Larger Syne-styled numbers (`font-heading`, `text-2xl`)
- Olive accent on labels

### OrdersActionBar (`components/DashboardComponents/OrdersActionBar.tsx`)
- Olive primary buttons (already uses `bg-primary` — will inherit new palette)

### Navbar (`components/navbar.tsx`)
- Avatar fallback: olive instead of orange
- Notification badge: olive/tan instead of orange

### Sidebar (`components/app-sidebar.tsx`, `components/sidebar-header-snippet.tsx`)
- Avatar fallback: olive instead of orange
- Inherits new `--sidebar` palette tokens

### Status Badges (`components/DashboardComponents/columns.tsx`, order detail page)
- Pending: tan/amber tint
- Shipped: olive tint
- Delivered: success olive
- Cancelled: destructive red

### OrdersOverTimeChart (`components/DashboardComponents/OrdersOverTimeChart.tsx`)
- Chart line uses `var(--chart-1)` — will inherit olive automatically

## Files to Modify

1. `app/layout.tsx` — fix Syne variable name
2. `app/globals.css` — new olive/sand palette tokens (light + dark)
3. `app/(dashboard)/page.tsx` — Syne heading on banner
4. `app/(dashboard)/orders/page.tsx` — Syne heading on "Orders"
5. `app/(dashboard)/orders/new/page.tsx` — Syne heading on "Create Order"
6. `app/(dashboard)/orders/[id]/page.tsx` — Syne headings on order ID + card titles
7. `components/DashboardComponents/PromotionalBannar.tsx` — olive gradient, Syne heading
8. `components/DashboardComponents/StatItem.tsx` — Syne numbers, olive accent
9. `components/navbar.tsx` — olive avatar fallback, olive notification badge
10. `components/sidebar-header-snippet.tsx` — olive avatar fallback
11. `components/DashboardComponents/columns.tsx` — status badge tints

## Out of Scope

- No new features or functionality changes
- No data model changes
- No new dependencies
- No changes to the static week-one page