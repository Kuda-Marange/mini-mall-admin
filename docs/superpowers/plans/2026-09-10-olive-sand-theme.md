# Olive & Sand Theme + Syne Headings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use /long-haul-development.md to implement this plan task-by-task (disk-backed plan + journal, `/newtask` relay, review gates). For a plan small enough to finish in one session, /executing-plans.md is the simpler inline path. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Olive & Sand warm/earthy color palette across the entire mini-mall-admin app and fix the broken Syne font setup so headings render in Syne.

**Architecture:** Update CSS design tokens in `app/globals.css` (light + dark variants), fix the Syne font variable name in `app/layout.tsx`, then apply `font-heading` classes and olive/sand color accents across all pages and components. No new dependencies, no data model changes, no new features.

**Tech Stack:** Next.js 16.3.4, Tailwind CSS v4, shadcn/ui, next/font (Syne), TypeScript

---

## File Structure

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Fix Syne font variable name (`--font-display` → `--font-syne`) |
| `app/globals.css` | Olive & Sand palette tokens (light + dark) |
| `app/(dashboard)/page.tsx` | Syne heading on dashboard banner |
| `app/(dashboard)/orders/page.tsx` | Syne heading on "Orders" title |
| `app/(dashboard)/orders/new/page.tsx` | Syne heading on "Create Order" title |
| `app/(dashboard)/orders/[id]/page.tsx` | Syne headings on order ID + card titles |
| `components/DashboardComponents/PromotionalBannar.tsx` | Olive gradient banner, Syne heading |
| `components/DashboardComponents/StatItem.tsx` | Syne numbers, olive accent |
| `components/navbar.tsx` | Olive avatar fallback + notification badge |
| `components/sidebar-header-snippet.tsx` | Olive avatar fallback |
| `components/DashboardComponents/columns.tsx` | Status badge tints |

---

### Task 1: Fix Syne font variable in layout

**Files:**
- Modify: `app/layout.tsx:12-15`

- [ ] **Step 1: Change the Syne variable name**

In `app/layout.tsx`, change the Syne font variable from `--font-display` to `--font-syne`:

```tsx
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev`
Expected: No build errors. The `--font-syne` CSS variable is now defined, matching the `--font-heading: var(--font-syne)` reference in `globals.css`.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "fix: align Syne font variable name with globals.css"
```

---

### Task 2: Update globals.css with Olive & Sand palette (light mode)

**Files:**
- Modify: `app/globals.css:55-92` (the `:root` block)

- [ ] **Step 1: Replace the `:root` palette tokens**

Replace the entire `:root { ... }` block in `app/globals.css` with:

```css
:root {
  --background: oklch(0.94 0.03 85);
  --foreground: oklch(0.25 0.02 60);
  --card: oklch(0.98 0.01 85);
  --card-foreground: oklch(0.25 0.02 60);
  --popover: oklch(0.98 0.01 85);
  --popover-foreground: oklch(0.25 0.02 60);
  --primary: oklch(0.55 0.08 110);
  --primary-foreground: oklch(0.98 0.01 85);
  --secondary: oklch(0.9 0.03 80);
  --secondary-foreground: oklch(0.3 0.02 60);
  --muted: oklch(0.92 0.02 80);
  --muted-foreground: oklch(0.5 0.02 60);
  --accent: oklch(0.7 0.06 70);
  --accent-foreground: oklch(0.98 0.01 85);
  --destructive: oklch(0.55 0.2 25);
  --border: oklch(0.85 0.02 80);
  --input: oklch(0.85 0.02 80);
  --ring: oklch(0.55 0.08 110);
  --chart-1: oklch(0.55 0.08 110);
  --chart-2: oklch(0.7 0.06 70);
  --chart-3: oklch(0.8 0.05 75);
  --chart-4: oklch(0.5 0.08 60);
  --chart-5: oklch(0.45 0.07 120);
  --radius: 0.625rem;
  --sidebar: oklch(0.3 0.02 60);
  --sidebar-foreground: oklch(0.92 0.02 80);
  --sidebar-primary: oklch(0.6 0.08 110);
  --sidebar-primary-foreground: oklch(0.98 0.01 85);
  --sidebar-accent: oklch(0.35 0.02 60);
  --sidebar-accent-foreground: oklch(0.92 0.02 80);
  --sidebar-border: oklch(0.35 0.02 60);
  --sidebar-ring: oklch(0.55 0.08 110);
  --success: oklch(0.55 0.08 110);
  --success-foreground: oklch(0.98 0.01 85);
  --warning: oklch(0.8 0.05 75);
  --warning-foreground: oklch(0.3 0.02 60);
}
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev`
Expected: The app renders with sand background, olive primary buttons, dark earth sidebar.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply olive & sand palette to light mode"
```

