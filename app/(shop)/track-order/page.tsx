"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";

import { PageBanner } from "@/components/page-banner";
import {
  getRecentOrders,
  removeRecentOrder,
  subscribeToRecentOrders,
  type RecentOrder,
} from "@/lib/recent-orders";

// Stable empty-array reference for SSR/first render — useSyncExternalStore
// requires getServerSnapshot to return the same value each call, or it
// treats every call as a change and re-renders in a loop.
const EMPTY_ORDERS: RecentOrder[] = [];

export default function TrackOrderPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recentOrders = useSyncExternalStore(
    subscribeToRecentOrders,
    getRecentOrders,
    () => EMPTY_ORDERS
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter your order code first.");
      return;
    }

    router.push(`/track-order/${encodeURIComponent(trimmed.toUpperCase())}`);
  }

  function handleRemove(orderCode: string) {
    removeRecentOrder(orderCode);
  }

  return (
    <div>
      <PageBanner
        title="Track Your Order"
        description="Enter the order code from your receipt or confirmation screen."
      />

      <section className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
        {recentOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 px-2 text-sm font-semibold text-foreground">
              Your recent orders
            </h2>

            <ul className="flex flex-col gap-2">
              {recentOrders.map((order) => (
                <li key={order.code}>
                  <div className="group flex items-center gap-2 rounded-full border-2 border-foreground bg-card p-1.5 pl-4 shadow-[3px_3px_0_0_var(--foreground)] dark:border-primary dark:shadow-[3px_3px_0_0_var(--primary)]">
                    <Link
                      href={`/track-order/${encodeURIComponent(order.code)}`}
                      className="flex min-w-0 flex-1 items-center justify-between gap-3"
                    >
                      <span className="min-w-0 truncate text-sm font-medium">
                        {order.pizzaName}
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          · {order.customerName}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {order.code}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemove(order.code)}
                      aria-label={`Remove ${order.code} from recent orders`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center rounded-full border-2 border-foreground bg-card p-1.5 shadow-[5px_5px_0_0_var(--foreground)] dark:border-primary dark:shadow-[5px_5px_0_0_var(--primary)]">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. ORD-SHP8M3FP"
              aria-label="Order code"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm font-medium uppercase tracking-wide outline-none placeholder:normal-case placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-foreground bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:translate-x-px hover:translate-y-px dark:border-gold dark:bg-gold dark:text-gold-foreground"
            >
              Track
              <ArrowRight className="size-4" />
            </button>
          </div>

          {error && <p className="px-2 text-sm text-destructive">{error}</p>}
        </form>

        <p className="mt-4 px-2 text-sm text-muted-foreground">
          Your order code was shown when you placed your order — it looks
          like <span className="font-medium text-foreground">ORD-SHP8M3FP</span>.
        </p>
      </section>
    </div>
  );
}