import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that don't require an admin session. Add the public shop's routes
// here once they exist (e.g. "/shop", "/product", "/cart", "/checkout") —
// browsing/checkout must stay login-free per the agreed product shape.
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/api/admin-signup",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/shop",
  "/product",
  "/cart",
  "/checkout",
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: do not remove this call. It refreshes the session token and
  // must run before any redirect logic below.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Guest checkout creates an order via POST /api/orders — must stay
  // login-free. GET (list) and everything under /api/orders/[id] (detail,
  // status update, delete) stay admin-only, so this checks the exact base
  // path AND the method, not a startsWith match like the rest of the list.
  const isGuestOrderCreation =
    path === "/api/orders" && request.method === "POST";

  const isPublicPath =
    isGuestOrderCreation || PUBLIC_PATHS.some((p) => path.startsWith(p));

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (path.startsWith("/login") || path.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};