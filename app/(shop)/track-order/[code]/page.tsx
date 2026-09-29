import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Circle, X } from "lucide-react";

import { PageBanner } from "@/components/page-banner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { mapOrderRow, type OrderRow } from "@/lib/order-mapper";
import { formatPrice } from "@/lib/format-price";
import { getProductByName } from "@/lib/products";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

interface LookupRow {
  id: string;
  customer_name: string;
  pizza_name: string;
  amount_in_cents: number;
  status: OrderStatus;
  ordered_at: string;
  item_product_name: string;
  item_quantity: number;
  item_price_in_cents: number;
}

async function getOrder(code: string): Promise<Order | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_order_by_code", {
    order_code: code.trim().toUpperCase(),
  });

  if (error) {
    console.error("Failed to look up order:", error);
    return null;
  }

  const rows = data as LookupRow[] | null;
  if (!rows || rows.length === 0) return null;

  const [first] = rows;
  const row: OrderRow = {
    id: first.id,
    customer_name: first.customer_name,
    pizza_name: first.pizza_name,
    amount_in_cents: first.amount_in_cents,
    status: first.status,
    ordered_at: first.ordered_at,
    order_items: rows.map((r) => ({
      product_name: r.item_product_name,
      quantity: r.item_quantity,
      price_in_cents: r.item_price_in_cents,
    })),
  };

  return mapOrderRow(row);
}

const STEPS: { status: OrderStatus; label: string; note: string }[] = [
  {
    status: "pending",
    label: "Order received",
    note: "We've got your order and it's in the queue.",
  },
  {
    status: "shipped",
    label: "Out for delivery",
    note: "Your pizzas are on their way to you.",
  },
  {
    status: "delivered",
    label: "Delivered",
    note: "Enjoy! This order is complete.",
  },
];

const STEP_ORDER: OrderStatus[] = ["pending", "shipped", "delivered"];

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl border-2 border-destructive/40 bg-destructive/5 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10 text-destructive">
          <X className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-destructive">
            This order was cancelled
          </p>
          <p className="text-xs text-muted-foreground">
            If this doesn&apos;t look right, get in touch and we&apos;ll sort
            it out.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEP_ORDER.indexOf(status);

  return (
    <div className="space-y-3">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;

        return (
          <div
            key={step.status}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-3",
              active
                ? "border-foreground dark:border-primary"
                : "border-foreground/20 dark:border-border"
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                done || active
                  ? "bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {done || active ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Circle className="h-2 w-2 fill-current" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const order = await getOrder(code);

  if (!order) {
    return (
      <div>
        <PageBanner title="Order Not Found" />

        <section className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-muted-foreground">
            We couldn&apos;t find an order matching{" "}
            <span className="font-medium text-foreground">{code}</span>. Check
            the code from your receipt and try again.
          </p>

          <Button
            asChild
            className="mt-6 rounded-full border-2 border-foreground px-6 shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[2px_2px_0_0_var(--gold)]"
          >
            <Link href="/track-order">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try another code
            </Link>
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        title={order.id}
        description={`Placed by ${order.customerName} on ${order.orderedAt}`}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 sm:grid-cols-[1fr_260px]">
          {/* Status */}
          <div className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_0_var(--foreground)] sm:p-6 dark:border-primary dark:shadow-[6px_6px_0_0_var(--primary)]">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Order status
            </h2>
            <OrderTimeline status={order.status} />
          </div>

          {/* Total */}
          <div className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_0_var(--foreground)] sm:p-6 dark:border-gold dark:shadow-[6px_6px_0_0_var(--gold)]">
            <p className="text-sm font-medium text-foreground">Total</p>
            <p className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-gold">
              {formatPrice(order.amountInCents)}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)] dark:border-primary dark:shadow-[6px_6px_0_0_var(--primary)]">
          <div className="divide-y divide-border">
            {order.items.map((item, i) => {
              const product = getProductByName(item.productName);

              return (
                <div key={i} className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/40">
                    {product ? (
                      <Image
                        src={product.image}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-foreground">
                    {formatPrice(item.priceInCents * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <Button
            asChild
            variant="ghost"
            className="group rounded-full px-0 hover:bg-transparent"
          >
            <Link href="/track-order">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Track another order
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}