"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Truck, User, Mail, Phone } from "lucide-react"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gray-800/70 rounded-3xl shadow-2xl border border-yellow-600 p-8">
        <h1 className="text-3xl font-extrabold text-yellow-400 text-center mb-8">🛒 تکمیل سفارش</h1>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-10">
          {["اطلاعات", "تحویل", "پرداخت"].map((label, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                  step === i + 1
                    ? "bg-yellow-500 text-black"
                    : step > i + 1
                    ? "bg-green-500 text-black"
                    : "bg-gray-600"
                }`}
              >
                {i + 1}
              </div>
              <span className="text-sm mt-2">{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: User Info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-300">
              <User className="w-5 h-5" /> اطلاعات کاربر
            </h2>
            <input placeholder="نام و نام خانوادگی" className="w-full p-3 rounded-xl text-black font-semibold" />
            <input placeholder="ایمیل" className="w-full p-3 rounded-xl text-black font-semibold" />
            <input placeholder="شماره تماس" className="w-full p-3 rounded-xl text-black font-semibold" />
            <div className="flex justify-end gap-4">
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600"
              >
                ادامه ➡
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Delivery */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-300">
              <Truck className="w-5 h-5" /> اطلاعات تحویل
            </h2>
            <textarea
              placeholder="آدرس دقیق تحویل"
              rows={3}
              className="w-full p-3 rounded-xl text-black font-semibold"
            />
            <select className="w-full p-3 rounded-xl text-black font-semibold">
              <option>ارسال فوری (تهران)</option>
              <option>پست پیشتاز (۲-۳ روز)</option>
              <option>تحویل حضوری</option>
            </select>
            <div className="flex justify-between gap-4">
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700"
              >
                ⬅ بازگشت
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600"
              >
                ادامه ➡
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-300">
              <CreditCard className="w-5 h-5" /> پرداخت
            </h2>
            <p className="text-gray-300">لطفا روش پرداخت خود را انتخاب کنید:</p>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-xl cursor-pointer">
                <input type="radio" name="payment" /> پرداخت آنلاین (درگاه بانکی)
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-xl cursor-pointer">
                <input type="radio" name="payment" /> پرداخت در محل (فقط تهران)
              </label>
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700"
              >
                ⬅ بازگشت
              </button>
              <button className="px-6 py-2 bg-green-500 text-black rounded-xl font-bold hover:bg-green-600">
                ✅ ثبت نهایی سفارش
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
