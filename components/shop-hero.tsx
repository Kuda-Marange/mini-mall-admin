"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type MenuData = {
  id: number;
  img: string;
  imgAlt: string;
  description: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ShopHero({ menudata }: { menudata: MenuData[] }) {
  const [current, setCurrent] = useState(0);

  const root = useRef<HTMLElement>(null);
  const pizza = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const index = useRef(0);
  const busy = useRef(false);
  const paused = useRef(false);
  const intro = useRef<gsap.core.Timeline | null>(null);

  // The one orchestrated moment: page-load sequence.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.current = tl;

        tl.from("[data-hero-line]", { yPercent: 115, duration: 0.9, stagger: 0.12 })
          .from(
            pizza.current,
            { scale: 0.55, rotate: -30, autoAlpha: 0, duration: 1.1, ease: "back.out(1.3)" },
            0.15
          )
          .from(
            "[data-hero-fade]",
            { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.1 },
            "-=0.6"
          )
          .from(
            caption.current,
            { y: 12, autoAlpha: 0, duration: 0.5 },
            "-=0.5"
          )
          .from(
            "[data-hero-thumb]",
            { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.05 },
            "-=0.4"
          );

        gsap.to("[data-hero-glow]", {
          opacity: 0.7,
          scale: 1.06,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: root }
  );

  // Responds to a person's action (or autoplay): the pizza spins out, the next spins in.
  const goTo = useCallback((next: number) => {
    if (next === index.current || busy.current) return;
    if (intro.current?.isActive()) return;

    if (prefersReducedMotion()) {
      index.current = next;
      setCurrent(next);
      return;
    }

    busy.current = true;

    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(pizza.current, {
        rotate: -70,
        scale: 0.6,
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.in",
      })
      .to(caption.current, { y: -10, autoAlpha: 0, duration: 0.25 }, 0)
      .add(() => {
        index.current = next;
        setCurrent(next);
      })
      .fromTo(
        pizza.current,
        { rotate: 70, scale: 0.6 },
        { rotate: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.5)" }
      )
      .fromTo(
        caption.current,
        { y: 12 },
        { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" },
        "<0.15"
      );
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || menudata.length < 2) return;

    const id = setInterval(() => {
      if (!paused.current) goTo((index.current + 1) % menudata.length);
    }, 4500);

    return () => clearInterval(id);
  }, [goTo, menudata.length]);

  const item = menudata[current];
  if (!item) return null;

  return (
    <section
      id="home"
      ref={root}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_70%_at_75%_45%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-20">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6 max-lg:items-center max-lg:text-center">
          <h1 className="font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden pb-1">
              <span data-hero-line className="block">
                Fresh pizza,
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-hero-line className="block text-primary">
                made to order
              </span>
            </span>
          </h1>

          <p
            data-hero-fade
            className="max-w-md text-lg leading-7 text-muted-foreground"
          >
            Seven pizzas, hand-tossed and baked fresh. Pick your favourite and
            check out in minutes.
          </p>

          <div data-hero-fade className="flex flex-wrap gap-3 max-lg:justify-center">
            <Button asChild size="lg" className="rounded-full px-7 text-base">
              <Link href="/shop/menu">Order now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7 text-base"
            >
              <Link href="#about-us">Our story</Link>
            </Button>
          </div>
        </div>

        {/* Pizza + selector */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative aspect-square w-full max-w-[480px]">
            <div
              data-hero-glow
              aria-hidden
              className="absolute inset-[8%] rounded-full bg-primary/40 blur-3xl"
            />
            <div ref={pizza} className="absolute inset-0">
              <Image
                src={item.img}
                alt={item.imgAlt}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 480px"
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>

          <div ref={caption} className="min-h-16 max-w-sm text-center">
            <p className="font-heading text-xl font-bold">{item.imgAlt}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {menudata.map((m, i) => (
              <button
                key={m.id}
                data-hero-thumb
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${m.imgAlt}`}
                aria-current={i === current}
                className={cn(
                  "size-14 rounded-full border bg-card p-1.5 transition-colors duration-200 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  i === current ? "border-primary" : "border-border"
                )}
              >
                <Image
                  src={m.img}
                  alt=""
                  width={56}
                  height={56}
                  className="size-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}