import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const protectedRoutes = ["/home"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const request = req as NextRequest & { auth?: any };

  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !request.auth) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});
