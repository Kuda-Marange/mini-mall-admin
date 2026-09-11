import { Order } from "./types";

export const orders: Order[] = [
  { id: "ORD-001", customerName: "Tendai Moyo", pizzaName: "Margherita", amountInCents: 899, status: "delivered", orderedAt: "2026-08-01" },
  { id: "ORD-002", customerName: "Rudo Chikafu", pizzaName: "Pepperoni", amountInCents: 1099, status: "shipped", orderedAt: "2026-08-02" },
  { id: "ORD-003", customerName: "Farai Gwenzi", pizzaName: "Hawaiian", amountInCents: 999, status: "pending", orderedAt: "2026-08-04" },
  { id: "ORD-004", customerName: "Chido Marufu", pizzaName: "Veggie", amountInCents: 899, status: "delivered", orderedAt: "2026-08-06" },
  { id: "ORD-005", customerName: "Tapiwa Ndoro", pizzaName: "Lasagna", amountInCents: 599, status: "cancelled", orderedAt: "2026-08-06" },
  { id: "ORD-006", customerName: "Nyasha Chirwa", pizzaName: "Chicken Supreme", amountInCents: 1199, status: "delivered", orderedAt: "2026-08-07" },
  { id: "ORD-007", customerName: "Kudzai Manyeza", pizzaName: "Spicy Sausage", amountInCents: 1299, status: "shipped", orderedAt: "2026-08-07" },
  { id: "ORD-008", customerName: "Rutendo Mhlanga", pizzaName: "Margherita", amountInCents: 899, status: "pending", orderedAt: "2026-08-07" },
  { id: "ORD-009", customerName: "Simba Chatiza", pizzaName: "Pepperoni", amountInCents: 1099, status: "delivered", orderedAt: "2026-08-10" },
  { id: "ORD-010", customerName: "Vimbai Sithole", pizzaName: "Hawaiian", amountInCents: 999, status: "shipped", orderedAt: "2026-08-10" },
  { id: "ORD-011", customerName: "Blessing Nyathi", pizzaName: "Veggie", amountInCents: 899, status: "pending", orderedAt: "2026-08-10" },
  { id: "ORD-012", customerName: "Panashe Dube", pizzaName: "Lasagna", amountInCents: 599, status: "delivered", orderedAt: "2026-08-10" },
  { id: "ORD-013", customerName: "Anesu Marange", pizzaName: "Chicken Supreme", amountInCents: 1199, status: "cancelled", orderedAt: "2026-08-10" },
  { id: "ORD-014", customerName: "Tafara Chimuka", pizzaName: "Spicy Sausage", amountInCents: 1299, status: "delivered", orderedAt: "2026-08-11" },
  { id: "ORD-015", customerName: "Nomsa Ncube", pizzaName: "Margherita", amountInCents: 899, status: "shipped", orderedAt: "2026-08-11" },
  { id: "ORD-016", customerName: "Tinashe Mudzingwa", pizzaName: "Pepperoni", amountInCents: 1099, status: "pending", orderedAt: "2026-08-13" },
  { id: "ORD-017", customerName: "Charity Zvidzai", pizzaName: "Hawaiian", amountInCents: 999, status: "delivered", orderedAt: "2026-08-15" },
  { id: "ORD-018", customerName: "Munashe Gambiza", pizzaName: "Veggie", amountInCents: 899, status: "shipped", orderedAt: "2026-08-15" },
  { id: "ORD-019", customerName: "Precious Chikowore", pizzaName: "Lasagna", amountInCents: 599, status: "pending", orderedAt: "2026-08-16" },
  { id: "ORD-020", customerName: "Tatenda Musarurwa", pizzaName: "Chicken Supreme", amountInCents: 1199, status: "delivered", orderedAt: "2026-08-17" },
  { id: "ORD-021", customerName: "Shamiso Chitima", pizzaName: "Spicy Sausage", amountInCents: 1299, status: "shipped", orderedAt: "2026-08-17" },
  { id: "ORD-022", customerName: "Wadzanai Chiweshe", pizzaName: "Margherita", amountInCents: 899, status: "delivered", orderedAt: "2026-08-18" },
  { id: "ORD-023", customerName: "Takudzwa Ruwende", pizzaName: "Pepperoni", amountInCents: 1099, status: "cancelled", orderedAt: "2026-08-20" },
  { id: "ORD-024", customerName: "Sekai Muzenda", pizzaName: "Hawaiian", amountInCents: 999, status: "delivered", orderedAt: "2026-08-20" },
  { id: "ORD-025", customerName: "Tanaka Chirinda", pizzaName: "Veggie", amountInCents: 899, status: "pending", orderedAt: "2026-08-20" },
  { id: "ORD-026", customerName: "Ropafadzo Muti", pizzaName: "Lasagna", amountInCents: 599, status: "shipped", orderedAt: "2026-08-21" },
  { id: "ORD-027", customerName: "Batsirai Nhema", pizzaName: "Chicken Supreme", amountInCents: 1199, status: "delivered", orderedAt: "2026-08-21" },
  { id: "ORD-028", customerName: "Chiedza Mapfumo", pizzaName: "Spicy Sausage", amountInCents: 1299, status: "pending", orderedAt: "2026-08-21" },
  { id: "ORD-029", customerName: "Nyaradzo Gudo", pizzaName: "Margherita", amountInCents: 899, status: "delivered", orderedAt: "2026-08-21" },
  { id: "ORD-030", customerName: "Onai Machaya", pizzaName: "Pepperoni", amountInCents: 1099, status: "shipped", orderedAt: "2026-08-21" },
];

// Single source of truth for the pizza menu, derived from the orders above.
// Every pizza that appears in an order is available in the create-order form,
// keeping it in sync with the filter dropdown on the orders page.
export const PIZZA_OPTIONS: { name: string; priceInCents: number }[] = orders.reduce<{ name: string; priceInCents: number }[]>(
  (acc, order) => {
    if (!acc.some((pizza) => pizza.name === order.pizzaName)) {
      acc.push({ name: order.pizzaName, priceInCents: order.amountInCents });
    }
    return acc;
  },
  []
);
