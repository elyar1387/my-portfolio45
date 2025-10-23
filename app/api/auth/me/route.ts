import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret")

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "توکن یافت نشد" }, { status: 401 })
    }

    // ✅ تایید JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload?.userId) {
      return NextResponse.json({ error: "شناسه کاربر در توکن نیست" }, { status: 401 })
    }

    // 🔧 تبدیل به عدد مطمئن
    const userId: number = Number(payload.userId)

    // ✅ گرفتن کاربر از دیتابیس
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error("❌ خطا در /api/auth/me:", err)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}
