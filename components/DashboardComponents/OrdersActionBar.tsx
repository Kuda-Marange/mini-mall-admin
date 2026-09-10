import { Button } from "../ui/button";
import { Upload, Plus } from "lucide-react";
import Link from "next/link";

export function OrdersActionBar() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Export */}
      <Button variant="outline" size="icon" className="sm:hidden">
        <Upload className="h-4 w-4" />
      </Button>
      <Button variant="outline" className="hidden sm:inline-flex">
        <Upload className="mr-2 h-4 w-4" />
        Export
      </Button>

      {/* Create Order */}
      <Button
        size="icon"
        className="bg-primary text-primary-foreground hover:bg-primary/90 sm:hidden"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Link
        href="/orders/new"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 hidden sm:inline-flex items-center"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Order
      </Link>
    </div>
  );
}
