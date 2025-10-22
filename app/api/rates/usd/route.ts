import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.NEXT_PUBLIC_NAVASAN_KEY
  if (!key) return NextResponse.json({ ok: false, error: "NAVASAN key missing" }, { status: 500 })

  try {
    const res = await fetch(`https://api.navasan.tech/latest/?item=usd_sell&api_key=${key}`, { cache: "no-store" })
    if (!res.ok) throw new Error("navasan fetch failed")
    const data = await res.json()

    const valueStr = data?.usd_sell?.value
    const toman = Number(valueStr)
    if (!toman || Number.isNaN(toman)) throw new Error("invalid usd_sell value")

    return NextResponse.json({ ok: true, toman, source: "usd_sell" })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "rate error" }, { status: 500 })
  }
}
