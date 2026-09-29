"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import type { Order } from "@/lib/types";

interface ReceiptViewProps {
  order: Order;
}

export function ReceiptView({ order }: ReceiptViewProps) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      // Loaded on click so the PDF libraries stay out of the main bundle
      // and never run during server rendering.
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 48;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Mini Mall Pizza", margin, 64);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text("Order Receipt", margin, 82);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(String(order.id), pageWidth - margin, 64, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(String(order.orderedAt), pageWidth - margin, 82, {
        align: "right",
      });

      doc.setDrawColor(0);
      doc.setLineWidth(1.5);
      doc.line(margin, 96, pageWidth - margin, 96);

      // Customer
      doc.setFontSize(10);
      doc.text("Placed by", margin, 126);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(order.customerName, margin, 144);

      // Items table
      autoTable(doc, {
        startY: 168,
        margin: { left: margin, right: margin },
        head: [["Item", "Qty", "Price"]],
        body: order.items.map((item) => [
          item.productName,
          String(item.quantity),
          formatPrice(item.priceInCents * item.quantity),
        ]),
        theme: "plain",
        styles: { fontSize: 11, cellPadding: 6, textColor: 0 },
        headStyles: { fontStyle: "bold", lineWidth: { bottom: 0.75 } },
        columnStyles: {
          1: { halign: "center", cellWidth: 60 },
          2: { halign: "right", cellWidth: 100 },
        },
      });

      const finalY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 24;

      // Total
      doc.setLineWidth(1.5);
      doc.line(margin, finalY, pageWidth - margin, finalY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Total", pageWidth - margin, finalY + 22, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text(formatPrice(order.amountInCents), pageWidth - margin, finalY + 46, {
        align: "right",
      });

      // Footer note
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Keep this receipt - your order code (${order.id}) is needed to track this order at any time.`,
        pageWidth / 2,
        finalY + 96,
        { align: "center", maxWidth: pageWidth - margin * 2 }
      );

      doc.save(`receipt-${order.id}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleDownload}
      disabled={generating}
      variant="outline"
      className="rounded-full border-2 border-foreground shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_var(--foreground)] dark:border-gold dark:shadow-[3px_3px_0_0_var(--gold)] dark:hover:shadow-[1px_1px_0_0_var(--gold)]"
    >
      {generating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {generating ? "Preparing..." : "Download Receipt"}
    </Button>
  );
}