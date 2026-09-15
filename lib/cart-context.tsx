"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  pizzaName: string;
  priceInCents: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (pizzaName: string) => void;
  updateQuantity: (pizzaName: string, quantity: number) => void;
  clearCart: () => void;
  totalInCents: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
});

  // Save to localStorage every time the cart changes.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.pizzaName === item.pizzaName);
      if (existing) {
        return prev.map((i) =>
          i.pizzaName === item.pizzaName
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }

  function removeItem(pizzaName: string) {
    setItems((prev) => prev.filter((i) => i.pizzaName !== pizzaName));
  }

  function updateQuantity(pizzaName: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.pizzaName === pizzaName ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalInCents = items.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalInCents }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}