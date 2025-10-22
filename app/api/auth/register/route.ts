import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, firstName, lastName, password } = await req.json();

    if (!phone || !firstName || !lastName || !password) {
      return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json({ error: "این شماره قبلاً ثبت‌نام کرده است" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        passwordHash,
      },
    });

    return NextResponse.json({ message: "ثبت‌نام موفق", user }, { status: 201 });
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "خطا در ثبت‌نام" }, { status: 500 });
  }
}
