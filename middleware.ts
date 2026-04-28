import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isExpired(token: string) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 < Date.now();
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value || null;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isApi = pathname.startsWith("/api");

  console.log("middleware発火")
  console.log("token", token)

  if (!token && !isAuthPage && !isApi) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // if (!token || isExpired(token)) {
  //   return NextResponse.redirect(new URL("/login", req.url))
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/cart/:path*", "/orders/:path*"],
};
