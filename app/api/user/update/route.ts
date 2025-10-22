import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });
    }

    const { payload }: any = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "خطا در بروزرسانی اطلاعات" }, { status: 500 });
  }
}
