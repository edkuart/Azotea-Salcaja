import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only intercept /admin paths
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Login page is always public
  if (pathname === "/admin/login") {
    // If already authenticated, redirect to dashboard
    const token = req.cookies.get("az_session")?.value;
    const session = await decrypt(token);
    if (session?.userId) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  // All other /admin/* routes require a valid session
  const token = req.cookies.get("az_session")?.value;
  const session = await decrypt(token);

  if (!session?.userId) {
    const loginUrl = new URL("/admin/login", req.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)"],
};
