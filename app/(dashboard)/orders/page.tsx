import { OrdersActionBar } from "@/components/orders_ dashboard_components/OrdersActionBar";
import PromotionalBanner from "@/components/orders_ dashboard_components/PromotionalBannar";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* THE PROMOTIONAL BANNER FOR THE ORDERS PAGE*/}
      <PromotionalBanner />

      {/* THE ORDERS ACTION BELOW*/}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <OrdersActionBar />
      </div>

      {/* THE ORDERS ACTION BELOW*/}






    </div>
  );
}
