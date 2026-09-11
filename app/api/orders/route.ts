import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { mapOrderRow, type OrderRow } from "@/lib/order-mapper";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
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
  try {
    const body = await request.json();
    const { customerName, pizzaName, amountInCents, status, orderedAt } = body;

    if (!customerName || !pizzaName || !amountInCents) {
      return NextResponse.json(
        { error: "customerName, pizzaName, and amountInCents are required." },
        { status: 400 }
      );
    }

    // Compute the next sequential "ORD-XXX" id from what's already in the table.
    const { data: existingOrders, error: fetchError } = await supabase
      .from("orders")
      .select("id");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    const lastNumber =
      existingOrders && existingOrders.length > 0
        ? Math.max(
            ...existingOrders.map((o) => parseInt(o.id.replace("ORD-", ""), 10))
          )
        : 0;
    const nextId = `ORD-${String(lastNumber + 1).padStart(3, "0")}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        id: nextId,
        customer_name: customerName,
        pizza_name: pizzaName,
        amount_in_cents: amountInCents,
        status: status ?? "pending",
        ordered_at: orderedAt ?? new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(mapOrderRow(data as OrderRow), { status: 201 });
  } catch (err) {
    console.error("Failed to create order:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}