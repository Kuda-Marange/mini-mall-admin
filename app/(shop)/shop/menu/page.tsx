import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";

export default function MenuPage() {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Everything we make
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            All {PRODUCTS.length} pizzas, made fresh to order.
          </p>
        </div>

        <Reveal className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}