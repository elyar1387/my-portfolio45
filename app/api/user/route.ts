import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) return NextResponse.json({ user: null });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    // اگر کاربر حذف شده بود → کوکی رو پاک کن و null برگردون
    if (!user) {
      const res = NextResponse.json({ user: null });
      res.cookies.set("token", "", { maxAge: 0, path: "/" });
      return res;
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("User GET error:", err);
    const res = NextResponse.json({ user: null });
    res.cookies.set("token", "", { maxAge: 0, path: "/" });
    return res;
  }
}
