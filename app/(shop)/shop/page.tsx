import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format-price";
import { PRODUCTS } from "@/lib/products";
import { ShopHero, type MenuData } from "@/components/shop-hero";
import { PopularPicks } from "@/components/popular-picks";
import { AboutUs } from "@/components/about-us";

export default function ShopPage() {
  const menudata: MenuData[] = PRODUCTS.map((product, index) => ({
    id: index,
    img: product.image,
    imgAlt: product.name,
    description: product.description,
  }));

  return (
    <div className="space-y-8">
      <ShopHero menudata={menudata} />

      <PopularPicks />

      <AboutUs />
    </div>
  );
}