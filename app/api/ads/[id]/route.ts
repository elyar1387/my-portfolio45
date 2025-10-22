import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 حتماً Promise باشه!
) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ خطا در حذف سفارش:", error);
    return NextResponse.json(
      { error: "حذف سفارش ناموفق بود" },
      { status: 500 }
    );
  }
}
