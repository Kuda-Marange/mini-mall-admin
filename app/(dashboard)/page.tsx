import { OrdersOverTimeChart } from "@/components/DashboardComponents/OrdersOverTimeChart";
import PromotionalBanner from "@/components/DashboardComponents/PromotionalBannar";
import { StatItem } from "@/components/DashboardComponents/StatItem";
import { Card } from "@/components/ui/card";
import { orders } from "@/lib/orders-data";


export default function Home() {

//for the stats cards
  const totalOrders = orders.length;
  const returns = orders.filter((o) => o.status === "cancelled").length;
  const fulfilledOrders = orders.filter(
    (o) => o.status === "shipped" || o.status === "delivered"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      {/* THE PROMOTIONAL BANNER FOR THE ORDERS PAGE*/}
      <PromotionalBanner totalOrders={totalOrders} />

       {/* THE STATUS CARDS GO HERE*/}
      <Card className="border-none shadow-sm h-auto sm:h-30">
        <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-border">
          <StatItem label="Total orders" value={totalOrders} />
          <StatItem label="Returns" value={returns} />
          <StatItem label="Fulfilled orders" value={fulfilledOrders} />
          <StatItem label="Delivered orders" value={deliveredOrders} />
        </div>
      </Card>
      
      {/* THE RECHART SHADCN COMPONENT GOES HERE*/}
      <OrdersOverTimeChart />
    </div>
  );
}
