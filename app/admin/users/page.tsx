"use client";
import React from "react";

async function handleDelete(userId: number) {
  if (!confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) return;

  try {
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      alert("✅ کاربر با موفقیت حذف شد");
      window.location.reload(); // لیست را تازه‌سازی کن
    } else {
      alert(`❌ ${data.error || "خطا در حذف کاربر"}`);
    }
  } catch (err) {
    alert("❌ خطا در ارتباط با سرور");
    console.error(err);
  }
}

export default function UsersPage() {
  // برای نمونه یک دکمه حذف داریم (می‌تونی لیست کاربران خودت رو اینجا جایگزین کنی)
  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      <h2>مدیریت کاربران</h2>
      <button
        onClick={() => handleDelete(1)}
        style={{
          backgroundColor: "#d33",
          color: "white",
          padding: "10px 15px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        حذف کاربر شماره ۱
      </button>
    </div>
  );
}
