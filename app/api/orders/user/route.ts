// app/api/orders/user/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "نیاز به ورود" }, { status: 401 });

    const decoded: any = verifyJwt(token);

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("Orders Error:", err);
    return NextResponse.json({ error: "خطا در دریافت سفارشات" }, { status: 500 });
  }
}
