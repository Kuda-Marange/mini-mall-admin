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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { error, count } = await supabase
      .from("orders")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Supabase/RLS returns no error even when zero rows match (e.g. a
    // missing DELETE policy, or the id simply doesn't exist) — so an
    // empty count has to be treated as a failure explicitly, rather than
    // trusting the absence of an `error` to mean the delete happened.
    if (!count || count === 0) {
      return NextResponse.json(
        { error: "No order was deleted. It may not exist, or delete access may be missing." },
        { status: 404 }
      );
    }

    return NextResponse.json({ deleted: true, id });
  } catch (err) {
    console.error("Failed to delete order:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}