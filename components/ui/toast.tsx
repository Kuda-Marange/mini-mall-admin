"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

import { cn } from "cn";

interface ToastPayload {
  title: string;
  description?: string;
}

interface ToastItem extends ToastPayload {
  id: number;
  leaving: boolean;
}

const TOAST_EVENT = "mini-mall:toast";
const AUTO_DISMISS_MS = 4000;
const EXIT_ANIMATION_MS = 200;

/**
 * Fire-and-forget toast. Safe to call from anywhere client-side;
 * the toast survives client-side navigation because the <Toaster />
 * lives in the dashboard layout.
 */
export function showToast(toast: ToastPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: toast }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    const timers: number[] = [];

    function dismiss(id: number) {
      // Mark as leaving so the exit animation plays, then remove.
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      timers.push(
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, EXIT_ANIMATION_MS)
      );
    }

    function handleShow(event: Event) {
      const detail = (event as CustomEvent<ToastPayload>).detail;
      const id = ++counter;
      setToasts((prev) => [...prev, { ...detail, id, leaving: false }]);
      timers.push(window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS));
    }

    window.addEventListener(TOAST_EVENT, handleShow);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleShow);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function handleManualDismiss(id: number) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_MS);
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-leaving={toast.leaving}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg",
            "data-[leaving=false]:animate-in data-[leaving=false]:fade-in-0 data-[leaving=false]:slide-in-from-bottom-2 data-[leaving=false]:duration-200",
            "data-[leaving=true]:animate-out data-[leaving=true]:fade-out-0 data-[leaving=true]:slide-out-to-right-2 data-[leaving=true]:duration-200"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {toast.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleManualDismiss(toast.id)}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss notification</span>
          </button>
        </div>
      ))}
    </div>
  );
}