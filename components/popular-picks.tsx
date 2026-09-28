import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";

export function PopularPicks() {
  const featured = PRODUCTS.slice(0, 3);

  return (
    <section
      id="popular-picks"
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      {/* Section backdrop — echoes the hero without repeating it */}
      <div className="absolute inset-0 -z-10 bg-muted/40 dark:bg-transparent" />
      <div className="absolute inset-0 -z-10 bg-[url('/light-bg.jpg')] bg-[length:420px_420px] opacity-20 mix-blend-multiply dark:hidden" />
      <div className="absolute inset-0 -z-10 hidden dark:block bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border-2 border-foreground bg-background px-3 py-1 text-xs font-semibold shadow-[3px_3px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)]">
              Popular Picks
            </span>

            <h2 className="mt-4 max-w-2xl text-balance font-heading text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              A few favourites to start with
            </h2>
            <p className="mt-3 text-muted-foreground">
              Not sure where to start? These are a great first order.
            </p>
          </div>

          <Link
            href="/shop/menu"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 border-foreground bg-background px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_0_var(--foreground)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[1px_1px_0_0_var(--gold)] sm:self-auto"
          >
            View full menu
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Reveal className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}