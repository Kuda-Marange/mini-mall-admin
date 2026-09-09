"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock, Package, Truck, X } from "lucide-react";

import { orders } from "@/lib/orders-data";
import { type OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format-price";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];

function getStatusLabel(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusVariant(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

/* Renders the correct icon for a status directly, instead of returning
   a component reference to be used as a JSX tag (which React warns
   against creating during render). */
function StatusIconDisplay({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  switch (status) {
    case "pending":
      return <Clock className={className} />;
    case "shipped":
      return <Truck className={className} />;
    case "delivered":
      return <Check className={className} />;
    case "cancelled":
      return <X className={className} />;
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const foundOrder = orders.find((order) => order.id === id);

  if (!foundOrder) {
    notFound();
  }

  const [status, setStatus] = useState<OrderStatus>(foundOrder.status);

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------
          PAGE HEADER
      -------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to orders</span>
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {foundOrder.id}
              </h1>

              <Badge variant={getStatusVariant(status)} className="gap-1">
                <StatusIconDisplay status={status} className="h-3 w-3" />
                {getStatusLabel(status)}
              </Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Order placed {foundOrder.orderedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as OrderStatus)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>

            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {getStatusLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* -------------------------------------------------
          MAIN CONTENT
      -------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ================================================
            LEFT COLUMN
        ================================================= */}
        <div className="space-y-6">
          {/* ITEMS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Package className="h-7 w-7 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="font-medium">{foundOrder.pizzaName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pizza order
                    </p>
                  </div>
                </div>

                <p className="font-medium">
                  {formatPrice(foundOrder.amountInCents)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ORDER PROGRESS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order progress</CardTitle>
            </CardHeader>

            <CardContent>
              <OrderProgress status={status} />
            </CardContent>
          </Card>

          {/* CUSTOMER */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer details</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <DetailRow label="Customer name" value={foundOrder.customerName} />
                <Separator />
                <DetailRow label="Order ID" value={foundOrder.id} />
                <Separator />
                <DetailRow label="Ordered" value={foundOrder.orderedAt} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================================================
            RIGHT COLUMN
        ================================================= */}
        <div className="space-y-6">
          {/* ORDER SUMMARY */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order summary</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <SummaryRow label="Subtotal" value={formatPrice(foundOrder.amountInCents)} />
                <SummaryRow label="Discount" value={formatPrice(0)} />
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(foundOrder.amountInCents)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STATUS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order status</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                  <StatusIconDisplay status={status} className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">{getStatusLabel(status)}</p>
                  <p className="text-sm text-muted-foreground">
                    Current order status
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   ORDER PROGRESS
===================================================== */

interface OrderProgressProps {
  status: OrderStatus;
}

function OrderProgress({ status }: OrderProgressProps) {
  const steps = [
    { label: "Order placed", value: "pending", icon: Clock },
    { label: "Shipped", value: "shipped", icon: Truck },
    { label: "Delivered", value: "delivered", icon: Check },
  ];

  const statusIndex = {
    pending: 0,
    shipped: 1,
    delivered: 2,
    cancelled: -1,
  }[status];

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <X className="h-5 w-5 text-destructive" />
        </div>

        <div>
          <p className="font-medium">Order cancelled</p>
          <p className="text-sm text-muted-foreground">
            This order is no longer being processed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const completed = index <= statusIndex;
          const isCurrent = index === statusIndex;

          return (
            <div key={step.value} className="flex flex-1 items-start">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border",
                    completed
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground",
                    isCurrent ? "ring-4 ring-primary/10" : "",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span
                  className={[
                    "mt-2 text-center text-xs",
                    completed ? "font-medium text-foreground" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "mt-4 h-px flex-1",
                    index < statusIndex ? "bg-primary" : "bg-border",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================
   DETAIL ROW
===================================================== */

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

/* =====================================================
   SUMMARY ROW
===================================================== */

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}