"use client";
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          amount: 1, // فعلا ۱ میذاریم، بعد می‌تونیم تعداد بذاریم
        }),
      });

      if (res.ok) {
        alert("✅ سفارش شما ثبت شد");
      } else {
        const err = await res.json();
        alert("❌ خطا: " + err.error);
      }
    } catch (e) {
      console.error(e);
      alert("❌ خطا در ثبت سفارش");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
      <h3 className="text-lg font-bold">{product.title}</h3>
      <p className="text-gray-600">{product.desc}</p>
      <p className="text-green-600 font-bold">{product.price} تومان</p>
      <button
        onClick={handleOrder}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "در حال ثبت..." : "ثبت سفارش"}
      </button>
    </div>
  );
}
