// app/api/rates/all/route.ts
import { NextResponse } from "next/server"

function safeNum(n: any): number {
  const v = Number(n)
  return Number.isFinite(v) ? v : 0
}

// نرمال‌سازی دلار به "تومان"
function normalizeUsdToToman(raw: number): number {
  if (!raw || raw <= 0) return 0
  // مشاهده‌شده: بعضی کلیدها مقدار را ~10605 می‌دهند که باید *10 شود → 106,050
  // اگر خیلی بزرگ باشد احتمالاً ریال است → /10
  if (raw < 20000) return Math.round(raw * 10)            // مثل 10605 → 106,050
  if (raw > 2_000_000) return Math.round(raw / 10)        // ریال → تومان
  return Math.round(raw)                                   // ظاهراً خودِ تومان
}

// نرمال‌سازی قیمت سکه به "تومان"
function normalizeCoinToToman(raw: number): number {
  if (!raw || raw <= 0) return 0
  // مشاهده‌شده: sekkeh=9710 که باید بشود 97,100,000 → *10000
  if (raw < 1_000_000) return Math.round(raw * 10_000)
  // اگر ریالی باشد (خیلی بزرگ) → /10
  if (raw > 1_000_000_000) return Math.round(raw / 10)
  return Math.round(raw) // احتمالاً خود تومان
}

async function getNavasanLatest(key: string) {
  const url = `https://api.navasan.tech/latest/?api_key=${key}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("navasan latest failed")
  return res.json()
}

async function getMetalsLiveOz(): Promise<number> {
  // پاسخ‌های متفاوت: [number] یا [{gold:number}] یا موارد مشابه
  const res = await fetch("https://api.metals.live/v1/spot/gold", { cache: "no-store" })
  if (!res.ok) throw new Error("metals.live failed")
  const data = await res.json()
  let oz = 0
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0]
    if (typeof first === "number") oz = first
    else if (first && typeof first === "object" && "gold" in first) {
      oz = safeNum(first.gold)
    } else {
      // تلاش برای پیدا کردن اولین عدد
      const vals = Object.values(first ?? {})
      const n = vals.find(v => typeof v === "number")
      oz = safeNum(n)
    }
  }
  if (!oz || oz <= 0) throw new Error("invalid metals.live")
  return oz
}

export async function GET() {
  const key = process.env.NEXT_PUBLIC_NAVASAN_KEY
  if (!key) {
    return NextResponse.json({ ok: false, error: "NAVASAN key missing" }, { status: 500 })
  }

  try {
    const nd = await getNavasanLatest(key)

    // USD (بازار آزاد/فروش)
    const usdRaw =
      safeNum(nd?.usd_sell?.value) ||
      safeNum(nd?.usd?.value) ||
      safeNum(nd?.usdt?.value)

    const usdToman = normalizeUsdToToman(usdRaw)

    // سکه‌ها
    const sekkeh = normalizeCoinToToman(safeNum(nd?.sekkeh?.value))
    const nim    = normalizeCoinToToman(safeNum(nd?.nim?.value))
    const rob    = normalizeCoinToToman(safeNum(nd?.rob?.value))
    const gerami = normalizeCoinToToman(safeNum(nd?.gerami?.value))

    // طلا ۱۸/۲۴ عیار از ناواسان اگر موجود بود
    let gold18 = safeNum(nd?.["18ayar"]?.value)
    gold18 = gold18 ? normalizeCoinToToman(gold18) /* همان منطق مقیاس */ : 0

    let gold24 = 0
    if (gold18 > 0) {
      gold24 = Math.round(gold18 / 0.75) // 24K = 18K / 0.75
    }

    // اگر ۱۸عیار از ناواسان نبود، از metals.live + دلار ناواسان محاسبه کن
    if (!gold24 || !gold18) {
      const usdPerOz = await getMetalsLiveOz() // USD/oz
      if (usdToman > 0) {
        const usdPerGram = usdPerOz / 31.1035
        const tomanPerGram24 = Math.round(usdPerGram * usdToman)
        const tomanPerGram18 = Math.round(tomanPerGram24 * 0.75)
        gold24 = gold24 || tomanPerGram24
        gold18 = gold18 || tomanPerGram18
      }
    }

    // شمش‌ها بر اساس ۲۴ عیار
    const bar1g = gold24 > 0 ? gold24 : 0
    const bar5g = gold24 > 0 ? gold24 * 5 : 0

    return NextResponse.json({
      ok: true,
      usd: usdToman,            // تومان
      gold18,                   // تومان/گرم
      gold24,                   // تومان/گرم
      coins: {
        sekkeh, nim, rob, gerami,
      },
      bars: {
        bar1g, bar5g,
      },
      source: {
        usd: "navasan",
        gold: gold18 ? "navasan/metals.live" : "metals.live×navasan",
        coins: "navasan",
      }
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "rates failed" }, { status: 500 })
  }
}
