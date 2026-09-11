"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { type Order } from "@/lib/types";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });

interface OrdersOverTimeChartProps {
  orders: Order[];
}

export function OrdersOverTimeChart({ orders }: OrdersOverTimeChartProps) {
  // group orders by date, count how many per day
  const ordersByDate = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.orderedAt] = (acc[order.orderedAt] || 0) + 1;
    return acc;
  }, {});

  // convert into the array shape Recharts expects, sorted chronologically
  const chartData = Object.entries(ordersByDate)
    .map(([date, count]) => ({ date, orders: count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // simple trend: compare the average of the first half of days vs the second half
  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);
  const midpoint = Math.floor(chartData.length / 2);
  const firstHalf = chartData.slice(0, midpoint);
  const secondHalf = chartData.slice(midpoint);
  const firstHalfAvg =
    firstHalf.reduce((sum, d) => sum + d.orders, 0) / (firstHalf.length || 1);
  const secondHalfAvg =
    secondHalf.reduce((sum, d) => sum + d.orders, 0) / (secondHalf.length || 1);
  const trendPercent =
    firstHalfAvg === 0 ? 0 : ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  const isTrendingUp = trendPercent >= 0;

  const dateRange =
    chartData.length > 0
      ? `${formatShortDate(chartData[0].date)} – ${formatShortDate(chartData[chartData.length - 1].date)}`
      : "";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Orders over time
        </CardTitle>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {isTrendingUp ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span>
            {isTrendingUp ? "Trending up" : "Trending down"} by{" "}
            {Math.abs(trendPercent).toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {dateRange} · {totalOrders} total orders
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              tickFormatter={formatShortDate}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              fontSize={11}
              width={24}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="orders"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}