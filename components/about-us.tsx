"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChefHat, Pizza, Clock3, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  {
    icon: Pizza,
    target: 7,
    suffix: "",
    title: "Pizzas on the menu",
    description: "A carefully selected menu of customer favourites.",
  },
  {
    icon: ChefHat,
    target: 5,
    suffix: "",
    title: "Years of experience",
    description: "Years of perfecting the art of great pizza.",
  },
  {
    icon: Clock3,
    target: 2000,
    suffix: "+",
    title: "Orders served",
    description: "Fresh pizzas made and enjoyed by our customers.",
  },
];

export function AboutUs() {
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
  () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const numberEls = Array.from(
      statsRef.current?.querySelectorAll<HTMLSpanElement>(
        "[data-stat-value]",
      ) ?? [],
    );

    if (reduceMotion) {
      numberEls.forEach((el) => {
        el.textContent = `${el.dataset.target}${el.dataset.suffix ?? ""}`;
      });
      return;
    }

    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        numberEls.forEach((el) => {
          const target = Number(el.dataset.target);
          const suffix = el.dataset.suffix ?? "";
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(counter.value)}${suffix}`;
            },
          });
        });
      },
    });
  },
  { scope: statsRef },
);

  return (
    <section
      id="about-us"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Section backdrop */}
      <div className="absolute inset-0 -z-20 bg-muted/30 dark:bg-transparent" />
      <div className="absolute inset-0 -z-20 hidden dark:block bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Block 1: photo left, copy right */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-2xl dark:bg-primary/20" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-foreground shadow-[6px_6px_0_0_var(--foreground)] dark:border-primary dark:shadow-[6px_6px_0_0_var(--primary)]">
              <Image
                src="/chef.jpg"
                alt="Chef hand-tossing a fresh pizza in the kitchen"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center rounded-full border-2 border-foreground bg-background px-3 py-1 text-xs font-semibold shadow-[3px_3px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)]">
              About Us
            </span>

            <h2 className="mt-4 max-w-lg text-balance font-heading text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              Fresh pizza, made simple.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              We keep the menu small and the pizzas fresh. Every order is
              made when you place it, using simple ingredients and plenty of
              care.
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-7 rounded-full border-2 border-foreground shadow-[3px_3px_0_0_var(--foreground)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[1px_1px_0_0_var(--gold)]"
            >
              <Link href="/shop/menu">
                Explore our menu
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>


        {/* Block 2: copy left, photo right — flipped from block 1 */}
        <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center rounded-full border-2 border-foreground bg-background px-3 py-1 text-xs font-semibold shadow-[3px_3px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)]">
              Our Story
            </span>

            <h2 className="mt-4 max-w-lg text-balance font-heading text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl">
              From one small kitchen to your table.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Mini Mall Pizza started with a simple idea: keep the menu
              small, keep the ingredients honest, and make every pizza the
              same care as the first one we ever sold.
            </p>
          </div>

          <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-foreground shadow-[6px_6px_0_0_var(--foreground)] dark:border-primary dark:shadow-[6px_6px_0_0_var(--primary)]">
              <Image
                src="/kitchenn.jpg"
                alt="Inside the Mini Mall Pizza kitchen"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}