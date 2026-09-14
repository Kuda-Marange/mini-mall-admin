const PIZZA_IMAGES: Record<string, string> = {
  Margherita: "/margherita.png",
  Pepperoni: "/pepperoni.png",
  Hawaiian: "/hawaiian.png",
  Veggie: "/veggie.png",
  "Chicken Supreme": "/chicken-supreme.png",
  "Spicy Sausage": "/spicy-sausage.png",
  Lasagna: "/lasagna.png",
};

/** Fallback image shown for any pizza name that isn't in PIZZA_IMAGES. */
const FALLBACK_PIZZA_IMAGE = "/pizza.jpg";

/** Returns the image path for a given pizza name, falling back to a generic pizza image. */
export function getPizzaImage(pizzaName: string): string {
  return PIZZA_IMAGES[pizzaName] ?? FALLBACK_PIZZA_IMAGE;
}
