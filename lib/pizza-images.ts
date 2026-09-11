const PIZZA_IMAGES: Record<string, string> = {
  Margherita: "/margherita.jpg",
  Pepperoni: "/pepperoni.jpg",
  Hawaiian: "/hawaiian.png",
  Veggie: "/veggie.jpg",
  "Chicken Supreme": "/chicken-supreme.jpg",
  "Spicy Sausage": "/spicy-sausage.jpg",
  Lasagna: "/lasagna.jpg",
};

/** Fallback image shown for any pizza name that isn't in PIZZA_IMAGES. */
const FALLBACK_PIZZA_IMAGE = "/pizza.jpg";

/** Returns the image path for a given pizza name, falling back to a generic pizza image. */
export function getPizzaImage(pizzaName: string): string {
  return PIZZA_IMAGES[pizzaName] ?? FALLBACK_PIZZA_IMAGE;
}
