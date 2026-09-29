"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { PageBanner } from "@/components/page-banner";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";
import { getProductByName } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

/* -------------------------------------------------------------------------- */
/*  Step indicator: three hard-shadow circles, filled in as you progress       */
/* -------------------------------------------------------------------------- */

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Shopping cart", "Checkout details", "Order complete"];

  return (
    <div className="mt-8 flex items-center justify-center">
      {steps.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const done = step < current;
        const active = step === current;

        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  "mx-3 h-0.5 w-10 sm:mx-6 sm:w-20",
                  step <= current ? "bg-foreground" : "bg-primary-foreground/30 dark:bg-border"
                )}
              />
            )}
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-foreground text-xs font-bold",
                  done || active
                    ? "bg-foreground text-background shadow-[2px_2px_0_0_var(--foreground)] dark:border-gold dark:bg-gold dark:text-gold-foreground dark:shadow-[2px_2px_0_0_var(--gold)]"
                    : "bg-transparent text-foreground/50 dark:border-border dark:text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : step}
              </div>
              <span className="ml-2 hidden text-xs font-medium sm:block">
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();

  const { items, totalInCents, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
    },
  });

  async function onSubmit(values: CheckoutFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: values.customerName,
          items: items.map((item) => ({
            productName: item.pizzaName,
            quantity: item.quantity,
            priceInCents: item.priceInCents,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error ?? "Failed to place order.");
        return;
      }

      clearCart();
      setPlacedOrderId(result.id);
    } catch (err) {
      console.error("Failed to place order:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==================================================
  // ORDER COMPLETE
  // ==================================================

  if (placedOrderId) {
    return (
      <div>
        <PageBanner
          title="Order Complete"
          description="Thank you for your order. We've received your request and will begin processing it shortly."
          after={<Steps current={3} />}
        />

        <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-3xl border-2 border-foreground bg-card p-6 text-center shadow-[6px_6px_0_0_var(--foreground)] sm:p-10 dark:border-gold dark:shadow-[6px_6px_0_0_var(--gold)]">
            {/* Success icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--foreground)] dark:border-background dark:bg-gold dark:text-gold-foreground dark:shadow-[3px_3px_0_0_var(--background)]">
              <Check className="h-8 w-8" />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Your order has been placed!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Your order has been successfully received. Please keep your
              order number for reference.
            </p>

            {/* Order ID */}
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border-2 border-foreground bg-background p-5 dark:border-border">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Order Number
              </p>
              <p className="mt-2 break-all font-heading text-lg font-bold text-foreground">
                {placedOrderId}
              </p>
            </div>

            {/* Status */}
            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl border-2 border-foreground p-3 dark:border-border">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Order received</p>
                  <p className="text-xs text-muted-foreground">
                    Your order has been successfully submitted.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border-2 border-foreground/30 p-3 dark:border-border/60">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Preparing your order</p>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll begin preparing your pizzas shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border-2 border-foreground/30 p-3 dark:border-border/60">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Ready for you</p>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll receive your order when it&apos;s ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="h-11 flex-1 rounded-full border-2 border-foreground shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)] dark:border-border dark:shadow-none dark:hover:translate-x-0 dark:hover:translate-y-0"
              >
                <Link href="/shop">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>

              <Button
                type="button"
                className="h-11 flex-1 rounded-full border-2 border-foreground shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[2px_2px_0_0_var(--gold)]"
                onClick={() => router.push(`/track-order/${placedOrderId}`)}
              >
                Track This Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (items.length === 0) {
    return (
      <div>
        <PageBanner title="Checkout" />

        <div className="mx-auto flex min-h-[50vh] max-w-lg items-center justify-center px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-foreground bg-card shadow-[4px_4px_0_0_var(--foreground)] dark:border-primary dark:shadow-[4px_4px_0_0_var(--primary)]">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add some pizzas to your cart before proceeding to checkout.
            </p>

            <Button
              asChild
              className="mt-6 rounded-full border-2 border-foreground px-6 shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[2px_2px_0_0_var(--gold)]"
            >
              <Link href="/shop">
                Browse Pizzas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // CHECKOUT DETAILS
  // ==================================================

  return (
    <div>
      <PageBanner
        title="Checkout Details"
        description="Enter your details below to complete your order."
        after={<Steps current={2} />}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          {/* ==================================================
              LEFT — CUSTOMER DETAILS
          ================================================== */}

          <div>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Your Details
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Tell us who the order is for.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_0_var(--foreground)] sm:p-6 dark:border-primary dark:shadow-[6px_6px_0_0_var(--primary)]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Tendai Moyo"
                            className="h-11 rounded-xl border-2 border-foreground bg-background focus-visible:ring-primary dark:border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-xl border-2 border-foreground/20 bg-muted/30 p-4 dark:border-border">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-background dark:border-border">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Your information is secure
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          We only use your details to process and fulfill your
                          order.
                        </p>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-3">
                      <p className="text-sm text-destructive">
                        {submitError}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-full border-2 border-foreground text-sm font-semibold shadow-[4px_4px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)] dark:border-gold dark:shadow-[4px_4px_0_0_var(--gold)] dark:hover:shadow-[2px_2px_0_0_var(--gold)]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Placing order..."
                    ) : (
                      <>
                        Place Order
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="mt-5">
              <Button
                asChild
                variant="ghost"
                className="group rounded-full px-0 hover:bg-transparent"
              >
                <Link href="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Cart
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

              <div className="mt-5 space-y-4">
                {items.map((item) => {
                  const product = getProductByName(item.pizzaName);

                  return (
                    <div
                      key={item.pizzaName}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/40">
                          {product ? (
                            <Image
                              src={product.image}
                              alt={item.pizzaName}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <ShoppingBag className="h-4 w-4 text-muted-foreground/60" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.pizzaName}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-gold">
                        {formatPrice(item.priceInCents * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="my-6 h-px bg-border" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(totalInCents)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Calculated later
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Total</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current order total
                  </p>
                </div>
                <p className="font-heading text-2xl font-extrabold tracking-tight text-gold">
                  {formatPrice(totalInCents)}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
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