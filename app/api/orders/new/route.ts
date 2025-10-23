import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret")

export async function POST(req: Request) {
  try {
    const { productId, amount } = await req.json()

    // بررسی ورودی‌ها
    if (!productId || !amount) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 })
    }

    // دریافت محصول از دیتابیس
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    })

    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 })
    }

    // دریافت توکن از هدر
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "توکن یافت نشد" }, { status: 401 })
    }

    // بررسی توکن
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (!payload?.userId) {
      return NextResponse.json({ error: "شناسه کاربر معتبر نیست" }, { status: 401 })
    }

    // ایجاد سفارش جدید (بدون productId)
    const order = await prisma.order.create({
      data: {
        userId: Number(payload.userId),
        amount,
        price: product.price * amount,
      },
    })

    return NextResponse.json({ order })
  } catch (err) {
    console.error("خطا در /api/orders/new:", err)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}
