"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, firstName, lastName, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ ثبت‌نام موفق! حالا می‌تونی وارد حساب بشی.");
    } else {
      setMessage(data.error || "❌ خطا در ثبت‌نام");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* متن خوش آمدگویی */}
        <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-2">
          🎉 خوش آمدید!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          لطفاً اطلاعات خود را برای ثبت‌نام وارد کنید.
        </p>

        {/* فرم ثبت نام */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="نام"
            className="w-full border border-gray-300 p-3 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="نام خانوادگی"
            className="w-full border border-gray-300 p-3 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="شماره موبایل"
            className="w-full border border-gray-300 p-3 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            className="w-full border border-gray-300 p-3 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          >
            ثبت‌نام
          </button>
        </form>

        {/* پیام */}
        {message && (
          <p className="text-center text-red-600 font-medium mt-4">{message}</p>
        )}

        {/* دکمه رفتن به صفحه ورود */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-medium mb-2">
            قبلاً ثبت‌نام کردی؟
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            ورود به حساب
          </button>
        </div>
      </div>
    </div>
  );
}
