"use client";

import { OrdersActionBar } from "@/components/orders_ dashboard_components/OrdersActionBar";
import { OrderSearchFilterBar } from "@/components/orders_ dashboard_components/OrderSearchFilterBar";
import { OrdersTable } from "@/components/orders_ dashboard_components/OrdersTable";
import { OrderStatusFilter } from "@/components/orders_ dashboard_components/OrderStatusFilter";
import PromotionalBanner from "@/components/orders_ dashboard_components/PromotionalBannar";
import { StatItem } from "@/components/orders_ dashboard_components/StatItem";
import { Card } from "@/components/ui/card";
import { orders } from "@/lib/orders-data";
import { OrderStatus } from "@/lib/types";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  //For search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [view, setView] = useState<"grid" | "list">("list");

  //for the stats cards
  const totalOrders = orders.length;
  const returns = orders.filter((o) => o.status === "cancelled").length;
  const fulfilledOrders = orders.filter(
    (o) => o.status === "shipped" || o.status === "delivered"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  //Filter orders for the Order Table
  const filteredOrders = orders
    .filter((o) => statusFilter === "all" || o.status === statusFilter)
    .filter((o) =>
      search.trim() === ""
        ? true
        : o.customerName.toLowerCase().includes(search.toLowerCase()) ||
          o.id.toLowerCase().includes(search.toLowerCase())
    );


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
      <Card className="border-none shadow-sm h-auto sm:h-30">
        <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="px-4 py-3 sm:py-2 flex flex-1 flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 cursor-pointer hover:bg-accent rounded-md text-center sm:text-left">
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

      {/* THIS IS THE ORDER_STATUS_FILTER AND THE ORDER_FILTER_BAR*/}
      <OrderStatusFilter value={statusFilter} onChange={setStatusFilter} />
      <OrderSearchFilterBar
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
      />

      {/* TABLE TO FILTER ORDERS*/}
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
