"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";
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

const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

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
      <main className="min-h-screen bg-background">
        {/* Header */}

        <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Order Confirmation
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Order Complete
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Thank you for your order. We&apos;ve received your request and
              will begin processing it shortly.
            </p>
          </div>

          {/* Progress */}

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex items-center justify-center">
              {/* Step 1 */}

              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-4 w-4" />
                </div>

                <span className="ml-2 hidden text-xs font-medium sm:block">
                  Shopping cart
                </span>
              </div>

              <div className="mx-3 h-px w-10 bg-foreground sm:mx-6 sm:w-20" />

              {/* Step 2 */}

              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-4 w-4" />
                </div>

                <span className="ml-2 hidden text-xs font-medium sm:block">
                  Checkout details
                </span>
              </div>

              <div className="mx-3 h-px w-10 bg-foreground sm:mx-6 sm:w-20" />

              {/* Step 3 */}

              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-4 w-4" />
                </div>

                <span className="ml-2 hidden text-xs font-medium sm:block">
                  Order complete
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Confirmation */}

        <section className="mx-auto max-w-2xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/60 bg-card p-6 text-center shadow-sm sm:p-10">
            {/* Success icon */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="h-6 w-6" />
              </div>
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Your order has been placed!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Your order has been successfully received. Please keep your
              order number for reference.
            </p>

            {/* Order ID */}

            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-muted/40 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Order Number
              </p>

              <p className="mt-2 break-all text-lg font-semibold text-foreground">
                {placedOrderId}
              </p>
            </div>

            {/* Status */}

            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-3.5 w-3.5" />
                </div>

                <div>
                  <p className="text-sm font-medium">Order received</p>
                  <p className="text-xs text-muted-foreground">
                    Your order has been successfully submitted.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Preparing your order
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll begin preparing your pizzas shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
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
                className="h-11 flex-1 rounded-full"
              >
                <Link href="/shop">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>

              <Button
                type="button"
                className="h-11 flex-1 rounded-full"
                onClick={() => router.push("/")}
              >
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add some pizzas to your cart before proceeding to checkout.
            </p>

            <Button asChild className="mt-6 rounded-full px-6">
              <Link href="/shop">
                Browse Pizzas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ==================================================
  // CHECKOUT DETAILS
  // ==================================================

  return (
    <main className="min-h-screen bg-background">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Almost There
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Checkout Details
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Enter your details below to complete your order.
          </p>
        </div>

        {/* ==================================================
            CHECKOUT STEPS
        ================================================== */}

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex items-center justify-center">
            {/* Step 1 */}

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="h-4 w-4" />
              </div>

              <span className="ml-2 hidden text-xs font-medium sm:block">
                Shopping cart
              </span>
            </div>

            {/* Connector */}

            <div className="mx-3 h-px w-10 bg-foreground sm:mx-6 sm:w-20" />

            {/* Step 2 */}

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium">
                2
              </div>

              <span className="ml-2 hidden text-xs font-medium sm:block">
                Checkout details
              </span>
            </div>

            {/* Connector */}

            <div className="mx-3 h-px w-10 bg-border sm:mx-6 sm:w-20" />

            {/* Step 3 */}

            <div className="flex items-center text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                3
              </div>

              <span className="ml-2 hidden text-xs font-medium sm:block">
                Order complete
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CHECKOUT CONTENT
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
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

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* ==================================================
                      CUSTOMER NAME
                  ================================================== */}

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
                            className="h-11 rounded-xl bg-background"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Information */}

                  <div className="rounded-xl bg-muted/30 p-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background">
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

                  {/* Error */}

                  {submitError && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                      <p className="text-sm text-destructive">
                        {submitError}
                      </p>
                    </div>
                  )}

                  {/* Submit */}

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-full text-sm font-medium"
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

            {/* Back */}

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

          <div className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                Order Summary
              </h2>

              {/* Products */}

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.pizzaName}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground/60" />
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

                    <p className="shrink-0 text-sm font-medium text-foreground">
                      {formatPrice(item.priceInCents * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}

              <div className="my-6 h-px bg-border" />

              {/* Price */}

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>

                  <span className="font-medium text-foreground">
                    {formatPrice(totalInCents)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Delivery
                  </span>

                  <span className="text-xs font-medium text-muted-foreground">
                    Calculated later
                  </span>
                </div>
              </div>

              {/* Divider */}

              <div className="my-5 h-px bg-border" />

              {/* Total */}

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Total
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Current order total
                  </p>
                </div>

                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {formatPrice(totalInCents)}
                </p>
              </div>

              {/* Security */}

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
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