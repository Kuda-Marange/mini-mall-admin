"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";
import type { Product, ProductBadge } from "@/lib/products";
import { cn } from "@/lib/utils";

const badgeStyles: Record<ProductBadge, string> = {
  "Best Seller": "bg-primary text-primary-foreground",
  Veg: "bg-success text-success-foreground",
  Spicy: "bg-orange-600 text-white",
  New: "bg-gold text-gold-foreground",
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const href = `/shop/${encodeURIComponent(product.name)}`;

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
    <article
      data-reveal
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary/60"
    >
      {product.badge && (
        <span
          className={cn(
            "absolute left-3 top-3 z-10 rounded-md px-2.5 py-1 text-xs font-semibold",
            badgeStyles[product.badge]
          )}
        >
          {product.badge}
        </span>
      )}

      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-muted/40"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-heading text-lg font-bold">
          <Link href={href} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-lg font-semibold text-gold">
            {formatPrice(product.priceInCents)}
          </span>

          <Button
            ref={buttonRef}
            type="button"
            size="sm"
            onClick={handleAdd}
            className="rounded-full px-4"
            aria-label={`Add ${product.name} to cart`}
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
                  Add to cart
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
}