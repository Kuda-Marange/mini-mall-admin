import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { type OrderStatus } from "../../lib/types";

interface OrderStatusFilterProps {
  value: OrderStatus | "all";
  onChange: (value: OrderStatus | "all") => void;
}

const STATUSES: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Unpaid" },
  { value: "shipped", label: "Need to ship" },
  { value: "delivered", label: "Completed" },
  { value: "cancelled", label: "Cancellation" },
];

export function OrderStatusFilter({ value, onChange }: OrderStatusFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as OrderStatus | "all")}>
      <TabsList variant="line">
        {STATUSES.map((status) => (
          <TabsTrigger key={status.value} value={status.value}>
            {status.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}