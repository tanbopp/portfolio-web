import { NextRequest, NextResponse } from "next/server";

const CPANEL_HOST = "cpanel.tanbopp.my.id";

function isLocalHost(host: string): boolean {
  return (
    host === "localhost" ||
    host.startsWith("localhost:") ||
    host === "127.0.0.1" ||
    host.startsWith("127.0.0.1:")
  );
}

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

  // Main domain → hide the admin/auth routes (but keep them accessible locally)
  if (
    !isLocalHost(host) &&
    (pathname === "/auth" || pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/admin/:path*"],
};
