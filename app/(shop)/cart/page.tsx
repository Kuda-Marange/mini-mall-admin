"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { PageBanner } from "@/components/page-banner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";
import { getProductByName } from "@/lib/products";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalInCents } = useCart();

  // --------------------------------------------------
  // Empty cart
  // --------------------------------------------------

  if (items.length === 0) {
    return (
      <div>
        <PageBanner title="Your Cart" />

        <div className="mx-auto flex min-h-[50vh] max-w-2xl items-center justify-center px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-foreground bg-card shadow-[4px_4px_0_0_var(--foreground)] dark:border-primary dark:shadow-[4px_4px_0_0_var(--primary)]">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Looks like you haven&apos;t added any pizzas yet. Browse our menu
              and find something delicious.
            </p>

            <Button
              asChild
              className="mt-6 rounded-full border-2 border-foreground px-6 shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[2px_2px_0_0_var(--gold)]"
            >
              <Link href="/shop/menu">
                Browse Pizzas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Calculate number of products
  // --------------------------------------------------

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      <PageBanner
        title="Your Cart"
        description={`${totalItems} ${totalItems === 1 ? "item" : "items"} ready for checkout.`}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          {/* ==================================================
              LEFT — CART ITEMS
          ================================================== */}

          <div>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Your Order
              </h2>

              <button
                type="button"
                onClick={() => {
                  items.forEach((item) => removeItem(item.pizzaName));
                }}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Delete all
              </button>
            </div>

            {/* ==================================================
                CART CARD
            ================================================== */}

            <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)] dark:border-primary dark:shadow-[6px_6px_0_0_var(--primary)]">
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const product = getProductByName(item.pizzaName);

                  return (
                    <div
                      key={item.pizzaName}
                      className="flex gap-4 p-4 sm:gap-5 sm:p-5"
                    >
                      {/* Product image */}

                      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/40 sm:h-24 sm:w-24">
                        {product ? (
                          <Image
                            src={product.image}
                            alt={item.pizzaName}
                            fill
                            sizes="96px"
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <ShoppingBag className="h-7 w-7 text-muted-foreground/40" />
                        )}
                      </div>

                      {/* Product information */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="truncate font-heading text-base font-bold text-foreground sm:text-lg">
                              {item.pizzaName}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Pizza
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.pizzaName)}
                            aria-label={`Remove ${item.pizzaName}`}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price + quantity */}

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gold">
                              {formatPrice(item.priceInCents)}
                            </p>

                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              each
                            </p>
                          </div>

                          {/* Quantity controls */}

                          <div className="flex items-center rounded-full border-2 border-foreground bg-background p-1 dark:border-border">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.pizzaName,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Decrease quantity of ${item.pizzaName}`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="w-8 text-center text-xs font-medium text-foreground">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.pizzaName, item.quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label={`Increase quantity of ${item.pizzaName}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ==================================================
                CONTINUE SHOPPING
            ================================================== */}

            <div className="mt-5">
              <Button
                asChild
                variant="ghost"
                className="group rounded-full px-0 hover:bg-transparent"
              >
                <Link href="/shop/menu">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* ==================================================
              RIGHT — ORDER SUMMARY
          ================================================== */}

          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_0_var(--foreground)] sm:p-6 dark:border-gold dark:shadow-[6px_6px_0_0_var(--gold)]">
              <h2 className="text-base font-semibold text-foreground">
                Order Summary
              </h2>

              <div className="my-6 h-px bg-border" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatPrice(totalInCents)}
                </span>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="flex items-end justify-between">
                <p className="text-sm font-medium text-foreground">Total</p>
                <p className="font-heading text-2xl font-extrabold tracking-tight text-gold">
                  {formatPrice(totalInCents)}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="mt-6 h-12 w-full rounded-full border-2 border-foreground text-sm font-semibold shadow-[4px_4px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)] dark:border-gold dark:shadow-[4px_4px_0_0_var(--gold)] dark:hover:shadow-[2px_2px_0_0_var(--gold)]"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <Check className="h-3.5 w-3.5" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}