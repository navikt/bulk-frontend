import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.pathname.includes("/_next")) {
    return response;
  }

  // Extract only the token part of the header, removed
  //  const cookie: string | undefined = request.headers.get("authorization")?.split(" ")[1];
  const cookie: string | null = request.headers.get("authorization");

  if (cookie && cookie.startsWith("Bearer ")) {
    response.cookies.set("AuthorizationCookie", cookie.substring(7), {
      httpOnly: true,
      domain: "bulk-backend.dev.intern.nav.no",
      sameSite: "none",
      secure: true,
    });
  }

  return response;
}
