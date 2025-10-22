import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "نیاز به ورود" }, { status: 401 });

    const decoded: any = verifyJwt(token);
    if (!decoded?.userId) return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== "admin") return NextResponse.json({ error: "مجوز لازم نیست" }, { status: 403 });

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return NextResponse.json({ ok: true, orders });
  } catch (e) {
    console.error("Admin orders error:", e);
    return NextResponse.json({ error: "خطا در دریافت سفارش‌ها" }, { status: 500 });
  }
}
