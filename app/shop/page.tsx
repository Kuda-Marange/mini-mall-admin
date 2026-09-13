import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format-price";
import { PRODUCTS } from "@/lib/products";

export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Our Pizzas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {PRODUCTS.map((product) => (
          <Link
            key={product.name}
            href={`/shop/${encodeURIComponent(product.name)}`}
            className="rounded-lg border bg-card hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(product.priceInCents)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}