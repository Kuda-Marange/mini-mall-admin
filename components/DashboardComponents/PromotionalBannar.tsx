import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface PromotionalBannerProps {
  totalOrders?: number;
  userName?: string;
}

export default function PromotionalBanner({
  totalOrders = 0,
  userName = "Kudakwashe",
}: PromotionalBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-sidebar text-sidebar-foreground">
      {/* Warm ambient glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading tracking-tight sm:text-3xl">
            Welcome back, {userName}!
          </h2>
          <p className="mt-2 max-w-md text-sm text-sidebar-foreground/70 sm:text-base">
            Your pizzeria has served {totalOrders} orders so far. The ovens are
            warm.
          </p>
        </div>

        <Link
          href="/orders"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base"
        >
          View orders
          <TrendingUp className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}