"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";

interface OrderSearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (value: "grid" | "list") => void;
  onFilterClick?: () => void;
}

export function OrderSearchFilterBar({
  search,
  onSearchChange,
  view,
  onViewChange,
  onFilterClick,
}: OrderSearchFilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search order..."
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border border-border p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={`p-1.5 rounded-sm transition-colors ${
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`p-1.5 rounded-sm transition-colors ${
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <Button variant="outline" onClick={onFilterClick} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
}
