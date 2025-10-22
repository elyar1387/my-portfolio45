"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Wallet, ShoppingBag, Home } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600 font-medium">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* کارت پروفایل */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
            {user.firstName?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-800">
              {user.firstName || "نام ثبت نشده"} {user.lastName || ""}
            </h2>
            <p className="text-gray-600">📱 {user.phone}</p>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/account/edit")}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <User className="w-8 h-8 text-blue-600 mb-2" />
            <span className="font-bold text-gray-700">ویرایش پروفایل</span>
          </button>

          <button
            onClick={() => router.push("/wallet")}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <Wallet className="w-8 h-8 text-green-600 mb-2" />
            <span className="font-bold text-gray-700">کیف پول</span>
          </button>

          <button
            onClick={() => router.push("/orders")}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <ShoppingBag className="w-8 h-8 text-purple-600 mb-2" />
            <span className="font-bold text-gray-700">سفارشات</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <Home className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="font-bold text-gray-700">صفحه اصلی</span>
          </button>
        </div>

        {/* خروج */}
        <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
          <span className="text-gray-700 font-bold">خروج از حساب</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            خروج
          </button>
        </div>
      </div>
    </div>
  );
}
