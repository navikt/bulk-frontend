import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createLogger, format, transports } from "winston";
const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ",
    }),
    format.json(),
  ),
  transports: [new transports.Console()],
});
logger.log("debug", "---------------- Initialize logger. -------------");

export function middleware(request: NextRequest) {
  // Extract only the token part of the header, removed
  //  const cookie: string | undefined = request.headers.get("authorization")?.split(" ")[1];
  // const pathname = request.nextUrl.pathname.split("/").splice(3).join("/");
  // const query = request.nextUrl.searchParams;
  // const totalpath = pathname + "?" + query;
  const url = request.nextUrl.clone();
  url.hostname = "bulk-backend.dev.intern.nav.no";
  const response = NextResponse.redirect(url);
  const token = request.headers.get("authorization");
  logger.log("debug", `Auth token: ${token}`);
  if (token !== null) request.headers.set("authorization", token);
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
