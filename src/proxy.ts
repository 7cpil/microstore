import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  const isLoggedIn = !!token;
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnAuth = pathname.startsWith("/auth");
  const isOnOrders = pathname.startsWith("/orders");
  const isOnCheckout = pathname.startsWith("/checkout");

  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (isOnAdmin && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if ((isOnOrders || isOnCheckout) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/orders/:path*", "/checkout/:path*"],
};
