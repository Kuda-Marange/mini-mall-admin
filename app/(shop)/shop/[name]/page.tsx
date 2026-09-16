"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { getProductByName } from "@/lib/products";
import { formatPrice } from "@/lib/format-price";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: Promise<{ name: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { name } = use(params);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const foundProduct = getProductByName(name);

  if (!foundProduct) {
    notFound();
    return null;
  }

  const product = foundProduct;

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function handleAddToCart() {
    addItem(
      {
        pizzaName: product.name,
        priceInCents: product.priceInCents,
      },
      quantity
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Product Card */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm sm:rounded-3xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* =====================================================
                PRODUCT IMAGE
            ====================================================== */}
            <div className="relative flex min-h-[360px] items-center justify-center bg-muted/30 p-5 sm:min-h-[500px] sm:p-10 lg:min-h-[620px]">
              {/* Soft background decoration */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl sm:h-[400px] sm:w-[400px]" />

              {/* Image container */}
              <div className="relative z-10 aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl bg-background shadow-lg sm:max-w-[420px] sm:rounded-3xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 420px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* =====================================================
                PRODUCT INFORMATION
            ====================================================== */}
            <div className="flex flex-col p-5 sm:p-8 lg:p-12">
              <div className="flex-1">
                {/* Small label */}
                <div className="mb-4">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                    Available
                  </span>
                </div>

                {/* Product name */}
                <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {formatPrice(product.priceInCents)}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Price per item
                  </p>
                </div>

                {/* Divider */}
                <div className="my-7 h-px bg-border" />

                {/* Quantity */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Quantity
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {quantity}{" "}
                      {quantity === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="flex w-fit items-center rounded-xl border border-border bg-background p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-9 w-9 rounded-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>

                    <div className="flex h-9 min-w-12 items-center justify-center px-2">
                      <span className="text-sm font-medium">
                        {quantity}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-9 w-9 rounded-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Product benefits */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Truck className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-foreground">
                        Fast delivery
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        Delivered to your door
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-foreground">
                        Secure checkout
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        Safe and secure ordering
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =====================================================
                  CTA
              ====================================================== */}
              <div className="mt-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="h-12 w-full rounded-xl text-sm font-medium shadow-sm transition-all sm:h-13"
                >
                  {added ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to cart
                    </>
                  )}
                </Button>

                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  You can review your items before completing your order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            LOWER INFORMATION SECTION
        ========================================================== */}
        <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-card p-4 sm:p-5">
            <p className="text-xs font-medium text-foreground">
              Quality products
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Carefully selected products available through Mini Mall.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-4 sm:p-5">
            <p className="text-xs font-medium text-foreground">
              Simple ordering
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Add your products to the cart and complete your order with ease.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-4 sm:p-5">
            <p className="text-xs font-medium text-foreground">
              Secure experience
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Your shopping experience is designed with security in mind.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}