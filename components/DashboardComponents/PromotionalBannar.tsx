import { TrendingUp } from "lucide-react";

export default function PromotionalBanner() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-sidebar text-sidebar-foreground p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-heading">
            Dashboard Home Page
          </h2>
          <p className="text-sidebar-foreground/70 mt-1 text-sm sm:text-base">
            Welcome Back!
          </p>
          <button className=" flex gap-2 mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm sm:text-base">
            Go to orders page
            <TrendingUp />
          </button>
        </div>
      </div>
    </div>
  );
}