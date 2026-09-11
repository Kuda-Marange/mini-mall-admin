"use client";

import { useEffect, useState } from "react";

import { OrdersActionBar } from "@/components/DashboardComponents/OrdersActionBar";
import { OrderSearchFilterBar } from "@/components/DashboardComponents/OrderSearchFilterBar";
import { OrderStatusFilter } from "@/components/DashboardComponents/OrderStatusFilter";
import { type Order, type OrderStatus } from "@/lib/types";
import { columns } from "@/components/DashboardComponents/columns";
import { OrdersDataTable } from "@/components/DashboardComponents/OrdersDataTable";
import { OrdersGridView } from "@/components/DashboardComponents/OrdersGridView";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useSearch } from "@/lib/search-context";

export default function OrdersPage() {
  const router = useRouter();
  const { search, setSearch } = useSearch();

  // Fetched order data
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // For search
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [view, setView] = useState<"grid" | "list">("list");
  const [pizzaFilter, setPizzaFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);

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

  // Unique pizza names for the filter dropdown
  const pizzaNames = orders
    .map((o) => o.pizzaName)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  // Filter orders for the Order Table
  const filteredOrders = orders
    .filter((o) => statusFilter === "all" || o.status === statusFilter)
    .filter((o) => pizzaFilter === "all" || o.pizzaName === pizzaFilter)
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
      <div className="relative">
        <OrderSearchFilterBar
          search={search}
          onSearchChange={setSearch}
          view={view}
          onViewChange={setView}
          onFilterClick={() => setFilterOpen((open) => !open)}
        />

        {filterOpen && (
          <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-lg border border-border bg-card p-4 shadow-lg">
            <p className="mb-2 text-sm font-medium text-foreground">Filter by pizza</p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => { setPizzaFilter("all"); setFilterOpen(false); }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                  pizzaFilter === "all"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                All pizzas
                {pizzaFilter === "all" && <Check className="h-3.5 w-3.5" />}
              </button>
              {pizzaNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => { setPizzaFilter(name); setFilterOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                    pizzaFilter === name
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {name}
                  {pizzaFilter === name && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LOADING / ERROR / EMPTY STATES */}
      {isLoading && (
        <p className="px-2 text-sm text-muted-foreground">Loading orders…</p>
      )}

      {!isLoading && loadError && (
        <p className="px-2 text-sm text-destructive">{loadError}</p>
      )}

      {!isLoading && !loadError && filteredOrders.length === 0 && (
        <p className="px-2 text-sm text-muted-foreground">No orders found.</p>
      )}

      {/* TABLE OR GRID TO FILTER ORDERS*/}
      {!isLoading && !loadError && filteredOrders.length > 0 && (
        view === "list" ? (
          <OrdersDataTable columns={columns} data={filteredOrders} onRowClick={(order) => router.push(`/orders/${order.id}`)} />
        ) : (
          <OrdersGridView orders={filteredOrders} onOrderClick={(order) => router.push(`/orders/${order.id}`)} />
        )
      )}
    </div>
  );
}