// Order type — money is stored as integer CENTS, never decimals.

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productName: string;
  quantity: number;
  priceInCents: number;
}

export interface Order {
  id: string;
  customerName: string;
  pizzaName: string;
  amountInCents: number;
  status: OrderStatus;
  orderedAt: string; // e.g. "2026-08-15"
  items: OrderItem[];
}