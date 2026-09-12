import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Full admin privileges — bypasses RLS
 * entirely. NEVER import this into a client component, and NEVER give
 * SUPABASE_SERVICE_ROLE_KEY a NEXT_PUBLIC_ prefix. Server-only. Used
 * exclusively by the gated admin signup route.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}