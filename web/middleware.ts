import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveUserRole } from "./lib/admin/auth/supabase-user";
import { canAccess } from "./lib/admin/permissions";

const publicAdminRoutes = new Set([
  "/admin/login",
  "/admin/signup",
  "/admin/akses-ditolak",
]);

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname, search } = request.nextUrl;
  const isPublicAdminRoute = publicAdminRoutes.has(pathname);

  if (!user && !isPublicAdminRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === "/admin/login" || pathname === "/admin/signup")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (user && !isPublicAdminRoute) {
    const role = resolveUserRole(user);
    if (!role || !canAccess(role, pathname)) {
      return NextResponse.redirect(new URL("/admin/akses-ditolak", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
