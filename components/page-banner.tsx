import { type ReactNode } from "react";

/**
 * Shared title band for storefront pages other than the home hero: menu,
 * cart, checkout, track order. Same red/doodle vs dark/glow backdrop and
 * hard-shadow headline as the rest of the site, in a shorter strip.
 */
export function PageBanner({
  title,
  description,
  after,
}: {
  title: ReactNode;
  description?: ReactNode;
  /** Optional content below the heading block, e.g. a search box or tabs. */
  after?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary py-14 text-primary-foreground sm:py-16 dark:bg-transparent dark:text-foreground">
      {/* Light mode: doodle pattern soaked into the red, matching Popular Picks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/light-bg.jpg')] bg-[length:420px_420px] opacity-25 mix-blend-multiply dark:hidden"
      />
      {/* Dark mode: the hero's texture + a quiet red glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 hidden bg-[url('/dark-bg.jpg')] bg-cover bg-center opacity-40 dark:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_60%_80%_at_30%_0%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_70%)] dark:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="max-w-2xl font-heading text-3xl font-extrabold tracking-tight [text-shadow:3px_3px_0_var(--foreground)] sm:text-4xl lg:text-5xl dark:[text-shadow:3px_3px_0_var(--gold)]">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-xl text-lg text-primary-foreground/85 dark:text-muted-foreground">
            {description}
          </p>
        )}

        {after && <div className="mt-6">{after}</div>}
      </div>
    </section>
  );
}