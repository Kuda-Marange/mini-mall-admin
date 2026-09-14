import type { Metadata } from "next";
import "./globals.css";
import { Geist, Syne } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart-context";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "Mini Mall Admin",
  description: "Merchant order dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        geist.variable,
        syne.variable
      )}
      suppressHydrationWarning
    >
    
        <body className={cn("bg-background text-foreground antialiased")}>
      
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <CartProvider>
          {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}