import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE_NAME } from "./lib/admin/auth/session";
import { canAccess } from "./lib/admin/permissions";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Hanya periksa rute /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = decodeSession(cookie);

  // Jika membuka halaman login
  if (pathname === "/admin/login") {
    if (session) {
      // Sudah login -> alihkan ke /admin
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Jika belum login dan mengakses halaman selain /admin/login
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    if (cookie) {
      loginUrl.searchParams.set("reason", "expired");
    } else {
      loginUrl.searchParams.set("next", pathname + search);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login, cek hak akses rute (mis. /admin/akun hanya untuk owner)
  if (!canAccess(session.role, pathname)) {
    return NextResponse.redirect(new URL("/admin/akses-ditolak", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
