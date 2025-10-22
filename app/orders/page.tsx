"use client";

import { useEffect, useState } from "react";
import { Trash2, Info, Clock } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [detailsId, setDetailsId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("خطا در دریافت سفارشات", err);
      setOrders([]);
    }
  };

  const cancelOrder = async (id: number, createdAt: string) => {
    const diffHours =
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (diffHours > 2) return alert("⛔ امکان لغو سفارش بعد از ۲ ساعت وجود ندارد.");

    if (!confirm("آیا از لغو این سفارش مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف سفارش");
      await fetchOrders();
      alert("✅ سفارش با موفقیت لغو شد.");
    } catch (err) {
      alert("❌ خطا در لغو سفارش");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-6 border border-yellow-200">
        <h1 className="text-2xl font-extrabold text-yellow-700 mb-6">
          📦 سفارشات من
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-lg">
            هیچ سفارشی یافت نشد.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <div className="font-bold text-lg text-gray-800">
                      نوع: {o.type}
                    </div>
                    <div className="text-sm text-gray-600">
                      مقدار: {o.amount} | قیمت:{" "}
                      {o.price.toLocaleString("fa-IR")} تومان
                    </div>
                    <div className="text-sm text-gray-500">
                      وضعیت:{" "}
                      <span className="font-semibold text-yellow-700">
                        {o.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        cancelOrder(o.id, o.createdAt)
                      }
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> لغو سفارش
                    </button>

                    <button
                      onClick={() =>
                        setDetailsId(detailsId === o.id ? null : o.id)
                      }
                      className="flex items-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-bold"
                    >
                      <Info className="w-4 h-4" /> جزئیات
                    </button>
                  </div>
                </div>

                {detailsId === o.id && (
                  <div className="mt-4 bg-white border-t border-gray-200 pt-3 text-sm text-gray-700 rounded-xl">
                    <p><strong>نام گیرنده:</strong> {o.recipientName}</p>
                    <p><strong>تلفن:</strong> {o.phone}</p>
                    <p><strong>آدرس:</strong> {o.address}</p>
                    <p><strong>شهر:</strong> {o.city}</p>
                    <p><strong>کد پستی:</strong> {o.postalCode}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Clock className="w-4 h-4" /> زمان ثبت:{" "}
                      {new Date(o.createdAt).toLocaleString("fa-IR")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
