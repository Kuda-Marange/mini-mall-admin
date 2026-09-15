import { ChefHat, Pizza, Clock3, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  {
    icon: Pizza,
    value: "7",
    title: "Pizzas on the menu",
    description: "A carefully selected menu of customer favourites.",
  },
  {
    icon: ChefHat,
    value: "5",
    title: "Years of experience",
    description: "Years of perfecting the art of great pizza.",
  },
  {
    icon: Clock3,
    value: "2000+",
    title: "Orders served",
    description: "Fresh pizzas made and enjoyed by our customers.",
  },
];

export function AboutUs() {
  return (
    <section
      id="about-us"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[70%] -translate-y-1/2 bg-muted/60 [clip-path:polygon(0_12%,100%_0,100%_88%,0_100%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16 lg:mb-20">
          <Badge
            variant="outline"
            className="mb-5 h-auto rounded-full px-3 py-1 text-sm font-normal"
          >
            About Us
          </Badge>

          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Fresh pizza, made simple.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            We keep the menu small and the pizzas fresh. Every order is made
            when you place it, using simple ingredients and plenty of care.
          </p>

          <Button asChild variant="outline" className="mt-7">
            <Link href="/shop/menu">
              Explore our menu
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid overflow-hidden rounded-2xl border bg-background shadow-sm sm:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`group relative flex flex-col items-center px-6 py-9 text-center transition-colors hover:bg-muted/30 sm:px-8 sm:py-10 ${
                  index !== stats.length - 1
                    ? "border-b sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                {/* Icon */}
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-6" />
                </div>

                {/* Number */}
                <span className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  {stat.value}
                </span>

                {/* Title */}
                <h3 className="mt-2 font-medium">{stat.title}</h3>

                {/* Description */}
                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}