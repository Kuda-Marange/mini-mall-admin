const STORAGE_KEY = "mini-mall-recent-orders";
const MAX_ENTRIES = 5;

export interface RecentOrder {
  code: string;
  pizzaName: string;
  customerName: string;
  placedAt: string; // ISO date string
}

// Cache the last-parsed snapshot alongside the raw string it came from, so
// getRecentOrders() only allocates a new array when localStorage's actual
// content changed — required by useSyncExternalStore, which treats any new
// reference from getSnapshot as a change and re-renders, looping forever
// if a fresh array is returned on every call regardless of content.
let cachedRaw: string | null = null;
let cachedSnapshot: RecentOrder[] = [];

function readAll(): RecentOrder[] {
  if (typeof window === "undefined") return cachedSnapshot;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedSnapshot;
  }

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;

  try {
    if (!raw) {
      cachedSnapshot = [];
      return cachedSnapshot;
    }

    const parsed = JSON.parse(raw);
    cachedSnapshot = Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupted storage — fail quietly, this is a convenience feature.
    cachedSnapshot = [];
  }

  return cachedSnapshot;
}

export function getRecentOrders(): RecentOrder[] {
  return readAll();
}

export function saveRecentOrder(order: RecentOrder): void {
  if (typeof window === "undefined") return;

  try {
    const existing = readAll().filter((o) => o.code !== order.code);
    const updated = [order, ...existing].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("recent-orders-changed"));
  } catch {
    // Storage full or unavailable — not worth surfacing to the customer.
  }
}

export function removeRecentOrder(code: string): void {
  if (typeof window === "undefined") return;

  try {
    const updated = readAll().filter((o) => o.code !== code);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("recent-orders-changed"));
  } catch {
    // Ignore.
  }
}

// For useSyncExternalStore: subscribe to both cross-tab storage events and
// our own same-tab custom event (native "storage" events don't fire in the
// tab that made the change, only other tabs).
export function subscribeToRecentOrders(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener("recent-orders-changed", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("recent-orders-changed", callback);
  };
}