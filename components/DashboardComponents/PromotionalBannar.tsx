import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function PromotionalBanner() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-heading">
            Dashboard Home Page
          </h2>
          <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
            Welcome Back!
          </p>
          <Link
            href="/orders"
            className="flex gap-2 mt-4 bg-primary-foreground text-primary px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-primary-foreground/90"
          >
            Go to orders page
            <TrendingUp />
          </Link>
        </div>
      </div>
    </div>
  );
}