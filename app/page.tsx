"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, UserPlus, ClipboardList, ShoppingCart, HandCoins, CheckCircle, Truck } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const fnum = (n: number) => (typeof n === "number" ? n.toLocaleString("fa-IR") : n)

export default function Home() {
  const [gold18, setGold18] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chartData, setChartData] = useState<any>(null)
  const [ads, setAds] = useState<any[]>([])

  // دریافت نرخ‌ها
  useEffect(() => {
    const getRates = async () => {
      try {
        const res = await fetch("/api/rates/all", { cache: "no-store" })
        const data = await res.json()
        if (data?.ok && data.gold18 > 0) setGold18(data.gold18)
      } catch {}
    }
    getRates()
  }, [])

  // محاسبه قیمت کل در ماشین حساب
  useEffect(() => {
    setTotal(weight > 0 && gold18 > 0 ? Math.round(weight * gold18) : 0)
  }, [weight, gold18])

  // داده‌های نمودار
  useEffect(() => {
    const base = gold18 > 0 ? gold18 : 9_000_000
    const prices = Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString("fa-IR", { hour: "2-digit" }),
      price: base + Math.round(Math.random() * 180_000 - 90_000),
    }))
    setChartData({
      labels: prices.map((p) => p.time),
      datasets: [
        {
          label: "قیمت طلا (تومان)",
          data: prices.map((p) => p.price),
          borderColor: "#FFD700",
          backgroundColor: "rgba(255,215,0,0.3)",
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 0,
        },
      ],
    })
  }, [gold18])

  // ✅ دریافت آگهی‌ها با هندل مناسب
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/ads", { cache: "no-store" })
        const data = await res.json()
        if (Array.isArray(data)) setAds(data)
        else if (Array.isArray(data.ads)) setAds(data.ads)
        else setAds([])
      } catch (e) {
        console.error("خطا در گرفتن آگهی‌ها", e)
      }
    }
    fetchAds()
  }, [])

  const steps = [
    { title: "ثبت‌نام سریع", desc: "در کمتر از ۱ دقیقه ثبت‌نام کنید", Icon: UserPlus },
    { title: "تکمیل مشخصات", desc: "اطلاعات هویتی خود را ثبت کنید", Icon: ClipboardList },
    { title: "خرید آسان", desc: "میزان طلا یا سکه دلخواه را بخرید", Icon: ShoppingCart },
    { title: "فروش یا تحویل", desc: "برداشت یا تحویل فیزیکی بگیرید", Icon: HandCoins },
  ]

  const deliveryAds = [
    { title: "تحویل سکه درب منزل", desc: "تحویل فوری در تهران و شهرستان‌ها" },
    { title: "ارسال شمش طلا", desc: "بیمه کامل و بسته‌بندی امن" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex flex-col items-center text-white">

      {/* ===== هدر ===== */}
<header className="w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 p-4 flex justify-between items-center shadow-lg">
  <div className="flex gap-4 ml-4">
    <a
      href="/login"
      className="px-4 py-1 rounded-xl bg-white text-yellow-700 font-bold hover:bg-yellow-200 transition"
    >
      ورود
    </a>
    <a
      href="/register"
      className="px-4 py-1 rounded-xl bg-yellow-900 text-white font-bold hover:bg-yellow-800 transition"
    >
      ثبت‌نام
    </a>
  </div>
  <button
    onClick={() => setMenuOpen(true)}
    className="p-2 bg-yellow-700 rounded-full shadow hover:bg-yellow-800 transition"
  >
    <Menu className="w-6 h-6 text-white" />
  </button>
</header>


      {/* ===== منو کشویی ===== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside
              className="fixed right-0 top-0 h-full w-72 bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-700 shadow-2xl z-50 flex flex-col p-6 gap-6 rounded-l-3xl border-l border-yellow-500"
              initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <h2 className="text-2xl font-extrabold text-yellow-300 border-b pb-3 text-center">🌟 MAX-GOLD</h2>
              <nav className="flex flex-col gap-4 mt-4 text-yellow-100">
                <a href="/" className="px-4 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 shadow">خانه</a>
                <a href="/trade" className="px-4 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 shadow">ترید طلا</a>
                <a href="/coins-bars" className="px-4 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 shadow">سکه و شمش</a>
                <a href="/wallet" className="px-4 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 shadow">کیف پول</a>
                <a href="/account" className="px-4 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 shadow">حساب کاربری</a>
                <a href="/admin" className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 shadow font-bold">پنل ادمین</a>
              </nav>
              <button onClick={() => setMenuOpen(false)} className="mt-auto w-full py-3 rounded-xl font-bold shadow-md bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">✖ بستن منو</button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== بنر ===== */}
      <div className="w-full max-w-5xl my-6 px-3">
        <img src="/quote_1756460568004.png" alt="بنر تبلیغاتی" className="w-full rounded-xl shadow-2xl" />
      </div>

      {/* ===== نمودار ===== */}
      <motion.section className="w-full max-w-6xl my-10 rounded-2xl p-6 bg-gradient-to-br from-gray-800/60 to-gray-700/50 shadow-2xl border border-yellow-700"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
      >
        <h3 className="text-3xl font-extrabold text-center text-yellow-400 mb-6">📈 تغییرات ۲۴ ساعت اخیر</h3>
        <div className="h-[400px]">
          {chartData && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />}
        </div>
      </motion.section>

      {/* ===== ماشین حساب ===== */}
      <motion.div className="w-full max-w-md my-20" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <motion.div className="rounded-3xl shadow-2xl p-6 flex flex-col gap-6 bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600">
          <h2 className="text-xl font-bold text-black text-center">📊 ماشین حساب طلا</h2>
          <div className="rounded-2xl bg-black/30 text-center p-3 font-bold text-yellow-300">
            قیمت هر گرم ۱۸ عیار: <span>{gold18 > 0 ? `${fnum(gold18)} تومان` : "—"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-black font-semibold">وزن (گرم):</label>
            <input type="number" min={0} value={weight} onChange={(e) => setWeight(Number(e.target.value))}
              className="p-3 rounded-xl text-center font-bold text-lg bg-white text-yellow-900" />
          </div>
          <div className="text-black font-extrabold text-center text-xl">
            {weight > 0 && gold18 > 0 ? `قیمت کل: ${fnum(total)} تومان` : "قیمت کل: —"}
          </div>
        </motion.div>
      </motion.div>

      {/* ===== محصولات ===== */}
      <section className="w-full max-w-6xl px-4 py-16">
        <h3 className="text-3xl font-extrabold text-yellow-400 text-center mb-12">🏆 محصولات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {ads.slice(0, 4).map((ad: any, i: number) => (
            <div key={i} className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-yellow-500 flex flex-col justify-between">
              <div>
                {ad.image && (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-40 object-cover rounded-xl mb-3 border border-yellow-700"
                  />
                )}
                <h4 className="text-lg font-bold text-yellow-300 mb-2">{ad.title}</h4>
                <p className="text-gray-300">{ad.desc}</p>
                {ad.price ? (
                  <p className="mt-3 text-yellow-400 font-bold">{fnum(ad.price)} تومان</p>
                ) : null}
              </div>
              <a href="/market" className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600 text-center">
                مشاهده
              </a>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/market" className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white font-bold shadow">
            دیدن همه
          </a>
        </div>
      </section>

      {/* ===== تحویل فیزیکی ===== */}
      <section className="w-full max-w-6xl px-4 py-16">
        <h3 className="text-3xl font-extrabولد text-yellow-400 text-center mb-12 flex items-center justify-center gap-2">
          <Truck className="w-8 h-8 text-yellow-400" /> تحویل فیزیکی طلا
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deliveryAds.map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-yellow-600 text-center"
            >
              <p className="text-xl font-bold text-yellow-200 mb-2">{item.title}</p>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== چهار گام ===== */}
      <section className="relative w-full max-w-6xl px-4 py-12">
        <h3 className="text-2xl md:text-3xl font-extrabold text-yellow-400 text-center mb-10">
          ✨ چهار گام تا اولین معامله
        </h3>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.18 }
            }
          }}
        >
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="rounded-2xl shadow-xl پ-5 bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-600 text-center"
            >
              <item.Icon className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-yellow-200 mb-2">{item.title}</h4>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== چرا ما ===== */}
      <section className="w-full max-w-6xl px-4 py-16">
        <h3 className="text-3xl font-extrabold text-yellow-400 text-center mb-12">🌟؟MAX-GOLD چرا </h3>        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { text: "امنیت بالا", sub: "با زیرساخت رمزنگاری و کیف پول امن", icon: CheckCircle },
            { text: "پشتیبانی ۲۴/۷", sub: "همیشه کنار شما حتی نصف شب", icon: CheckCircle },
            { text: "تسویه سریع", sub: "برداشت ریالی در کمتر از یک ساعت", icon: CheckCircle },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-yellow-600 text-center"
            >
              <item.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-xl font-bold text-yellow-200 mb-2">{item.text}</p>
              <p className="text-gray-300">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== آخرین آگهی‌ها ===== */}
      <section className="w-full max-w-6xl px-4 py-12 overflow-hidden">
        <h3 className="text-2xl font-bold text-yellow-400 mb-8">📰 جدیدترین آگهی‌ها</h3>
        <motion.div className="flex gap-6" animate={{ x: ["0%", "-100%"] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }}>
          {[...ads, ...ads].map((ad: any, i: number) => (
            <div key={i} className="w-72 min-w-[18rem] h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 shadow-xl border border-yellow-500 flex flex-col justify-between mx-2">
              <div>
                <h4 className="text-lg font-bold text-yellow-300 mb-2">{ad.title}</h4>
                <p className="text-gray-300">{ad.desc}</p>
              </div>
              <a href="/market" className="px-4 py-2 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600 text-center">مشاهده</a>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== فوتر ===== */}
      <footer className="w-full bg-gradient-to-r from-gray-950 via-black to-gray-950 border-t border-yellow-600 py-16 mt-10 text-gray-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <div>
            <h4 className="text-yellow-400 font-bold mb-3">MAX-GOLD</h4>
            <p className="text-sm leading-6">سامانه خرید و فروش آنلاین طلا، سکه و شمش با امنیت بالا و پشتیبانی شبانه‌روزی.</p>
          </div>
          <div>
            <h4 className="text-yellow-400 font-bold mb-3">لینک‌ها</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/trade" className="hover:text-yellow-400">ترید طلا</a></li>
              <li><a href="/coins-bars" className="hover:text-yellow-400">خرید سکه و شمش</a></li>
              <li><a href="/wallet" className="hover:text-yellow-400">کیف پول</a></li>
              <li><a href="/account" className="hover:text-yellow-400">حساب کاربری</a></li>
              <li><a href="/admin" className="hover:text-red-400 font-bold">پنل ادمین</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-yellow-400 font-bold mb-3">تماس</h4>
          </div>
          <div>
            <h4 className="text-yellow-400 font-bold mb-3">ما را دنبال کنید</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-yellow-400">📱</a>
              <a href="#" className="hover:text-yellow-400">💬</a>
              <a href="#" className="hover:text-yellow-400">📷</a>
            </div>
          </div>
        </div>
        <p className="text-center text-sm mt-12 text-gray-500">© ۲۰۲۵ MAX-GOLD - تمامی حقوق محفوظ است</p>
      </footer>
    </main>
  )
}
