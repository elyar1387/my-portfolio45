import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const body = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        userId: decoded.userId,
        type: body.type,
        amount: body.amount,
        price: body.price,
        recipientName: body.recipientName,
        address: body.address,
        postalCode: body.postalCode,
        city: body.city,
        phone: body.phone,
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true, order: newOrder });
  } catch (err) {
    console.error("Order POST error:", err);
    return NextResponse.json({ error: "خطا در ذخیره سفارش" }, { status: 500 });
  }
}

// ✅ سفارش‌های کاربر جاری (فقط سفارش‌های خودش)
export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("Order GET error:", err);
    return NextResponse.json({ error: "خطا در دریافت سفارشات" }, { status: 500 });
  }
}
