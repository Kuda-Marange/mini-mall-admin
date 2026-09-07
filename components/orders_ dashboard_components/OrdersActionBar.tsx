import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Upload, ChevronDown, Plus } from "lucide-react";

export function OrdersActionBar() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline">
        <Upload className="mr-2 h-4 w-4" />
        Export
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
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

      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="mr-2 h-4 w-4" />
        Create Order
      </Button>
    </div>
  );
}