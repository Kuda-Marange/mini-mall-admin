import { getPizzaImage } from "@/lib/pizza-images";

export interface Product {
  name: string;
  description: string;
  priceInCents: number;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    name: "Margherita",
    description: "Classic tomato, fresh mozzarella, and basil.",
    priceInCents: 899,
    image: getPizzaImage("Margherita"),
  },
  {
    name: "Pepperoni",
    description: "Loaded with pepperoni and melted mozzarella.",
    priceInCents: 1099,
    image: getPizzaImage("Pepperoni"),
  },
  {
    name: "Hawaiian",
    description: "Ham, pineapple, and mozzarella.",
    priceInCents: 999,
    image: getPizzaImage("Hawaiian"),
  },
  {
    name: "Veggie",
    description: "Bell peppers, onions, mushrooms, and olives.",
    priceInCents: 899,
    image: getPizzaImage("Veggie"),
  },
  {
    name: "Chicken Supreme",
    description: "Grilled chicken, peppers, and a smoky BBQ base.",
    priceInCents: 1199,
    image: getPizzaImage("Chicken Supreme"),
  },
  {
    name: "Spicy Sausage",
    description: "Italian sausage with a chili kick.",
    priceInCents: 1299,
    image: getPizzaImage("Spicy Sausage"),
  },
  {
    name: "Lasagna",
    description: "A hearty layered classic, pizzeria-style.",
    priceInCents: 599,
    image: getPizzaImage("Lasagna"),
  },
];

export function getProductByName(name: string): Product | undefined {
  return PRODUCTS.find(
    (p) => p.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
  );
}