"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "خطا در ورود")
        return
      }

      router.push("/account")
    } catch (err) {
      setError("مشکل در ارتباط با سرور")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        
        {/* دکمه برگشت */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 ml-1" />
          بازگشت به صفحه اصلی
        </button>

        {/* خوش‌آمدگویی */}
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-700">
          ورود به حساب کاربری
        </h2>
        <p className="text-center text-gray-500 mb-6">
          لطفا شماره موبایل و رمز عبور خود را وارد کنید
        </p>

        {/* نمایش خطا */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-2">شماره موبایل</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400"
              placeholder="مثلا 09123456789"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400"
              placeholder="رمز عبور خود را وارد کنید"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            ورود
          </button>
        </form>

        {/* لینک ثبت‌نام */}
        <p className="text-center text-sm text-gray-600 mt-6">
          حساب ندارید؟{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            ثبت‌نام کنید
          </span>
        </p>
      </div>
    </div>
  )
}
