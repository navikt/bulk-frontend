import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

console.log("debug", "---------------- Initialize logger. -------------");

export function middleware(request: NextRequest) {
  // Extract only the token part of the header, removed
  //  const cookie: string | undefined = request.headers.get("authorization")?.split(" ")[1];
  // const pathname = request.nextUrl.pathname.split("/").splice(3).join("/");
  // const query = request.nextUrl.searchParams;
  // const totalpath = pathname + "?" + query;
  const url = request.nextUrl.clone();
  url.hostname = "bulk-backend.dev.intern.nav.no";
  url.port = "";
  url.protocol = "https";
  url.pathname = url.pathname.split("/").splice(3).join("/");
  const response = NextResponse.redirect(url);
  const token = request.headers.get("authorization");
  console.log("debug", `Auth token: ${token}`);
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
