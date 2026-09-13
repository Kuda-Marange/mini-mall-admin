import { Order } from "./types";
import { PRODUCTS } from "./products";

export const orders: Order[] = [
];

// Single source of truth for the pizza menu: derived directly from the shop's
// product catalog (lib/products.ts), so the admin create-order dropdown always
// matches what's actually sold in the shop.
export const PIZZA_OPTIONS: { name: string; priceInCents: number }[] = PRODUCTS.map(
  (product) => ({
    name: product.name,
    priceInCents: product.priceInCents,
  })
);