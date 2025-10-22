import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.NEXT_PUBLIC_NAVASAN_KEY
  if (!key) return NextResponse.json({ ok: false, error: "NAVASAN key missing" }, { status: 500 })

  try {
    const res = await fetch(`https://api.navasan.tech/latest/?item=18ayar&api_key=${key}`, { cache: "no-store" })
    if (!res.ok) throw new Error("navasan fetch failed")
    const data = await res.json()

    const valueStr = data?.["18ayar"]?.value
    const tomanPerGram = Number(valueStr)
    if (!tomanPerGram || Number.isNaN(tomanPerGram)) throw new Error("invalid 18ayar value")

    return NextResponse.json({ ok: true, tomanPerGram, source: "18ayar" })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "rate error" }, { status: 500 })
  }
}
