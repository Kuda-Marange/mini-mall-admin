"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductByName } from "@/lib/products";
import { formatPrice } from "@/lib/format-price";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: Promise<{ name: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { name } = use(params);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const foundProduct = getProductByName(name);

  if (!foundProduct) {
    notFound();
    return null;
  }

  const product = foundProduct;

  function handleAddToCart() {
    addItem(
      {
        pizzaName: product.name,
        priceInCents: product.priceInCents,
      },
      quantity
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-8 sm:grid-cols-2">
      <div className="relative aspect-square rounded-full overflow-hidden max-w-sm mx-auto sm:mx-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          {product.name}
        </h1>

        <p className="text-muted-foreground">
          {product.description}
        </p>

        <p className="text-xl font-semibold text-foreground">
          {formatPrice(product.priceInCents)}
        </p>

        <div className="flex items-center gap-3">
          <label
            htmlFor="quantity"
            className="text-sm text-muted-foreground"
          >
            Quantity
          </label>

          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value)))
            }
            className="w-20 rounded-md border px-2 py-1 bg-background"
          />
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full sm:w-auto"
        >
          {added ? "Added!" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}