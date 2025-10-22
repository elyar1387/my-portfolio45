import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* ==========================================================
   🟡 PATCH — تغییر وضعیت سفارش (ادمین یا کاربر)
   ✅ ادمین می‌تواند وضعیت سفارش را تغییر دهد
   ✅ اگر وضعیت لغو شد (canceled) سفارش حذف می‌شود
========================================================== */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // ← تغییر فقط این خط
) {
  try {
    const { id } = await context.params; // ← و این خط
    const body = await req.json();
    const { status } = body;

    if (!status)
      return NextResponse.json(
        { error: "وضعیت سفارش مشخص نیست." },
        { status: 400 }
      );

    // 🧩 دریافت توکن از کوکی‌ها
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 🧩 اعتبارسنجی توکن
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 🧩 پیدا کردن سفارش
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });
    if (!order)
      return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });

    // 🧩 فقط ادمین یا مالک سفارش مجاز است
    if (decoded.role !== "admin" && order.userId !== decoded.userId)
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });

    // 🧩 اگر لغو شد → حذف کامل سفارش از دیتابیس
    if (status === "canceled") {
      await prisma.order.delete({ where: { id: Number(id) } });
      return NextResponse.json({ success: true, deleted: true });
    }

    // 🧩 در غیر این صورت فقط وضعیت را به‌روزرسانی کن
    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("Order PATCH error:", err);
    return NextResponse.json(
      { error: "خطا در تغییر وضعیت سفارش." },
      { status: 500 }
    );
  }
}

/* ==========================================================
   🔴 DELETE — لغو سفارش توسط کاربر (تا ۲ ساعت پس از ثبت)
   ✅ فقط کاربر خودش می‌تواند سفارش را حذف کند
   ✅ فقط تا دو ساعت بعد از ثبت سفارش
========================================================== */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // ← تغییر فقط این خط
) {
  try {
    const { id } = await context.params; // ← و این خط

    // 🧩 دریافت و بررسی توکن
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 🧩 پیدا کردن سفارش
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order)
      return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });

    // 🧩 بررسی مالک سفارش
    if (order.userId !== decoded.userId)
      return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 403 });

    // 🧩 بررسی محدودیت زمانی ۲ ساعته
    const diffHours =
      (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    if (diffHours > 2)
      return NextResponse.json(
        { error: "⛔ لغو سفارش فقط تا ۲ ساعت پس از ثبت امکان‌پذیر است." },
        { status: 400 }
      );

    // 🧩 حذف سفارش از دیتابیس
    await prisma.order.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order DELETE error:", err);
    return NextResponse.json(
      { error: "خطا در حذف سفارش." },
      { status: 500 }
    );
  }
}
