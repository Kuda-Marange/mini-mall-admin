import { PRODUCTS } from "@/lib/products";
import { ShopHero, type MenuData } from "@/components/shop-hero";
import { TrustStrip } from "@/components/trust-strip";
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
    <div>
      <ShopHero menudata={menudata} />
      <TrustStrip />
      <PopularPicks />
      <AboutUs />
    </div>
  );
}