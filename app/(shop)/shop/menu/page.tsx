import { PageBanner } from "@/components/page-banner";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";

export default function MenuPage() {
  return (
    <div>
      <PageBanner
        title="Everything we make"
        description={`All ${PRODUCTS.length} pizzas, made fresh to order.`}
      />

      <section className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}