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

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
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
      {/* Mobile / tablet: card list */}
      <div className="md:hidden divide-y divide-border">
        {orders.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">
            No orders match your filters.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4 flex gap-3">
              <Checkbox className="mt-1 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {order.pizzaName}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {order.id}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                    {initials(order.customerName)}
                  </div>
                  <span className="text-sm truncate">{order.customerName}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.orderedAt)}
                  </span>
                  <span className="font-medium text-sm">
                    {formatPrice(order.amountInCents)}
                  </span>
                  <Badge className={STATUS_STYLES[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: table, with horizontal scroll as a fallback */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[720px]">
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
              <th className="py-4 hidden lg:table-cell">
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
                        {initials(order.customerName)}
                      </div>
                      <span>{order.customerName}</span>
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground hidden lg:table-cell">
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
    </div>
  );
}