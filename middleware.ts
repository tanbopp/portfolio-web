import { NextRequest, NextResponse } from "next/server";

const CPANEL_HOST = "cpanel.tanbopp.my.id";

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").replace(/:\d+$/, "").toLowerCase();
  const isCpanel = host === CPANEL_HOST;
  const { pathname } = req.nextUrl;

  if (isCpanel) {
    // cPanel subdomain → admin panel; root goes straight to the login page
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
    return NextResponse.next();
  }

  // Main domain → hide the admin/auth routes
  if (pathname === "/auth" || pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/admin/:path*"],
};
