"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogIn, Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle-button";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import { cn, scrollToSection } from "@/lib/utils";

type NavLink =
  | { title: string; type: "scroll"; id: string }
  | { title: string; type: "link"; href: string };

const NAV_LINKS: NavLink[] = [
  { title: "Home", type: "link", href: "/shop" },
  { title: "Menu", type: "link", href: "/shop/menu" },
  { title: "Checkout", type: "link", href: "/checkout" },
  { title: "Track Order", type: "link", href: "/track-order" },
];

export function Header() {
  const { items } = useCart();
  const pathname = usePathname();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // On pages that open with a full-bleed band (the home hero, or a
  // PageBanner on menu/cart/checkout/orders), the header stays see-through
  // until the visitor scrolls, so that band's background runs to the top
  // of the window. Add a route here whenever a page adopts PageBanner.
  const BANNER_ROUTES = ["/shop", "/shop/menu", "/cart", "/checkout", "/track-order"];
  const overHero =
    (BANNER_ROUTES.includes(pathname) || pathname.startsWith("/track-order/")) &&
    !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  function scrollLinkHref(id: string) {
    return pathname === "/shop" ? `#${id}` : `/shop#${id}`;
  }
  function handleScrollLinkClick(id: string) {
    return (e: React.MouseEvent) => {
      if (pathname === "/shop") {
        e.preventDefault();
        scrollToSection(id);
      }
    };
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        overHero
          ? "border-transparent bg-transparent"
          : "bg-background/95 backdrop-blur"
      )}
    >
      <div className="max-w-4xl mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/shop" className="shrink-0 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
            <span className="text-xs font-bold">M</span>
          </div>
          <span className="font-bold text-sm text-foreground">
            Mini Mall Pizza
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) =>
            link.type === "scroll" ? (
              <Link
                key={link.title}
                href={scrollLinkHref(link.id)}
                onClick={handleScrollLinkClick(link.id)}
                className="rounded-full px-3 py-1.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {link.title}
              </Link>
            ) : (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors hover:text-primary hover:bg-primary/5",
                  pathname === link.href
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80"
                )}
              >
                {link.title}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin !== null && (
            <Link
              href={isAdmin ? "/" : "/login"}
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {isAdmin ? (
                <>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </>
              ) : (
                <>
                  <LogIn className="h-3.5 w-3.5" />
                  Admin
                </>
              )}
            </Link>
          )}

          <ThemeToggle />

          <Button variant="outline" size="icon" className="relative" asChild>
            <Link href="/cart" aria-label="Cart">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden rounded-full"
                aria-label="Menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {NAV_LINKS.map((link) =>
                link.type === "scroll" ? (
                  <DropdownMenuItem key={link.title} asChild>
                    <Link
                      href={scrollLinkHref(link.id)}
                      onClick={handleScrollLinkClick(link.id)}
                    >
                      {link.title}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={link.title} asChild>
                    <Link href={link.href}>{link.title}</Link>
                  </DropdownMenuItem>
                )
              )}
              <DropdownMenuItem asChild>
                <Link href={isAdmin ? "/" : "/login"}>
                  {isAdmin ? "Dashboard" : "Admin login"}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}