---

### Task 3: Update globals.css with Olive & Sand dark mode variants

**Files:**
- Modify: `app/globals.css:94-130` (the `.dark` block)

- [ ] **Step 1: Replace the `.dark` palette tokens**

Replace the entire `.dark { ... }` block in `app/globals.css` with:

```css
.dark {
  --background: oklch(0.18 0.01 100);
  --foreground: oklch(0.92 0.02 80);
  --card: oklch(0.22 0.01 100);
  --card-foreground: oklch(0.92 0.02 80);
  --popover: oklch(0.22 0.01 100);
  --popover-foreground: oklch(0.92 0.02 80);
  --primary: oklch(0.65 0.08 110);
  --primary-foreground: oklch(0.15 0.01 100);
  --secondary: oklch(0.25 0.01 100);
  --secondary-foreground: oklch(0.92 0.02 80);
  --muted: oklch(0.25 0.01 100);
  --muted-foreground: oklch(0.6 0.02 80);
  --accent: oklch(0.75 0.06 70);
  --accent-foreground: oklch(0.15 0.01 100);
  --destructive: oklch(0.65 0.2 25);
  --border: oklch(0.3 0.01 100);
  --input: oklch(0.3 0.01 100);
  --ring: oklch(0.65 0.08 110);
  --chart-1: oklch(0.65 0.08 110);
  --chart-2: oklch(0.75 0.06 70);
  --chart-3: oklch(0.55 0.08 110);
  --chart-4: oklch(0.7 0.06 70);
  --chart-5: oklch(0.45 0.07 120);
  --sidebar: oklch(0.14 0.01 100);
  --sidebar-foreground: oklch(0.8 0.02 80);
  --sidebar-primary: oklch(0.65 0.08 110);
  --sidebar-primary-foreground: oklch(0.15 0.01 100);
  --sidebar-accent: oklch(0.18 0.01 100);
  --sidebar-accent-foreground: oklch(0.8 0.02 80);
  --sidebar-border: oklch(0.22 0.01 100);
  --sidebar-ring: oklch(0.65 0.08 110);
  --success: oklch(0.65 0.08 110);
  --success-foreground: oklch(0.15 0.01 100);
  --warning: oklch(0.75 0.06 70);
  --warning-foreground: oklch(0.15 0.01 100);
}
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev` and toggle dark mode via the theme toggle.
Expected: Dark mode renders with deep olive-charcoal background, lighter olive primary, near-black olive sidebar.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply olive & sand dark mode variants"
```

---

### Task 4: Syne heading on dashboard banner

**Files:**
- Modify: `app/(dashboard)/page.tsx:21` (PromotionalBanner usage)

- [ ] **Step 1: No change needed — banner heading is inside PromotionalBanner component**

The dashboard page renders `<PromotionalBanner />` which contains the "Dashboard Home Page" heading. The Syne heading will be applied in Task 6. Verify the page still renders:

Run: `pnpm dev`
Expected: Dashboard page renders with the promotional banner.

- [ ] **Step 2: Commit (no-op — skip if nothing changed)**

No commit needed for this task.

---

### Task 5: Syne heading on Orders page title

**Files:**
- Modify: `app/(dashboard)/orders/page.tsx:41`

- [ ] **Step 1: Add `font-heading` to the Orders title**

In `app/(dashboard)/orders/page.tsx`, change:

```tsx
<h1 className="text-2xl font-bold text-foreground">Orders</h1>
```

to:

```tsx
<h1 className="text-2xl font-bold font-heading text-foreground">Orders</h1>
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev` and navigate to `/orders`.
Expected: "Orders" title renders in Syne font.

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/orders/page.tsx"
git commit -m "feat: apply Syne heading to Orders page title"
```

