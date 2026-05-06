import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });

  const isAdminPage = req.nextUrl.pathname.startsWith("/portal/admin");

  // ❌ inte inloggad
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ❌ inte admin
  if (isAdminPage && token.role !== "Headquarters") {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};