"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { PageBanner } from "@/components/page-banner";

export default function TrackOrderPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter your order code first.");
      return;
    }

    router.push(`/track-order/${encodeURIComponent(trimmed.toUpperCase())}`);
  }

  return (
    <div>
      <PageBanner
        title="Track Your Order"
        description="Enter the order code from your receipt or confirmation screen."
      />

      <section className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
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