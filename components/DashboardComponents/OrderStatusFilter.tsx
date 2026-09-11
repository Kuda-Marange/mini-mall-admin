import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { type OrderStatus } from "../../lib/types";

interface OrderStatusFilterProps {
  value: OrderStatus | "all";
  onChange: (value: OrderStatus | "all") => void;
}

const STATUSES: {
  value: OrderStatus | "all";
  label: string;
  /** Active-state accent classes, echoing the status badge tints in columns.tsx */
  activeClasses: string;
}[] = [
  {
    value: "all",
    label: "All",
    activeClasses: "data-active:text-primary data-active:after:bg-primary",
  },
  {
    value: "pending",
    label: "Pending",
    activeClasses: "data-active:text-warning data-active:after:bg-warning",
  },
  {
    value: "shipped",
    label: "Shipped",
    activeClasses: "data-active:text-primary data-active:after:bg-primary",
  },
  {
    value: "delivered",
    label: "Delivered",
    activeClasses: "data-active:text-success data-active:after:bg-success",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    activeClasses:
      "data-active:text-destructive data-active:after:bg-destructive",
  },
];

export function OrderStatusFilter({ value, onChange }: OrderStatusFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as OrderStatus | "all")}>
      <TabsList
        variant="line"
        className="w-full justify-start gap-1 overflow-x-auto no-scrollbar flex-nowrap border-b border-border pb-1"
      >
        {STATUSES.map((status) => (
          <TabsTrigger
            key={status.value}
            value={status.value}
            className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/60 hover:text-foreground ${status.activeClasses}`}
          >
            {status.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}