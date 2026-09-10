"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type Order } from "@/lib/types";
import { formatPrice } from "@/lib/format-price";
import { Badge } from "../ui/badge";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Unpaid",
  shipped: "Need to ship",
  delivered: "Completed",
  cancelled: "Cancellation",
};

const STATUS_BADGE_CLASSES: Record<Order["status"], string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  shipped: "bg-primary/10 text-primary border-primary/30",
  delivered: "bg-success/15 text-success-foreground border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "amountInCents",
    header: "Total",
    cell: ({ row }) => formatPrice(row.original.amountInCents),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={STATUS_BADGE_CLASSES[row.original.status]}>
        {STATUS_LABELS[row.original.status]}
      </Badge>
    ),
  },
];