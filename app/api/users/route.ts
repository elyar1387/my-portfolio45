import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// گرفتن لیست همه کاربرها
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return NextResponse.json(
      { error: "خطا در گرفتن لیست کاربران" },
      { status: 500 }
    );
  }
}

// ساخت کاربر جدید
export async function POST(req: Request) {
  try {
    const { phone, firstName, lastName, passwordHash, role, status } = await req.json();

    const user = await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        passwordHash,
        role: role || "user",
        status: status || "active",
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    return NextResponse.json(
      { error: "خطا در ساخت کاربر جدید" },
      { status: 500 }
    );
  }
}
