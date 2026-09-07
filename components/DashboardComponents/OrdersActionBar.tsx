import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Upload, ChevronDown, Plus } from "lucide-react";

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

      {/* More actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="sm:hidden">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Mark as fulfilled</DropdownMenuItem>
          <DropdownMenuItem>Archive orders</DropdownMenuItem>
          <DropdownMenuItem>Print invoices</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="hidden sm:inline-flex">
            More actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Mark as fulfilled</DropdownMenuItem>
          <DropdownMenuItem>Archive orders</DropdownMenuItem>
          <DropdownMenuItem>Print invoices</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Order */}
      <Button
        size="icon"
        className="bg-primary text-primary-foreground hover:bg-primary/90 sm:hidden"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:inline-flex">
        <Plus className="mr-2 h-4 w-4" />
        Create Order
      </Button>
    </div>
  );
}