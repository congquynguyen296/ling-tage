import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "@/config/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const roleCookie = request.cookies.get(AUTH_CONFIG.cookieName)?.value;

    if (roleCookie !== AUTH_CONFIG.adminRole) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "admin_required");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

