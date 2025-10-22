"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrdersForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const qtype = sp.get("type") || "gold";
  const qamount = Number(sp.get("amount") || sp.get("weight") || 0);
  const qprice = Number(sp.get("price") || 0);

  const [type] = useState(qtype);
  const [amount, setAmount] = useState(qamount);
  const [price, setPrice] = useState(qprice);

  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const isFormValid =
    recipientName.trim() !== "" &&
    address.trim() !== "" &&
    postalCode.trim() !== "" &&
    city.trim() !== "" &&
    phone.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("لطفاً تمام فیلدها را به‌درستی پر کنید.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount,
          price,
          recipientName,
          address,
          postalCode,
          city,
          phone,
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (res.ok) {
        router.push("/account/orders");
      } else {
        alert("❌ " + (data.error || "خطا در ثبت سفارش"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gradient-to-b from-yellow-100 via-white to-yellow-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg border border-yellow-200 p-8">
        <h1 className="text-3xl font-extrabold text-center text-yellow-700 mb-6">
          🛍️ ثبت سفارش جدید
        </h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-gray-800 text-sm space-y-1">
          <div>نوع سفارش: <strong>{type}</strong></div>
          <div>مقدار: <strong>{amount}</strong></div>
          <div>قیمت کل: <strong>{price.toLocaleString("fa-IR")} تومان</strong></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="نام گیرنده" value={recipientName} onChange={setRecipientName} placeholder="مثال: علی رضایی" />
          <Input label="شماره تماس" value={phone} onChange={setPhone} placeholder="0912..." />
          <TextArea label="آدرس کامل" value={address} onChange={setAddress} placeholder="استان، شهر، خیابان..." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="کد پستی" value={postalCode} onChange={setPostalCode} placeholder="مثال: 1234567890" />
            <Input label="شهر" value={city} onChange={setCity} placeholder="مثال: تهران" />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`flex-1 py-3 rounded-xl font-bold transition ${
                !isFormValid || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "در حال ارسال..." : "ثبت سفارش"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-800 transition"
            >
              بازگشت
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, placeholder = "" }: { label: string; value: any; onChange: (v: any) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "" }: { label: string; value: any; onChange: (v: any) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
}
