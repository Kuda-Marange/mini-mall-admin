import { Clock3, Flame, Leaf, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Leaf, title: "Fresh ingredients", text: "Simple and made fresh" },
  { icon: Flame, title: "Baked to order", text: "Hot from the oven" },
  { icon: Truck, title: "Fast delivery", text: "Delivered to your door" },
  { icon: Clock3, title: "Quick checkout", text: "Order in minutes" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Safe and secure ordering" },
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ul className="grid grid-cols-2 divide-border overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3 p-4 sm:p-5">
            <Icon className="size-7 shrink-0 text-primary" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}