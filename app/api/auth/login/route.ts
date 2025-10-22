import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 });
    }

    // ✅ ساخت JWT
    const token = signJwt({ userId: user.id });

    // ✅ ذخیره در کوکی
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 روز
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "خطا در ورود" }, { status: 500 });
  }
}
