import { NextRequest, NextResponse } from "next/server";
import { useGetCookies } from "./hook/useCookie";

export async function middleware(req: NextRequest) {
  const refresh_token = await useGetCookies();

  if (!refresh_token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
