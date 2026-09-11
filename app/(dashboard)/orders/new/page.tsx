"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orderFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),
  pizzaName: z.string().min(1, "Please select a pizza"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const PIZZA_OPTIONS = [
  { name: "Margherita", priceInCents: 899 },
  { name: "Pepperoni", priceInCents: 1099 },
  { name: "Hawaiian", priceInCents: 999 },
  { name: "Veggie", priceInCents: 899 },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      pizzaName: "",
      quantity: 1,
    },
  });

  async function onSubmit(values: OrderFormValues) {
    const selectedPizza = PIZZA_OPTIONS.find(
      (p) => p.name === values.pizzaName
    );
    const amountInCents = (selectedPizza?.priceInCents ?? 0) * values.quantity;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: values.customerName,
          pizzaName: values.pizzaName,
          amountInCents,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error ?? "Failed to create order.");
        return;
      }

      router.push("/orders");
    } catch (err) {
      console.error("Failed to create order:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading text-foreground">Create Order</h1>

      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-heading">Order details</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <FormLabel>Customer name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tendai Moyo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pizzaName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pizza</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pizza" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PIZZA_OPTIONS.map((pizza) => (
                            <SelectItem key={pizza.name} value={pizza.name}>
                              {pizza.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating…" : "Create Order"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}