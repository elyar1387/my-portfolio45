"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RefreshCw, Plus, Minus, Home } from "lucide-react"

type Rates = {
  ok: boolean
  usd: number
  gold18: number
  gold24: number
  coins: { sekkeh: number; nim: number; rob: number; gerami: number }
  bars: { bar1g: number; bar5g: number }
}

type Product =
  | { id: "sekkeh"; name: "سکه تمام بهار آزادی"; type: "coin" }
  | { id: "nim"; name: "نیم‌سکه"; type: "coin" }
  | { id: "rob"; name: "ربع‌سکه"; type: "coin" }
  | { id: "gerami"; name: "سکه گرمی"; type: "coin" }
  | { id: "bar1g"; name: "شمش ۱ گرمی 24K"; type: "bar" }
  | { id: "bar5g"; name: "شمش ۵ گرمی 24K"; type: "bar" }

const PRODUCTS: Product[] = [
  { id: "sekkeh", name: "سکه تمام بهار آزادی", type: "coin" },
  { id: "nim", name: "نیم‌سکه", type: "coin" },
  { id: "rob", name: "ربع‌سکه", type: "coin" },
  { id: "gerami", name: "سکه گرمی", type: "coin" },
  { id: "bar1g", name: "شمش ۱ گرمی 24K", type: "bar" },
  { id: "bar5g", name: "شمش ۵ گرمی 24K", type: "bar" },
]

const fnum = (n?: number | null) =>
  typeof n === "number" && Number.isFinite(n) && n > 0 ? n.toLocaleString("fa-IR") : "—"

export default function CoinsBarsPage() {
  const router = useRouter()
  const [rates, setRates] = useState<Rates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qty, setQty] = useState<Record<string, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 1]))
  )

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/rates/all", { cache: "no-store" })
      const data: Rates = await res.json()
      if (!data.ok) throw new Error("rates not ok")
      setRates(data)
    } catch {
      setError("❌ خطا در دریافت نرخ‌ها")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const unitPrice = (p: Product) => {
    if (!rates) return 0
    return p.type === "coin"
      ? Math.max(0, rates.coins[p.id as keyof typeof rates.coins] || 0)
      : Math.max(0, rates.bars[p.id as keyof typeof rates.bars] || 0)
  }

  // ✅ اتصال درست دکمه ثبت سفارش به فرم سفارش
  const handleBuy = (p: Product) => {
    const count = Math.max(1, qty[p.id] ?? 1)
    const price = unitPrice(p)
    if (!price) return alert("قیمت این کالا در حال حاضر در دسترس نیست.")

    const q = new URLSearchParams({
      type: p.name,
      amount: String(count),
      price: String(price),
    }).toString()

    router.push(`/orders/new?${q}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900">خرید و فروش سکه و شمش</h1>
          <p className="text-amber-700/80 mt-1">قیمت‌ها بر اساس نوسان بازار و نرخ لحظه‌ای طلا و دلار.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 shadow">
            <Home className="w-5 h-5" /> بازگشت به خانه
          </Link>
          <button onClick={fetchAll} className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 shadow">
            <RefreshCw className="w-5 h-5" /> بروزرسانی قیمت‌ها
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[{ title: "قیمت دلار", value: rates?.usd },
          { title: "قیمت هر گرم طلا ۱۸ عیار", value: rates?.gold18 },
          { title: "قیمت هر گرم طلا ۲۴ عیار", value: rates?.gold24 },
        ].map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white shadow border border-amber-200 p-5">
            <div className="text-sm text-amber-800/80">{r.title}</div>
            <div className="text-2xl font-extrabold text-amber-900 mt-1">
              {fnum(r.value)} <span className="text-base font-bold text-amber-800">تومان</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* گرید کالاها */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((p, i) => {
          const price = unitPrice(p)
          const disabled = price <= 0
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-3xl bg-white shadow-lg border border-amber-100 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-amber-900">{p.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${p.type === "coin" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                  {p.type === "coin" ? "سکه" : "شمش"}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3">
                <div className="text-amber-700/80 text-sm">قیمت واحد</div>
                <div className="text-xl font-extrabold text-amber-900">{fnum(price)} <span className="text-sm font-bold text-amber-800">تومان</span></div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(prev => ({ ...prev, [p.id]: Math.max(1, (prev[p.id] ?? 1) - 1) }))} className="p-2 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input type="number" className="w-16 text-center rounded-lg border border-amber-300 px-2 py-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={qty[p.id]} onChange={(e) => setQty(prev => ({ ...prev, [p.id]: Math.max(1, Number(e.target.value)) }))} min={1} />
                  <button onClick={() => setQty(prev => ({ ...prev, [p.id]: (prev[p.id] ?? 1) + 1 }))} className="p-2 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button disabled={disabled} onClick={() => handleBuy(p)} className={`rounded-xl px-5 py-2 font-bold shadow ${disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700 text-white"}`}>
                  ثبت سفارش
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </main>
  )
}
