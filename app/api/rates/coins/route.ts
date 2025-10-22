// app/api/rates/coins/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.NEXT_PUBLIC_NAVASAN_KEY
  if (!key) {
    return NextResponse.json({ ok: false, error: "NAVASAN key missing" }, { status: 500 })
  }

  try {
    const res = await fetch(`https://api.navasan.tech/latest/?api_key=${key}`, { cache: "no-store" })
    const data = await res.json()

    // تبدیل به تومان
    const usd = Math.round(Number(data?.usd?.value) / 10)
    const sekkeh = Math.round(Number(data?.sekkeh?.value) / 10)
    const nim = Math.round(Number(data?.nim?.value) / 10)
    const rob = Math.round(Number(data?.rob?.value) / 10)
    const gerami = Math.round(Number(data?.gerami?.value) / 10)

    return NextResponse.json({ ok: true, usd, sekkeh, nim, rob, gerami })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "fetch error" }, { status: 500 })
  }
}
