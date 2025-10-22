import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // ← فقط این بخش اصلاح شده
) {
  const { id } = await context.params; // ← اضافه شده برای استخراج پارامتر
  const userId = Number(id);

  if (!userId || isNaN(userId))
    return NextResponse.json(
      { error: "شناسه کاربر نامعتبر است." },
      { status: 400 }
    );

  try {
    // حذف تمام رکوردهای وابسته
    await prisma.$transaction([
      prisma.order.deleteMany({ where: { userId } }),
      prisma.ticket.deleteMany({ where: { userId } }),
      prisma.supportMessage.deleteMany({ where: { userId } }),
      prisma.wallet.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    // بعد از حذف موفق، پاسخ با نیاز به خروج کاربر
    return NextResponse.json({
      success: true,
      logout: true,
      message: "✅ کاربر حذف شد و باید از سیستم خارج شود.",
    });
  } catch (err: any) {
    console.error("❌ Error deleting user:", err);
    return NextResponse.json(
      { error: "❌ خطا در حذف کاربر." },
      { status: 500 }
    );
  }
}
