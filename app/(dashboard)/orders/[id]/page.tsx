"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  Package,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { type Order, type OrderStatus } from "@/lib/types";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { showToast } from "@/components/ui/toast";

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

function getStatusVariant(status: OrderStatus): "outline" {
  return "outline";
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

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetches the order from the API route on mount / whenever `id` changes.
  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(`/api/orders/${id}`);
        const result = await response.json();

        if (!response.ok) {
          if (!cancelled) setLoadError(result.error ?? "Order not found.");
          return;
        }

        if (!cancelled) {
          setOrder(result as Order);
          setStatus((result as Order).status);
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        if (!cancelled) setLoadError("Something went wrong loading this order.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Updates the status optimistically, then PATCHes the API route.
  // Reverts if the request fails.
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    const previousStatus = status;
    setStatus(newStatus);

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        setStatus(previousStatus);
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      setStatus(previousStatus);
    }
  };

  // Deletes the order from the confirm dialog, shows a success toast,
  // then returns to the orders list.
  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault(); // keep the dialog open while the request runs

    if (!order) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        setDeleteError(result.error ?? "Failed to delete order.");
        setIsDeleting(false);
        return;
      }

      setIsDeleteDialogOpen(false);
      showToast({
        title: "Order deleted",
        description: `${order.customerName}'s order ${order.id} was deleted.`,
      });
      router.push("/orders");
    } catch (err) {
      console.error("Failed to delete order:", err);
      setDeleteError("Something went wrong deleting this order.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-14 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !order || !status) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to orders
        </Button>
        <p className="text-sm text-muted-foreground">
          {loadError ?? "Order not found."}
        </p>
      </div>
    );
  }

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
              <h1 className="text-2xl font-semibold font-heading tracking-tight">
                {order.id}
              </h1>

              <Badge
                variant={getStatusVariant(status)}
                className="gap-1 bg-primary/10 text-primary border-primary/30"
              >
                <StatusIconDisplay status={status} className="h-3 w-3" />
                {getStatusLabel(status)}
              </Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Order placed {order.orderedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
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

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              if (!isDeleting) setIsDeleteDialogOpen(open);
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isDeleting}
                className="group/delete shrink-0"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 transition-transform duration-200 ease-out group-hover/delete:-rotate-12 group-active/delete:scale-90" />
                )}
                {isDeleting ? "Deleting…" : "Delete order"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>

                <AlertDialogTitle>Delete this order?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes order {order.id} for{" "}
                  {order.customerName}. This action cannot be undone.
                </AlertDialogDescription>

                {deleteError && (
                  <p className="text-sm text-destructive">{deleteError}</p>
                )}
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {isDeleting ? "Deleting…" : "Delete order"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
              <CardTitle className="text-base font-heading">Items</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Package className="h-7 w-7 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="font-medium">{order.pizzaName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pizza order
                    </p>
                  </div>
                </div>

                <p className="font-medium">
                  {formatPrice(order.amountInCents)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ORDER PROGRESS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading">Order progress</CardTitle>
            </CardHeader>

            <CardContent>
              <OrderProgress status={status} />
            </CardContent>
          </Card>

          {/* CUSTOMER */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading">Customer details</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <DetailRow label="Customer name" value={order.customerName} />
                <Separator />
                <DetailRow label="Order ID" value={order.id} />
                <Separator />
                <DetailRow label="Ordered" value={order.orderedAt} />
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
              <CardTitle className="text-base font-heading">Order summary</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <SummaryRow label="Subtotal" value={formatPrice(order.amountInCents)} />
                <SummaryRow label="Discount" value={formatPrice(0)} />
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(order.amountInCents)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STATUS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading">Order status</CardTitle>
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
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <X className="h-5 w-5 text-primary" />
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