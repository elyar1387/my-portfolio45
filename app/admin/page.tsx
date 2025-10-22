"use client";

import React, { useEffect, useState } from "react";
import {
  LogOut,
  RefreshCcw,
  PlusCircle,
} from "lucide-react";

type Ad = {
  id: number;
  title: string;
  desc: string;
  category: string;
  price: number;
  image?: string | null;
  createdAt?: string;
};
type User = {
  id: number;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
  createdAt?: string;
};
type Order = {
  id: number;
  user?: { id?: number; firstName?: string; phone?: string };
  type: string;
  amount: number;
  price: number;
  status: string;
  recipientName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  createdAt?: string;
};

const fnum = (n?: number | string) =>
  !n || isNaN(Number(n)) ? "—" : Number(n).toLocaleString("fa-IR");

export default function AdminPanel() {
  const [active, setActive] = useState("داشبورد");
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const ADMIN_PASSWORD = "Aamir1384"; // 🔑 رمز ورود

  const [users, setUsers] = useState<User[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [newAd, setNewAd] = useState({
    title: "",
    desc: "",
    category: "سکه",
    price: "",
    image: null as File | null,
  });

  // ورود با رمز
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
    } else {
      alert("رمز اشتباه است ❌");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  // ------------------- Fetchers -------------------
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch {
      setUsers([]);
    }
  };
  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads", { credentials: "include" });
      const data = await res.json();
      setAds(Array.isArray(data) ? data : data.ads || []);
    } catch {
      setAds([]);
    }
  };
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { credentials: "include" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (active === "مدیریت کاربران") fetchUsers();
    if (active === "مدیریت آگهی‌ها") fetchAds();
    if (active === "مدیریت سفارشات") fetchOrders();
  }, [active]);

  // ------------------- حذف کاربر -------------------
  const deleteUser = async (id: number) => {
    if (!confirm("آیا از حذف این کاربر مطمئن هستید؟")) return;
    setLoading(true);
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("✅ کاربر حذف شد");
      fetchUsers();
    } else {
      alert("❌ خطا در حذف کاربر");
    }
    setLoading(false);
  };

  // ------------------- مدیریت آگهی‌ها -------------------
  const addAd = async () => {
    if (!newAd.title || !newAd.price) {
      alert("لطفاً عنوان و قیمت را وارد کنید");
      return;
    }
    const form = new FormData();
    form.append("title", newAd.title);
    form.append("desc", newAd.desc);
    form.append("category", newAd.category);
    form.append("price", newAd.price);
    if (newAd.image) form.append("image", newAd.image);

    const res = await fetch("/api/ads", {
      method: "POST",
      body: form,
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ آگهی ثبت شد");
      setNewAd({ title: "", desc: "", category: "سکه", price: "", image: null });
      fetchAds();
    } else {
      alert("❌ " + (data.error || "خطا در ثبت آگهی"));
    }
  };

  const deleteAd = async (id: number) => {
    if (!confirm("حذف آگهی؟")) return;
    const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("✅ آگهی حذف شد");
      fetchAds();
    } else {
      alert("❌ خطا در حذف آگهی");
    }
  };

  // ------------------- سفارشات -------------------
  const updateOrderStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ وضعیت سفارش بروزرسانی شد");
      fetchOrders();
    } else {
      alert("❌ " + (data.error || "خطا"));
    }
  };

  // ------------------- صفحات -------------------
  const renderDashboard = () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-yellow-700 mb-4">📊 داشبورد مدیریت</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          کاربران: <b>{users.length}</b>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          آگهی‌ها: <b>{ads.length}</b>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          سفارشات: <b>{orders.length}</b>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-yellow-700">👥 کاربران</h2>
        <button
          onClick={fetchUsers}
          className="px-3 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-1"
        >
          <RefreshCcw className="w-4 h-4" /> بروزرسانی
        </button>
      </div>
      <table className="w-full bg-white rounded-xl shadow border text-sm">
        <thead className="bg-yellow-100 text-yellow-900">
          <tr>
            <th className="p-2">شناسه</th>
            <th className="p-2">نام</th>
            <th className="p-2">شماره</th>
            <th className="p-2">نقش</th>
            <th className="p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t hover:bg-yellow-50">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.firstName || "—"}</td>
              <td className="p-2">{u.phone || "—"}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAds = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">📢 مدیریت آگهی‌ها</h2>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <input
            placeholder="عنوان"
            className="p-2 border rounded"
            value={newAd.title}
            onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
          />
          <input
            placeholder="توضیحات"
            className="p-2 border rounded"
            value={newAd.desc}
            onChange={(e) => setNewAd({ ...newAd, desc: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            value={newAd.category}
            onChange={(e) => setNewAd({ ...newAd, category: e.target.value })}
          >
            <option>سکه</option>
            <option>شمش</option>
            <option>دلار</option>
          </select>
          <input
            placeholder="قیمت"
            className="p-2 border rounded"
            value={newAd.price}
            onChange={(e) => setNewAd({ ...newAd, price: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewAd({ ...newAd, image: e.target.files?.[0] || null })
            }
          />
          <button
            onClick={addAd}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" /> افزودن
          </button>
        </div>
      </div>

      <table className="w-full bg-white rounded-xl shadow border text-sm">
        <thead className="bg-yellow-100 text-yellow-900">
          <tr>
            <th className="p-2">شناسه</th>
            <th className="p-2">عنوان</th>
            <th className="p-2">دسته</th>
            <th className="p-2">قیمت</th>
            <th className="p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((a) => (
            <tr key={a.id} className="border-t hover:bg-yellow-50">
              <td className="p-2">{a.id}</td>
              <td className="p-2">{a.title}</td>
              <td className="p-2">{a.category}</td>
              <td className="p-2">{fnum(a.price)}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteAd(a.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrders = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">🧾 سفارشات</h2>
      <table className="w-full bg-white rounded-xl shadow border text-sm">
        <thead className="bg-yellow-100 text-yellow-900">
          <tr>
            <th className="p-2">شناسه</th>
            <th className="p-2">کاربر</th>
            <th className="p-2">نوع</th>
            <th className="p-2">مقدار</th>
            <th className="p-2">قیمت</th>
            <th className="p-2">وضعیت</th>
            <th className="p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t hover:bg-yellow-50">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.user?.firstName || "—"}</td>
              <td className="p-2">{o.type}</td>
              <td className="p-2">{fnum(o.amount)}</td>
              <td className="p-2">{fnum(o.price)}</td>
              <td className="p-2">{o.status}</td>
              <td className="p-2 flex gap-1">
                <button
                  onClick={() => updateOrderStatus(o.id, "processing")}
                  className="bg-yellow-500 px-2 py-1 rounded text-xs text-white"
                >
                  پردازش
                </button>
                <button
                  onClick={() => updateOrderStatus(o.id, "completed")}
                  className="bg-green-600 px-2 py-1 rounded text-xs text-white"
                >
                  تکمیل
                </button>
                <button
                  onClick={() => updateOrderStatus(o.id, "canceled")}
                  className="bg-red-600 px-2 py-1 rounded text-xs text-white"
                >
                  لغو
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ------------------- ورود به پنل -------------------
  if (!authenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-80 text-center">
          <h2 className="text-xl font-bold text-yellow-700 mb-4">🔐 ورود مدیر</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 text-center"
            placeholder="رمز عبور را وارد کنید"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-bold"
          >
            ورود
          </button>
        </div>
      </div>
    );
  }

  // ------------------- layout -------------------
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-64 bg-yellow-700 text-white flex flex-col shadow-xl">
        <div className="p-6 text-center text-2xl font-bold border-b border-yellow-600">
          🌟 پنل مدیریت
        </div>
        <nav className="flex-1 p-3 space-y-2">
          {["داشبورد", "مدیریت کاربران", "مدیریت آگهی‌ها", "مدیریت سفارشات"].map(
            (name) => (
              <button
                key={name}
                onClick={() => setActive(name)}
                className={`w-full text-right px-5 py-3 rounded-xl text-base transition font-semibold ${
                  active === name
                    ? "bg-yellow-400 text-black shadow-lg"
                    : "hover:bg-yellow-600"
                }`}
              >
                {name}
              </button>
            )
          )}
        </nav>
        <div className="p-4">
          <button
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              setAuthenticated(false);
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 font-bold"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {active === "داشبورد" && renderDashboard()}
        {active === "مدیریت کاربران" && renderUsers()}
        {active === "مدیریت آگهی‌ها" && renderAds()}
        {active === "مدیریت سفارشات" && renderOrders()}
      </main>
    </div>
  );
}
