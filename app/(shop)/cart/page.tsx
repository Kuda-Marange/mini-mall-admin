"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalInCents } = useCart();

  // --------------------------------------------------
  // Empty cart
  // --------------------------------------------------

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Your cart is empty
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Looks like you haven&apos;t added any pizzas yet. Browse our menu and
              find something delicious.
            </p>

            <Button asChild className="mt-6 rounded-full px-6">
              <Link href="/shop/menu">
                Browse Pizzas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Calculate number of products
  // --------------------------------------------------

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="min-h-screen bg-background">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Your Order
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your Shopping Cart
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Review your pizzas before continuing to checkout.
          </p>
        </div>
      </section>

      {/* ==================================================
          CART CONTENT
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          {/* ==================================================
              LEFT — CART ITEMS
          ================================================== */}

          <div>
            {/* Cart heading */}

            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Your Cart
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </p>
              </div>

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

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="divide-y divide-border/60">
                {items.map((item) => (
                  <div
                    key={item.pizzaName}
                    className="group flex gap-4 p-4 transition-colors hover:bg-muted/20 sm:gap-5 sm:p-5"
                  >
                    {/* Product placeholder */}

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24">
                      <ShoppingBag className="h-7 w-7 text-muted-foreground/40" />
                    </div>

                    {/* Product information */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                            {item.pizzaName}
                          </h3>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Pizza
                          </p>
                        </div>

                        {/* Delete */}

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
                          <p className="text-sm font-semibold text-foreground">
                            {formatPrice(item.priceInCents)}
                          </p>

                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            each
                          </p>
                        </div>

                        {/* Quantity controls */}

                        <div className="flex items-center rounded-full border border-border bg-background p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.pizzaName,
                                Math.max(1, item.quantity - 1),
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
                ))}
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

          <div className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                Order Summary
              </h2>

              {/* Divider */}

              <div className="my-6 h-px bg-border" />

              {/* Summary */}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>

                <span className="font-medium text-foreground">
                  {formatPrice(totalInCents)}
                </span>
              </div>

              {/* Divider */}

              <div className="my-5 h-px bg-border" />

              {/* Total */}

              <div className="flex items-end justify-between">
                <p className="text-sm font-medium text-foreground">Total</p>

                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {formatPrice(totalInCents)}
                </p>
              </div>

              {/* Checkout */}

              <Button
                asChild
                size="lg"
                className="mt-6 h-12 w-full rounded-full text-sm font-medium shadow-sm"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Secure checkout */}

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <Check className="h-3.5 w-3.5" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}