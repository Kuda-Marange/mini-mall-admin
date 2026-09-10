"use client";

import { OrdersActionBar } from "@/components/DashboardComponents/OrdersActionBar";
import { OrderSearchFilterBar } from "@/components/DashboardComponents/OrderSearchFilterBar";
import { OrderStatusFilter } from "@/components/DashboardComponents/OrderStatusFilter";
import { orders } from "@/lib/orders-data";
import { OrderStatus } from "@/lib/types";
import { useState } from "react";
import { columns } from "@/components/DashboardComponents/columns";
import { OrdersDataTable } from "@/components/DashboardComponents/OrdersDataTable";
import { useRouter } from "next/navigation";

export default function OrdersPage() {

  const router = useRouter();


  //For search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [view, setView] = useState<"grid" | "list">("list");


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

      {/* THE ORDERS ACTION BELOW*/}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold font-heading text-foreground">Orders</h1>
        <OrdersActionBar />
      </div>

      {/* THIS IS THE ORDER_STATUS_FILTER AND THE ORDER_FILTER_BAR*/}
      <OrderStatusFilter value={statusFilter} onChange={setStatusFilter} />
      <OrderSearchFilterBar
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
      />

      {/* TABLE TO FILTER ORDERS*/}
      <OrdersDataTable columns={columns} data={filteredOrders} onRowClick={(order) => router.push(`/orders/${order.id}`)} />
    </div>
  );
}
