import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken = request.cookies.get("kgh_admin_session")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = atob(sessionToken);
      const [email, timestamp, secret] = decoded.split(":");
      const expectedSecret = process.env.ADMIN_SECRET_KEY || "kgh_dental_secret_2026";
      const tokenAge = Date.now() - Number(timestamp);
      const isSecretValid = secret === expectedSecret;
      const isFresh = !isNaN(tokenAge) && tokenAge < 7 * 24 * 60 * 60 * 1000;

      if (!email || !isSecretValid || !isFresh) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("kgh_admin_session");
        return response;
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("kgh_admin_session");
      return response;
    }
  }

  // If already logged in and visiting /admin/login, redirect to /admin
  if (pathname === "/admin/login") {
    const sessionToken = request.cookies.get("kgh_admin_session")?.value;
    if (sessionToken) {
      try {
        const decoded = atob(sessionToken);
        const [, timestamp, secret] = decoded.split(":");
        const expectedSecret = process.env.ADMIN_SECRET_KEY || "kgh_dental_secret_2026";
        const tokenAge = Date.now() - Number(timestamp);
        if (secret === expectedSecret && !isNaN(tokenAge) && tokenAge < 7 * 24 * 60 * 60 * 1000) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        // invalid token, allow login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
