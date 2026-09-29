import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapOrderRow, type OrderRow } from "@/lib/order-mapper";

interface LookupRow {
  id: string;
  customer_name: string;
  pizza_name: string;
  amount_in_cents: number;
  status: OrderRow["status"];
  ordered_at: string;
  item_product_name: string;
  item_quantity: number;
  item_price_in_cents: number;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const supabase = await createClient();

  try {
    // get_order_by_code is a security-definer function: it looks up orders
    // internally (bypassing the "authenticated only" SELECT policy) but
    // only ever returns rows matching this exact code — never the full
    // table — so anonymous customers can safely track a single order.
    const { data, error } = await supabase.rpc("get_order_by_code", {
      order_code: code.trim().toUpperCase(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const rows = data as LookupRow[] | null;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const [first] = rows;
    const row: OrderRow = {
      id: first.id,
      customer_name: first.customer_name,
      pizza_name: first.pizza_name,
      amount_in_cents: first.amount_in_cents,
      status: first.status,
      ordered_at: first.ordered_at,
      order_items: rows.map((r) => ({
        product_name: r.item_product_name,
        quantity: r.item_quantity,
        price_in_cents: r.item_price_in_cents,
      })),
    };

    return NextResponse.json(mapOrderRow(row));
  } catch (err) {
    console.error("Failed to look up order:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}