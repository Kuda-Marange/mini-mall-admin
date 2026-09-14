import { ChefHat, Pizza, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    icon: Pizza,
    value: "7",
    description: ["Pizzas on", "the menu"],
  },
  {
    icon: ChefHat,
    value: "—",
    description: ["Years of", "experience"],
  },
  {
    icon: Clock,
    value: "—",
    description: ["Orders", "served"],
  },
];

export function AboutUs() {
  return (
    <section
      id="about-us"
      className="before:bg-muted relative py-8 before:absolute before:inset-0 before:-z-10 before:skew-y-3 sm:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center space-y-4 text-center md:mb-16 lg:mb-24">
          <Badge variant="outline" className="h-auto text-sm font-normal">
            About Us
          </Badge>
          <h2 className="text-2xl font-semibold font-heading tracking-tight md:text-3xl lg:text-4xl">
            Fresh pizza, made simple
          </h2>
          <p className="text-muted-foreground text-xl">
            We keep the menu small and the pizzas fresh — every order is
            made when you place it, not before.
          </p>
        </div>

        <div className="bg-background grid gap-10 border p-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2.5 text-center"
            >
              <div className="flex size-7 items-center justify-center [&>svg]:size-7 text-primary">
                <stat.icon />
              </div>
              <span className="text-2xl font-semibold">{stat.value}</span>
              <p className="text-muted-foreground text-lg">
                {stat.description[0]} <br /> {stat.description[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}