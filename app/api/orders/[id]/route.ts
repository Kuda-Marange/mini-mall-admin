import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { mapOrderRow, type OrderRow } from "@/lib/order-mapper";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json(mapOrderRow(data as OrderRow));
  } catch (err) {
    console.error("Failed to fetch order:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "status is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Order not found." },
        { status: 400 }
      );
    }

    return NextResponse.json(mapOrderRow(data as OrderRow));
  } catch (err) {
    console.error("Failed to update order:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}