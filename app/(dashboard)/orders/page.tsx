import { OrdersActionBar } from "@/components/orders_ dashboard_components/OrdersActionBar";
import PromotionalBanner from "@/components/orders_ dashboard_components/PromotionalBannar";
import { StatItem } from "@/components/StatItem";
import { Card } from "@/components/ui/card";
import { orders } from "@/lib/orders-data";
import { CalendarIcon } from "lucide-react";

export default function OrdersPage() {

  const totalOrders = orders.length;
  const returns = orders.filter((o) => o.status === "cancelled").length;
  const fulfilledOrders = orders.filter(
    (o) => o.status === "shipped" || o.status === "delivered"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;



  return (
    <div className="space-y-6">
      {/* THE PROMOTIONAL BANNER FOR THE ORDERS PAGE*/}
      <PromotionalBanner />

      {/* THE ORDERS ACTION BELOW*/}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <OrdersActionBar />
      </div>

      {/* THE STATUS CARDS GO HERE*/}
      <Card className="border-none shadow-sm h-30">
        <div className="flex items-center divide-x divide-border">
          <div className="px-4 flex flex-1 items-center gap-2 cursor-pointer hover:bg-accent rounded-md py-2">
            <CalendarIcon className="h-4 w-4" />
            <div>
              <h2 className="font-semibold text-xl">Today</h2>
            </div>
          </div>
          <StatItem label="Total orders" value={totalOrders} />
          <StatItem label="Returns" value={returns} />
          <StatItem label="Fulfilled orders" value={fulfilledOrders} />
          <StatItem label="Delivered orders" value={deliveredOrders} />
        </div>
      </Card>
    </div>
  );
}
