import { type Order, type OrderStatus } from "@/lib/types";

// Shape of a row as it comes back from the `orders` table (snake_case columns).
export interface OrderRow {
  id: string;
  customer_name: string;
  pizza_name: string;
  amount_in_cents: number;
  status: OrderStatus;
  ordered_at: string;
}

/** Converts a raw Supabase `orders` row into the app's camelCase `Order` type. */
export function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    pizzaName: row.pizza_name,
    amountInCents: row.amount_in_cents,
    status: row.status,
    orderedAt: row.ordered_at,
  };
}