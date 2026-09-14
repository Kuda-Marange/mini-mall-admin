"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    defaultValues: { customerName: "" },
  });

  async function onSubmit(values: CheckoutFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  if (placedOrderId) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Order placed!</h1>
        <p className="text-muted-foreground">
          Your order <span className="font-medium">{placedOrderId}</span> has
          been received.
        </p>
        <Button asChild className="w-full">
          <Link href="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center space-y-4">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild>
          <Link href="/shop">Browse pizzas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-heading">Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item) => (
            <div key={item.pizzaName} className="flex justify-between text-sm">
              <span>
                {item.pizzaName} × {item.quantity}
              </span>
              <span>{formatPrice(item.priceInCents * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(totalInCents)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-heading">Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tendai Moyo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Placing order…" : "Place order"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}