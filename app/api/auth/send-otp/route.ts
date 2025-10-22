import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()
    if (!phone) return NextResponse.json({ error: "شماره موبایل الزامی است" }, { status: 400 })

    // ساخت کد ۴ رقمی
    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    // ذخیره در دیتابیس
    let user = await prisma.user.findUnique({ where: { phone } })
    if (user) {
      await prisma.user.update({
        where: { phone },
        data: { otp, otpExpires: new Date(Date.now() + 2 * 60 * 1000) }, // ۲ دقیقه اعتبار
      })
    } else {
      await prisma.user.create({
        data: {
          phone,
          otp,
          otpExpires: new Date(Date.now() + 2 * 60 * 1000),
          role: "user",
          status: "pending",
        },
      })
    }

    console.log("📲 کد تایید:", otp, "برای شماره:", phone)

    return NextResponse.json({ ok: true, message: "کد تایید ارسال شد ✅ (فعلا در لاگ)" })
  } catch (err) {
    console.error("❌ خطا در ارسال کد:", err)
    return NextResponse.json({ error: "مشکل سرور" }, { status: 500 })
  }
}
