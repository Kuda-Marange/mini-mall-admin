"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, Check, Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";
import { PRODUCTS, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const productHref = (product: Product) =>
  `/shop/${encodeURIComponent(product.name)}`;

/* -------------------------------------------------------------------------- */
/*  Add to cart button (hard-shadow style, pops when clicked)                  */
/* -------------------------------------------------------------------------- */

function AddButton({
  product,
  tone,
}: {
  product: Product;
  tone: "featured" | "card";
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleAdd() {
    addItem(
      { pizzaName: product.name, priceInCents: product.priceInCents },
      1
    );

    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);

    if (
      buttonRef.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.88 },
        { scale: 1, duration: 0.5, ease: "back.out(3)", clearProps: "transform" }
      );
    }
  }

  return (
    <Button
      ref={buttonRef}
      type="button"
      size={tone === "featured" ? "lg" : "sm"}
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className={cn(
        "rounded-full border-2 border-foreground px-4 shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)]",
        tone === "featured"
          ? "dark:border-background dark:bg-gold dark:text-gold-foreground dark:shadow-[3px_3px_0_0_var(--background)] dark:hover:bg-gold/90 dark:hover:shadow-[2px_2px_0_0_var(--background)]"
          : "dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[2px_2px_0_0_var(--gold)]"
      )}
    >
      <span aria-live="polite" className="inline-flex items-center gap-1.5">
        {added ? (
          <>
            <Check className="size-4" />
            Added
          </>
        ) : (
          <>
            <Plus className="size-4" />
            {tone === "featured" ? "Add to cart" : "Add"}
          </>
        )}
      </span>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*  The big card: one pizza breaks out of its frame and turns as you scroll     */
/* -------------------------------------------------------------------------- */

function FeaturedPick({ product }: { product: Product }) {
  const card = useRef<HTMLElement>(null);
  const pizza = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          pizza.current,
          { rotate: -25 },
          {
            rotate: 25,
            ease: "none",
            scrollTrigger: {
              trigger: card.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });
    },
    { scope: card }
  );

  const href = productHref(product);

  return (
    <article
      ref={card}
      data-reveal
      className="relative flex flex-col justify-end rounded-3xl border-2 border-foreground bg-[oklch(0.9_0.16_92)] p-6 text-foreground shadow-[8px_8px_0_0_var(--foreground)] sm:p-8 lg:col-span-7 lg:min-h-[440px] lg:pr-[54%] dark:border-gold dark:bg-primary dark:text-primary-foreground dark:shadow-[8px_8px_0_0_var(--gold)]"
    >
      {product.badge && (
        <span className="absolute -left-3 top-6 z-20 -rotate-6 rounded-md border-2 border-foreground bg-card px-3 py-1 text-sm font-bold text-foreground shadow-[3px_3px_0_0_var(--foreground)] dark:border-background dark:bg-gold dark:text-gold-foreground dark:shadow-[3px_3px_0_0_var(--background)]">
          {product.badge}
        </span>
      )}

      {/* Price sticker */}
      <span className="absolute right-4 top-4 z-20 flex size-20 -rotate-[8deg] items-center justify-center rounded-full border-2 border-foreground bg-primary font-heading text-lg font-extrabold text-primary-foreground shadow-[3px_3px_0_0_var(--foreground)] sm:size-24 sm:text-xl dark:border-background dark:bg-gold dark:text-gold-foreground dark:shadow-[3px_3px_0_0_var(--background)]">
        {formatPrice(product.priceInCents)}
      </span>

      {/* Pizza (in flow on mobile, breaking out of the frame on desktop) */}
      <div
        ref={pizza}
        className="relative mx-auto -mt-16 mb-4 aspect-square w-[72%] max-w-[300px] lg:absolute lg:-right-6 lg:top-1/2 lg:mx-0 lg:mb-0 lg:mt-0 lg:w-[56%] lg:max-w-none lg:-translate-y-1/2"
      >
        <Link href={href} aria-label={`View ${product.name}`} className="relative block size-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 72vw, 400px"
            className="object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.35)]"
          />
        </Link>
      </div>

      <div className="relative z-10">
        <h3 className="font-heading text-3xl font-extrabold sm:text-4xl">
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className="mt-2 max-w-xs text-base text-foreground/75 dark:text-primary-foreground/85">
          {product.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <AddButton product={product} tone="featured" />
          <Link
            href={href}
            className="text-sm font-semibold underline underline-offset-4"
          >
            See details
          </Link>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  The two supporting cards                                                   */
/* -------------------------------------------------------------------------- */

function CompactPick({ product }: { product: Product }) {
  const href = productHref(product);

  return (
    <article
      data-reveal
      className="relative flex items-center gap-4 rounded-2xl border-2 border-foreground bg-card p-4 text-card-foreground shadow-[5px_5px_0_0_var(--foreground)] sm:gap-5 sm:p-5 dark:border-primary dark:shadow-[5px_5px_0_0_var(--primary)]"
    >
      <Link
        href={href}
        aria-label={`View ${product.name}`}
        className="relative size-28 shrink-0 sm:size-32"
      >
        <span
          aria-hidden
          className="absolute inset-1 rounded-full bg-primary/15 dark:bg-primary/25"
        />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="128px"
          className="object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)]"
        />
      </Link>

      <div className="min-w-0 flex-1">
        {product.badge && (
          <span className="mb-1 inline-block rounded-md bg-foreground px-2 py-0.5 text-xs font-semibold text-background dark:bg-gold dark:text-gold-foreground">
            {product.badge}
          </span>
        )}
        <h3 className="font-heading text-lg font-bold">
          <Link href={href} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-gold">
            {formatPrice(product.priceInCents)}
          </span>
          <AddButton product={product} tone="card" />
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export function PopularPicks() {
  const featured =
    PRODUCTS.find((p) => p.badge === "Best Seller") ?? PRODUCTS[0];

  if (!featured) return null;

  const others = PRODUCTS.filter((p) => p !== featured).slice(0, 2);

  return (
    <section
      id="popular-picks"
      className="relative isolate overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20 lg:py-24 dark:bg-transparent dark:text-foreground"
    >
      {/* Light mode: the doodle pattern again, soaked into the red */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/light-bg.jpg')] bg-[length:420px_420px] opacity-25 mix-blend-multiply dark:hidden"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight [text-shadow:3px_3px_0_var(--foreground)] sm:text-4xl lg:text-5xl dark:[text-shadow:3px_3px_0_var(--primary)]">
              A few favourites to start with
            </h2>
            <p className="mt-3 max-w-md text-lg text-primary-foreground/85 dark:text-muted-foreground">
              Not sure where to start? These are a great first order.
            </p>
          </div>

          <Link
            href="/shop/menu"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold underline underline-offset-4 dark:text-gold"
          >
            View full menu
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Reveal className="mt-20 grid items-center gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
          <FeaturedPick product={featured} />

          <div className="flex flex-col gap-8 lg:col-span-5">
            {others.map((product) => (
              <CompactPick key={product.name} product={product} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}