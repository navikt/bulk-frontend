import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.pathname.includes("/_next")) {
    return response;
  }

  const cookie: string | null = request.headers.get("authorization");
  if (cookie) {
    response.cookies.set("AuthorizationCookie", cookie, {
      httpOnly: true,
    });
  }

  return response;
}
