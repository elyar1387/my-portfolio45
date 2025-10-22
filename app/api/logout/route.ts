// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

const COOKIE_NAME = "meligold_token";

export async function POST() {
  const cookie = `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
