import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Extract only the token part of the header, removed
  //  const cookie: string | undefined = request.headers.get("authorization")?.split(" ")[1];
  const pathname = request.nextUrl.pathname.split("/").splice(3).join("/");
  const response = NextResponse.redirect("https://bulk-backend.dev.intern.nav.no/" + pathname);
  const token = request.headers.get("authorization");
  if (token !== null) response.headers.set("authorization", token);
  return response;

  // if (cookie && cookie.startsWith("Bearer ")) {
  //   response.cookies.set("AuthorizationCookie", cookie.substring(7), {
  //     httpOnly: true,
  //     domain: "bulk-backend.dev.intern.nav.no",
  //     sameSite: "none",
  //     secure: true,
  //   });
}

export const config = {
  matcher: "/api/v1/:path*",
};
