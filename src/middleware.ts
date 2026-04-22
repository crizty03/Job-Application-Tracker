import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");
  
  if (isApiAuthRoute) return NextResponse.next();
  
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
