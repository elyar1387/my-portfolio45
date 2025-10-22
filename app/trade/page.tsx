"use client"

import { useState, useEffect } from "react"
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
import { useRouter } from "next/navigation"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function TradeGold() {
  const [goldPrice, setGoldPrice] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [chartData, setChartData] = useState<any>(null)
  const [trades, setTrades] = useState<{ type: string; weight: number; price: number; date: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/rates/gold", { cache: "no-store" })
        const data = await res.json()
        if (data.ok && data.tomanPerGram) {
          setGoldPrice(data.tomanPerGram)
        }
      } catch {
        setGoldPrice(8325000)
      }
    }
    fetchPrice()
  }, [])

  useEffect(() => {
    if (!goldPrice) return
    const prices = Array.from({ length: 12 }, (_, i) => ({
      time: new Date(Date.now() - (11 - i) * 3600000).toLocaleTimeString("fa-IR", { hour: "2-digit" }),
      price: goldPrice + Math.random() * 200000 - 100000,
    }))
    setChartData({
      labels: prices.map((p) => p.time),
      datasets: [
        {
          label: "قیمت طلا ۱۸ عیار (تومان)",
          data: prices.map((p) => p.price),
          borderColor: "rgba(234, 179, 8, 1)",
          backgroundColor: "rgba(253, 224, 71, 0.3)",
          fill: true,
          tension: 0.4,
        },
      ],
    })
  }, [goldPrice])

  const handleWeightChange = (w: number) => {
    setWeight(w)
    setAmount(w * goldPrice)
  }
  const handleAmountChange = (a: number) => {
    setAmount(a)
    setWeight(a / goldPrice)
  }

  const makeTrade = (type: string) => {
    if (weight <= 0) return
    const newTrade = {
      type,
      weight,
      price: weight * goldPrice,
      date: new Date().toLocaleString("fa-IR"),
    }
    const updatedTrades = [newTrade, ...trades]
    setTrades(updatedTrades)
    localStorage.setItem("trades", JSON.stringify(updatedTrades))
    setWeight(0)
    setAmount(0)
  }

  const deleteTrade = (index: number) => {
    const updatedTrades = trades.filter((_, i) => i !== index)
    setTrades(updatedTrades)
    localStorage.setItem("trades", JSON.stringify(updatedTrades))
  }

  useEffect(() => {
    const savedTrades = localStorage.getItem("trades")
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades))
    }
  }, [])

  // ✅ به فرم سفارش بفرست
  const handleRegisterOrder = (trade: any) => {
    const q = new URLSearchParams({
      type: "gold",
      weight: String(trade.weight),
      price: String(trade.price),
    }).toString()

  router.push(`/orders/new?${q}`)

  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-yellow-900 mb-6">ترید طلای آب‌شده</h1>

      {/* قیمت لحظه‌ای */}
      <motion.div
        className="w-full max-w-2xl p-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold">قیمت لحظه‌ای ۱ گرم ۱۸ عیار</h2>
        <p className="text-3xl font-bold mt-2">
          {goldPrice ? goldPrice.toLocaleString("fa-IR") + " تومان" : "—"}
        </p>
      </motion.div>

      {/* ماشین حساب */}
      <motion.div
        className="w-full max-w-2xl p-6 rounded-2xl bg-gradient-to-br from-yellow-100 via-white to-yellow-200 shadow-xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-yellow-900 mb-4">📊 ماشین حساب معامله</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <label className="font-semibold text-yellow-900">وزن (گرم):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="w-full mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-yellow-700 text-center text-gray-900"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <label className="font-semibold text-yellow-900">مبلغ (تومان):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="w-full mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-yellow-700 text-center text-gray-900"
            />
          </motion.div>
        </div>
        <div className="flex gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => makeTrade("خرید")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-md"
          >
            خرید
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => makeTrade("فروش")}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-md"
          >
            فروش
          </motion.button>
        </div>
      </motion.div>

      {/* نمودار */}
      <motion.div
        className="w-full max-w-2xl p-4 rounded-2xl bg-white shadow-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-lg font-bold text-yellow-900 mb-2">نمودار قیمت ۲۴ ساعت اخیر</h3>
        {chartData && <Line data={chartData} />}
      </motion.div>

      {/* جدول معاملات اخیر */}
      <motion.div
        className="w-full max-w-2xl rounded-2xl bg-white border border-yellow-200 p-4 shadow-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-lg font-bold text-yellow-900 mb-3">معاملات اخیر شما</h3>
        {trades.length === 0 ? (
          <p className="text-yellow-800 text-center">هنوز معامله‌ای انجام نداده‌اید.</p>
        ) : (
          <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-yellow-300 text-gray-900">
                <th className="p-2 text-center">نوع</th>
                <th className="p-2 text-center">وزن (گرم)</th>
                <th className="p-2 text-center">مبلغ (تومان)</th>
                <th className="p-2 text-center">تاریخ</th>
                <th className="p-2 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr
                  key={i}
                  className="odd:bg-yellow-50 even:bg-yellow-100 hover:bg-yellow-200 transition text-gray-900"
                >
                  <td className="p-2 font-bold text-center">{t.type}</td>
                  <td className="p-2 text-center font-medium">{t.weight.toFixed(2)}</td>
                  <td className="p-2 text-center font-medium">{t.price.toLocaleString("fa-IR")}</td>
                  <td className="p-2 text-center font-medium">{t.date}</td>
                  <td className="p-2 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => deleteTrade(i)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => handleRegisterOrder(t)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs"
                    >
                      ثبت سفارش
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* دکمه بازگشت */}
      <motion.a
        href="/"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-lg"
      >
        ⬅ بازگشت به صفحه اصلی
      </motion.a>
    </main>
  )
}
