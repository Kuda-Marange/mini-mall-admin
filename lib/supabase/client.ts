import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in the browser (client components only).
 * Reads/writes the session via cookies so the server can pick it up too.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}