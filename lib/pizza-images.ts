const PIZZA_IMAGES: Record<string, string> = {
  Margherita: "/margherita.webp",
  Pepperoni: "/pepperoni.webp",
  Hawaiian: "/hawaiian.webp",
  Veggie: "/veggie.webp",
  "Chicken Supreme": "/chicken-supreme.webp",
  "Spicy Sausage": "/spicy-sausage.webp",
  Lasagna: "/lasagna.webp",
};

/** Fallback image shown for any pizza name that isn't in PIZZA_IMAGES. */
const FALLBACK_PIZZA_IMAGE = "/pizza.jpg";

/** Returns the image path for a given pizza name, falling back to a generic pizza image. */
export function getPizzaImage(pizzaName: string): string {
  return PIZZA_IMAGES[pizzaName] ?? FALLBACK_PIZZA_IMAGE;
}
