"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (res.ok) {
      router.push("/account");
    } else {
      alert("❌ خطا در ذخیره تغییرات");
    }
  };

  if (loading) return <p className="p-4 text-gray-600">در حال بارگذاری...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-gray-800 text-center">
          ✏️ ویرایش پروفایل
        </h2>

        {/* نام */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            نام
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="نام خود را وارد کنید"
          />
        </div>

        {/* نام خانوادگی */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            نام خانوادگی
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="نام خانوادگی خود را وارد کنید"
          />
        </div>

        {/* دکمه‌ها */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          >
            ذخیره تغییرات
          </button>

          <button
            type="button"
            onClick={() => router.push("/account")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
          >
            بازگشت
          </button>
        </div>
      </form>
    </div>
  );
}
