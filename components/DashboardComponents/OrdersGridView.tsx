"use client";

import { useState } from "react";
import { type Order } from "@/lib/types";
import { formatPrice } from "@/lib/format-price";
import { getPizzaImage } from "@/lib/pizza-images";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, Truck, Check, X } from "lucide-react";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_ICONS: Record<Order["status"], typeof Clock> = {
  pending: Clock,
  shipped: Truck,
  delivered: Check,
  cancelled: X,
};

interface OrdersGridViewProps {
  orders: Order[];
  onOrderClick?: (order: Order) => void;
}

const PAGE_SIZE = 8;

export function OrdersGridView({ orders, onOrderClick }: OrdersGridViewProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const paginatedOrders = orders.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedOrders.map((order) => {
          const StatusIcon = STATUS_ICONS[order.status];
          return (
            <button
              key={order.id}
              type="button"
              onClick={() => onOrderClick?.(order)}
              className="group flex flex-col rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-2">
                <img
                  src={getPizzaImage(order.pizzaName)}
                  alt={order.pizzaName}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  <StatusIcon className="h-3 w-3" />
                  {STATUS_LABELS[order.status]}
                </Badge>
              </div>

              <div className="mt-3">
                <p className="font-medium text-foreground">{order.customerName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{order.pizzaName}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">{order.id}</span>
                <span className="font-semibold text-foreground">{formatPrice(order.amountInCents)}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={currentPage >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}