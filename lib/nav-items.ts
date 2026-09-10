// app/lib/nav-items.ts
import { ClipboardPlus, ListSortDescending, LayoutDashboard} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ListSortDescending },
  { label: "Create Order", href: "/orders/new", icon: ClipboardPlus },
  
];