---

### Task 6: Syne heading on Create Order page title

**Files:**
- Modify: `app/(dashboard)/orders/new/page.tsx:95`

- [ ] **Step 1: Add `font-heading` to the Create Order title**

In `app/(dashboard)/orders/new/page.tsx`, change:

```tsx
<h1 className="text-2xl font-bold text-foreground">Create Order</h1>
```

to:

```tsx
<h1 className="text-2xl font-bold font-heading text-foreground">Create Order</h1>
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev` and navigate to `/orders/new`.
Expected: "Create Order" title renders in Syne font.

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/orders/new/page.tsx"
git commit -m "feat: apply Syne heading to Create Order page title"
```

---

### Task 7: Syne headings on Order Detail page

**Files:**
- Modify: `app/(dashboard)/orders/[id]/page.tsx:130` (order ID heading)
- Modify: `app/(dashboard)/orders/[id]/page.tsx:177, 205, 216, 238, 259` (CardTitle components)

- [ ] **Step 1: Add `font-heading` to the order ID heading**

In `app/(dashboard)/orders/[id]/page.tsx`, change:

```tsx
<h1 className="text-2xl font-semibold tracking-tight">
```

to:

```tsx
<h1 className="text-2xl font-semibold font-heading tracking-tight">
```

- [ ] **Step 2: Add `font-heading` to all CardTitle components**

In the same file, add `font-heading` to each `CardTitle`:

```tsx
<CardTitle className="text-base font-heading">Items</CardTitle>
<CardTitle className="text-base font-heading">Order progress</CardTitle>
<CardTitle className="text-base font-heading">Customer details</CardTitle>
<CardTitle className="text-base font-heading">Order summary</CardTitle>
<CardTitle className="text-base font-heading">Order status</CardTitle>
```

- [ ] **Step 3: Verify the change**

Run: `pnpm dev` and navigate to `/orders/ORD-001`.
Expected: Order ID and all card titles render in Syne font.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/orders/[id]/page.tsx"
git commit -m "feat: apply Syne headings to Order Detail page"
```

---

### Task 8: PromotionalBanner — olive gradient + Syne heading

**Files:**
- Modify: `components/DashboardComponents/PromotionalBannar.tsx`

- [ ] **Step 1: Update the banner with olive gradient and Syne heading**

Replace the entire file content with:

```tsx
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function PromotionalBanner() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-heading">
            Dashboard Home Page
          </h2>
          <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
            Welcome Back!
          </p>
          <Link
            href="/orders"
            className="flex gap-2 mt-4 bg-primary-foreground text-primary px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-primary-foreground/90"
          >
            Go to orders page
            <TrendingUp />
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev` and view the dashboard.
Expected: Banner has an olive gradient background, Syne heading, and a contrasting button.

- [ ] **Step 3: Commit**

```bash
git add components/DashboardComponents/PromotionalBannar.tsx
git commit -m "feat: olive gradient banner with Syne heading"
```

---

### Task 9: StatItem — Syne numbers + olive accent

**Files:**
- Modify: `components/DashboardComponents/StatItem.tsx`

- [ ] **Step 1: Update StatItem with Syne numbers and olive accent**

Replace the entire file content with:

