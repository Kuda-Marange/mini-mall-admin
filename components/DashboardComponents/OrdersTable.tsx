import { type Order } from "../../lib/types";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MoreVertical, ChevronsUpDown } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
}

const STATUS_STYLES: Record<Order["status"], string> = {
  delivered: "bg-green-100 text-green-700 border-transparent",
  shipped: "bg-blue-100 text-blue-700 border-transparent",
  pending: "bg-amber-100 text-amber-700 border-transparent",
  cancelled: "bg-red-100 text-red-700 border-transparent",
};

const STATUS_LABELS: Record<Order["status"], string> = {
  delivered: "Delivered",
  shipped: "Shipped",
  pending: "Pending",
  cancelled: "Cancelled",
};

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SortableHeader({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 font-semibold text-foreground hover:text-foreground/80"
    >
      {label}
      <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="w-10 py-4 pl-5">
              <Checkbox />
            </th>
            <th className="py-4">
              <SortableHeader label="Order" />
            </th>
            <th className="py-4">
              <SortableHeader label="Customer" />
            </th>
            <th className="py-4">
              <SortableHeader label="Date" />
            </th>
            <th className="py-4">
              <SortableHeader label="Total" />
            </th>
            <th className="py-4">
              <SortableHeader label="Status" />
            </th>
            <th className="w-10 py-4 pr-5" />
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-muted-foreground">
                No orders match your filters.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors"
              >
                <td className="py-4 pl-5">
                  <Checkbox />
                </td>
                <td className="py-4">
                  <p className="font-medium text-foreground">{order.pizzaName}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{order.id}</p>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                      {order.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span>{order.customerName}</span>
                  </div>
                </td>
                <td className="py-4 text-muted-foreground">
                  {formatDate(order.orderedAt)}
                </td>
                <td className="py-4 font-medium">
                  {formatPrice(order.amountInCents)}
                </td>
                <td className="py-4">
                  <Badge className={STATUS_STYLES[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </td>
                <td className="py-4 pr-5">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}