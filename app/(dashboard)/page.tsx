"use client";

import { useEffect, useState } from "react";

import { OrdersOverTimeChart } from "@/components/DashboardComponents/OrdersOverTimeChart";
import PromotionalBanner from "@/components/DashboardComponents/PromotionalBannar";
import { StatItem } from "@/components/DashboardComponents/StatItem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Order } from "@/lib/types";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetches all orders from the API route on mount.
  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch("/api/orders");
        const result = await response.json();

        if (!response.ok) {
          if (!cancelled) setLoadError(result.error ?? "Failed to load orders.");
          return;
        }

        if (!cancelled) setOrders(result as Order[]);
      } catch (err) {
        console.error("Failed to load orders:", err);
        if (!cancelled) setLoadError("Something went wrong loading orders.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  // for the stats cards
  const totalOrders = orders.length;
  const returns = orders.filter((o) => o.status === "cancelled").length;
  const fulfilledOrders = orders.filter(
    (o) => o.status === "shipped" || o.status === "delivered"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      {/* THE PROMOTIONAL BANNER FOR THE ORDERS PAGE*/}
      <PromotionalBanner totalOrders={totalOrders} isLoading={isLoading} />

      {/* LOADING / ERROR STATES */}
      {isLoading && (
        <div className="space-y-6">
          <Card className="border-none shadow-sm h-auto sm:h-30">
            <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-1 space-y-2 p-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="space-y-3 p-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-40 w-full" />
            </div>
          </Card>
        </div>
      )}

      {!isLoading && loadError && (
        <p className="px-2 text-sm text-destructive">{loadError}</p>
      )}

      {!isLoading && !loadError && (
        <>
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
          <OrdersOverTimeChart orders={orders} />
        </>
      )}
    </div>
  );
}