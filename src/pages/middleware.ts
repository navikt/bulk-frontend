// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// import { getSession } from 'next-auth/react'

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookie: string | null = request.headers.get("authorization");
  if (cookie) {
    response.cookies.set("AuthorizationCookie", cookie);
  }
  return response;
}