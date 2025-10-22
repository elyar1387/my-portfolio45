// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // پاک کردن کوکی (maxAge: 0)
  res.cookies.set("token", "", { path: "/", maxAge: 0 })
  return res
}
