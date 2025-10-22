"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, PlusCircle, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch("/api/wallet");
        if (res.ok) {
          const data = await res.json();
          setWallet(data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Wallet Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 font-semibold">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* هدر */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center justify-center gap-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            کیف پول من
          </h1>
          <p className="text-gray-600 mt-2">مدیریت موجودی و تراکنش‌های شما</p>
        </div>

        {/* کارت موجودی */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <p className="text-gray-600 font-medium">موجودی فعلی</p>
          <h2 className="text-4xl font-extrabold text-blue-600 mt-2">
            {wallet?.balance?.toLocaleString("fa-IR")} تومان
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            آخرین بروزرسانی:{" "}
            {new Date(wallet?.updatedAt).toLocaleDateString("fa-IR")}
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <PlusCircle className="w-8 h-8 text-green-600 mb-2" />
            <span className="font-bold text-gray-700">افزایش موجودی</span>
          </button>

          <button className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrowUpCircle className="w-8 h-8 text-red-600 mb-2" />
            <span className="font-bold text-gray-700">برداشت وجه</span>
          </button>

          <button className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrowDownCircle className="w-8 h-8 text-purple-600 mb-2" />
            <span className="font-bold text-gray-700">تراکنش‌ها</span>
          </button>

          <button
            onClick={() => router.push("/account")}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <span className="font-bold text-gray-700">بازگشت</span>
          </button>
        </div>
      </div>
    </div>
  );
}
