"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalInCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild>
          <Link href="/shop">Browse pizzas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.pizzaName}
            className="flex items-center justify-between gap-4 border-b pb-4"
          >
            <div>
              <p className="font-medium text-foreground">{item.pizzaName}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.priceInCents)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.pizzaName, Math.max(1, Number(e.target.value)))
                }
                className="w-16"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.pizzaName)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-lg font-semibold">{formatPrice(totalInCents)}</p>
      </div>

      <Button asChild className="w-full">
        <Link href="/checkout">Proceed to checkout</Link>
      </Button>
    </div>
  );
}