import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret")

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtectedPage =
    pathname.startsWith("/account") ||
    pathname.startsWith("/wallet") ||
    pathname.startsWith("/trade") ||
    pathname.startsWith("/coins-bars") ||
    pathname.startsWith("/admin")

  // کاربر لاگین نکرده
  if (!token) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    // اجازه بده بره login/register یا صفحات عمومی
    return NextResponse.next()
  }

  // بررسی توکن
  try {
    await jwtVerify(token, JWT_SECRET)

    // اگر لاگین کرده بود، نذاره به login/register بره
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/account", req.url))
    }

    return NextResponse.next()
  } catch {
    // توکن نامعتبر یا منقضی شده
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/account",
    "/wallet",
    "/trade",
    "/coins-bars",
    "/admin",
  ],
}
