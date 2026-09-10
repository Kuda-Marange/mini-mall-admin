"use client";

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

import { orders } from "@/lib/orders-data";
import { type Order } from "@/lib/types";

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

/** Finds the highest existing "ORD-XXX" number and returns the next one, e.g. "ORD-031". */
function getNextOrderId(): string {
  const lastNumber =
    orders.length > 0
      ? Math.max(...orders.map((o) => parseInt(o.id.replace("ORD-", ""), 10)))
      : 0;
  const nextNumber = lastNumber + 1;
  return `ORD-${String(nextNumber).padStart(3, "0")}`;
}

export default function NewOrderPage() {
  const router = useRouter();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      pizzaName: "",
      quantity: 1,
    },
  });

  function onSubmit(values: OrderFormValues) {
    const selectedPizza = PIZZA_OPTIONS.find(
      (p) => p.name === values.pizzaName
    );
    const amountInCents = (selectedPizza?.priceInCents ?? 0) * values.quantity;

    const newOrder: Order = {
      id: getNextOrderId(),
      customerName: values.customerName,
      pizzaName: values.pizzaName,
      amountInCents,
      status: "pending",
      orderedAt: new Date().toISOString().split("T")[0],
    };

    // Mutates the shared, imported `orders` array directly — every other
    // page importing `orders` sees this new entry too, until the dev
    // server restarts or the page is refreshed (no real backend/database
    // behind this fixture data — see project notes on that limitation).
    orders.push(newOrder);

    router.push("/orders");
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

                <Button type="submit" className="w-full">
                  Create Order
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
