import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "شماره یا کد الزامی است" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return NextResponse.json({ error: "کد نامعتبر یا منقضی شده" }, { status: 400 });
    }

    await prisma.user.update({
      where: { phone },
      data: { otp: null, otpExpires: null, status: "active" },
    });

    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ اینجا باید await بزنیم
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    console.error("❌ خطا در verify-otp:", e.message, e.stack);
    return NextResponse.json({ error: "مشکل سرور" }, { status: 500 });
  }
}
