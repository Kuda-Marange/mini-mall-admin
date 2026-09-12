import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use on the server (Route Handlers, Server Components,
 * Server Actions). Reads the session from the request's cookies, so queries
 * run as the logged-in admin and satisfy RLS policies scoped to `authenticated`.
 *
 * IMPORTANT: this replaces the old anon-key singleton in lib/supabase.ts for
 * any route that needs to read/update/delete orders. Call this fresh per
 * request — don't cache the client at module scope.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll was called from a Server Component that can't set
            // cookies directly. Safe to ignore as long as middleware.ts
            // is refreshing the session on every request.
          }
        },
      },
    }
  );
}