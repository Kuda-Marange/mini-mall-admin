import { NextResponse } from "next/server";
import { type OrderStatus } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { mapOrderRow, type OrderRow } from "@/lib/order-mapper";

interface IncomingItem {
  productName: string;
  quantity: number;
  priceInCents: number;
}

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("ordered_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const orders = (data as OrderRow[]).map(mapOrderRow);
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { customerName, items, status, orderedAt } = body as {
      customerName?: string;
      items?: IncomingItem[];
      status?: OrderStatus;
      orderedAt?: string;
    };

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: "customerName and at least one item are required." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.productName || !item.quantity || !item.priceInCents) {
        return NextResponse.json(
          { error: "Each item needs productName, quantity, and priceInCents." },
          { status: 400 }
        );
      }
    }

    const amountInCents = items.reduce(
      (sum, item) => sum + item.quantity * item.priceInCents,
      0
    );
    const pizzaName = items.map((item) => item.productName).join(", ");
    const resolvedStatus = status ?? "pending";
    const resolvedOrderedAt =
      orderedAt ?? new Date().toISOString().split("T")[0];

    const { data: nextId, error: idError } = await supabase.rpc(
      "generate_order_id"
    );

    if (idError || !nextId) {
      return NextResponse.json(
        { error: idError?.message ?? "Failed to generate order id." },
        { status: 400 }
      );
    }

    // Deliberately no .select() here: chaining .select() after .insert()
    // makes PostgREST return the inserted row via a RETURNING clause, which
    // is subject to the SELECT RLS policy (authenticated only) — a guest
    // would get "permission denied" even though the INSERT itself is
    // allowed. We already know every field we just inserted, so the
    // response is built locally instead of reading it back.
    const { error: orderError } = await supabase.from("orders").insert({
      id: nextId,
      customer_name: customerName,
      pizza_name: pizzaName,
      amount_in_cents: amountInCents,
      status: resolvedStatus,
      ordered_at: resolvedOrderedAt,
    });

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: nextId,
        product_name: item.productName,
        quantity: item.quantity,
        price_in_cents: item.priceInCents,
      }))
    );

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 });
    }

    return NextResponse.json(
      mapOrderRow({
        id: nextId,
        customer_name: customerName,
        pizza_name: pizzaName,
        amount_in_cents: amountInCents,
        status: resolvedStatus,
        ordered_at: resolvedOrderedAt,
        order_items: items.map((i) => ({
          product_name: i.productName,
          quantity: i.quantity,
          price_in_cents: i.priceInCents,
        })),
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to create order:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}