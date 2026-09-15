"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { scrollToSection } from "@/lib/utils";

const FOOTER_LINKS = [
  { title: "Menu", id: "menu" },
  { title: "About", id: "about-us" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <Link href="/shop" className="font-bold text-lg text-foreground">
          Mini Mall Pizza
        </Link>

        <div className="flex items-center gap-5">
          {FOOTER_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              {link.title}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-4xl justify-center px-4 py-6">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Mini Mall Pizza
        </p>
      </div>
    </footer>
  );
}