```tsx
interface StatItemProps {
  label: string;
  value: string | number;
}

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex-1 min-w-[110px] px-6 py-4 text-center sm:text-left">
      <p className="text-sm text-muted-foreground whitespace-nowrap">{label}</p>
      <p className="text-2xl font-bold font-heading text-primary mt-1">{value}</p>
    </div>
  );
}
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev` and view the dashboard.
Expected: Stat numbers render in Syne, larger, and in olive primary color.

- [ ] **Step 3: Commit**

```bash
git add components/DashboardComponents/StatItem.tsx
git commit -m "feat: Syne stat numbers with olive accent"
```

---

### Task 10: Navbar — olive avatar fallback + notification badge

**Files:**
- Modify: `components/navbar.tsx:82` (notification badge)
- Modify: `components/navbar.tsx:92` (avatar fallback)

- [ ] **Step 1: Change notification badge from orange to olive**

In `components/navbar.tsx`, change:

```tsx
<span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-medium text-white">
```

to:

```tsx
<span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
```

- [ ] **Step 2: Change avatar fallback from orange to olive**

In `components/navbar.tsx`, change:

```tsx
<AvatarFallback className="bg-orange-500 text-white">
```

to:

```tsx
<AvatarFallback className="bg-primary text-primary-foreground">
```

- [ ] **Step 3: Verify the change**

Run: `pnpm dev`.
Expected: Notification badge and avatar fallback render in olive.

- [ ] **Step 4: Commit**

```bash
git add components/navbar.tsx
git commit -m "feat: olive notification badge and avatar fallback"
```

---

### Task 11: Sidebar header — olive avatar fallback

**Files:**
- Modify: `components/sidebar-header-snippet.tsx:35`

- [ ] **Step 1: Change avatar fallback from orange to olive**

In `components/sidebar-header-snippet.tsx`, change:

```tsx
<AvatarFallback className="rounded-lg bg-orange-500 text-white">
```

to:

```tsx
<AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev`.
Expected: Sidebar avatar fallback renders in olive.

- [ ] **Step 3: Commit**

```bash
git add components/sidebar-header-snippet.tsx
git commit -m "feat: olive sidebar avatar fallback"
```

---

### Task 12: Status badges — olive/tan tints

**Files:**
- Modify: `components/DashboardComponents/columns.tsx`

- [ ] **Step 1: Add status-specific badge variants**

In `components/DashboardComponents/columns.tsx`, replace the status cell renderer with tinted badges:

```tsx
import { Badge } from "../ui/badge";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Unpaid",
  shipped: "Need to ship",
  delivered: "Completed",
  cancelled: "Cancellation",
};

const STATUS_BADGE_CLASSES: Record<Order["status"], string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  shipped: "bg-primary/10 text-primary border-primary/30",
  delivered: "bg-success/15 text-success-foreground border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "amountInCents",
    header: "Total",
    cell: ({ row }) => formatPrice(row.original.amountInCents),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={STATUS_BADGE_CLASSES[row.original.status]}>
        {STATUS_LABELS[row.original.status]}
      </Badge>
    ),
  },
];
```

- [ ] **Step 2: Verify the change**

Run: `pnpm dev` and navigate to `/orders`.
Expected: Status badges show olive/tan/red tints per status.

- [ ] **Step 3: Commit**

```bash
git add components/DashboardComponents/columns.tsx
git commit -m "feat: olive/tan status badge tints"
```

---

### Task 13: Final verification

**Files:**
- All modified files

- [ ] **Step 1: Run the build**

Run: `pnpm build`
Expected: Build succeeds with no TypeScript or lint errors.

- [ ] **Step 2: Visual check all pages**

Run: `pnpm dev` and check:
1. Dashboard (`/`) — olive gradient banner, Syne heading, Syne stat numbers, olive chart line
2. Orders (`/orders`) — Syne "Orders" title, tinted status badges
3. Create Order (`/orders/new`) — Syne "Create Order" title
4. Order Detail (`/orders/ORD-001`) — Syne order ID + card titles
5. Toggle dark mode — olive/sand dark variants render correctly

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete olive & sand theme touchups"