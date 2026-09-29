"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-20 px-4 pb-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border-2 border-foreground bg-primary text-primary-foreground shadow-[6px_6px_0_0_var(--foreground)] dark:border-gold dark:bg-transparent dark:text-foreground dark:shadow-[6px_6px_0_0_var(--gold)]">
        {/* Backdrop — matches every banner's treatment: red + doodle in light, dark texture + red glow in dark */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/light-bg.jpg')] bg-[length:420px_420px] opacity-25 mix-blend-multiply dark:hidden" />

        <div className="pointer-events-none absolute inset-0 z-0 hidden bg-[url('/dark-bg.jpg')] bg-cover opacity-40 dark:block" />
        <div className="pointer-events-none absolute inset-0 z-0 hidden dark:block bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_25%,transparent),transparent)]" />

        {/* Content wrapper — sits above the backdrop */}
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
          {/* Affiliate / Promotional Banner — a light card standing out on the red backdrop
              TODO: /affiliate route + affiliate program not built yet — placeholder per PR notes.
              Confirm with team whether this ships now or stays hidden until the route exists. */}
          <div className="relative mb-12 overflow-hidden rounded-[24px] border-2 border-foreground bg-background px-6 py-10 text-foreground shadow-[4px_4px_0_0_var(--foreground)] sm:px-10 lg:px-12">
            <div className="pointer-events-none absolute right-[-80px] top-1/2 hidden h-[360px] w-[360px] -translate-y-1/2 rounded-full border border-border/50 sm:block">
              <div className="absolute inset-8 rounded-full border border-border/50">
                <div className="absolute inset-8 rounded-full border border-border/50">
                  <div className="absolute inset-8 rounded-full border border-border/50" />
                </div>
              </div>
            </div>

            <div className="relative z-10 max-w-md">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Earn with Mini Mall Pizza
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Join our affiliate program
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                Recommend your favourite products and earn rewards for every
                customer you bring to Mini Mall Pizza.
              </p>

              {/* TODO: /affiliate doesn't exist yet — placeholder link */}
              <Link
                href="#"
                className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-[3px_3px_0_0_var(--foreground)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--foreground)]"
              >
                Become an affiliate
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="pointer-events-none absolute right-[15%] top-1/2 hidden -translate-y-1/2 sm:block">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground bg-background">
                <div className="h-3 w-3 rounded-full border-2 border-foreground" />
              </div>
            </div>
          </div>

          {/* Main Footer */}
          <div className="grid gap-10 border-b border-primary-foreground/20 pb-10 dark:border-foreground/20 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/shop" className="inline-flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground bg-foreground text-background dark:border-gold">
                  <span className="text-xs font-bold">M</span>
                </div>
                <span className="text-base font-semibold tracking-tight text-primary-foreground dark:text-foreground">
                  Mini Mall Pizza
                </span>
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/80 dark:text-muted-foreground">
                Everything you need, all in one place. Discover great products
                and shop with ease.
              </p>
            </div>

            {/* Shop — real, existing routes */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-primary-foreground dark:text-foreground">
                Shop
              </h3>
              <ul className="space-y-3 text-sm text-primary-foreground/80 dark:text-muted-foreground">
                <li>
                  <Link href="/shop/menu" className="transition-opacity hover:opacity-100 dark:hover:text-foreground">
                    All products
                  </Link>
                </li>

                <li>
                  <Link href="/shop/menu" className="transition-opacity hover:opacity-100 dark:hover:text-foreground">
                    Menu
                  </Link>
                </li>

                <li>
                  <Link href="/cart" className="transition-opacity hover:opacity-100 dark:hover:text-foreground">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company — About scrolls to existing on-page section;
                Contact/FAQ/Privacy/Terms have no route yet, so they're
                placeholders (href="#") rather than dead links to real paths.
                TODO: build these pages and swap in real hrefs. */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-primary-foreground dark:text-foreground">
                Company
              </h3>
              <ul className="space-y-3 text-sm text-primary-foreground/80 dark:text-muted-foreground">
                <li>
                  <button
                    onClick={() => scrollToSection("about-us")}
                    className="transition-opacity hover:opacity-100 dark:hover:text-foreground"
                  >
                    About us
                  </button>
                </li>
                <li>
                  <Link href="#" className="transition-opacity hover:opacity-100 dark:hover:text-foreground">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-opacity hover:opacity-100 dark:hover:text-foreground">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1 transition-opacity hover:opacity-100 dark:hover:text-foreground"
                  >
                    Become an affiliate
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter — form has no submit handler yet.
                TODO: wire up to a real subscribe endpoint (e.g. API route / Resend / Mailchimp). */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-primary-foreground dark:text-foreground">
                Newsletter
              </h3>
              <p className="mb-4 text-sm leading-5 text-primary-foreground/80 dark:text-muted-foreground">
                Get product updates, special offers and the latest from Mini
                Mall Pizza.
              </p>

              <form className="flex items-center rounded-full border-2 border-foreground bg-background p-1 shadow-[3px_3px_0_0_var(--foreground)]">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-foreground text-background transition-opacity hover:opacity-90"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar — social links point to generic domains, not real
              handles yet. TODO: swap in actual Instagram/Facebook URLs.
              Magnific credit: tier (free vs premium) unconfirmed — remove if premium. */}
          <div className="flex flex-col gap-4 pt-6 text-xs text-primary-foreground/80 dark:text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Mini Mall Pizza</p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="#" className="transition-opacity hover:opacity-100 dark:hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="transition-opacity hover:opacity-100 dark:hover:text-foreground">
                Terms
              </Link>
              <Link
                href="https://www.magnific.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-100 dark:hover:text-foreground"
              >
                Background photography by Magnific
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}