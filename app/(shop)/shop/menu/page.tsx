import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";
import { PRODUCTS } from "@/lib/products";

export default function MenuPage() {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center justify-center space-y-4 text-center sm:mb-16 lg:mb-24">
          <Badge variant="outline" className="h-auto text-sm font-normal">
            Full Menu
          </Badge>
          <h1 className="text-2xl font-semibold font-heading md:text-3xl lg:text-4xl">
            Everything we make
          </h1>
          <p className="text-muted-foreground text-xl">
            All {PRODUCTS.length} pizzas, made fresh to order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Card
              className="hover:border-primary border-primary/10 rounded-none border pt-0 shadow-none ring-0 transition-colors duration-300"
              key={product.name}
            >
              <CardContent className="px-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              </CardContent>
              <CardHeader className="mb-2 gap-3">
                <CardTitle className="text-xl font-semibold">
                  <Link href={`/shop/${encodeURIComponent(product.name)}`}>
                    {product.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    {formatPrice(product.priceInCents)}
                  </span>
                  <Button
                    className="group bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm has-[>svg]:px-6"
                    size="lg"
                    asChild
                  >
                    <Link href={`/shop/${encodeURIComponent(product.name)}`}>
                      View
                      <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}