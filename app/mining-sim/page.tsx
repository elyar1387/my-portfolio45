"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
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
import { ArrowRight, Factory, Activity, Gauge, Zap, Truck, Pickaxe, Home } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const fnum = (n?: number) =>
  Number.isFinite(n) ? (n as number).toLocaleString("fa-IR") : "—"

export default function MiningSimPage() {
  // قیمت واقعی از بک‌اند خودت
  const [gold18, setGold18] = useState<number>(0)

  // پارامترهای شبیه‌سازی (قابل تغییر با اسلایدر)
  const [grade, setGrade] = useState(2.5)          // g/t (عیار سنگ)
  const [recovery, setRecovery] = useState(90)     // %
  const [throughput, setThroughput] = useState(800) // t/day (تناژ روزانه)
  const [costPerTon, setCostPerTon] = useState(450_000) // تومان/تن (AISC ساده‌شده)
  const [lossFactor, setLossFactor] = useState(5)  // % (اتلاف فرآیندی/عملیاتی)

  // دریافت قیمت ۱۸ عیار
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const r = await fetch("/api/rates/all", { cache: "no-store" })
        const d = await r.json()
        if (d?.ok && d.gold18 > 0) setGold18(d.gold18)
        else setGold18(9_000_000) // fallback معقول
      } catch {
        setGold18(9_000_000)
      }
    }
    fetchRates()
  }, [])

  // محاسبات اصلی شبیه‌سازی
  const calc = useMemo(() => {
    // جرم طلای محتوی در خوراک (g/day)
    const contained_g = throughput * grade
    // بازیابی موثر
    const rec = Math.min(Math.max(recovery, 0), 100) / 100
    const loss = Math.min(Math.max(lossFactor, 0), 100) / 100
    const recovered_g = contained_g * rec * (1 - loss)

    // تبدیل گرم به اونس تروا (1 oz ≈ 31.1035 g)
    const recovered_oz = recovered_g / 31.1035

    // قیمت هر گرم پایه: از ۱۸ عیار به خلوص 24K نزدیک کنیم (تقریب: /0.75)
    const pricePerGram24K = gold18 > 0 ? Math.round(gold18 / 0.75) : 0

    // درآمد روزانه (تومان)
    const revenue_day = Math.max(0, recovered_g) * pricePerGram24K

    // هزینه روزانه (تومان)
    const opex_day = Math.max(0, throughput) * Math.max(0, costPerTon)

    // سود خالص روزانه
    const profit_day = revenue_day - opex_day

    return {
      contained_g,
      recovered_g,
      recovered_oz,
      pricePerGram24K,
      revenue_day,
      opex_day,
      profit_day,
    }
  }, [throughput, grade, recovery, lossFactor, costPerTon, gold18])

  // داده نمودار پیش‌بینی ۳۰ روزه با کمی نویز
  const chartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    let base = calc.profit_day
    const series = days.map((d) => {
      // کمی نوسان نمایشی
      const jitter = (Math.sin(d / 2.5) * 0.06 + Math.random() * 0.04 - 0.02) * base
      return Math.round(base + jitter)
    })

    return {
      labels: days.map((d) => `روز ${d}`),
      datasets: [
        {
          label: "سود خالص (تومان/روز) – شبیه‌سازی",
          data: series,
          borderColor: "rgba(234, 179, 8, 1)",
          backgroundColor: "rgba(253, 224, 71, 0.25)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 3,
        },
      ],
    }
  }, [calc.profit_day])

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 p-6">
      {/* هدر */}
      <div className="mx-auto max-w-6xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Factory className="w-8 h-8 text-yellow-600" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-900">
              شبیه‌ساز استخراج طلا (دمو آموزشی)
            </h1>
            <p className="text-yellow-800/80 text-sm md:text-base">
              این صفحه یک شبیه‌ساز نمایشی است و برای آموزش/تست UI ساخته شده است.
            </p>
          </div>
        </div>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition"
        >
          <Home className="w-5 h-5" />
          بازگشت به خانه
        </a>
      </div>

      {/* کارت قیمت */}
      <motion.div
        className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-semibold">قیمت ۱ گرم طلای ۱۸ عیار</span>
            <Gauge className="w-6 h-6 opacity-90" />
          </div>
          <div className="text-3xl font-extrabold mt-2">{fnum(gold18)} <span className="text-sm">تومان</span></div>
          <div className="text-white/90 text-sm mt-1">مبنای محاسبه‌ی دمو (24K ≈ 18K / 0.75)</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-yellow-200 shadow">
          <div className="flex items-center justify-between text-yellow-900">
            <span className="font-bold">درآمد روزانه (دمو)</span>
            <Activity className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-gray-900">
            {fnum(calc.revenue_day)} <span className="text-sm text-gray-600">تومان</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">تولید × قیمت تقریبی 24K</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-yellow-200 shadow">
          <div className="flex items-center justify-between text-yellow-900">
            <span className="font-bold">سود خالص روزانه (دمو)</span>
            <Zap className="w-6 h-6 text-yellow-600" />
          </div>
          <div className={`text-2xl font-extrabold mt-2 ${calc.profit_day >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {fnum(calc.profit_day)} <span className="text-sm text-gray-600">تومان</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">درآمد − هزینه‌های روزانه</div>
        </div>
      </motion.div>

      {/* کنترل‌ها */}
      <motion.section
        className="mx-auto max-w-6xl mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* اسلایدرها */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-yellow-200 shadow">
          <h3 className="text-lg font-extrabold text-yellow-900 mb-4 flex items-center gap-2">
            <Pickaxe className="w-5 h-5 text-yellow-600" />
            پارامترهای عملیاتی (دمو)
          </h3>

          <Slider
            label="عیار سنگ (گرم در تُن - g/t)"
            value={grade}
            min={0.1}
            max={10}
            step={0.1}
            onChange={setGrade}
          />

          <Slider
            label="نرخ بازیابی فرآیند (%)"
            value={recovery}
            min={50}
            max={98}
            step={1}
            onChange={setRecovery}
          />

          <Slider
            label="تناژ فرآوری روزانه (t/day)"
            value={throughput}
            min={100}
            max={3000}
            step={50}
            onChange={setThroughput}
          />

          <Slider
            label="اتلاف عملیاتی/فرآیندی (%)"
            value={lossFactor}
            min={0}
            max={20}
            step={1}
            onChange={setLossFactor}
          />

          <Slider
            label="هزینه‌ی عملیاتی به‌ازای هر تُن (تومان/تن)"
            value={costPerTon}
            min={200_000}
            max={2_000_000}
            step={50_000}
            onChange={setCostPerTon}
            format={(v) => `${fnum(v)} تومان`}
          />
        </div>

        {/* نتایج لحظه‌ای */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-100 to-white border border-yellow-200 shadow">
          <h3 className="text-lg font-extrabold text-yellow-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-yellow-600" />
            خروجی‌های لحظه‌ای (دمو)
          </h3>

          <InfoRow title="طلای محتوی در خوراک (g/day)" value={fnum(calc.contained_g)} />
          <InfoRow title="طلای بازیابی‌شده (g/day)" value={fnum(calc.recovered_g)} />
          <InfoRow title="طلای بازیابی‌شده (oz/day)" value={fnum(Number(calc.recovered_oz.toFixed(2)))} />
          <InfoRow title="قیمت تقریبی 24K (تومان/گرم)" value={fnum(calc.pricePerGram24K)} />
          <div className="h-px my-3 bg-yellow-200" />
          <InfoRow title="درآمد روزانه" value={`${fnum(calc.revenue_day)} تومان`} strong />
          <InfoRow title="هزینه روزانه" value={`${fnum(calc.opex_day)} تومان`} />
          <InfoRow
            title="سود خالص روزانه"
            value={`${fnum(calc.profit_day)} تومان`}
            strong
            accent={calc.profit_day >= 0 ? "green" : "red"}
          />

          <div className="mt-4 p-3 rounded-xl bg-yellow-50 text-yellow-900 text-sm">
            ⚠️ این یک <b>شبیه‌ساز نمایشی</b> است؛ نتایج جنبه‌ی آموزشی دارند و قابل اتکا برای تصمیم‌گیری واقعی نیستند.
          </div>
        </div>
      </motion.section>

      {/* نمودار سود ۳۰ روزه */}
      <motion.section
        className="mx-auto max-w-6xl mt-8 p-6 rounded-2xl bg-white border border-yellow-200 shadow"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-extrabold text-yellow-900 mb-4">نمودار پیش‌بینی سود ۳۰ روزه (دمو)</h3>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
                     plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(255,180,0,0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 12,
                callbacks: {
                  label: (ctx) => ` ${ctx.parsed.y.toLocaleString("fa-IR")} تومان`,
                },
              },
            },
            elements: {
              line: { tension: 0.35, borderWidth: 3 },
              point: { radius: 0, hoverRadius: 7 },
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: "#b45309", font: { weight: "bold" } } },
              y: {
grid: { color: "rgba(234,179,8,0.12)" },

                ticks: {
                  color: "#b45309",
                  font: { weight: "bold" },
                  callback: (val: any) => Number(val).toLocaleString("fa-IR"),
                },
              },
            },
            animation: { duration: 1500, easing: "easeOutQuart" },
          }}
          height={380}
        />
      </motion.section>

      {/* فوتر دمو */}
      <div className="mx-auto max-w-6xl text-center text-yellow-800/80 mt-8">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 border border-yellow-200">
          این صفحه صرفاً یک <b>دمو/شبیه‌سازی آموزشی</b> است
          <ArrowRight className="w-4 h-4" />
          آمار و خروجی‌ها واقعی نیستند
        </span>
      </div>
    </main>
  )
}

/** Components */

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-900 font-semibold">{label}</span>
        <span className="text-yellow-700 font-bold">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        className="w-full accent-yellow-500"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function InfoRow({
  title,
  value,
  strong,
  accent,
}: {
  title: string
  value: string | number
  strong?: boolean
  accent?: "green" | "red"
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{title}</span>
      <span
        className={[
          "text-base",
          strong ? "font-extrabold" : "font-bold",
          accent === "green" ? "text-emerald-600" : accent === "red" ? "text-red-600" : "text-gray-900",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  )
}
