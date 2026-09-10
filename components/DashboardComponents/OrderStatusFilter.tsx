import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { type OrderStatus } from "../../lib/types";

interface OrderStatusFilterProps {
  value: OrderStatus | "all";
  onChange: (value: OrderStatus | "all") => void;
}

const STATUSES: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderStatusFilter({ value, onChange }: OrderStatusFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as OrderStatus | "all")}>
      <TabsList
        variant="line"
        className="w-full justify-start overflow-x-auto no-scrollbar flex-nowrap"
      >
        {STATUSES.map((status) => (
          <TabsTrigger
            key={status.value}
            value={status.value}
            className="shrink-0 whitespace-nowrap"
          >
            {status.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}