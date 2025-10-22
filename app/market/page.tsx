"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function MarketPage() {
  const [ads, setAds] = useState<any[]>([])

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/ads", { cache: "no-store" })
        const data = await res.json()
        if (Array.isArray(data)) {
          setAds(data)
        } else if (Array.isArray(data?.ads)) {
          setAds(data.ads)
        } else {
          setAds([])
        }
      } catch (err) {
        console.error("خطا در گرفتن آگهی‌ها:", err)
        setAds([])
      }
    }
    fetchAds()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-extrabold text-yellow-600 mb-8">🛒 مارکت MAX-GOLD</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="p-6 bg-white shadow rounded-xl border border-yellow-300">
            {ad.image && (
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-2">{ad.title}</h2>
            <p className="text-gray-600 mb-3">{ad.desc}</p>
            <p className="font-bold text-yellow-700 mb-3">
              {ad.price?.toLocaleString("fa-IR")} تومان
            </p>

            {/* دکمه ادامه خرید که به فرم سفارش وصل می‌شود */}
            <Link
              href={`/orders/new?type=${encodeURIComponent(ad.title)}&amount=1&price=${ad.price}`}
              className="block text-center w-full px-4 py-2 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600 transition"
            >
              ادامه خرید ✅
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
