"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type Order } from "@/lib/types";
import { formatPrice } from "@/lib/format-price";
import { getPizzaImage } from "@/lib/pizza-images";
import { Badge } from "../ui/badge";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_BADGE_CLASSES: Record<Order["status"], string> = {
  pending: "bg-primary/10 text-primary border-primary/30",
  shipped: "bg-primary/10 text-primary border-primary/30",
  delivered: "bg-primary/10 text-primary border-primary/30",
  cancelled: "bg-primary/10 text-primary border-primary/30",
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "pizzaImage",
    header: "",
    cell: ({ row }) => (
      <img
        src={getPizzaImage(row.original.pizzaName)}
        alt={row.original.pizzaName}
        className="h-9 w-9 rounded-full object-cover"
      />
    ),
  },
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