import { type Order, type OrderItem, type OrderStatus } from "@/lib/types";

// Shape of a row as it comes back from the `orders` table (snake_case columns).
export interface OrderRow {
  id: string;
  customer_name: string;
  pizza_name: string;
  amount_in_cents: number;
  status: OrderStatus;
  ordered_at: string;
  // Present only when the query joins order_items, e.g. .select("*, order_items(*)")
  order_items?: {
    product_name: string;
    quantity: number;
    price_in_cents: number;
  }[];
}

/** Converts a raw Supabase `orders` row into the app's camelCase `Order` type. */
export function mapOrderRow(row: OrderRow): Order {
  const items: OrderItem[] = (row.order_items ?? []).map((item) => ({
    productName: item.product_name,
    quantity: item.quantity,
    priceInCents: item.price_in_cents,
  }));

  return {
    id: row.id,
    customerName: row.customer_name,
    pizzaName: row.pizza_name,
    amountInCents: row.amount_in_cents,
    status: row.status,
    orderedAt: row.ordered_at,
    items,
  };
}